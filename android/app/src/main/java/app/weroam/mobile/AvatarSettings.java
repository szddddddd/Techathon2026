package app.weroam.mobile;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.text.InputType;
import android.widget.*;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import java.security.KeyStore;
import javax.crypto.*;
import javax.crypto.spec.GCMParameterSpec;
import org.json.JSONObject;

/** Native-only credentials; never returned to the WebView or included in backups. */
final class AvatarSettings {
 private static final String ALIAS="weroam-avatar-config-v1";
 private static javax.crypto.SecretKey key() throws Exception {
  KeyStore ks=KeyStore.getInstance("AndroidKeyStore");ks.load(null);
  if(!ks.containsAlias(ALIAS)){KeyGenerator generator=KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES,"AndroidKeyStore");generator.init(new KeyGenParameterSpec.Builder(ALIAS,KeyProperties.PURPOSE_ENCRYPT|KeyProperties.PURPOSE_DECRYPT).setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).build());generator.generateKey();}
  return (javax.crypto.SecretKey)ks.getKey(ALIAS,null);
 }
 static JSONObject load(Context c)throws Exception{
  String stored=c.getSharedPreferences(ALIAS,0).getString("value",null);if(stored==null)return null;
  String[] pieces=stored.split(":");Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.DECRYPT_MODE,key(),new GCMParameterSpec(128,Base64.decode(pieces[0],Base64.NO_WRAP)));
  return new JSONObject(new String(cipher.doFinal(Base64.decode(pieces[1],Base64.NO_WRAP)),java.nio.charset.StandardCharsets.UTF_8));
 }
 static void save(Context c,JSONObject config)throws Exception{
  Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.ENCRYPT_MODE,key());String value=Base64.encodeToString(cipher.getIV(),Base64.NO_WRAP)+":"+Base64.encodeToString(cipher.doFinal(config.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8)),Base64.NO_WRAP);
  if(!c.getSharedPreferences(ALIAS,0).edit().putString("value",value).commit())throw new Exception("Save failed");
 }
 private static EditText field(Activity a,LinearLayout box,String label,String value,boolean secret){TextView title=new TextView(a);title.setText(label);box.addView(title);EditText e=new EditText(a);e.setSingleLine(true);e.setInputType(InputType.TYPE_CLASS_TEXT|(secret?InputType.TYPE_TEXT_VARIATION_PASSWORD:InputType.TYPE_TEXT_VARIATION_NORMAL));e.setText(value);box.addView(e);return e;}
 static void show(Activity a,Runnable changed){
  JSONObject old;try{old=load(a);}catch(Exception e){Toast.makeText(a,"无法读取原配置，请重新填写",Toast.LENGTH_LONG).show();old=null;}
  final JSONObject previous=old;LinearLayout box=new LinearLayout(a);box.setOrientation(LinearLayout.VERTICAL);box.setPadding(32,16,32,16);ScrollView scroll=new ScrollView(a);scroll.addView(box);
  TextView intro=new TextView(a);intro.setText("先生成参考图，再调用 Hyper3D Rodin。密钥只在本机加密保存。生成会消耗你的服务额度；保存配置不会发起请求。已有密钥留空可保留。更换图片服务地址时须重新填写对应密钥。进行中任务应完成后再更换配置。");box.addView(intro);
  JSONObject image=old==null?new JSONObject():old.optJSONObject("image");if(image==null)image=new JSONObject();
  EditText base=field(a,box,"图片服务 HTTPS API Base URL（兼容 /images/edits）",image.optString("baseURL","https://api.openai.com/v1"),false);
  EditText model=field(a,box,"图片模型",image.optString("model","gpt-image-1"),false);
  EditText size=field(a,box,"图片尺寸",image.optString("size","1024x1024"),false);
  EditText imageKey=field(a,box,"图片服务 API Key","",true);EditText rodinKey=field(a,box,"Hyper3D Rodin API Key（官方 REST）","",true);
  AlertDialog dialog=new AlertDialog.Builder(a).setTitle("模型服务配置").setView(scroll).setPositiveButton("保存",null).setNegativeButton("取消",null).setNeutralButton("清除配置",(d,w)->{a.getSharedPreferences(ALIAS,0).edit().clear().commit();changed.run();Toast.makeText(a,"配置已清除",Toast.LENGTH_SHORT).show();}).create();
  dialog.setOnShowListener(v->dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(v2->{try{
   String url=base.getText().toString().trim().replaceAll("/+$","");java.net.URI u=new java.net.URI(url);if(!"https".equals(u.getScheme())||u.getHost()==null||u.getUserInfo()!=null||u.getQuery()!=null||u.getFragment()!=null)throw new Exception("请输入有效 HTTPS API 地址");
   String ik=imageKey.getText().toString().trim(),rk=rodinKey.getText().toString().trim();
   if(ik.isEmpty()&&previous!=null&&url.equals(previous.getJSONObject("image").getString("baseURL")))ik=previous.getJSONObject("image").getString("apiKey");
   if(rk.isEmpty()&&previous!=null)rk=previous.getJSONObject("rodin").getString("apiKey");
   if(ik.isEmpty()||rk.isEmpty()||model.getText().toString().trim().isEmpty()||size.getText().toString().trim().isEmpty())throw new Exception("请填写两项密钥、图片模型和尺寸");
   JSONObject cfg=new JSONObject().put("image",new JSONObject().put("baseURL",url).put("apiKey",ik).put("model",model.getText().toString().trim()).put("size",size.getText().toString().trim())).put("rodin",new JSONObject().put("baseURL","https://api.hyper3d.com/api/v2").put("apiKey",rk)).put("prompt","Create one friendly low-poly woodland animal character based on this portrait, full body A-pose, centered, plain background, no pedestal, no text.");
   save(a,cfg);changed.run();Toast.makeText(a,"已加密保存；尚未验证服务凭据",Toast.LENGTH_LONG).show();dialog.dismiss();
  }catch(Exception e){Toast.makeText(a,"保存失败：请检查配置、密钥与 HTTPS 地址",Toast.LENGTH_LONG).show();}}));dialog.show();
 }
}
