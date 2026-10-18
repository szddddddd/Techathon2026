package app.weroam.mobile;

import android.content.Context;
import android.util.Base64;
import org.json.*;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;

/** Demo-only direct API pipeline. Secrets and job state stay outside WebView. */
final class AvatarService {
 private final Context context; private final File root; private final JSONObject config;
 AvatarService(Context context) throws Exception {this.context=context;root=new File(context.getFilesDir(),"avatar-jobs");root.mkdirs();config=AvatarSettings.load(context);}
 static byte[] read(InputStream in,int max)throws Exception{ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] b=new byte[8192];int n;while((n=in.read(b))!=-1){if(out.size()+n>max)throw new IOException("Response too large");out.write(b,0,n);}return out.toByteArray();}
 File asset(String route){return new File(root,route.substring("assets/".length()));}
 private File file(String id,String name){File dir=new File(root,id);dir.mkdirs();return new File(dir,name);}
 private void save(JSONObject job)throws Exception{File tmp=file(job.getString("id"),"job.tmp"),dest=file(job.getString("id"),"job.json");try(FileOutputStream out=new FileOutputStream(tmp)){out.write(job.toString().getBytes(StandardCharsets.UTF_8));out.getFD().sync();}if(!tmp.renameTo(dest))throw new IOException("Cannot save task");}
 private JSONObject load(String id)throws Exception{try(InputStream in=new FileInputStream(file(id,"job.json"))){return new JSONObject(new String(read(in,2000000),StandardCharsets.UTF_8));}}
 synchronized JSONObject request(String route,String body)throws Exception{
  if(config==null)throw new IOException("请先在我 → 设置 → 模型服务配置中填写密钥");
   String[] parts=route.split("/");JSONObject job;
  if(parts.length==1){JSONObject input=new JSONObject(body);String id=input.getString("requestId");if(!id.matches("[a-f0-9-]{36}"))throw new IOException("Invalid task");if(file(id,"job.json").exists())return publicJob(load(id));byte[] image=Base64.decode(input.getString("avatarBase64"),Base64.DEFAULT);if(image.length>6*1024*1024)throw new IOException("Image too large");write(file(id,"avatar.img"),image);job=new JSONObject().put("id",id).put("name",input.optString("name")).put("phase","queued");save(job);return publicJob(job);}
  if(!file(parts[1],"job.json").exists())return null;
  job=load(parts[1]);String phase=job.getString("phase");
  // A process restart during submission is ambiguous: never submit it again.
  if(phase.equals("image_submitting")||phase.equals("rodin_submitting")){job.put("phase","attention");save(job);return publicJob(job);}
  try{step(job);}catch(Exception error){String p=job.getString("phase");if(p.endsWith("submitting"))job.put("phase","attention");job.put("error","生成暂未完成，请检查网络；提交结果不明确时请勿重复创建。");save(job);}
  return publicJob(job);
 }
 private JSONObject publicJob(JSONObject j)throws Exception{JSONObject out=new JSONObject(j.toString());out.remove("subscriptionKey");return out;}
 private void step(JSONObject j)throws Exception{
  String id=j.getString("id"),phase=j.getString("phase");
  if(phase.equals("queued")){
   j.put("phase","image_submitting");save(j);JSONObject c=config.getJSONObject("image");JSONObject fields=new JSONObject().put("model",c.getString("model")).put("size",c.getString("size")).put("n","1").put("prompt",config.getString("prompt"));
   JSONObject result=multipart(c,"/images/edits",fields,"image",bytes(file(id,"avatar.img")),"avatar.png");JSONObject image=result.getJSONArray("data").getJSONObject(0);byte[] reference=image.has("b64_json")?Base64.decode(image.getString("b64_json"),Base64.DEFAULT):download(image.getString("url"),20*1024*1024);write(file(id,"reference.img"),reference);j.put("phase","image_review");save(j);
  }else if(phase.equals("image_review")){
   j.put("phase","rodin_submitting");save(j);JSONObject fields=new JSONObject().put("tier","Gen-2.5-Medium").put("mesh_mode","Raw").put("quality_override","12000").put("geometry_file_format","glb").put("prompt","One full body woodland character, A-pose, no pedestal");
   JSONObject result=multipart(config.getJSONObject("rodin"),"/rodin",fields,"images",bytes(file(id,"reference.img")),"reference.png");j.put("generationId",result.getString("uuid")).put("subscriptionKey",result.getJSONObject("jobs").getString("subscription_key")).put("phase","model_processing");save(j);
  }else if(phase.equals("model_processing")){
   JSONObject result=json("/status",new JSONObject().put("subscription_key",j.getString("subscriptionKey")));JSONArray jobs=result.getJSONArray("jobs");boolean done=jobs.length()>0;for(int i=0;i<jobs.length();i++){String state=jobs.getJSONObject(i).getString("status");if(state.equals("Failed")){j.put("phase","failed");save(j);return;}done &= state.equals("Done");}if(done){j.put("phase","downloading");save(j);}
  }else if(phase.equals("downloading")){
   JSONArray files=json("/download",new JSONObject().put("task_uuid",j.getString("generationId"))).getJSONArray("list");String url=null;for(int i=0;i<files.length();i++){JSONObject f=files.getJSONObject(i);if(f.optString("name").toLowerCase().endsWith(".glb")||f.optString("url").split("\\?")[0].endsWith(".glb")){url=f.getString("url");break;}}if(url==null)throw new IOException("No GLB");byte[] model=download(url,100*1024*1024);if(model.length<12||model[0]!='g'||model[1]!='l'||model[2]!='T'||model[3]!='F')throw new IOException("Invalid GLB");write(file(id,"scene.glb"),model);j.put("phase","ready").put("modelUrl","/api/avatar/assets/"+id+"/scene.glb");save(j);
  }
 }
 private byte[] bytes(File f)throws Exception{try(InputStream in=new FileInputStream(f)){return read(in,100*1024*1024);}}
 private void write(File f,byte[] b)throws Exception{try(OutputStream out=new FileOutputStream(f)){out.write(b);}}
 private HttpURLConnection connection(String url)throws Exception{URL u=new URL(url);if(!u.getProtocol().equals("https"))throw new IOException("HTTPS required");HttpURLConnection c=(HttpURLConnection)u.openConnection();c.setInstanceFollowRedirects(false);c.setConnectTimeout(15000);c.setReadTimeout(240000);return c;}
 private byte[] download(String url,int max)throws Exception{HttpURLConnection c=connection(url);try{if(c.getResponseCode()!=200)throw new IOException("Download failed");try(InputStream in=c.getInputStream()){return read(in,max);}}finally{c.disconnect();}}
 private JSONObject json(String route,JSONObject body)throws Exception{JSONObject cfg=config.getJSONObject("rodin");return send(cfg,route,"application/json",body.toString().getBytes(StandardCharsets.UTF_8));}
 private JSONObject multipart(JSONObject cfg,String route,JSONObject fields,String field,byte[] image,String filename)throws Exception{String boundary="Weroam"+java.util.UUID.randomUUID();ByteArrayOutputStream out=new ByteArrayOutputStream();java.util.Iterator<String> keys=fields.keys();while(keys.hasNext()){String k=keys.next();out.write(("--"+boundary+"\r\nContent-Disposition: form-data; name=\""+k+"\"\r\n\r\n"+fields.getString(k)+"\r\n").getBytes(StandardCharsets.UTF_8));}String mime=image[0]==(byte)0x89?"image/png":image[0]==(byte)0xff?"image/jpeg":"image/webp";out.write(("--"+boundary+"\r\nContent-Disposition: form-data; name=\""+field+"\"; filename=\""+filename+"\"\r\nContent-Type: "+mime+"\r\n\r\n").getBytes(StandardCharsets.UTF_8));out.write(image);out.write(("\r\n--"+boundary+"--\r\n").getBytes(StandardCharsets.UTF_8));return send(cfg,route,"multipart/form-data; boundary="+boundary,out.toByteArray());}
 private JSONObject send(JSONObject cfg,String route,String type,byte[] body)throws Exception{HttpURLConnection c=connection(cfg.getString("baseURL")+route);try{c.setRequestMethod("POST");c.setDoOutput(true);c.setRequestProperty("Authorization","Bearer "+cfg.getString("apiKey"));c.setRequestProperty("Content-Type",type);try(OutputStream out=c.getOutputStream()){out.write(body);}if(c.getResponseCode()<200||c.getResponseCode()>=300)throw new IOException("Provider request failed");try(InputStream in=c.getInputStream()){JSONObject r=new JSONObject(new String(read(in,32*1024*1024),StandardCharsets.UTF_8));if(r.has("error"))throw new IOException("Provider error");return r;}}finally{c.disconnect();}}
}
