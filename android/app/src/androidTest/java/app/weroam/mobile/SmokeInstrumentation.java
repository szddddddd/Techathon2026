package app.weroam.mobile;

import android.app.Instrumentation;
import android.content.ContentValues;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.SystemClock;
import android.net.Uri;
import android.provider.MediaStore;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import org.json.JSONObject;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

/** Executes against the installed signed release APK; no external services. */
public final class SmokeInstrumentation extends Instrumentation {
    private WebView web;
    private boolean settings;
    private boolean quick;
    private boolean picker;
    private boolean benchmark;
    private boolean media;
    private final StringBuilder report = new StringBuilder();
    @Override public void onCreate(Bundle args) { super.onCreate(args); settings="true".equals(args.getString("settings")); quick="true".equals(args.getString("quick")); picker="true".equals(args.getString("picker")); benchmark="true".equals(args.getString("benchmark")); media="true".equals(args.getString("media")); start(); }
    private WebView find(View node) {
        if (node instanceof WebView) return (WebView) node;
        if (node instanceof ViewGroup) for (int i=0;i<((ViewGroup) node).getChildCount();i++) {
            WebView result=find(((ViewGroup) node).getChildAt(i)); if(result!=null)return result;
        }
        return null;
    }
    private String js(String expression) throws Exception {
        CountDownLatch done=new CountDownLatch(1); AtomicReference<String> result=new AtomicReference<>();
        runOnMainSync(() -> web.evaluateJavascript(expression, value->{result.set(value);done.countDown();}));
        if(!done.await(90,TimeUnit.SECONDS))throw new AssertionError("JS callback timed out");
        return result.get();
    }
    private void await(String expression) throws Exception {
        long end=SystemClock.elapsedRealtime()+180000;
        while(SystemClock.elapsedRealtime()<end) { if("true".equals(js(expression)))return;SystemClock.sleep(300); }
        throw new AssertionError("Condition timed out: "+expression);
    }
    private void check(boolean value,String label){if(!value)throw new AssertionError(label);report.append("PASS: ").append(label).append('\n');}
    private void screenshot(String name) throws Exception {
        SystemClock.sleep(500);
        Bitmap image=getUiAutomation().takeScreenshot();if(image==null)throw new AssertionError("Screenshot unavailable");
        File file=new File(getTargetContext().getExternalFilesDir(null),name+".png");
        try(FileOutputStream stream=new FileOutputStream(file)){image.compress(Bitmap.CompressFormat.PNG,100,stream);}image.recycle();
    }
    private void tap(String selector) throws Exception {
        String quoted=JSONObject.quote(selector);
        JSONObject p=new JSONObject(js("(()=>{const e=document.querySelector("+quoted+");e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2,width:innerWidth};})()"));
        int[] location=new int[2];runOnMainSync(()->web.getLocationOnScreen(location));
        double scale=web.getWidth()/p.getDouble("width");float x=(float)(location[0]+p.getDouble("x")*scale),y=(float)(location[1]+p.getDouble("y")*scale);
        long now=SystemClock.uptimeMillis();
        sendPointerSync(MotionEvent.obtain(now,now,MotionEvent.ACTION_DOWN,x,y,0));
        sendPointerSync(MotionEvent.obtain(now,now+80,MotionEvent.ACTION_UP,x,y,0));
    }
    private void performanceRun() throws Exception {
        js("window.__nativeMetrics=[];window.__nativeSetup=false;(async()=>{await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian','shanshan']){await __socialStore.addFriend(id);await __socialStore.clearStatus(id);await __socialStore.markRead(id,__socialStore.state.messages.filter(m=>m.friendId===id).map(m=>m.id));await __socialStore.receiveMessage(id,{text:'性能测试'});}__uiInteractions.back();window.__nativeSetup=true;})()" );
        await("__nativeSetup===true");
        js("window.__nativeCosts=[];window.__nativeRequest=requestAnimationFrame;window.requestAnimationFrame=callback=>__nativeRequest.call(window,now=>{const start=performance.now();callback(now);if(callback.name!=='probe')__nativeCosts.push(performance.now()-start);});true");
        for(String scene:new String[]{"forest","fuji","ideal"}){
            js("window.__nativeSwitchDone=false;window.__nativeSwitchStart=performance.now();__sceneTheme.switch('"+scene+"').then(()=>{window.__nativeSwitchMs=performance.now()-__nativeSwitchStart;window.__nativeSwitchDone=true;});true");
            await("__nativeSwitchDone&&!__sceneTheme.switching");SystemClock.sleep(1800);
            js("window.__nativeSampleDone=false;__nativeCosts=[];(()=>{const intervals=[];let last;function probe(now){if(last!==undefined)intervals.push(now-last);last=now;if(intervals.length<120){requestAnimationFrame(probe);return;}const summary=a=>{const s=a.slice().sort((a,b)=>a-b);return{median:s[Math.floor(s.length*.5)],p95:s[Math.floor(s.length*.95)]};};__nativeMetrics.push({scene:__sceneTheme.id,switchMs:__nativeSwitchMs,cpu:summary(__nativeCosts),intervals:summary(intervals),resources:__sceneTheme.resourceSnapshot(),warmup:__renderPerformance.warmup||null});window.__nativeSampleDone=true;}requestAnimationFrame(probe);})();true");
            await("__nativeSampleDone");
        }
        String metrics=js("__nativeMetrics");
        try(FileOutputStream stream=new FileOutputStream(new File(getTargetContext().getExternalFilesDir(null),"android-performance.json"))){stream.write(metrics.getBytes(java.nio.charset.StandardCharsets.UTF_8));}
        report.append("BENCHMARK: ").append(metrics).append('\n');
    }
    @Override public void onStart() {
        Bundle result=new Bundle();
        try {
            if(settings){JSONObject previous=AvatarSettings.load(getTargetContext());try{JSONObject test=new JSONObject().put("image",new JSONObject().put("apiKey","synthetic-image-only")).put("rodin",new JSONObject().put("apiKey","synthetic-rodin-only"));AvatarSettings.save(getTargetContext(),test);check("synthetic-image-only".equals(AvatarSettings.load(getTargetContext()).getJSONObject("image").getString("apiKey")),"Keystore encrypted configuration roundtrip");String encrypted=getTargetContext().getSharedPreferences("weroam-avatar-config-v1",0).getString("value","");check(!encrypted.contains("synthetic"),"stored configuration contains no plaintext test key");getTargetContext().getSharedPreferences("weroam-avatar-config-v1",0).edit().clear().commit();check(AvatarSettings.load(getTargetContext())==null,"clear configuration");boolean blocked=false;try{new AvatarService(getTargetContext()).request("jobs","{}");}catch(Exception e){blocked=true;}check(blocked,"unconfigured generation blocked before network");}finally{if(previous!=null)AvatarSettings.save(getTargetContext(),previous);}result.putString("stream",report.toString());finish(-1,result);return;}
            MainActivity activity=(MainActivity)startActivitySync(new Intent(getTargetContext(),MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
            runOnMainSync(()->web=find(activity.getWindow().getDecorView()));
            await("Boolean(window.__sceneTheme?.ready&&window.__socialUI?.inbox)");
            if(media){
                js("__discoveryUI.open({type:'video',id:'video-1'});true");
                await("__uiInteractions.state('discovery')==='open'&&__contentPlayer.video.readyState>=1");
                if("true".equals(js("__contentPlayer.video.paused")))tap(".d-video-big-play");
                await("__contentPlayer.video.readyState>=3&&!__contentPlayer.video.paused");
                js("__contentPlayer.pause();true");
                check("true".equals(js("__contentPlayer.video.src.startsWith('blob:')")),"WebView uses one compatible offline media Blob");
                js("__contentPlayer.video.currentTime=__contentPlayer.video.duration*.7;true");
                await("!__contentPlayer.video.seeking&&Math.abs(__contentPlayer.video.currentTime-__contentPlayer.video.duration*.7)<.15");
                check(true,"native WebView plays and seeks the offline video");
                result.putString("stream",report.toString());finish(-1,result);return;
            }
            if(benchmark){performanceRun();result.putString("stream",report.toString());finish(-1,result);return;}
            check("true".equals(js("window.isSecureContext && !!crypto.subtle && !!indexedDB && __WEROAM_ANDROID__")),"local HTTPS WebView, secure APIs and Android entry");
            js("window.__nativeErrors=[];addEventListener('error',e=>__nativeErrors.push(e.message));window.__nativeSetup=false;(async()=>{await __socialStore.setDemoPaused(true);for(const id of ['tuantuan','ali','xiaomian','shanshan']){if(__socialStore.getFriend(id)){await __socialStore.addFriend(id);await __socialStore.receiveMessage(id,{text:'手机里的朋友'});}}await __socialUI.inbox.gateway.loadDemo();window.__nativeSetup=true;})().catch(e=>__nativeErrors.push(e.message));true");
            await("window.__nativeSetup===true");
            check("true".equals(js("document.querySelector('#viewport canvas')!==null")),"three-dimensional canvas booted");
            screenshot("android-inbox");
            js("document.querySelector('[data-inbox-thread=\"external:demo:qqmail:thread-1\"]').click();true");
            await("__uiInteractions.state('inbox-thread')==='open'");
            js("document.querySelector('#inbox-thread [name=reply]').value='手机原生测试草稿';document.querySelector('#inbox-thread [name=reply]').dispatchEvent(new Event('input',{bubbles:true}));true");
            check("true".equals(js("__weroamHandleBack()")),"native back handler consumed reading page");
            await("__uiInteractions.state('directory')==='open'");
            js("document.querySelector('[data-inbox-thread=\"external:demo:qqmail:thread-1\"]').click();true");
            await("__uiInteractions.state('inbox-thread')==='open'");
            check("true".equals(js("document.querySelector('#inbox-thread [name=reply]').value==='手机原生测试草稿'")),"back navigation preserves reply draft");
            screenshot("android-reply");
            js("__weroamHandleBack();true");await("__uiInteractions.state('directory')==='open'");
            js("__weroamHandleBack();true");await("__uiInteractions.state('directory')==='closed'");
            if(!quick)for(String scene:new String[]{"forest","fuji","ideal"}){
                js("__sceneTheme.switch('"+scene+"');true");
                await("Boolean(__sceneTheme.ready&&!__sceneTheme.switching&&__sceneTheme.id==='"+scene+"')");
                check("true".equals(js("document.querySelector('#viewport').dataset.loaded==='true'")),"release APK scene: "+scene);
                screenshot("android-"+scene);
            }
            if(picker){
            js("__uiInteractions.open('directory');true");await("__uiInteractions.state('directory')==='open'");
            js("document.querySelector('[data-conversation-tab=contacts]').click();document.querySelector('#directory .contacts-add').click();true");
            await("__uiInteractions.state('inbox-contact')==='open'");
            ContentValues values=new ContentValues();values.put(MediaStore.Images.Media.DISPLAY_NAME,"weroam-native-test.png");
            values.put(MediaStore.Images.Media.MIME_TYPE,"image/png");values.put(MediaStore.Images.Media.RELATIVE_PATH,"Pictures/WeRoam Test");
            Uri photo=getTargetContext().getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,values);
            try(InputStream source=getTargetContext().getAssets().open("assets/branding/weroam-icon.png");OutputStream destination=getTargetContext().getContentResolver().openOutputStream(photo)){
                byte[] buffer=new byte[16384];int count;while((count=source.read(buffer))>0)destination.write(buffer,0,count);
            }
            tap("#inbox-contact .inbox-contact-photo");
            // Optional interactive acceptance step: select the generated test
            // image in Android's system picker (or tap it through emulator UI).
            await("document.querySelector('#inbox-contact .inbox-contact-photo img')!==null");
            check(true,"Android system document picker and content URI image decoding");
            js("document.querySelector('#inbox-contact [name=name]').value='手机原生测试好友';document.querySelector('#inbox-contact [name=account]').value='native-test-contact';document.querySelector('#inbox-contact form').requestSubmit();true");
            await("__uiInteractions.state('inbox-contact')==='closed'");
            check("true".equals(js("Object.values(__socialStore.state.customFriends).some(f=>f.name==='手机原生测试好友')")),"uploaded avatar creates a local friend without generation service");
            getTargetContext().getContentResolver().delete(photo,null,null);
            }
            check("true".equals(js("__nativeErrors.length===0")),"no uncaught runtime JavaScript errors");
            result.putString("stream",report.toString());finish(-1,result);
        }catch(Throwable error){
            if(media&&web!=null)try{report.append("MEDIA: ").append(js("(()=>{const v=__contentPlayer.video;return{ready:v.readyState,network:v.networkState,time:v.currentTime,duration:v.duration,seeking:v.seeking,error:v.error?.code,seekable:Array.from({length:v.seekable.length},(_,i)=>[v.seekable.start(i),v.seekable.end(i)]),buffered:Array.from({length:v.buffered.length},(_,i)=>[v.buffered.start(i),v.buffered.end(i)])};})()"));}catch(Exception ignored){}
            result.putString("stream",report+"FAIL: "+error.toString());finish(0,result);
        }
    }
}
