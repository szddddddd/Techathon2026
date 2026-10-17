package app.weroam.mobile;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Message;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import androidx.webkit.WebViewAssetLoader;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

/** Local HTTPS assets, no JavaScript-to-native bridge, no embedded server key. */
public final class MainActivity extends Activity {
    private static final String ORIGIN = "https://appassets.androidplatform.net";
    private static final int PICK_IMAGE = 104;
    private FrameLayout root;
    private WebView web;
    private View fullScreenVideo;
    private WebChromeClient.CustomViewCallback videoCallback;
    private ValueCallback<Uri[]> fileCallback;
    private boolean backPending;

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(32, 58, 50));
        setContentView(root);
        // Insets are applied once by the native host. CSS sees the remaining
        // viewport, including when the IME opens or the device rotates.
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            root.setOnApplyWindowInsetsListener((view, insets) -> {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                android.graphics.Insets ime = insets.getInsets(WindowInsets.Type.ime());
                view.setPadding(bars.left, bars.top, bars.right, Math.max(bars.bottom, ime.bottom));
                return WindowInsets.CONSUMED;
            });
        } else root.setFitsSystemWindows(true);
        if (Build.VERSION.SDK_INT >= 33)
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(0, this::handleBack);
        createWebView();
    }

    private void createWebView() {
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(32, 58, 50));
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setAllowFileAccessFromFileURLs(false);
        s.setAllowUniversalAccessFromFileURLs(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setMediaPlaybackRequiresUserGesture(true);
        s.setSupportMultipleWindows(true);
        s.setJavaScriptCanOpenWindowsAutomatically(false);
        // Keep WebView text scaling predictable, while allowing browser zoom.
        s.setTextZoom(100);
        s.setBuiltInZoomControls(false);
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (isLocal(uri)) {
                    if (uri.getPath() != null && uri.getPath().startsWith("/api/"))
                        return response(503, "Service Unavailable", "application/json", "{\"error\":\"手机版暂未连接形象生成服务\"}");
                    WebResourceResponse result = loader.shouldInterceptRequest(uri);
                    if (result != null) return result;
                    return response(404, "Not Found", "text/plain", "Not found");
                }
                // External content is opened by explicit navigation in the system
                // browser; the offline demo never makes background platform calls.
                return response(403, "Forbidden", "text/plain", "External resources are not part of the offline demo");
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (isLocal(request.getUrl())) return false;
                if (request.isForMainFrame() && request.hasGesture()) openExternal(request.getUrl());
                return true;
            }
            @Override public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                root.removeView(view); view.destroy();
                new AlertDialog.Builder(MainActivity.this).setTitle("重新打开风景")
                    .setMessage("系统释放了场景内存，你的本地消息仍然保留。")
                    .setPositiveButton("重新打开", (dialog, which) -> createWebView())
                    .setNegativeButton("退出", (dialog, which) -> finish()).setCancelable(false).show();
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent pick = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                pick.setType("image/*"); pick.addCategory(Intent.CATEGORY_OPENABLE);
                pick.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                try { startActivityForResult(pick, PICK_IMAGE); }
                catch (ActivityNotFoundException error) { fileCallback.onReceiveValue(null); fileCallback = null; }
                return true;
            }
            @Override public boolean onCreateWindow(WebView view, boolean dialog, boolean userGesture, Message message) {
                if (!userGesture) return false;
                WebView popup = new WebView(MainActivity.this);
                popup.setWebViewClient(new WebViewClient() {
                    @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest req) {
                        openExternal(req.getUrl()); v.destroy(); return true;
                    }
                });
                ((WebView.WebViewTransport) message.obj).setWebView(popup); message.sendToTarget(); return true;
            }
            @Override public void onShowCustomView(View view, CustomViewCallback callback) {
                if (fullScreenVideo != null) { callback.onCustomViewHidden(); return; }
                fullScreenVideo = view; videoCallback = callback; web.setVisibility(View.GONE);
                root.addView(view, new FrameLayout.LayoutParams(-1, -1));
            }
            @Override public void onHideCustomView() { closeVideo(); }
        });
        web.loadUrl(ORIGIN + "/index.html?inbox=1");
    }

    private boolean isLocal(Uri uri) {
        return "https".equals(uri.getScheme()) && "appassets.androidplatform.net".equals(uri.getHost())
            && (uri.getPort() == -1 || uri.getPort() == 443);
    }
    private WebResourceResponse response(int code, String reason, String mime, String text) {
        return new WebResourceResponse(mime, "UTF-8", code, reason, Collections.singletonMap("Cache-Control", "no-store"),
            new ByteArrayInputStream(text.getBytes(StandardCharsets.UTF_8)));
    }
    private void openExternal(Uri uri) {
        if (!"https".equals(uri.getScheme()) && !"http".equals(uri.getScheme()) && !"mailto".equals(uri.getScheme())) return;
        try { startActivity(new Intent(Intent.ACTION_VIEW, uri).addCategory(Intent.CATEGORY_BROWSABLE)); }
        catch (ActivityNotFoundException error) { Toast.makeText(this, "没有可打开该链接的应用", Toast.LENGTH_SHORT).show(); }
    }
    private void closeVideo() {
        if (fullScreenVideo == null) return;
        root.removeView(fullScreenVideo); fullScreenVideo = null; web.setVisibility(View.VISIBLE);
        if (videoCallback != null) videoCallback.onCustomViewHidden(); videoCallback = null;
    }
    private void handleBack() {
        if (fullScreenVideo != null) { closeVideo(); return; }
        if (backPending || web == null) return;
        backPending = true;
        web.evaluateJavascript("Boolean(window.__weroamHandleBack && window.__weroamHandleBack())", result -> {
            backPending = false;
            if (!"true".equals(result)) new AlertDialog.Builder(this).setTitle("退出 WeRoam？")
                .setMessage("消息和草稿会保留在这台手机上。")
                .setPositiveButton("退出", (dialog, which) -> finish()).setNegativeButton("继续浏览", null).show();
        });
    }
    @Override public void onBackPressed() { handleBack(); }
    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_IMAGE && fileCallback != null) {
            Uri selected = resultCode == RESULT_OK && data != null ? data.getData() : null;
            fileCallback.onReceiveValue(selected == null ? null : new Uri[]{selected}); fileCallback = null;
        }
    }
    @Override protected void onPause() { if (web != null) { web.onPause(); web.pauseTimers(); } super.onPause(); }
    @Override protected void onResume() { super.onResume(); if (web != null) { web.onResume(); web.resumeTimers(); } }
    @Override protected void onDestroy() {
        if (fileCallback != null) { fileCallback.onReceiveValue(null); fileCallback = null; }
        if (web != null) { root.removeView(web); web.destroy(); web = null; } super.onDestroy();
    }
}
