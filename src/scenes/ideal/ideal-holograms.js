import * as T from 'three';

export function createIdealHologram(kind){
 const video=kind==='scene-video',root=new T.Group(),w=video?1.88:2.02,h=video?2.94:1.68,y=video?2.18:1.8;
 root.name=video?'Holographic video portal':'Holographic Hyper3D news terminal';
 const pearl=new T.MeshStandardMaterial({color:0xdceaf1,roughness:.7,metalness:.12}),dark=new T.MeshStandardMaterial({color:0x26495f,roughness:.6}),light=new T.MeshBasicMaterial({color:video?0x8acaff:0x77f3ef,toneMapped:false});
 const box=(name,x,yy,z,a,b,c,m)=>{const o=new T.Mesh(new T.BoxGeometry(a,b,c),m);o.name=name;o.position.set(x,yy,z);root.add(o);return o;};
 box('Hologram projector plinth',0,.14,0,1.72,.28,.72,pearl);box('Projector dark inset',0,.305,0,1.5,.07,.58,dark);
 for(const x of [-.67,.67]){box('Optical emitter',x,.4,0,.22,.18,.32,dark);box('Emitter lens',x,.505,0,.14,.025,.22,light);}
 const glass=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:0x2698c5,transparent:true,opacity:.18,side:T.DoubleSide,depthWrite:false,toneMapped:false}));glass.name='Floating holographic glass';glass.position.set(0,y,-.045);root.add(glass);
 // Open luminous corners give the screen a projected, rather than framed, edge.
 for(const sx of [-1,1])for(const sy of [-1,1]){box('Holographic corner',sx*(w/2-.16),y+sy*h/2,0,.34,.025,.025,light);box('Holographic corner',sx*w/2,y+sy*(h/2-.14),0,.025,.3,.025,light);}
 const beamMaterial=new T.MeshBasicMaterial({color:0x7feaff,transparent:true,opacity:.045,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending});
 for(const sx of [-1,1]){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([sx*.67,.5,0,sx*w/2,y-h/2,0,sx*(w/2-.45),y-h/2,0],3));const beam=new T.Mesh(geo,beamMaterial);beam.name='Projection beam';root.add(beam);}
 const scan=box('Holographic scan line',0,y, .035,w-.12,.012,.012,new T.MeshBasicMaterial({color:0xbcefff,transparent:true,opacity:.35,depthWrite:false,toneMapped:false}));
 scan.userData.hologramScan={min:y-h/2+.08,max:y+h/2-.08};
 root.userData.discoverySurface={width:video?1.64:1.76,height:video?2.7:1.4,position:[0,y,.018],tint:video?0xc8e6ff:0xc0fff1,opacity:.84};
 return root;
}
