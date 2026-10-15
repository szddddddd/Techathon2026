(()=>{var wi={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Ai={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Nu=0,pl=1,Uu=2;var ml=1,pa=2,qn=3,Sn=0,Xt=1,_t=2,li=0,Oi=1,gl=2,_l=3,xl=4,Fu=5,xi=100,Ou=101,Bu=102,ku=103,zu=104,Hu=200,Vu=201,Gu=202,Wu=203,Wo=204,Xo=205,Xu=206,qu=207,Yu=208,$u=209,Zu=210,Ku=211,Ju=212,ju=213,Qu=214,ma=0,ga=1,_a=2,Bi=3,xa=4,ya=5,va=6,Ma=7,yl=0,ed=1,td=2,hi=0,nd=1,id=2,sd=3,ba=4,rd=5,od=6,ad=7,jc="attached",cd="detached",vl=300,Ki=301,Ji=302,Sa=303,Ea=304,Qr=306,yi=1e3,Ln=1001,bs=1002,Ut=1003,Ta=1004;var ji=1005;var Gt=1006,ks=1007;var An=1008;var Rn=1009,Ml=1010,bl=1011,zs=1012,wa=1013,Ri=1014,pn=1015,Hs=1016,Aa=1017,Ra=1018,Vs=1020,Sl=35902,El=35899,Tl=1021,wl=1022,an=1023,Ss=1026,Gs=1027,Ca=1028,Ia=1029,Al=1030,Pa=1031;var La=1033,eo=33776,to=33777,no=33778,io=33779,Da=35840,Na=35841,Ua=35842,Fa=35843,Oa=36196,Ba=37492,ka=37496,za=37808,Ha=37809,Va=37810,Ga=37811,Wa=37812,Xa=37813,qa=37814,Ya=37815,$a=37816,Za=37817,Ka=37818,Ja=37819,ja=37820,Qa=37821,ec=36492,tc=36494,nc=36495,ic=36283,sc=36284,rc=36285,oc=36286;var ki=2300,zi=2301,Go=2302,Qc=2400,el=2401,tl=2402,ld=2500;var Rl=0,so=1,Ws=2,hd=3200,ud=3201;var Cl=0,dd=1,ui="",bt="srgb",Ft="srgb-linear",gr="linear",lt="srgb";var Fi=7680;var nl=519,fd=512,pd=513,md=514,Il=515,gd=516,_d=517,xd=518,yd=519,qo=35044;var Pl="300 es",bn=2e3,_r=2001;var Un=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}},Bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Xh=1234567,vs=Math.PI/180,Hi=180/Math.PI;function dn(){let s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Bt[s&255]+Bt[s>>8&255]+Bt[s>>16&255]+Bt[s>>24&255]+"-"+Bt[e&255]+Bt[e>>8&255]+"-"+Bt[e>>16&15|64]+Bt[e>>24&255]+"-"+Bt[t&63|128]+Bt[t>>8&255]+"-"+Bt[t>>16&255]+Bt[t>>24&255]+Bt[n&255]+Bt[n>>8&255]+Bt[n>>16&255]+Bt[n>>24&255]).toLowerCase()}function Ke(s,e,t){return Math.max(e,Math.min(t,s))}function Ll(s,e){return(s%e+e)%e}function Xf(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function qf(s,e,t){return s!==e?(t-s)/(e-s):0}function fr(s,e,t){return(1-t)*s+t*e}function Yf(s,e,t,n){return fr(s,e,1-Math.exp(-t*n))}function $f(s,e=1){return e-Math.abs(Ll(s,e*2)-e)}function Zf(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Kf(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Jf(s,e){return s+Math.floor(Math.random()*(e-s+1))}function jf(s,e){return s+Math.random()*(e-s)}function Qf(s){return s*(.5-Math.random())}function ep(s){s!==void 0&&(Xh=s);let e=Xh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function tp(s){return s*vs}function np(s){return s*Hi}function ip(s){return(s&s-1)===0&&s!==0}function sp(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function rp(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function op(s,e,t,n,i){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),f=o((e-n)/2),d=r((n-e)/2),p=o((n-e)/2);switch(i){case"XYX":s.set(a*h,l*u,l*f,a*c);break;case"YZY":s.set(l*f,a*h,l*u,a*c);break;case"ZXZ":s.set(l*u,l*f,a*h,a*c);break;case"XZX":s.set(a*h,l*p,l*d,a*c);break;case"YXY":s.set(l*d,a*h,l*p,a*c);break;case"ZYZ":s.set(l*p,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Mn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function ct(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var mn={DEG2RAD:vs,RAD2DEG:Hi,generateUUID:dn,clamp:Ke,euclideanModulo:Ll,mapLinear:Xf,inverseLerp:qf,lerp:fr,damp:Yf,pingpong:$f,smoothstep:Zf,smootherstep:Kf,randInt:Jf,randFloat:jf,randFloatSpread:Qf,seededRandom:ep,degToRad:tp,radToDeg:np,isPowerOfTwo:ip,ceilPowerOfTwo:sp,floorPowerOfTwo:rp,setQuaternionFromProperEuler:op,normalize:ct,denormalize:Mn},_e=class s{constructor(e=0,t=0){s.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Wt=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],f=r[o+0],d=r[o+1],p=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=d,e[t+2]=p,e[t+3]=_;return}if(u!==_||l!==f||c!==d||h!==p){let g=1-a,m=l*f+c*d+h*p+u*_,M=m>=0?1:-1,y=1-m*m;if(y>Number.EPSILON){let E=Math.sqrt(y),A=Math.atan2(E,m*M);g=Math.sin(g*A)/E,a=Math.sin(a*A)/E}let x=a*M;if(l=l*g+f*x,c=c*g+d*x,h=h*g+p*x,u=u*g+_*x,g===1-a){let E=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=E,c*=E,h*=E,u*=E}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,o){let a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[o],f=r[o+1],d=r[o+2],p=r[o+3];return e[t]=a*p+h*u+l*d-c*f,e[t+1]=l*p+h*f+c*u-a*d,e[t+2]=c*p+h*d+a*f-l*u,e[t+3]=h*p-a*u-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(r/2),f=l(n/2),d=l(i/2),p=l(r/2);switch(o){case"XYZ":this._x=f*h*u+c*d*p,this._y=c*d*u-f*h*p,this._z=c*h*p+f*d*u,this._w=c*h*u-f*d*p;break;case"YXZ":this._x=f*h*u+c*d*p,this._y=c*d*u-f*h*p,this._z=c*h*p-f*d*u,this._w=c*h*u+f*d*p;break;case"ZXY":this._x=f*h*u-c*d*p,this._y=c*d*u+f*h*p,this._z=c*h*p+f*d*u,this._w=c*h*u-f*d*p;break;case"ZYX":this._x=f*h*u-c*d*p,this._y=c*d*u+f*h*p,this._z=c*h*p-f*d*u,this._w=c*h*u+f*d*p;break;case"YZX":this._x=f*h*u+c*d*p,this._y=c*d*u+f*h*p,this._z=c*h*p-f*d*u,this._w=c*h*u-f*d*p;break;case"XZY":this._x=f*h*u-c*d*p,this._y=c*d*u-f*h*p,this._z=c*h*p+f*d*u,this._w=c*h*u+f*d*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+a+u;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(o-i)*d}else if(n>a&&n>u){let d=2*Math.sqrt(1+n-a-u);this._w=(h-l)/d,this._x=.25*d,this._y=(i+o)/d,this._z=(r+c)/d}else if(a>u){let d=2*Math.sqrt(1+a-n-u);this._w=(r-c)/d,this._x=(i+o)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+u-n-a);this._w=(o-i)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,i=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let d=1-t;return this._w=d*o+t*this._w,this._x=d*n+t*this._x,this._y=d*i+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},N=class s{constructor(e=0,t=0,n=0){s.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(qh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(qh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),h=2*(a*t-r*i),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=i+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Mc.copy(this).projectOnVector(e),this.sub(Mc)}reflect(e){return this.sub(Mc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Mc=new N,qh=new Wt,Ze=class s{constructor(e,t,n,i,r,o,a,l,c){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c)}set(e,t,n,i,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],p=n[8],_=i[0],g=i[3],m=i[6],M=i[1],y=i[4],x=i[7],E=i[2],A=i[5],D=i[8];return r[0]=o*_+a*M+l*E,r[3]=o*g+a*y+l*A,r[6]=o*m+a*x+l*D,r[1]=c*_+h*M+u*E,r[4]=c*g+h*y+u*A,r[7]=c*m+h*x+u*D,r[2]=f*_+d*M+p*E,r[5]=f*g+d*y+p*A,r[8]=f*m+d*x+p*D,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,f=a*l-h*r,d=c*r-o*l,p=t*u+n*f+i*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/p;return e[0]=u*_,e[1]=(i*c-h*n)*_,e[2]=(a*n-i*o)*_,e[3]=f*_,e[4]=(h*t-i*l)*_,e[5]=(i*r-a*t)*_,e[6]=d*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(bc.makeScale(e,t)),this}rotate(e){return this.premultiply(bc.makeRotation(-e)),this}translate(e,t){return this.premultiply(bc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},bc=new Ze;function Dl(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Es(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function vd(){let s=Es("canvas");return s.style.display="block",s}var Yh={};function Ts(s){s in Yh||(Yh[s]=!0,console.warn(s))}function Md(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var $h=new Ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Zh=new Ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ap(){let s={enabled:!0,workingColorSpace:Ft,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===lt&&(i.r=ii(i.r),i.g=ii(i.g),i.b=ii(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===lt&&(i.r=Ms(i.r),i.g=Ms(i.g),i.b=Ms(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ui?gr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Ts("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Ts("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Ft]:{primaries:e,whitePoint:n,transfer:gr,toXYZ:$h,fromXYZ:Zh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:bt},outputColorSpaceConfig:{drawingBufferColorSpace:bt}},[bt]:{primaries:e,whitePoint:n,transfer:lt,toXYZ:$h,fromXYZ:Zh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:bt}}}),s}var tt=ap();function ii(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ms(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var os,Yo=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{os===void 0&&(os=Es("canvas")),os.width=e.width,os.height=e.height;let i=os.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=os}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Es("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=ii(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ii(t[n]/255)*255):t[n]=ii(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},cp=0,ws=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:cp++}),this.uuid=dn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Sc(i[o].image)):r.push(Sc(i[o]))}else r=Sc(i);n.url=r}return t||(e.images[this.uuid]=n),n}};function Sc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Yo.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var lp=0,Ec=new N,Nt=class s extends Un{constructor(e=s.DEFAULT_IMAGE,t=s.DEFAULT_MAPPING,n=Ln,i=Ln,r=Gt,o=An,a=an,l=Rn,c=s.DEFAULT_ANISOTROPY,h=ui){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:lp++}),this.uuid=dn(),this.name="",this.source=new ws(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new _e(0,0),this.repeat=new _e(1,1),this.center=new _e(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ec).x}get height(){return this.source.getSize(Ec).y}get depth(){return this.source.getSize(Ec).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==vl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case yi:e.x=e.x-Math.floor(e.x);break;case Ln:e.x=e.x<0?0:1;break;case bs:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case yi:e.y=e.y-Math.floor(e.y);break;case Ln:e.y=e.y<0?0:1;break;case bs:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Nt.DEFAULT_IMAGE=null;Nt.DEFAULT_MAPPING=vl;Nt.DEFAULT_ANISOTROPY=1;var rt=class s{constructor(e=0,t=0,n=0,i=1){s.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r,l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],p=l[9],_=l[2],g=l[6],m=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(p+g)<.1&&Math.abs(c+d+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let y=(c+1)/2,x=(d+1)/2,E=(m+1)/2,A=(h+f)/4,D=(u+_)/4,O=(p+g)/4;return y>x&&y>E?y<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(y),i=A/n,r=D/n):x>E?x<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(x),n=A/i,r=O/i):E<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(E),n=D/r,i=O/r),this.set(n,i,r,t),this}let M=Math.sqrt((g-p)*(g-p)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(M)<.001&&(M=1),this.x=(g-p)/M,this.y=(u-_)/M,this.z=(f-h)/M,this.w=Math.acos((c+d+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},$o=class extends Un{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Gt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new rt(0,0,e,t),this.scissorTest=!1,this.viewport=new rt(0,0,e,t);let i={width:e,height:t,depth:n.depth},r=new Nt(i);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Gt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let i=Object.assign({},e.textures[t].image);this.textures[t].source=new ws(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fn=class extends $o{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},xr=class extends Nt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Ut,this.minFilter=Ut,this.wrapR=Ln,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Zo=class extends Nt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Ut,this.minFilter=Ut,this.wrapR=Ln,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ct=class{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(xn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(xn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=xn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,xn):xn.fromBufferAttribute(r,o),xn.applyMatrix4(e.matrixWorld),this.expandByPoint(xn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),fo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),fo.copy(n.boundingBox)),fo.applyMatrix4(e.matrixWorld),this.union(fo)}let i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,xn),xn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(sr),po.subVectors(this.max,sr),as.subVectors(e.a,sr),cs.subVectors(e.b,sr),ls.subVectors(e.c,sr),di.subVectors(cs,as),fi.subVectors(ls,cs),Li.subVectors(as,ls);let t=[0,-di.z,di.y,0,-fi.z,fi.y,0,-Li.z,Li.y,di.z,0,-di.x,fi.z,0,-fi.x,Li.z,0,-Li.x,-di.y,di.x,0,-fi.y,fi.x,0,-Li.y,Li.x,0];return!Tc(t,as,cs,ls,po)||(t=[1,0,0,0,1,0,0,0,1],!Tc(t,as,cs,ls,po))?!1:(mo.crossVectors(di,fi),t=[mo.x,mo.y,mo.z],Tc(t,as,cs,ls,po))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,xn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(xn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Kn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Kn=[new N,new N,new N,new N,new N,new N,new N,new N],xn=new N,fo=new Ct,as=new N,cs=new N,ls=new N,di=new N,fi=new N,Li=new N,sr=new N,po=new N,mo=new N,Di=new N;function Tc(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Di.fromArray(s,r);let a=i.x*Math.abs(Di.x)+i.y*Math.abs(Di.y)+i.z*Math.abs(Di.z),l=e.dot(Di),c=t.dot(Di),h=n.dot(Di);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var hp=new Ct,rr=new N,wc=new N,Yt=class{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):hp.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;rr.subVectors(e,this.center);let t=rr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(rr,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(wc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(rr.copy(e.center).add(wc)),this.expandByPoint(rr.copy(e.center).sub(wc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Jn=new N,Ac=new N,go=new N,pi=new N,Rc=new N,_o=new N,Cc=new N,On=class{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Jn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Jn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Jn.copy(this.origin).addScaledVector(this.direction,t),Jn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Ac.copy(e).add(t).multiplyScalar(.5),go.copy(t).sub(e).normalize(),pi.copy(this.origin).sub(Ac);let r=e.distanceTo(t)*.5,o=-this.direction.dot(go),a=pi.dot(this.direction),l=-pi.dot(go),c=pi.lengthSq(),h=Math.abs(1-o*o),u,f,d,p;if(h>0)if(u=o*l-a,f=o*a-l,p=r*h,u>=0)if(f>=-p)if(f<=p){let _=1/h;u*=_,f*=_,d=u*(u+o*f+2*a)+f*(o*u+f+2*l)+c}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f<=-p?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c):f<=p?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Ac).addScaledVector(go,f),d}intersectSphere(e,t){Jn.subVectors(e.center,this.origin);let n=Jn.dot(this.direction),i=Jn.dot(Jn)-n*n,r=e.radius*e.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Jn)!==null}intersectTriangle(e,t,n,i,r){Rc.subVectors(t,e),_o.subVectors(n,e),Cc.crossVectors(Rc,_o);let o=this.direction.dot(Cc),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;pi.subVectors(this.origin,e);let l=a*this.direction.dot(_o.crossVectors(pi,_o));if(l<0)return null;let c=a*this.direction.dot(Rc.cross(pi));if(c<0||l+c>o)return null;let h=-a*pi.dot(Cc);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},$e=class s{constructor(e,t,n,i,r,o,a,l,c,h,u,f,d,p,_,g){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c,h,u,f,d,p,_,g)}set(e,t,n,i,r,o,a,l,c,h,u,f,d,p,_,g){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=f,m[3]=d,m[7]=p,m[11]=_,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,i=1/hs.setFromMatrixColumn(e,0).length(),r=1/hs.setFromMatrixColumn(e,1).length(),o=1/hs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=o*h,d=o*u,p=a*h,_=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=d+p*c,t[5]=f-_*c,t[9]=-a*l,t[2]=_-f*c,t[6]=p+d*c,t[10]=o*l}else if(e.order==="YXZ"){let f=l*h,d=l*u,p=c*h,_=c*u;t[0]=f+_*a,t[4]=p*a-d,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=d*a-p,t[6]=_+f*a,t[10]=o*l}else if(e.order==="ZXY"){let f=l*h,d=l*u,p=c*h,_=c*u;t[0]=f-_*a,t[4]=-o*u,t[8]=p+d*a,t[1]=d+p*a,t[5]=o*h,t[9]=_-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let f=o*h,d=o*u,p=a*h,_=a*u;t[0]=l*h,t[4]=p*c-d,t[8]=f*c+_,t[1]=l*u,t[5]=_*c+f,t[9]=d*c-p,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let f=o*l,d=o*c,p=a*l,_=a*c;t[0]=l*h,t[4]=_-f*u,t[8]=p*u+d,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=d*u+p,t[10]=f-_*u}else if(e.order==="XZY"){let f=o*l,d=o*c,p=a*l,_=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+_,t[5]=o*h,t[9]=d*u-p,t[2]=p*u-d,t[6]=a*h,t[10]=_*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(up,e,dp)}lookAt(e,t,n){let i=this.elements;return tn.subVectors(e,t),tn.lengthSq()===0&&(tn.z=1),tn.normalize(),mi.crossVectors(n,tn),mi.lengthSq()===0&&(Math.abs(n.z)===1?tn.x+=1e-4:tn.z+=1e-4,tn.normalize(),mi.crossVectors(n,tn)),mi.normalize(),xo.crossVectors(tn,mi),i[0]=mi.x,i[4]=xo.x,i[8]=tn.x,i[1]=mi.y,i[5]=xo.y,i[9]=tn.y,i[2]=mi.z,i[6]=xo.z,i[10]=tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],p=n[2],_=n[6],g=n[10],m=n[14],M=n[3],y=n[7],x=n[11],E=n[15],A=i[0],D=i[4],O=i[8],b=i[12],v=i[1],I=i[5],V=i[9],X=i[13],ee=i[2],Q=i[6],C=i[10],L=i[14],w=i[3],H=i[7],G=i[11],F=i[15];return r[0]=o*A+a*v+l*ee+c*w,r[4]=o*D+a*I+l*Q+c*H,r[8]=o*O+a*V+l*C+c*G,r[12]=o*b+a*X+l*L+c*F,r[1]=h*A+u*v+f*ee+d*w,r[5]=h*D+u*I+f*Q+d*H,r[9]=h*O+u*V+f*C+d*G,r[13]=h*b+u*X+f*L+d*F,r[2]=p*A+_*v+g*ee+m*w,r[6]=p*D+_*I+g*Q+m*H,r[10]=p*O+_*V+g*C+m*G,r[14]=p*b+_*X+g*L+m*F,r[3]=M*A+y*v+x*ee+E*w,r[7]=M*D+y*I+x*Q+E*H,r[11]=M*O+y*V+x*C+E*G,r[15]=M*b+y*X+x*L+E*F,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],d=e[14],p=e[3],_=e[7],g=e[11],m=e[15];return p*(+r*l*u-i*c*u-r*a*f+n*c*f+i*a*d-n*l*d)+_*(+t*l*d-t*c*f+r*o*f-i*o*d+i*c*h-r*l*h)+g*(+t*c*u-t*a*d-r*o*u+n*o*d+r*a*h-n*c*h)+m*(-i*a*h-t*l*u+t*a*f+i*o*u-n*o*f+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],d=e[11],p=e[12],_=e[13],g=e[14],m=e[15],M=u*g*c-_*f*c+_*l*d-a*g*d-u*l*m+a*f*m,y=p*f*c-h*g*c-p*l*d+o*g*d+h*l*m-o*f*m,x=h*_*c-p*u*c+p*a*d-o*_*d-h*a*m+o*u*m,E=p*u*l-h*_*l-p*a*f+o*_*f+h*a*g-o*u*g,A=t*M+n*y+i*x+r*E;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let D=1/A;return e[0]=M*D,e[1]=(_*f*r-u*g*r-_*i*d+n*g*d+u*i*m-n*f*m)*D,e[2]=(a*g*r-_*l*r+_*i*c-n*g*c-a*i*m+n*l*m)*D,e[3]=(u*l*r-a*f*r-u*i*c+n*f*c+a*i*d-n*l*d)*D,e[4]=y*D,e[5]=(h*g*r-p*f*r+p*i*d-t*g*d-h*i*m+t*f*m)*D,e[6]=(p*l*r-o*g*r-p*i*c+t*g*c+o*i*m-t*l*m)*D,e[7]=(o*f*r-h*l*r+h*i*c-t*f*c-o*i*d+t*l*d)*D,e[8]=x*D,e[9]=(p*u*r-h*_*r-p*n*d+t*_*d+h*n*m-t*u*m)*D,e[10]=(o*_*r-p*a*r+p*n*c-t*_*c-o*n*m+t*a*m)*D,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*d-t*a*d)*D,e[12]=E*D,e[13]=(h*_*i-p*u*i+p*n*f-t*_*f-h*n*g+t*u*g)*D,e[14]=(p*a*i-o*_*i-p*n*l+t*_*l+o*n*g-t*a*g)*D,e[15]=(o*u*i-h*a*i+h*n*l-t*u*l-o*n*f+t*a*f)*D,this}scale(e){let t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,f=r*c,d=r*h,p=r*u,_=o*h,g=o*u,m=a*u,M=l*c,y=l*h,x=l*u,E=n.x,A=n.y,D=n.z;return i[0]=(1-(_+m))*E,i[1]=(d+x)*E,i[2]=(p-y)*E,i[3]=0,i[4]=(d-x)*A,i[5]=(1-(f+m))*A,i[6]=(g+M)*A,i[7]=0,i[8]=(p+y)*D,i[9]=(g-M)*D,i[10]=(1-(f+_))*D,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements,r=hs.set(i[0],i[1],i[2]).length(),o=hs.set(i[4],i[5],i[6]).length(),a=hs.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],yn.copy(this);let c=1/r,h=1/o,u=1/a;return yn.elements[0]*=c,yn.elements[1]*=c,yn.elements[2]*=c,yn.elements[4]*=h,yn.elements[5]*=h,yn.elements[6]*=h,yn.elements[8]*=u,yn.elements[9]*=u,yn.elements[10]*=u,t.setFromRotationMatrix(yn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=bn,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-i),f=(t+e)/(t-e),d=(n+i)/(n-i),p,_;if(l)p=r/(o-r),_=o*r/(o-r);else if(a===bn)p=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===_r)p=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=bn,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-i),f=-(t+e)/(t-e),d=-(n+i)/(n-i),p,_;if(l)p=1/(o-r),_=o/(o-r);else if(a===bn)p=-2/(o-r),_=-(o+r)/(o-r);else if(a===_r)p=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},hs=new N,yn=new $e,up=new N(0,0,0),dp=new N(1,1,1),mi=new N,xo=new N,tn=new N,Kh=new $e,Jh=new Wt,En=class s{constructor(e=0,t=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],f=i[6],d=i[10];switch(t){case"XYZ":this._y=Math.asin(Ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ke(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ke(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Kh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Kh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Jh.setFromEuler(this),this.setFromQuaternion(Jh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};En.DEFAULT_ORDER="XYZ";var As=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},fp=0,jh=new N,us=new Wt,jn=new $e,yo=new N,or=new N,pp=new N,mp=new Wt,Qh=new N(1,0,0),eu=new N(0,1,0),tu=new N(0,0,1),nu={type:"added"},gp={type:"removed"},ds={type:"childadded",child:null},Ic={type:"childremoved",child:null},xt=class s extends Un{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:fp++}),this.uuid=dn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let e=new N,t=new En,n=new Wt,i=new N(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new $e},normalMatrix:{value:new Ze}}),this.matrix=new $e,this.matrixWorld=new $e,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new As,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return us.setFromAxisAngle(e,t),this.quaternion.multiply(us),this}rotateOnWorldAxis(e,t){return us.setFromAxisAngle(e,t),this.quaternion.premultiply(us),this}rotateX(e){return this.rotateOnAxis(Qh,e)}rotateY(e){return this.rotateOnAxis(eu,e)}rotateZ(e){return this.rotateOnAxis(tu,e)}translateOnAxis(e,t){return jh.copy(e).applyQuaternion(this.quaternion),this.position.add(jh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Qh,e)}translateY(e){return this.translateOnAxis(eu,e)}translateZ(e){return this.translateOnAxis(tu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(jn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?yo.copy(e):yo.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),or.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?jn.lookAt(or,yo,this.up):jn.lookAt(yo,or,this.up),this.quaternion.setFromRotationMatrix(jn),i&&(jn.extractRotation(i.matrixWorld),us.setFromRotationMatrix(jn),this.quaternion.premultiply(us.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(nu),ds.child=e,this.dispatchEvent(ds),ds.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(gp),Ic.child=e,this.dispatchEvent(Ic),Ic.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),jn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),jn.multiply(e.parent.matrixWorld)),e.applyMatrix4(jn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(nu),ds.child=e,this.dispatchEvent(ds),ds.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,e,pp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,mp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];i.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),f=o(e.skeletons),d=o(e.animations),p=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}};xt.DEFAULT_UP=new N(0,1,0);xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var vn=new N,Qn=new N,Pc=new N,ei=new N,fs=new N,ps=new N,iu=new N,Lc=new N,Dc=new N,Nc=new N,Uc=new rt,Fc=new rt,Oc=new rt,ni=class s{constructor(e=new N,t=new N,n=new N){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),vn.subVectors(e,t),i.cross(vn);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){vn.subVectors(i,t),Qn.subVectors(n,t),Pc.subVectors(e,t);let o=vn.dot(vn),a=vn.dot(Qn),l=vn.dot(Pc),c=Qn.dot(Qn),h=Qn.dot(Pc),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let f=1/u,d=(c*l-a*h)*f,p=(o*h-a*l)*f;return r.set(1-d-p,p,d)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,ei)===null?!1:ei.x>=0&&ei.y>=0&&ei.x+ei.y<=1}static getInterpolation(e,t,n,i,r,o,a,l){return this.getBarycoord(e,t,n,i,ei)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ei.x),l.addScaledVector(o,ei.y),l.addScaledVector(a,ei.z),l)}static getInterpolatedAttribute(e,t,n,i,r,o){return Uc.setScalar(0),Fc.setScalar(0),Oc.setScalar(0),Uc.fromBufferAttribute(e,t),Fc.fromBufferAttribute(e,n),Oc.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(Uc,r.x),o.addScaledVector(Fc,r.y),o.addScaledVector(Oc,r.z),o}static isFrontFacing(e,t,n,i){return vn.subVectors(n,t),Qn.subVectors(e,t),vn.cross(Qn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return vn.subVectors(this.c,this.b),Qn.subVectors(this.a,this.b),vn.cross(Qn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return s.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return s.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return s.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return s.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return s.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,r=this.c,o,a;fs.subVectors(i,n),ps.subVectors(r,n),Lc.subVectors(e,n);let l=fs.dot(Lc),c=ps.dot(Lc);if(l<=0&&c<=0)return t.copy(n);Dc.subVectors(e,i);let h=fs.dot(Dc),u=ps.dot(Dc);if(h>=0&&u<=h)return t.copy(i);let f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(fs,o);Nc.subVectors(e,r);let d=fs.dot(Nc),p=ps.dot(Nc);if(p>=0&&d<=p)return t.copy(r);let _=d*c-l*p;if(_<=0&&c>=0&&p<=0)return a=c/(c-p),t.copy(n).addScaledVector(ps,a);let g=h*p-d*u;if(g<=0&&u-h>=0&&d-p>=0)return iu.subVectors(r,i),a=(u-h)/(u-h+(d-p)),t.copy(i).addScaledVector(iu,a);let m=1/(g+_+f);return o=_*m,a=f*m,t.copy(n).addScaledVector(fs,o).addScaledVector(ps,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},bd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},gi={h:0,s:0,l:0},vo={h:0,s:0,l:0};function Bc(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}var ze=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=tt.workingColorSpace){if(e=Ll(e,1),t=Ke(t,0,1),n=Ke(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Bc(o,r,e+1/3),this.g=Bc(o,r,e),this.b=Bc(o,r,e-1/3)}return tt.colorSpaceToWorking(this,i),this}setStyle(e,t=bt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=bt){let n=bd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ii(e.r),this.g=ii(e.g),this.b=ii(e.b),this}copyLinearToSRGB(e){return this.r=Ms(e.r),this.g=Ms(e.g),this.b=Ms(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=bt){return tt.workingToColorSpace(kt.copy(this),e),Math.round(Ke(kt.r*255,0,255))*65536+Math.round(Ke(kt.g*255,0,255))*256+Math.round(Ke(kt.b*255,0,255))}getHexString(e=bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(kt.copy(this),t);let n=kt.r,i=kt.g,r=kt.b,o=Math.max(n,i,r),a=Math.min(n,i,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(kt.copy(this),t),e.r=kt.r,e.g=kt.g,e.b=kt.b,e}getStyle(e=bt){tt.workingToColorSpace(kt.copy(this),e);let t=kt.r,n=kt.g,i=kt.b;return e!==bt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(gi),this.setHSL(gi.h+e,gi.s+t,gi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(gi),e.getHSL(vo);let n=fr(gi.h,vo.h,t),i=fr(gi.s,vo.s,t),r=fr(gi.l,vo.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},kt=new ze;ze.NAMES=bd;var _p=0,$t=class extends Un{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_p++}),this.uuid=dn(),this.name="",this.type="Material",this.blending=Oi,this.side=Sn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Wo,this.blendDst=Xo,this.blendEquation=xi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ze(0,0,0),this.blendAlpha=0,this.depthFunc=Bi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=nl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Fi,this.stencilZFail=Fi,this.stencilZPass=Fi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Oi&&(n.blending=this.blending),this.side!==Sn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Wo&&(n.blendSrc=this.blendSrc),this.blendDst!==Xo&&(n.blendDst=this.blendDst),this.blendEquation!==xi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Bi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==nl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Fi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Fi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Fi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ot=class extends $t{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=yl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Tt=new N,Mo=new _e,xp=0,gt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:xp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=qo,this.updateRanges=[],this.gpuType=pn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Mo.fromBufferAttribute(this,t),Mo.applyMatrix3(e),this.setXY(t,Mo.x,Mo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix3(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix4(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyNormalMatrix(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.transformDirection(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Mn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ct(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Mn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Mn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Mn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Mn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),i=ct(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),i=ct(i,this.array),r=ct(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==qo&&(e.usage=this.usage),e}};var yr=class extends gt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var vr=class extends gt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Ge=class extends gt{constructor(e,t,n){super(new Float32Array(e),t,n)}},yp=0,hn=new $e,kc=new xt,ms=new N,nn=new Ct,ar=new Ct,Dt=new N,je=class s extends Un{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yp++}),this.uuid=dn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Dl(e)?vr:yr)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ze().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return hn.makeRotationFromQuaternion(e),this.applyMatrix4(hn),this}rotateX(e){return hn.makeRotationX(e),this.applyMatrix4(hn),this}rotateY(e){return hn.makeRotationY(e),this.applyMatrix4(hn),this}rotateZ(e){return hn.makeRotationZ(e),this.applyMatrix4(hn),this}translate(e,t,n){return hn.makeTranslation(e,t,n),this.applyMatrix4(hn),this}scale(e,t,n){return hn.makeScale(e,t,n),this.applyMatrix4(hn),this}lookAt(e){return kc.lookAt(e),kc.updateMatrix(),this.applyMatrix4(kc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ms).negate(),this.translate(ms.x,ms.y,ms.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,r=e.length;i<r;i++){let o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ge(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ct);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let r=t[n];nn.setFromBufferAttribute(r),this.morphTargetsRelative?(Dt.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(Dt),Dt.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(Dt)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Yt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){let n=this.boundingSphere.center;if(nn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];ar.setFromBufferAttribute(a),this.morphTargetsRelative?(Dt.addVectors(nn.min,ar.min),nn.expandByPoint(Dt),Dt.addVectors(nn.max,ar.max),nn.expandByPoint(Dt)):(nn.expandByPoint(ar.min),nn.expandByPoint(ar.max))}nn.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)Dt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Dt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Dt.fromBufferAttribute(a,c),l&&(ms.fromBufferAttribute(e,c),Dt.add(ms)),i=Math.max(i,n.distanceToSquared(Dt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new gt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let O=0;O<n.count;O++)a[O]=new N,l[O]=new N;let c=new N,h=new N,u=new N,f=new _e,d=new _e,p=new _e,_=new N,g=new N;function m(O,b,v){c.fromBufferAttribute(n,O),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,v),f.fromBufferAttribute(r,O),d.fromBufferAttribute(r,b),p.fromBufferAttribute(r,v),h.sub(c),u.sub(c),d.sub(f),p.sub(f);let I=1/(d.x*p.y-p.x*d.y);isFinite(I)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(u,-d.y).multiplyScalar(I),g.copy(u).multiplyScalar(d.x).addScaledVector(h,-p.x).multiplyScalar(I),a[O].add(_),a[b].add(_),a[v].add(_),l[O].add(g),l[b].add(g),l[v].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let O=0,b=M.length;O<b;++O){let v=M[O],I=v.start,V=v.count;for(let X=I,ee=I+V;X<ee;X+=3)m(e.getX(X+0),e.getX(X+1),e.getX(X+2))}let y=new N,x=new N,E=new N,A=new N;function D(O){E.fromBufferAttribute(i,O),A.copy(E);let b=a[O];y.copy(b),y.sub(E.multiplyScalar(E.dot(b))).normalize(),x.crossVectors(A,b);let I=x.dot(l[O])<0?-1:1;o.setXYZW(O,y.x,y.y,y.z,I)}for(let O=0,b=M.length;O<b;++O){let v=M[O],I=v.start,V=v.count;for(let X=I,ee=I+V;X<ee;X+=3)D(e.getX(X+0)),D(e.getX(X+1)),D(e.getX(X+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new gt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);let i=new N,r=new N,o=new N,a=new N,l=new N,c=new N,h=new N,u=new N;if(e)for(let f=0,d=e.count;f<d;f+=3){let p=e.getX(f+0),_=e.getX(f+1),g=e.getX(f+2);i.fromBufferAttribute(t,p),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,g),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Dt.fromBufferAttribute(e,t),Dt.normalize(),e.setXYZ(t,Dt.x,Dt.y,Dt.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h),d=0,p=0;for(let _=0,g=l.length;_<g;_++){a.isInterleavedBufferAttribute?d=l[_]*a.data.stride+a.offset:d=l[_]*h;for(let m=0;m<h;m++)f[p++]=c[d++]}return new gt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new s,n=this.index.array,i=this.attributes;for(let a in i){let l=i[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let f=c[h],d=e(f,n);l.push(d)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){let d=c[u];h.push(d.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},su=new $e,Ni=new On,bo=new Yt,ru=new N,So=new N,Eo=new N,To=new N,zc=new N,wo=new N,ou=new N,Ao=new N,ot=class extends xt{constructor(e=new je,t=new Ot){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let a=this.morphTargetInfluences;if(r&&a){wo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(zc.fromBufferAttribute(u,e),o?wo.addScaledVector(zc,h):wo.addScaledVector(zc.sub(t),h))}t.add(wo)}return t}raycast(e,t){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),bo.copy(n.boundingSphere),bo.applyMatrix4(r),Ni.copy(e.ray).recast(e.near),!(bo.containsPoint(Ni.origin)===!1&&(Ni.intersectSphere(bo,ru)===null||Ni.origin.distanceToSquared(ru)>(e.far-e.near)**2))&&(su.copy(r).invert(),Ni.copy(e.ray).applyMatrix4(su),!(n.boundingBox!==null&&Ni.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ni)))}_computeIntersections(e,t,n){let i,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,_=f.length;p<_;p++){let g=f[p],m=o[g.materialIndex],M=Math.max(g.start,d.start),y=Math.min(a.count,Math.min(g.start+g.count,d.start+d.count));for(let x=M,E=y;x<E;x+=3){let A=a.getX(x),D=a.getX(x+1),O=a.getX(x+2);i=Ro(this,m,e,n,c,h,u,A,D,O),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,d.start),_=Math.min(a.count,d.start+d.count);for(let g=p,m=_;g<m;g+=3){let M=a.getX(g),y=a.getX(g+1),x=a.getX(g+2);i=Ro(this,o,e,n,c,h,u,M,y,x),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,_=f.length;p<_;p++){let g=f[p],m=o[g.materialIndex],M=Math.max(g.start,d.start),y=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let x=M,E=y;x<E;x+=3){let A=x,D=x+1,O=x+2;i=Ro(this,m,e,n,c,h,u,A,D,O),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let g=p,m=_;g<m;g+=3){let M=g,y=g+1,x=g+2;i=Ro(this,o,e,n,c,h,u,M,y,x),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}};function vp(s,e,t,n,i,r,o,a){let l;if(e.side===Xt?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,e.side===Sn,a),l===null)return null;Ao.copy(a),Ao.applyMatrix4(s.matrixWorld);let c=t.ray.origin.distanceTo(Ao);return c<t.near||c>t.far?null:{distance:c,point:Ao.clone(),object:s}}function Ro(s,e,t,n,i,r,o,a,l,c){s.getVertexPosition(a,So),s.getVertexPosition(l,Eo),s.getVertexPosition(c,To);let h=vp(s,e,t,n,So,Eo,To,ou);if(h){let u=new N;ni.getBarycoord(ou,So,Eo,To,u),i&&(h.uv=ni.getInterpolatedAttribute(i,a,l,c,u,new _e)),r&&(h.uv1=ni.getInterpolatedAttribute(r,a,l,c,u,new _e)),o&&(h.normal=ni.getInterpolatedAttribute(o,a,l,c,u,new N),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:l,c,normal:new N,materialIndex:0};ni.getNormal(So,Eo,To,f.normal),h.face=f,h.barycoord=u}return h}var Zt=class s extends je{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],f=0,d=0;p("z","y","x",-1,-1,n,t,e,o,r,0),p("z","y","x",1,-1,n,t,-e,o,r,1),p("x","z","y",1,1,e,n,t,i,o,2),p("x","z","y",1,-1,e,n,-t,i,o,3),p("x","y","z",1,-1,e,t,n,i,r,4),p("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Ge(c,3)),this.setAttribute("normal",new Ge(h,3)),this.setAttribute("uv",new Ge(u,2));function p(_,g,m,M,y,x,E,A,D,O,b){let v=x/D,I=E/O,V=x/2,X=E/2,ee=A/2,Q=D+1,C=O+1,L=0,w=0,H=new N;for(let G=0;G<C;G++){let F=G*I-X;for(let te=0;te<Q;te++){let U=te*v-V;H[_]=U*M,H[g]=F*y,H[m]=ee,c.push(H.x,H.y,H.z),H[_]=0,H[g]=0,H[m]=A>0?1:-1,h.push(H.x,H.y,H.z),u.push(te/D),u.push(1-G/O),L+=1}}for(let G=0;G<O;G++)for(let F=0;F<D;F++){let te=f+F+Q*G,U=f+F+Q*(G+1),ue=f+(F+1)+Q*(G+1),re=f+(F+1)+Q*G;l.push(te,U,re),l.push(U,ue,re),w+=6}a.addGroup(d,w,b),d+=w,f+=L}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Qi(s){let e={};for(let t in s){e[t]={};for(let n in s[t]){let i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function zt(s){let e={};for(let t=0;t<s.length;t++){let n=Qi(s[t]);for(let i in n)e[i]=n[i]}return e}function Mp(s){let e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Nl(s){let e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}var Sd={clone:Qi,merge:zt},bp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Sp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,sn=class extends $t{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=bp,this.fragmentShader=Sp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Qi(e.uniforms),this.uniformsGroups=Mp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Mr=class extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $e,this.projectionMatrix=new $e,this.projectionMatrixInverse=new $e,this.coordinateSystem=bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},_i=new N,au=new _e,cu=new _e,wt=class extends Mr{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Hi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(vs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Hi*2*Math.atan(Math.tan(vs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){_i.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(_i.x,_i.y).multiplyScalar(-e/_i.z),_i.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(_i.x,_i.y).multiplyScalar(-e/_i.z)}getViewSize(e,t){return this.getViewBounds(e,au,cu),t.subVectors(cu,au)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(vs*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},gs=-90,_s=1,Ko=class extends xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new wt(gs,_s,e,t);i.layers=this.layers,this.add(i);let r=new wt(gs,_s,e,t);r.layers=this.layers,this.add(r);let o=new wt(gs,_s,e,t);o.layers=this.layers,this.add(o);let a=new wt(gs,_s,e,t);a.layers=this.layers,this.add(a);let l=new wt(gs,_s,e,t);l.layers=this.layers,this.add(l);let c=new wt(gs,_s,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===bn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===_r)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},br=class extends Nt{constructor(e=[],t=Ki,n,i,r,o,a,l,c,h){super(e,t,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Jo=class extends Fn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new br(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Zt(5,5,5),r=new sn({name:"CubemapFromEquirect",uniforms:Qi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Xt,blending:li});r.uniforms.tEquirect.value=t;let o=new ot(i,r),a=t.minFilter;return t.minFilter===An&&(t.minFilter=Gt),new Ko(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}},it=class extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Ep={type:"move"},Rs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new it,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new it,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new it,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let g=t.getJointPose(_,n),m=this._getHandJoint(c,_);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,p=.005;c.inputState.pinching&&f>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Ep)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new it;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Sr=class s{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ze(e),this.density=t}clone(){return new s(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Er=class extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new En,this.environmentIntensity=1,this.environmentRotation=new En,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Cs=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=qo,this.updateRanges=[],this.version=0,this.uuid=dn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=dn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=dn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Vt=new N,Is=class s{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyMatrix4(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyNormalMatrix(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.transformDirection(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Mn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Mn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Mn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Mn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Mn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),i=ct(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),i=ct(i,this.array),r=ct(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new gt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new s(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var lu=new N,hu=new rt,uu=new rt,Tp=new N,du=new $e,Co=new N,Hc=new Yt,fu=new $e,Vc=new On,Tr=class extends ot{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=jc,this.bindMatrix=new $e,this.bindMatrixInverse=new $e,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ct),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Co),this.boundingBox.expandByPoint(Co)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Yt),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Co),this.boundingSphere.expandByPoint(Co)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Hc.copy(this.boundingSphere),Hc.applyMatrix4(i),e.ray.intersectsSphere(Hc)!==!1&&(fu.copy(i).invert(),Vc.copy(e.ray).applyMatrix4(fu),!(this.boundingBox!==null&&Vc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Vc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new rt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===jc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===cd?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;hu.fromBufferAttribute(i.attributes.skinIndex,e),uu.fromBufferAttribute(i.attributes.skinWeight,e),lu.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){let o=uu.getComponent(r);if(o!==0){let a=hu.getComponent(r);du.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(Tp.copy(lu).applyMatrix4(du),o)}}return t.applyMatrix4(this.bindMatrixInverse)}},Ps=class extends xt{constructor(){super(),this.isBone=!0,this.type="Bone"}},wr=class extends Nt{constructor(e=null,t=1,n=1,i,r,o,a,l,c=Ut,h=Ut,u,f){super(null,o,a,l,c,h,i,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},pu=new $e,wp=new $e,Ar=class s{constructor(e=[],t=[]){this.uuid=dn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new $e)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new $e;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:wp;pu.multiplyMatrices(a,t[r]),pu.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new s(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new wr(t,e,e,an,pn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let r=e.bones[n],o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Ps),this.bones.push(o),this.boneInverses.push(new $e().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){let o=t[i];e.bones.push(o.uuid);let a=n[i];e.boneInverses.push(a.toArray())}return e}},vi=class extends gt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},xs=new $e,mu=new $e,Io=[],gu=new Ct,Ap=new $e,cr=new ot,lr=new Yt,Rr=class extends ot{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new vi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Ap)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ct),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,xs),gu.copy(e.boundingBox).applyMatrix4(xs),this.boundingBox.union(gu)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Yt),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,xs),lr.copy(e.boundingSphere).applyMatrix4(xs),this.boundingSphere.union(lr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(cr.geometry=this.geometry,cr.material=this.material,cr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),lr.copy(this.boundingSphere),lr.applyMatrix4(n),e.ray.intersectsSphere(lr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,xs),mu.multiplyMatrices(n,xs),cr.matrixWorld=mu,cr.raycast(e,Io);for(let o=0,a=Io.length;o<a;o++){let l=Io[o];l.instanceId=r,l.object=this,t.push(l)}Io.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new vi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new wr(new Float32Array(i*this.count),i,this.count,Ca,pn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=i*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Gc=new N,Rp=new N,Cp=new Ze,un=class{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=Gc.subVectors(n,t).cross(Rp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Gc),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Cp.getNormalMatrix(e),i=this.coplanarPoint(Gc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ui=new Yt,Ip=new _e(.5,.5),Po=new N,Ls=class{constructor(e=new un,t=new un,n=new un,i=new un,r=new un,o=new un){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=bn,n=!1){let i=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],d=r[7],p=r[8],_=r[9],g=r[10],m=r[11],M=r[12],y=r[13],x=r[14],E=r[15];if(i[0].setComponents(c-o,d-h,m-p,E-M).normalize(),i[1].setComponents(c+o,d+h,m+p,E+M).normalize(),i[2].setComponents(c+a,d+u,m+_,E+y).normalize(),i[3].setComponents(c-a,d-u,m-_,E-y).normalize(),n)i[4].setComponents(l,f,g,x).normalize(),i[5].setComponents(c-l,d-f,m-g,E-x).normalize();else if(i[4].setComponents(c-l,d-f,m-g,E-x).normalize(),t===bn)i[5].setComponents(c+l,d+f,m+g,E+x).normalize();else if(t===_r)i[5].setComponents(l,f,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ui.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ui.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ui)}intersectsSprite(e){Ui.center.set(0,0,0);let t=Ip.distanceTo(e.center);return Ui.radius=.7071067811865476+t,Ui.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ui)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(Po.x=i.normal.x>0?e.max.x:e.min.x,Po.y=i.normal.y>0?e.max.y:e.min.y,Po.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Po)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Mi=class extends $t{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},jo=new N,Qo=new N,_u=new $e,hr=new On,Lo=new Yt,Wc=new N,xu=new N,Vi=class extends xt{constructor(e=new je,t=new Mi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)jo.fromBufferAttribute(t,i-1),Qo.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=jo.distanceTo(Qo);e.setAttribute("lineDistance",new Ge(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Lo.copy(n.boundingSphere),Lo.applyMatrix4(i),Lo.radius+=r,e.ray.intersectsSphere(Lo)===!1)return;_u.copy(i).invert(),hr.copy(e.ray).applyMatrix4(_u);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){let d=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let _=d,g=p-1;_<g;_+=c){let m=h.getX(_),M=h.getX(_+1),y=Do(this,e,hr,l,m,M,_);y&&t.push(y)}if(this.isLineLoop){let _=h.getX(p-1),g=h.getX(d),m=Do(this,e,hr,l,_,g,p-1);m&&t.push(m)}}else{let d=Math.max(0,o.start),p=Math.min(f.count,o.start+o.count);for(let _=d,g=p-1;_<g;_+=c){let m=Do(this,e,hr,l,_,_+1,_);m&&t.push(m)}if(this.isLineLoop){let _=Do(this,e,hr,l,p-1,d,p-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Do(s,e,t,n,i,r,o){let a=s.geometry.attributes.position;if(jo.fromBufferAttribute(a,i),Qo.fromBufferAttribute(a,r),t.distanceSqToSegment(jo,Qo,Wc,xu)>n)return;Wc.applyMatrix4(s.matrixWorld);let c=e.ray.origin.distanceTo(Wc);if(!(c<e.near||c>e.far))return{distance:c,point:xu.clone().applyMatrix4(s.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:s}}var yu=new N,vu=new N,Gi=class extends Vi{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)yu.fromBufferAttribute(t,i),vu.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+yu.distanceTo(vu);e.setAttribute("lineDistance",new Ge(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Cr=class extends Vi{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Bn=class extends $t{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ze(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Mu=new $e,il=new On,No=new Yt,Uo=new N,si=class extends xt{constructor(e=new je,t=new Bn){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),No.copy(n.boundingSphere),No.applyMatrix4(i),No.radius+=r,e.ray.intersectsSphere(No)===!1)return;Mu.copy(i).invert(),il.copy(e.ray).applyMatrix4(Mu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let f=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let p=f,_=d;p<_;p++){let g=c.getX(p);Uo.fromBufferAttribute(u,g),bu(Uo,g,l,i,e,t,this)}}else{let f=Math.max(0,o.start),d=Math.min(u.count,o.start+o.count);for(let p=f,_=d;p<_;p++)Uo.fromBufferAttribute(u,p),bu(Uo,p,l,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function bu(s,e,t,n,i,r,o){let a=il.distanceSqToPoint(s);if(a<t){let l=new N;il.closestPointToPoint(s,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Ir=class extends Nt{constructor(e,t,n=Ri,i,r,o,a=Ut,l=Ut,c,h=Ss,u=1){if(h!==Ss&&h!==Gs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:u};super(f,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ws(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Pr=class extends Nt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Lr=class s extends je{constructor(e=1,t=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:i,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=t/2,u=Math.PI/2*e,f=t,d=2*u+f,p=n*2+r,_=i+1,g=new N,m=new N;for(let M=0;M<=p;M++){let y=0,x=0,E=0,A=0;if(M<=n){let b=M/n,v=b*Math.PI/2;x=-h-e*Math.cos(v),E=e*Math.sin(v),A=-e*Math.cos(v),y=b*u}else if(M<=n+r){let b=(M-n)/r;x=-h+b*t,E=e,A=0,y=u+b*f}else{let b=(M-n-r)/n,v=b*Math.PI/2;x=h+e*Math.sin(v),E=e*Math.cos(v),A=e*Math.sin(v),y=u+f+b*u}let D=Math.max(0,Math.min(1,y/d)),O=0;M===0?O=.5/i:M===p&&(O=-.5/i);for(let b=0;b<=i;b++){let v=b/i,I=v*Math.PI*2,V=Math.sin(I),X=Math.cos(I);m.x=-E*X,m.y=x,m.z=E*V,a.push(m.x,m.y,m.z),g.set(-E*X,A,E*V),g.normalize(),l.push(g.x,g.y,g.z),c.push(v+O,D)}if(M>0){let b=(M-1)*_;for(let v=0;v<i;v++){let I=b+v,V=b+v+1,X=M*_+v,ee=M*_+v+1;o.push(I,V,X),o.push(V,ee,X)}}}this.setIndex(o),this.setAttribute("position",new Ge(a,3)),this.setAttribute("normal",new Ge(l,3)),this.setAttribute("uv",new Ge(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},Dr=class s extends je{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);let r=[],o=[],a=[],l=[],c=new N,h=new _e;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){let d=n+u/t*i;c.x=e*Math.cos(d),c.y=e*Math.sin(d),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[f]/e+1)/2,h.y=(o[f+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Ge(o,3)),this.setAttribute("normal",new Ge(a,3)),this.setAttribute("uv",new Ge(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.segments,e.thetaStart,e.thetaLength)}},fn=class s extends je{constructor(e=1,t=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;i=Math.floor(i),r=Math.floor(r);let h=[],u=[],f=[],d=[],p=0,_=[],g=n/2,m=0;M(),o===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new Ge(u,3)),this.setAttribute("normal",new Ge(f,3)),this.setAttribute("uv",new Ge(d,2));function M(){let x=new N,E=new N,A=0,D=(t-e)/n;for(let O=0;O<=r;O++){let b=[],v=O/r,I=v*(t-e)+e;for(let V=0;V<=i;V++){let X=V/i,ee=X*l+a,Q=Math.sin(ee),C=Math.cos(ee);E.x=I*Q,E.y=-v*n+g,E.z=I*C,u.push(E.x,E.y,E.z),x.set(Q,D,C).normalize(),f.push(x.x,x.y,x.z),d.push(X,1-v),b.push(p++)}_.push(b)}for(let O=0;O<i;O++)for(let b=0;b<r;b++){let v=_[b][O],I=_[b+1][O],V=_[b+1][O+1],X=_[b][O+1];(e>0||b!==0)&&(h.push(v,I,X),A+=3),(t>0||b!==r-1)&&(h.push(I,V,X),A+=3)}c.addGroup(m,A,0),m+=A}function y(x){let E=p,A=new _e,D=new N,O=0,b=x===!0?e:t,v=x===!0?1:-1;for(let V=1;V<=i;V++)u.push(0,g*v,0),f.push(0,v,0),d.push(.5,.5),p++;let I=p;for(let V=0;V<=i;V++){let ee=V/i*l+a,Q=Math.cos(ee),C=Math.sin(ee);D.x=b*C,D.y=g*v,D.z=b*Q,u.push(D.x,D.y,D.z),f.push(0,v,0),A.x=Q*.5+.5,A.y=C*.5*v+.5,d.push(A.x,A.y),p++}for(let V=0;V<i;V++){let X=E+V,ee=I+V;x===!0?h.push(ee,ee+1,X):h.push(ee+1,ee,X),O+=3}c.addGroup(m,O,x===!0?1:2),m+=O}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Wi=class s extends fn{constructor(e=1,t=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new s(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ds=class s extends je{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};let r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new Ge(r,3)),this.setAttribute("normal",new Ge(r.slice(),3)),this.setAttribute("uv",new Ge(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(M){let y=new N,x=new N,E=new N;for(let A=0;A<t.length;A+=3)d(t[A+0],y),d(t[A+1],x),d(t[A+2],E),l(y,x,E,M)}function l(M,y,x,E){let A=E+1,D=[];for(let O=0;O<=A;O++){D[O]=[];let b=M.clone().lerp(x,O/A),v=y.clone().lerp(x,O/A),I=A-O;for(let V=0;V<=I;V++)V===0&&O===A?D[O][V]=b:D[O][V]=b.clone().lerp(v,V/I)}for(let O=0;O<A;O++)for(let b=0;b<2*(A-O)-1;b++){let v=Math.floor(b/2);b%2===0?(f(D[O][v+1]),f(D[O+1][v]),f(D[O][v])):(f(D[O][v+1]),f(D[O+1][v+1]),f(D[O+1][v]))}}function c(M){let y=new N;for(let x=0;x<r.length;x+=3)y.x=r[x+0],y.y=r[x+1],y.z=r[x+2],y.normalize().multiplyScalar(M),r[x+0]=y.x,r[x+1]=y.y,r[x+2]=y.z}function h(){let M=new N;for(let y=0;y<r.length;y+=3){M.x=r[y+0],M.y=r[y+1],M.z=r[y+2];let x=g(M)/2/Math.PI+.5,E=m(M)/Math.PI+.5;o.push(x,1-E)}p(),u()}function u(){for(let M=0;M<o.length;M+=6){let y=o[M+0],x=o[M+2],E=o[M+4],A=Math.max(y,x,E),D=Math.min(y,x,E);A>.9&&D<.1&&(y<.2&&(o[M+0]+=1),x<.2&&(o[M+2]+=1),E<.2&&(o[M+4]+=1))}}function f(M){r.push(M.x,M.y,M.z)}function d(M,y){let x=M*3;y.x=e[x+0],y.y=e[x+1],y.z=e[x+2]}function p(){let M=new N,y=new N,x=new N,E=new N,A=new _e,D=new _e,O=new _e;for(let b=0,v=0;b<r.length;b+=9,v+=6){M.set(r[b+0],r[b+1],r[b+2]),y.set(r[b+3],r[b+4],r[b+5]),x.set(r[b+6],r[b+7],r[b+8]),A.set(o[v+0],o[v+1]),D.set(o[v+2],o[v+3]),O.set(o[v+4],o[v+5]),E.copy(M).add(y).add(x).divideScalar(3);let I=g(E);_(A,v+0,M,I),_(D,v+2,y,I),_(O,v+4,x,I)}}function _(M,y,x,E){E<0&&M.x===1&&(o[y]=M.x-1),x.x===0&&x.z===0&&(o[y]=E/2/Math.PI+.5)}function g(M){return Math.atan2(M.z,-M.x)}function m(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.vertices,e.indices,e.radius,e.details)}},Tn=class s extends Ds{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new s(e.radius,e.detail)}},Fo=new N,Oo=new N,Xc=new N,Bo=new ni,Nr=class extends je{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let i=Math.pow(10,4),r=Math.cos(vs*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),f={},d=[];for(let p=0;p<l;p+=3){o?(c[0]=o.getX(p),c[1]=o.getX(p+1),c[2]=o.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);let{a:_,b:g,c:m}=Bo;if(_.fromBufferAttribute(a,c[0]),g.fromBufferAttribute(a,c[1]),m.fromBufferAttribute(a,c[2]),Bo.getNormal(Xc),u[0]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,u[1]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,u[2]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let M=0;M<3;M++){let y=(M+1)%3,x=u[M],E=u[y],A=Bo[h[M]],D=Bo[h[y]],O=`${x}_${E}`,b=`${E}_${x}`;b in f&&f[b]?(Xc.dot(f[b].normal)<=r&&(d.push(A.x,A.y,A.z),d.push(D.x,D.y,D.z)),f[b]=null):O in f||(f[O]={index0:c[M],index1:c[y],normal:Xc.clone()})}}for(let p in f)if(f[p]){let{index0:_,index1:g}=f[p];Fo.fromBufferAttribute(a,_),Oo.fromBufferAttribute(a,g),d.push(Fo.x,Fo.y,Fo.z),d.push(Oo.x,Oo.y,Oo.z)}this.setAttribute("position",new Ge(d,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},rn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,i=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),i=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);let h=n[i],f=n[i+1]-h,d=(o-h)/f;return(i+d)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);let o=this.getPoint(i),a=this.getPoint(r),l=t||(o.isVector2?new _e:new N);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new N,i=[],r=[],o=[],a=new N,l=new $e;for(let d=0;d<=e;d++){let p=d/e;i[d]=this.getTangentAt(p,new N)}r[0]=new N,o[0]=new N;let c=Number.MAX_VALUE,h=Math.abs(i[0].x),u=Math.abs(i[0].y),f=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),f<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(i[d-1],i[d]),a.length()>Number.EPSILON){a.normalize();let p=Math.acos(Ke(i[d-1].dot(i[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(a,p))}o[d].crossVectors(i[d],r[d])}if(t===!0){let d=Math.acos(Ke(r[0].dot(r[e]),-1,1));d/=e,i[0].dot(a.crossVectors(r[0],r[e]))>0&&(d=-d);for(let p=1;p<=e;p++)r[p].applyMatrix4(l.makeRotationAxis(i[p],d*p)),o[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Ns=class extends rn{constructor(e=0,t=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new _e){let n=t,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*h-d*u+this.aX,c=f*u+d*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ea=class extends Ns{constructor(e,t,n,i,r,o){super(e,t,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Ul(){let s=0,e=0,t=0,n=0;function i(r,o,a,l){s=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){i(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let f=(o-r)/c-(a-r)/(c+h)+(a-o)/h,d=(a-o)/h-(l-o)/(h+u)+(l-a)/u;f*=h,d*=h,i(o,a,f,d)},calc:function(r){let o=r*r,a=o*r;return s+e*r+t*o+n*a}}}var ko=new N,qc=new Ul,Yc=new Ul,$c=new Ul,Us=class extends rn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new N){let n=t,i=this.points,r=i.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=i[(a-1)%r]:(ko.subVectors(i[0],i[1]).add(i[0]),c=ko);let u=i[a%r],f=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(ko.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=ko),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,p=Math.pow(c.distanceToSquared(u),d),_=Math.pow(u.distanceToSquared(f),d),g=Math.pow(f.distanceToSquared(h),d);_<1e-4&&(_=1),p<1e-4&&(p=_),g<1e-4&&(g=_),qc.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,p,_,g),Yc.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,p,_,g),$c.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,p,_,g)}else this.curveType==="catmullrom"&&(qc.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Yc.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),$c.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return n.set(qc.calc(l),Yc.calc(l),$c.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new N().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Su(s,e,t,n,i){let r=(n-e)*.5,o=(i-t)*.5,a=s*s,l=s*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*s+t}function Pp(s,e){let t=1-s;return t*t*e}function Lp(s,e){return 2*(1-s)*s*e}function Dp(s,e){return s*s*e}function pr(s,e,t,n){return Pp(s,e)+Lp(s,t)+Dp(s,n)}function Np(s,e){let t=1-s;return t*t*t*e}function Up(s,e){let t=1-s;return 3*t*t*s*e}function Fp(s,e){return 3*(1-s)*s*s*e}function Op(s,e){return s*s*s*e}function mr(s,e,t,n,i){return Np(s,e)+Up(s,t)+Fp(s,n)+Op(s,i)}var Ur=class extends rn{constructor(e=new _e,t=new _e,n=new _e,i=new _e){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new _e){let n=t,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(mr(e,i.x,r.x,o.x,a.x),mr(e,i.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ta=class extends rn{constructor(e=new N,t=new N,n=new N,i=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new N){let n=t,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(mr(e,i.x,r.x,o.x,a.x),mr(e,i.y,r.y,o.y,a.y),mr(e,i.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Fr=class extends rn{constructor(e=new _e,t=new _e){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new _e){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new _e){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},na=class extends rn{constructor(e=new N,t=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new N){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new N){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Or=class extends rn{constructor(e=new _e,t=new _e,n=new _e){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new _e){let n=t,i=this.v0,r=this.v1,o=this.v2;return n.set(pr(e,i.x,r.x,o.x),pr(e,i.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ia=class extends rn{constructor(e=new N,t=new N,n=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new N){let n=t,i=this.v0,r=this.v1,o=this.v2;return n.set(pr(e,i.x,r.x,o.x),pr(e,i.y,r.y,o.y),pr(e,i.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Br=class extends rn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new _e){let n=t,i=this.points,r=(i.length-1)*e,o=Math.floor(r),a=r-o,l=i[o===0?o:o-1],c=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(Su(a,l.x,c.x,h.x,u.x),Su(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new _e().fromArray(i))}return this}},sl=Object.freeze({__proto__:null,ArcCurve:ea,CatmullRomCurve3:Us,CubicBezierCurve:Ur,CubicBezierCurve3:ta,EllipseCurve:Ns,LineCurve:Fr,LineCurve3:na,QuadraticBezierCurve:Or,QuadraticBezierCurve3:ia,SplineCurve:Br}),sa=class extends rn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new sl[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let o=i[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let i=0,r=this.curves;i<r.length;i++){let o=r[i],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(new sl[i.type]().fromJSON(i))}return this}},kr=class extends sa{constructor(e){super(),this.type="Path",this.currentPoint=new _e,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Fr(this.currentPoint.clone(),new _e(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){let r=new Or(this.currentPoint.clone(),new _e(e,t),new _e(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,o){let a=new Ur(this.currentPoint.clone(),new _e(e,t),new _e(n,i),new _e(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Br(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,i,r,o),this}absarc(e,t,n,i,r,o){return this.absellipse(e,t,n,n,i,r,o),this}ellipse(e,t,n,i,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,r,o,a,l),this}absellipse(e,t,n,i,r,o,a,l){let c=new Ns(e,t,n,i,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},on=class extends kr{constructor(e){super(e),this.uuid=dn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(new kr().fromJSON(i))}return this}};function Bp(s,e,t=2){let n=e&&e.length,i=n?e[0]*t:s.length,r=Ed(s,0,i,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=Gp(s,e,r,t)),s.length>80*t){a=1/0,l=1/0;let h=-1/0,u=-1/0;for(let f=t;f<i;f+=t){let d=s[f],p=s[f+1];d<a&&(a=d),p<l&&(l=p),d>h&&(h=d),p>u&&(u=p)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return zr(r,o,t,a,l,c,0),o}function Ed(s,e,t,n,i){let r;if(i===em(s,e,t,n)>0)for(let o=e;o<t;o+=n)r=Eu(o/n|0,s[o],s[o+1],r);else for(let o=t-n;o>=e;o-=n)r=Eu(o/n|0,s[o],s[o+1],r);return r&&Fs(r,r.next)&&(Vr(r),r=r.next),r}function Xi(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(Fs(t,t.next)||St(t.prev,t,t.next)===0)){if(Vr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function zr(s,e,t,n,i,r,o){if(!s)return;!o&&r&&$p(s,n,i,r);let a=s;for(;s.prev!==s.next;){let l=s.prev,c=s.next;if(r?zp(s,n,i,r):kp(s)){e.push(l.i,s.i,c.i),Vr(s),s=c.next,a=c.next;continue}if(s=c,s===a){o?o===1?(s=Hp(Xi(s),e),zr(s,e,t,n,i,r,2)):o===2&&Vp(s,e,t,n,i,r):zr(Xi(s),e,t,n,i,r,1);break}}}function kp(s){let e=s.prev,t=s,n=s.next;if(St(e,t,n)>=0)return!1;let i=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=Math.min(i,r,o),u=Math.min(a,l,c),f=Math.max(i,r,o),d=Math.max(a,l,c),p=n.next;for(;p!==e;){if(p.x>=h&&p.x<=f&&p.y>=u&&p.y<=d&&dr(i,a,r,l,o,c,p.x,p.y)&&St(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function zp(s,e,t,n){let i=s.prev,r=s,o=s.next;if(St(i,r,o)>=0)return!1;let a=i.x,l=r.x,c=o.x,h=i.y,u=r.y,f=o.y,d=Math.min(a,l,c),p=Math.min(h,u,f),_=Math.max(a,l,c),g=Math.max(h,u,f),m=rl(d,p,e,t,n),M=rl(_,g,e,t,n),y=s.prevZ,x=s.nextZ;for(;y&&y.z>=m&&x&&x.z<=M;){if(y.x>=d&&y.x<=_&&y.y>=p&&y.y<=g&&y!==i&&y!==o&&dr(a,h,l,u,c,f,y.x,y.y)&&St(y.prev,y,y.next)>=0||(y=y.prevZ,x.x>=d&&x.x<=_&&x.y>=p&&x.y<=g&&x!==i&&x!==o&&dr(a,h,l,u,c,f,x.x,x.y)&&St(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;y&&y.z>=m;){if(y.x>=d&&y.x<=_&&y.y>=p&&y.y<=g&&y!==i&&y!==o&&dr(a,h,l,u,c,f,y.x,y.y)&&St(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;x&&x.z<=M;){if(x.x>=d&&x.x<=_&&x.y>=p&&x.y<=g&&x!==i&&x!==o&&dr(a,h,l,u,c,f,x.x,x.y)&&St(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Hp(s,e){let t=s;do{let n=t.prev,i=t.next.next;!Fs(n,i)&&wd(n,t,t.next,i)&&Hr(n,i)&&Hr(i,n)&&(e.push(n.i,t.i,i.i),Vr(t),Vr(t.next),t=s=i),t=t.next}while(t!==s);return Xi(t)}function Vp(s,e,t,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Jp(o,a)){let l=Ad(o,a);o=Xi(o,o.next),l=Xi(l,l.next),zr(o,e,t,n,i,r,0),zr(l,e,t,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function Gp(s,e,t,n){let i=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*n,l=r<o-1?e[r+1]*n:s.length,c=Ed(s,a,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Kp(c))}i.sort(Wp);for(let r=0;r<i.length;r++)t=Xp(i[r],t);return t}function Wp(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){let n=(s.next.y-s.y)/(s.next.x-s.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function Xp(s,e){let t=qp(s,e);if(!t)return e;let n=Ad(t,s);return Xi(n,n.next),Xi(t,t.next)}function qp(s,e){let t=e,n=s.x,i=s.y,r=-1/0,o;if(Fs(s,t))return t;do{if(Fs(s,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){let u=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,o=t.x<t.next.x?t:t.next,u===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;t=o;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Td(i<c?n:r,i,l,c,i<c?r:n,i,t.x,t.y)){let u=Math.abs(i-t.y)/(n-t.x);Hr(t,s)&&(u<h||u===h&&(t.x>o.x||t.x===o.x&&Yp(o,t)))&&(o=t,h=u)}t=t.next}while(t!==a);return o}function Yp(s,e){return St(s.prev,s,e.prev)<0&&St(e.next,s,s.next)<0}function $p(s,e,t,n){let i=s;do i.z===0&&(i.z=rl(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,Zp(i)}function Zp(s){let e,t=1;do{let n=s,i;s=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(i=n,n=n.nextZ,a--):(i=o,o=o.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=o}r.nextZ=null,t*=2}while(e>1);return s}function rl(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function Kp(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function Td(s,e,t,n,i,r,o,a){return(i-o)*(e-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(i-o)*(n-a)}function dr(s,e,t,n,i,r,o,a){return!(s===o&&e===a)&&Td(s,e,t,n,i,r,o,a)}function Jp(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!jp(s,e)&&(Hr(s,e)&&Hr(e,s)&&Qp(s,e)&&(St(s.prev,s,e.prev)||St(s,e.prev,e))||Fs(s,e)&&St(s.prev,s,s.next)>0&&St(e.prev,e,e.next)>0)}function St(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function Fs(s,e){return s.x===e.x&&s.y===e.y}function wd(s,e,t,n){let i=Ho(St(s,e,t)),r=Ho(St(s,e,n)),o=Ho(St(t,n,s)),a=Ho(St(t,n,e));return!!(i!==r&&o!==a||i===0&&zo(s,t,e)||r===0&&zo(s,n,e)||o===0&&zo(t,s,n)||a===0&&zo(t,e,n))}function zo(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Ho(s){return s>0?1:s<0?-1:0}function jp(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&wd(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function Hr(s,e){return St(s.prev,s,s.next)<0?St(s,e,s.next)>=0&&St(s,s.prev,e)>=0:St(s,e,s.prev)<0||St(s,s.next,e)<0}function Qp(s,e){let t=s,n=!1,i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function Ad(s,e){let t=ol(s.i,s.x,s.y),n=ol(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Eu(s,e,t,n){let i=ol(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Vr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function ol(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function em(s,e,t,n){let i=0;for(let r=e,o=t-n;r<t;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}var al=class{static triangulate(e,t,n=2){return Bp(e,t,n)}},Dn=class s{static area(e){let t=e.length,n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return s.area(e)<0}static triangulateShape(e,t){let n=[],i=[],r=[];Tu(e),wu(n,e);let o=e.length;t.forEach(Tu);for(let l=0;l<t.length;l++)i.push(o),o+=t[l].length,wu(n,t[l]);let a=al.triangulate(n,i);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Tu(s){let e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function wu(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}var bi=class s extends je{constructor(e=new on([new _e(.5,.5),new _e(-.5,.5),new _e(-.5,-.5),new _e(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,i=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new Ge(i,3)),this.setAttribute("uv",new Ge(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,d=t.bevelThickness!==void 0?t.bevelThickness:.2,p=t.bevelSize!==void 0?t.bevelSize:d-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,m=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:tm,y,x=!1,E,A,D,O;m&&(y=m.getSpacedPoints(h),x=!0,f=!1,E=m.computeFrenetFrames(h,!1),A=new N,D=new N,O=new N),f||(g=0,d=0,p=0,_=0);let b=a.extractPoints(c),v=b.shape,I=b.holes;if(!Dn.isClockWise(v)){v=v.reverse();for(let ie=0,oe=I.length;ie<oe;ie++){let ne=I[ie];Dn.isClockWise(ne)&&(I[ie]=ne.reverse())}}function X(ie){let ne=10000000000000001e-36,Y=ie[0];for(let me=1;me<=ie.length;me++){let de=me%ie.length,ye=ie[de],Fe=ye.x-Y.x,Be=ye.y-Y.y,R=Fe*Fe+Be*Be,S=Math.max(Math.abs(ye.x),Math.abs(ye.y),Math.abs(Y.x),Math.abs(Y.y)),K=ne*S*S;if(R<=K){ie.splice(de,1),me--;continue}Y=ye}}X(v),I.forEach(X);let ee=I.length,Q=v;for(let ie=0;ie<ee;ie++){let oe=I[ie];v=v.concat(oe)}function C(ie,oe,ne){return oe||console.error("THREE.ExtrudeGeometry: vec does not exist"),ie.clone().addScaledVector(oe,ne)}let L=v.length;function w(ie,oe,ne){let Y,me,de,ye=ie.x-oe.x,Fe=ie.y-oe.y,Be=ne.x-ie.x,R=ne.y-ie.y,S=ye*ye+Fe*Fe,K=ye*R-Fe*Be;if(Math.abs(K)>Number.EPSILON){let ce=Math.sqrt(S),ve=Math.sqrt(Be*Be+R*R),he=oe.x-Fe/ce,z=oe.y+ye/ce,k=ne.x-R/ve,q=ne.y+Be/ve,fe=((k-he)*R-(q-z)*Be)/(ye*R-Fe*Be);Y=he+ye*fe-ie.x,me=z+Fe*fe-ie.y;let j=Y*Y+me*me;if(j<=2)return new _e(Y,me);de=Math.sqrt(j/2)}else{let ce=!1;ye>Number.EPSILON?Be>Number.EPSILON&&(ce=!0):ye<-Number.EPSILON?Be<-Number.EPSILON&&(ce=!0):Math.sign(Fe)===Math.sign(R)&&(ce=!0),ce?(Y=-Fe,me=ye,de=Math.sqrt(S)):(Y=ye,me=Fe,de=Math.sqrt(S/2))}return new _e(Y/de,me/de)}let H=[];for(let ie=0,oe=Q.length,ne=oe-1,Y=ie+1;ie<oe;ie++,ne++,Y++)ne===oe&&(ne=0),Y===oe&&(Y=0),H[ie]=w(Q[ie],Q[ne],Q[Y]);let G=[],F,te=H.concat();for(let ie=0,oe=ee;ie<oe;ie++){let ne=I[ie];F=[];for(let Y=0,me=ne.length,de=me-1,ye=Y+1;Y<me;Y++,de++,ye++)de===me&&(de=0),ye===me&&(ye=0),F[Y]=w(ne[Y],ne[de],ne[ye]);G.push(F),te=te.concat(F)}let U;if(g===0)U=Dn.triangulateShape(Q,I);else{let ie=[],oe=[];for(let ne=0;ne<g;ne++){let Y=ne/g,me=d*Math.cos(Y*Math.PI/2),de=p*Math.sin(Y*Math.PI/2)+_;for(let ye=0,Fe=Q.length;ye<Fe;ye++){let Be=C(Q[ye],H[ye],de);be(Be.x,Be.y,-me),Y===0&&ie.push(Be)}for(let ye=0,Fe=ee;ye<Fe;ye++){let Be=I[ye];F=G[ye];let R=[];for(let S=0,K=Be.length;S<K;S++){let ce=C(Be[S],F[S],de);be(ce.x,ce.y,-me),Y===0&&R.push(ce)}Y===0&&oe.push(R)}}U=Dn.triangulateShape(ie,oe)}let ue=U.length,re=p+_;for(let ie=0;ie<L;ie++){let oe=f?C(v[ie],te[ie],re):v[ie];x?(D.copy(E.normals[0]).multiplyScalar(oe.x),A.copy(E.binormals[0]).multiplyScalar(oe.y),O.copy(y[0]).add(D).add(A),be(O.x,O.y,O.z)):be(oe.x,oe.y,0)}for(let ie=1;ie<=h;ie++)for(let oe=0;oe<L;oe++){let ne=f?C(v[oe],te[oe],re):v[oe];x?(D.copy(E.normals[ie]).multiplyScalar(ne.x),A.copy(E.binormals[ie]).multiplyScalar(ne.y),O.copy(y[ie]).add(D).add(A),be(O.x,O.y,O.z)):be(ne.x,ne.y,u/h*ie)}for(let ie=g-1;ie>=0;ie--){let oe=ie/g,ne=d*Math.cos(oe*Math.PI/2),Y=p*Math.sin(oe*Math.PI/2)+_;for(let me=0,de=Q.length;me<de;me++){let ye=C(Q[me],H[me],Y);be(ye.x,ye.y,u+ne)}for(let me=0,de=I.length;me<de;me++){let ye=I[me];F=G[me];for(let Fe=0,Be=ye.length;Fe<Be;Fe++){let R=C(ye[Fe],F[Fe],Y);x?be(R.x,R.y+y[h-1].y,y[h-1].x+ne):be(R.x,R.y,u+ne)}}}B(),$();function B(){let ie=i.length/3;if(f){let oe=0,ne=L*oe;for(let Y=0;Y<ue;Y++){let me=U[Y];xe(me[2]+ne,me[1]+ne,me[0]+ne)}oe=h+g*2,ne=L*oe;for(let Y=0;Y<ue;Y++){let me=U[Y];xe(me[0]+ne,me[1]+ne,me[2]+ne)}}else{for(let oe=0;oe<ue;oe++){let ne=U[oe];xe(ne[2],ne[1],ne[0])}for(let oe=0;oe<ue;oe++){let ne=U[oe];xe(ne[0]+L*h,ne[1]+L*h,ne[2]+L*h)}}n.addGroup(ie,i.length/3-ie,0)}function $(){let ie=i.length/3,oe=0;le(Q,oe),oe+=Q.length;for(let ne=0,Y=I.length;ne<Y;ne++){let me=I[ne];le(me,oe),oe+=me.length}n.addGroup(ie,i.length/3-ie,1)}function le(ie,oe){let ne=ie.length;for(;--ne>=0;){let Y=ne,me=ne-1;me<0&&(me=ie.length-1);for(let de=0,ye=h+g*2;de<ye;de++){let Fe=L*de,Be=L*(de+1),R=oe+Y+Fe,S=oe+me+Fe,K=oe+me+Be,ce=oe+Y+Be;Re(R,S,K,ce)}}}function be(ie,oe,ne){l.push(ie),l.push(oe),l.push(ne)}function xe(ie,oe,ne){Ee(ie),Ee(oe),Ee(ne);let Y=i.length/3,me=M.generateTopUV(n,i,Y-3,Y-2,Y-1);P(me[0]),P(me[1]),P(me[2])}function Re(ie,oe,ne,Y){Ee(ie),Ee(oe),Ee(Y),Ee(oe),Ee(ne),Ee(Y);let me=i.length/3,de=M.generateSideWallUV(n,i,me-6,me-3,me-2,me-1);P(de[0]),P(de[1]),P(de[3]),P(de[1]),P(de[2]),P(de[3])}function Ee(ie){i.push(l[ie*3+0]),i.push(l[ie*3+1]),i.push(l[ie*3+2])}function P(ie){r.push(ie.x),r.push(ie.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return nm(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new sl[i.type]().fromJSON(i)),new s(n,e.options)}},tm={generateTopUV:function(s,e,t,n,i){let r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[i*3],h=e[i*3+1];return[new _e(r,o),new _e(a,l),new _e(c,h)]},generateSideWallUV:function(s,e,t,n,i,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],f=e[i*3],d=e[i*3+1],p=e[i*3+2],_=e[r*3],g=e[r*3+1],m=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new _e(o,1-l),new _e(c,1-u),new _e(f,1-p),new _e(_,1-m)]:[new _e(a,1-l),new _e(h,1-u),new _e(d,1-p),new _e(g,1-m)]}};function nm(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){let r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var kn=class s extends Ds{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new s(e.radius,e.detail)}};var Gr=class s extends Ds{constructor(e=1,t=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new s(e.radius,e.detail)}},zn=class s extends je{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=e/a,f=t/l,d=[],p=[],_=[],g=[];for(let m=0;m<h;m++){let M=m*f-o;for(let y=0;y<c;y++){let x=y*u-r;p.push(x,-M,0),_.push(0,0,1),g.push(y/a),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let M=0;M<a;M++){let y=M+c*m,x=M+c*(m+1),E=M+1+c*(m+1),A=M+1+c*m;d.push(y,x,A),d.push(x,E,A)}this.setIndex(d),this.setAttribute("position",new Ge(p,3)),this.setAttribute("normal",new Ge(_,3)),this.setAttribute("uv",new Ge(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.widthSegments,e.heightSegments)}},Wr=class s extends je{constructor(e=.5,t=1,n=32,i=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);let a=[],l=[],c=[],h=[],u=e,f=(t-e)/i,d=new N,p=new _e;for(let _=0;_<=i;_++){for(let g=0;g<=n;g++){let m=r+g/n*o;d.x=u*Math.cos(m),d.y=u*Math.sin(m),l.push(d.x,d.y,d.z),c.push(0,0,1),p.x=(d.x/t+1)/2,p.y=(d.y/t+1)/2,h.push(p.x,p.y)}u+=f}for(let _=0;_<i;_++){let g=_*(n+1);for(let m=0;m<n;m++){let M=m+g,y=M,x=M+n+1,E=M+n+2,A=M+1;a.push(y,x,A),a.push(x,E,A)}}this.setIndex(a),this.setAttribute("position",new Ge(l,3)),this.setAttribute("normal",new Ge(c,3)),this.setAttribute("uv",new Ge(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},Si=class s extends je{constructor(e=new on([new _e(0,.5),new _e(-.5,-.5),new _e(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],i=[],r=[],o=[],a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new Ge(i,3)),this.setAttribute("normal",new Ge(r,3)),this.setAttribute("uv",new Ge(o,2));function c(h){let u=i.length/3,f=h.extractPoints(t),d=f.shape,p=f.holes;Dn.isClockWise(d)===!1&&(d=d.reverse());for(let g=0,m=p.length;g<m;g++){let M=p[g];Dn.isClockWise(M)===!0&&(p[g]=M.reverse())}let _=Dn.triangulateShape(d,p);for(let g=0,m=p.length;g<m;g++){let M=p[g];d=d.concat(M)}for(let g=0,m=d.length;g<m;g++){let M=d[g];i.push(M.x,M.y,0),r.push(0,0,1),o.push(M.x,M.y)}for(let g=0,m=_.length;g<m;g++){let M=_[g],y=M[0]+u,x=M[1]+u,E=M[2]+u;n.push(y,x,E),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return im(t,e)}static fromJSON(e,t){let n=[];for(let i=0,r=e.shapes.length;i<r;i++){let o=t[e.shapes[i]];n.push(o)}return new s(n,e.curveSegments)}};function im(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,n=s.length;t<n;t++){let i=s[t];e.shapes.push(i.uuid)}else e.shapes.push(s.uuid);return e}var qi=class s extends je{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new N,f=new N,d=[],p=[],_=[],g=[];for(let m=0;m<=n;m++){let M=[],y=m/n,x=0;m===0&&o===0?x=.5/t:m===n&&l===Math.PI&&(x=-.5/t);for(let E=0;E<=t;E++){let A=E/t;u.x=-e*Math.cos(i+A*r)*Math.sin(o+y*a),u.y=e*Math.cos(o+y*a),u.z=e*Math.sin(i+A*r)*Math.sin(o+y*a),p.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),g.push(A+x,1-y),M.push(c++)}h.push(M)}for(let m=0;m<n;m++)for(let M=0;M<t;M++){let y=h[m][M+1],x=h[m][M],E=h[m+1][M],A=h[m+1][M+1];(m!==0||o>0)&&d.push(y,x,A),(m!==n-1||l<Math.PI)&&d.push(x,E,A)}this.setIndex(d),this.setAttribute("position",new Ge(p,3)),this.setAttribute("normal",new Ge(_,3)),this.setAttribute("uv",new Ge(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var wn=class s extends je{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);let o=[],a=[],l=[],c=[],h=new N,u=new N,f=new N;for(let d=0;d<=n;d++)for(let p=0;p<=i;p++){let _=p/i*r,g=d/n*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(_),u.y=(e+t*Math.cos(g))*Math.sin(_),u.z=t*Math.sin(g),a.push(u.x,u.y,u.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(p/i),c.push(d/n)}for(let d=1;d<=n;d++)for(let p=1;p<=i;p++){let _=(i+1)*d+p-1,g=(i+1)*(d-1)+p-1,m=(i+1)*(d-1)+p,M=(i+1)*d+p;o.push(_,g,M),o.push(g,m,M)}this.setIndex(o),this.setAttribute("position",new Ge(a,3)),this.setAttribute("normal",new Ge(l,3)),this.setAttribute("uv",new Ge(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var At=class extends $t{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cl,this.normalScale=new _e(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Kt=class extends At{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new _e(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ke(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ze(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ze(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ze(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var ra=class extends $t{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=hd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},oa=class extends $t{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Vo(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function sm(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function rm(s){function e(i,r){return s[i]-s[r]}let t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Au(s,e,t){let n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){let a=t[r]*e;for(let l=0;l!==e;++l)i[o++]=s[a+l]}return i}function Rd(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=s[i++];while(r!==void 0)}var ri=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=t[++n],e<i)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let o=0;o!==i;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},aa=class extends ri{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Qc,endingEnd:Qc}}intervalChanged_(e,t,n){let i=this.parameterPositions,r=e-2,o=e+1,a=i[r],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case el:r=e,a=2*t-n;break;case tl:r=i.length-2,a=t+i[r]-i[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case el:o=e,l=2*n-t;break;case tl:o=1,l=n+i[1]-i[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,p=(n-t)/(i-t),_=p*p,g=_*p,m=-f*g+2*f*_-f*p,M=(1+f)*g+(-1.5-2*f)*_+(-.5+f)*p+1,y=(-1-d)*g+(1.5+d)*_+.5*p,x=d*g-d*_;for(let E=0;E!==a;++E)r[E]=m*o[h+E]+M*o[c+E]+y*o[l+E]+x*o[u+E];return r}},ca=class extends ri{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(i-t),u=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*u+o[l+f]*h;return r}},la=class extends ri{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Jt=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Vo(t,this.TimeBufferType),this.values=Vo(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Vo(e.times,Array),values:Vo(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new la(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ca(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new aa(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ki:t=this.InterpolantFactoryMethodDiscrete;break;case zi:t=this.InterpolantFactoryMethodLinear;break;case Go:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ki;case this.InterpolantFactoryMethodLinear:return zi;case this.InterpolantFactoryMethodSmooth:return Go}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(i!==void 0&&sm(i))for(let a=0,l=i.length;a!==l;++a){let c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Go,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(i)l=!0;else{let u=a*n,f=u-n,d=u+n;for(let p=0;p!==n;++p){let _=t[u+p];if(_!==t[f+p]||_!==t[d+p]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,f=o*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};Jt.prototype.ValueTypeName="";Jt.prototype.TimeBufferType=Float32Array;Jt.prototype.ValueBufferType=Float32Array;Jt.prototype.DefaultInterpolation=zi;var oi=class extends Jt{constructor(e,t,n){super(e,t,n)}};oi.prototype.ValueTypeName="bool";oi.prototype.ValueBufferType=Array;oi.prototype.DefaultInterpolation=ki;oi.prototype.InterpolantFactoryMethodLinear=void 0;oi.prototype.InterpolantFactoryMethodSmooth=void 0;var Xr=class extends Jt{constructor(e,t,n,i){super(e,t,n,i)}};Xr.prototype.ValueTypeName="color";var Hn=class extends Jt{constructor(e,t,n,i){super(e,t,n,i)}};Hn.prototype.ValueTypeName="number";var ha=class extends ri{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(i-t),c=e*a;for(let h=c+a;c!==h;c+=4)Wt.slerpFlat(r,0,o,c-a,o,c,l);return r}},Vn=class extends Jt{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new ha(this.times,this.values,this.getValueSize(),e)}};Vn.prototype.ValueTypeName="quaternion";Vn.prototype.InterpolantFactoryMethodSmooth=void 0;var ai=class extends Jt{constructor(e,t,n){super(e,t,n)}};ai.prototype.ValueTypeName="string";ai.prototype.ValueBufferType=Array;ai.prototype.DefaultInterpolation=ki;ai.prototype.InterpolantFactoryMethodLinear=void 0;ai.prototype.InterpolantFactoryMethodSmooth=void 0;var Gn=class extends Jt{constructor(e,t,n,i){super(e,t,n,i)}};Gn.prototype.ValueTypeName="vector";var qr=class{constructor(e="",t=-1,n=[],i=ld){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=dn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(am(n[o]).scale(i));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push(Jt.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);let h=rm(l);l=Au(l,1,h),c=Au(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new Hn(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){let c=e[a],h=c.name.match(r);if(h&&h.length>1){let u=h[1],f=i[u];f||(i[u]=f=[]),f.push(c)}}let o=[];for(let a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(u,f,d,p,_){if(d.length!==0){let g=[],m=[];Rd(d,g,m,p),g.length!==0&&_.push(new u(f,g,m))}},i=[],r=e.name||"default",o=e.fps||30,a=e.blendMode,l=e.length||-1,c=e.hierarchy||[];for(let u=0;u<c.length;u++){let f=c[u].keys;if(!(!f||f.length===0))if(f[0].morphTargets){let d={},p;for(p=0;p<f.length;p++)if(f[p].morphTargets)for(let _=0;_<f[p].morphTargets.length;_++)d[f[p].morphTargets[_]]=-1;for(let _ in d){let g=[],m=[];for(let M=0;M!==f[p].morphTargets.length;++M){let y=f[p];g.push(y.time),m.push(y.morphTarget===_?1:0)}i.push(new Hn(".morphTargetInfluence["+_+"]",g,m))}l=d.length*o}else{let d=".bones["+t[u].name+"]";n(Gn,d+".position",f,"pos",i),n(Vn,d+".quaternion",f,"rot",i),n(Gn,d+".scale",f,"scl",i)}}return i.length===0?null:new this(r,l,i,a)}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function om(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Hn;case"vector":case"vector2":case"vector3":case"vector4":return Gn;case"color":return Xr;case"quaternion":return Vn;case"bool":case"boolean":return oi;case"string":return ai}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function am(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=om(s.type);if(s.times===void 0){let t=[],n=[];Rd(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}var Nn={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}},ua=class{constructor(e,t,n){let i=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){let d=c[u],p=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Cd=new ua,Wn=class{constructor(e){this.manager=e!==void 0?e:Cd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Wn.DEFAULT_MATERIAL_NAME="__DEFAULT";var ti={},cl=class extends Error{constructor(e,t){super(e),this.response=t}},Os=class extends Wn{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=Nn.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(ti[e]!==void 0){ti[e].push({onLoad:t,onProgress:n,onError:i});return}ti[e]=[],ti[e].push({onLoad:t,onProgress:n,onError:i});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=ti[e],u=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=f?parseInt(f):0,p=d!==0,_=0,g=new ReadableStream({start(m){M();function M(){u.read().then(({done:y,value:x})=>{if(y)m.close();else{_+=x.byteLength;let E=new ProgressEvent("progress",{lengthComputable:p,loaded:_,total:d});for(let A=0,D=h.length;A<D;A++){let O=h[A];O.onProgress&&O.onProgress(E)}m.enqueue(x),M()}},y=>{m.error(y)})}}});return new Response(g)}else throw new cl(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return c.json();default:if(a==="")return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),f=u&&u[1]?u[1].toLowerCase():void 0,d=new TextDecoder(f);return c.arrayBuffer().then(p=>d.decode(p))}}}).then(c=>{Nn.add(`file:${e}`,c);let h=ti[e];delete ti[e];for(let u=0,f=h.length;u<f;u++){let d=h[u];d.onLoad&&d.onLoad(c)}}).catch(c=>{let h=ti[e];if(h===void 0)throw this.manager.itemError(e),c;delete ti[e];for(let u=0,f=h.length;u<f;u++){let d=h[u];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var ys=new WeakMap,da=class extends Wn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Nn.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let u=ys.get(o);u===void 0&&(u=[],ys.set(o,u)),u.push({onLoad:t,onError:i})}return o}let a=Es("img");function l(){h(),t&&t(this);let u=ys.get(this)||[];for(let f=0;f<u.length;f++){let d=u[f];d.onLoad&&d.onLoad(this)}ys.delete(this),r.manager.itemEnd(e)}function c(u){h(),i&&i(u),Nn.remove(`image:${e}`);let f=ys.get(this)||[];for(let d=0;d<f.length;d++){let p=f[d];p.onError&&p.onError(u)}ys.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Nn.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}};var Yr=class extends Wn{constructor(e){super(e)}load(e,t,n,i){let r=new Nt,o=new da(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}},Yi=class extends xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},$r=class extends Yi{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Zc=new $e,Ru=new N,Cu=new N,Zr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new _e(512,512),this.mapType=Rn,this.map=null,this.mapPass=null,this.matrix=new $e,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ls,this._frameExtents=new _e(1,1),this._viewportCount=1,this._viewports=[new rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Ru.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ru),Cu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Cu),t.updateMatrixWorld(),Zc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Zc,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Zc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ll=class extends Zr{constructor(){super(new wt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Hi*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},Kr=class extends Yi{constructor(e,t,n=0,i=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new ll}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Iu=new $e,ur=new N,Kc=new N,hl=class extends Zr{constructor(){super(new wt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new _e(4,2),this._viewportCount=6,this._viewports=[new rt(2,1,1,1),new rt(0,1,1,1),new rt(3,1,1,1),new rt(1,1,1,1),new rt(3,0,1,1),new rt(1,0,1,1)],this._cubeDirections=[new N(1,0,0),new N(-1,0,0),new N(0,0,1),new N(0,0,-1),new N(0,1,0),new N(0,-1,0)],this._cubeUps=[new N(0,1,0),new N(0,1,0),new N(0,1,0),new N(0,1,0),new N(0,0,1),new N(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ur.setFromMatrixPosition(e.matrixWorld),n.position.copy(ur),Kc.copy(n.position),Kc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Kc),n.updateMatrixWorld(),i.makeTranslation(-ur.x,-ur.y,-ur.z),Iu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Iu,n.coordinateSystem,n.reversedDepth)}},Xn=class extends Yi{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new hl}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},$i=class extends Mr{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ul=class extends Zr{constructor(){super(new $i(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ei=class extends Yi{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new ul}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var ci=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var Jc=new WeakMap,Jr=class extends Wn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Nn.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(c=>{if(Jc.has(o)===!0)i&&i(Jc.get(o)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(c),r.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Nn.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),Jc.set(l,c),Nn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Nn.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var fa=class extends wt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Fl="\\[\\]\\.:\\/",cm=new RegExp("["+Fl+"]","g"),Ol="[^"+Fl+"]",lm="[^"+Fl.replace("\\.","")+"]",hm=/((?:WC+[\/:])*)/.source.replace("WC",Ol),um=/(WCOD+)?/.source.replace("WCOD",lm),dm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ol),fm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ol),pm=new RegExp("^"+hm+um+dm+fm+"$"),mm=["material","materials","bones","map"],dl=class{constructor(e,t,n){let i=n||ft.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ft=class s{constructor(e,t,n){this.path=t,this.parsedPath=n||s.parseTrackName(t),this.node=s.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new s.Composite(e,t,n):new s(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(cm,"")}static parseTrackName(e){let t=pm.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);mm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,r=t.propertyIndex;if(e||(e=s.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[i];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ft.Composite=dl;ft.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ft.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ft.prototype.GetterByBindingType=[ft.prototype._getValue_direct,ft.prototype._getValue_array,ft.prototype._getValue_arrayElement,ft.prototype._getValue_toArray];ft.prototype.SetterByBindingTypeAndVersioning=[[ft.prototype._setValue_direct,ft.prototype._setValue_direct_setNeedsUpdate,ft.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_array,ft.prototype._setValue_array_setNeedsUpdate,ft.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_arrayElement,ft.prototype._setValue_arrayElement_setNeedsUpdate,ft.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_fromArray,ft.prototype._setValue_fromArray_setNeedsUpdate,ft.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Cy=new Float32Array(1);var Pu=new $e,Zi=class{constructor(e,t,n=0,i=1/0){this.ray=new On(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new As,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Pu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Pu),this}intersectObject(e,t=!0,n=[]){return fl(e,this,n,t),n.sort(Lu),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)fl(e[i],this,n,t);return n.sort(Lu),n}};function Lu(s,e){return s.distance-e.distance}function fl(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let r=s.children;for(let o=0,a=r.length;o<a;o++)fl(r[o],e,t,!0)}}var Ti=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ke(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ke(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Du=new _e,Bs=class{constructor(e=new _e(1/0,1/0),t=new _e(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Du.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Du).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}};var jr=class extends Un{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function Bl(s,e,t,n){let i=gm(n);switch(t){case Tl:return s*e;case Ca:return s*e/i.components*i.byteLength;case Ia:return s*e/i.components*i.byteLength;case Al:return s*e*2/i.components*i.byteLength;case Pa:return s*e*2/i.components*i.byteLength;case wl:return s*e*3/i.components*i.byteLength;case an:return s*e*4/i.components*i.byteLength;case La:return s*e*4/i.components*i.byteLength;case eo:case to:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case no:case io:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Na:case Fa:return Math.max(s,16)*Math.max(e,8)/4;case Da:case Ua:return Math.max(s,8)*Math.max(e,8)/2;case Oa:case Ba:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ka:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case za:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ha:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Va:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Ga:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Wa:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Xa:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case qa:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Ya:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case $a:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Za:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Ka:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Ja:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case ja:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Qa:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case ec:case tc:case nc:return Math.ceil(s/4)*Math.ceil(e/4)*16;case ic:case sc:return Math.ceil(s/4)*Math.ceil(e/4)*8;case rc:case oc:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function gm(s){switch(s){case Rn:case Ml:return{byteLength:1,components:1};case zs:case bl:case Hs:return{byteLength:2,components:1};case Aa:case Ra:return{byteLength:2,components:4};case Ri:case wa:case pn:return{byteLength:4,components:1};case Sl:case El:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Qd(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function xm(s){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,f=s.createBuffer();s.bindBuffer(l,f),s.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=s.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(s.bindBuffer(c,a),u.length===0)s.bufferSubData(c,0,h);else{u.sort((d,p)=>d.start-p.start);let f=0;for(let d=1;d<u.length;d++){let p=u[f],_=u[d];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++f,u[f]=_)}u.length=f+1;for(let d=0,p=u.length;d<p;d++){let _=u[d];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(s.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var ym=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,vm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Mm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,bm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Em=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Tm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,wm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Am=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Rm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Cm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Im=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Pm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Lm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Dm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Nm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Um=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Fm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Om=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Bm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,km=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,zm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Hm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Vm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Gm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Wm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Xm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,qm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ym=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,$m=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Zm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Km=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Jm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,jm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Qm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,eg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,tg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,ng=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ig=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,sg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,rg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,og=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ag=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,cg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,hg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,ug=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,dg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,pg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,mg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,gg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,_g=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,xg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,yg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,vg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Mg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Eg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Tg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ag=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Rg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Cg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ig=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Pg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Lg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Dg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ng=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ug=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Og=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Bg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,kg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Hg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Vg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Gg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Wg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Xg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Yg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,$g=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Zg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Kg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Jg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,jg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Qg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,e0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,t0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,n0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,i0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,s0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,r0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,o0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,a0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,c0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,l0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,h0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,u0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,d0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,f0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,p0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,m0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,g0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,_0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,x0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,y0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,v0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,M0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,b0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,S0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,E0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,T0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,w0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,A0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,R0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,C0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,I0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,P0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,L0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,D0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,N0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,U0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,F0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,O0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,B0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,k0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,z0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,H0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,V0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,G0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,W0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,X0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,q0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Y0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Z0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,K0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,J0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Je={alphahash_fragment:ym,alphahash_pars_fragment:vm,alphamap_fragment:Mm,alphamap_pars_fragment:bm,alphatest_fragment:Sm,alphatest_pars_fragment:Em,aomap_fragment:Tm,aomap_pars_fragment:wm,batching_pars_vertex:Am,batching_vertex:Rm,begin_vertex:Cm,beginnormal_vertex:Im,bsdfs:Pm,iridescence_fragment:Lm,bumpmap_pars_fragment:Dm,clipping_planes_fragment:Nm,clipping_planes_pars_fragment:Um,clipping_planes_pars_vertex:Fm,clipping_planes_vertex:Om,color_fragment:Bm,color_pars_fragment:km,color_pars_vertex:zm,color_vertex:Hm,common:Vm,cube_uv_reflection_fragment:Gm,defaultnormal_vertex:Wm,displacementmap_pars_vertex:Xm,displacementmap_vertex:qm,emissivemap_fragment:Ym,emissivemap_pars_fragment:$m,colorspace_fragment:Zm,colorspace_pars_fragment:Km,envmap_fragment:Jm,envmap_common_pars_fragment:jm,envmap_pars_fragment:Qm,envmap_pars_vertex:eg,envmap_physical_pars_fragment:ug,envmap_vertex:tg,fog_vertex:ng,fog_pars_vertex:ig,fog_fragment:sg,fog_pars_fragment:rg,gradientmap_pars_fragment:og,lightmap_pars_fragment:ag,lights_lambert_fragment:cg,lights_lambert_pars_fragment:lg,lights_pars_begin:hg,lights_toon_fragment:dg,lights_toon_pars_fragment:fg,lights_phong_fragment:pg,lights_phong_pars_fragment:mg,lights_physical_fragment:gg,lights_physical_pars_fragment:_g,lights_fragment_begin:xg,lights_fragment_maps:yg,lights_fragment_end:vg,logdepthbuf_fragment:Mg,logdepthbuf_pars_fragment:bg,logdepthbuf_pars_vertex:Sg,logdepthbuf_vertex:Eg,map_fragment:Tg,map_pars_fragment:wg,map_particle_fragment:Ag,map_particle_pars_fragment:Rg,metalnessmap_fragment:Cg,metalnessmap_pars_fragment:Ig,morphinstance_vertex:Pg,morphcolor_vertex:Lg,morphnormal_vertex:Dg,morphtarget_pars_vertex:Ng,morphtarget_vertex:Ug,normal_fragment_begin:Fg,normal_fragment_maps:Og,normal_pars_fragment:Bg,normal_pars_vertex:kg,normal_vertex:zg,normalmap_pars_fragment:Hg,clearcoat_normal_fragment_begin:Vg,clearcoat_normal_fragment_maps:Gg,clearcoat_pars_fragment:Wg,iridescence_pars_fragment:Xg,opaque_fragment:qg,packing:Yg,premultiplied_alpha_fragment:$g,project_vertex:Zg,dithering_fragment:Kg,dithering_pars_fragment:Jg,roughnessmap_fragment:jg,roughnessmap_pars_fragment:Qg,shadowmap_pars_fragment:e0,shadowmap_pars_vertex:t0,shadowmap_vertex:n0,shadowmask_pars_fragment:i0,skinbase_vertex:s0,skinning_pars_vertex:r0,skinning_vertex:o0,skinnormal_vertex:a0,specularmap_fragment:c0,specularmap_pars_fragment:l0,tonemapping_fragment:h0,tonemapping_pars_fragment:u0,transmission_fragment:d0,transmission_pars_fragment:f0,uv_pars_fragment:p0,uv_pars_vertex:m0,uv_vertex:g0,worldpos_vertex:_0,background_vert:x0,background_frag:y0,backgroundCube_vert:v0,backgroundCube_frag:M0,cube_vert:b0,cube_frag:S0,depth_vert:E0,depth_frag:T0,distanceRGBA_vert:w0,distanceRGBA_frag:A0,equirect_vert:R0,equirect_frag:C0,linedashed_vert:I0,linedashed_frag:P0,meshbasic_vert:L0,meshbasic_frag:D0,meshlambert_vert:N0,meshlambert_frag:U0,meshmatcap_vert:F0,meshmatcap_frag:O0,meshnormal_vert:B0,meshnormal_frag:k0,meshphong_vert:z0,meshphong_frag:H0,meshphysical_vert:V0,meshphysical_frag:G0,meshtoon_vert:W0,meshtoon_frag:X0,points_vert:q0,points_frag:Y0,shadow_vert:$0,shadow_frag:Z0,sprite_vert:K0,sprite_frag:J0},Ce={common:{diffuse:{value:new ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ze},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ze}},envmap:{envMap:{value:null},envMapRotation:{value:new Ze},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ze},normalScale:{value:new _e(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0},uvTransform:{value:new Ze}},sprite:{diffuse:{value:new ze(16777215)},opacity:{value:1},center:{value:new _e(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ze},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0}}},Yn={basic:{uniforms:zt([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.fog]),vertexShader:Je.meshbasic_vert,fragmentShader:Je.meshbasic_frag},lambert:{uniforms:zt([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new ze(0)}}]),vertexShader:Je.meshlambert_vert,fragmentShader:Je.meshlambert_frag},phong:{uniforms:zt([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new ze(0)},specular:{value:new ze(1118481)},shininess:{value:30}}]),vertexShader:Je.meshphong_vert,fragmentShader:Je.meshphong_frag},standard:{uniforms:zt([Ce.common,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.roughnessmap,Ce.metalnessmap,Ce.fog,Ce.lights,{emissive:{value:new ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag},toon:{uniforms:zt([Ce.common,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.gradientmap,Ce.fog,Ce.lights,{emissive:{value:new ze(0)}}]),vertexShader:Je.meshtoon_vert,fragmentShader:Je.meshtoon_frag},matcap:{uniforms:zt([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,{matcap:{value:null}}]),vertexShader:Je.meshmatcap_vert,fragmentShader:Je.meshmatcap_frag},points:{uniforms:zt([Ce.points,Ce.fog]),vertexShader:Je.points_vert,fragmentShader:Je.points_frag},dashed:{uniforms:zt([Ce.common,Ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Je.linedashed_vert,fragmentShader:Je.linedashed_frag},depth:{uniforms:zt([Ce.common,Ce.displacementmap]),vertexShader:Je.depth_vert,fragmentShader:Je.depth_frag},normal:{uniforms:zt([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,{opacity:{value:1}}]),vertexShader:Je.meshnormal_vert,fragmentShader:Je.meshnormal_frag},sprite:{uniforms:zt([Ce.sprite,Ce.fog]),vertexShader:Je.sprite_vert,fragmentShader:Je.sprite_frag},background:{uniforms:{uvTransform:{value:new Ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Je.background_vert,fragmentShader:Je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ze}},vertexShader:Je.backgroundCube_vert,fragmentShader:Je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Je.cube_vert,fragmentShader:Je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Je.equirect_vert,fragmentShader:Je.equirect_frag},distanceRGBA:{uniforms:zt([Ce.common,Ce.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Je.distanceRGBA_vert,fragmentShader:Je.distanceRGBA_frag},shadow:{uniforms:zt([Ce.lights,Ce.fog,{color:{value:new ze(0)},opacity:{value:1}}]),vertexShader:Je.shadow_vert,fragmentShader:Je.shadow_frag}};Yn.physical={uniforms:zt([Yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ze},clearcoatNormalScale:{value:new _e(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ze},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ze},sheen:{value:0},sheenColor:{value:new ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ze},transmissionSamplerSize:{value:new _e},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ze},attenuationDistance:{value:0},attenuationColor:{value:new ze(0)},specularColor:{value:new ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ze},anisotropyVector:{value:new _e},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ze}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag};var ac={r:0,b:0,g:0},es=new En,j0=new $e;function Q0(s,e,t,n,i,r,o){let a=new ze(0),l=r===!0?0:1,c,h,u=null,f=0,d=null;function p(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?t:e).get(x)),x}function _(y){let x=!1,E=p(y);E===null?m(a,l):E&&E.isColor&&(m(E,1),x=!0);let A=s.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function g(y,x){let E=p(x);E&&(E.isCubeTexture||E.mapping===Qr)?(h===void 0&&(h=new ot(new Zt(1,1,1),new sn({name:"BackgroundCubeMaterial",uniforms:Qi(Yn.backgroundCube.uniforms),vertexShader:Yn.backgroundCube.vertexShader,fragmentShader:Yn.backgroundCube.fragmentShader,side:Xt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,D,O){this.matrixWorld.copyPosition(O.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),es.copy(x.backgroundRotation),es.x*=-1,es.y*=-1,es.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(es.y*=-1,es.z*=-1),h.material.uniforms.envMap.value=E,h.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(j0.makeRotationFromEuler(es)),h.material.toneMapped=tt.getTransfer(E.colorSpace)!==lt,(u!==E||f!==E.version||d!==s.toneMapping)&&(h.material.needsUpdate=!0,u=E,f=E.version,d=s.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new ot(new zn(2,2),new sn({name:"BackgroundMaterial",uniforms:Qi(Yn.background.uniforms),vertexShader:Yn.background.vertexShader,fragmentShader:Yn.background.fragmentShader,side:Sn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=tt.getTransfer(E.colorSpace)!==lt,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||f!==E.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,u=E,f=E.version,d=s.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function m(y,x){y.getRGB(ac,Nl(s)),n.buffers.color.setClear(ac.r,ac.g,ac.b,x,o)}function M(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,x=1){a.set(y),l=x,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,m(a,l)},render:_,addToRenderList:g,dispose:M}}function e_(s,e){let t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=f(null),r=i,o=!1;function a(v,I,V,X,ee){let Q=!1,C=u(X,V,I);r!==C&&(r=C,c(r.object)),Q=d(v,X,V,ee),Q&&p(v,X,V,ee),ee!==null&&e.update(ee,s.ELEMENT_ARRAY_BUFFER),(Q||o)&&(o=!1,x(v,I,V,X),ee!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(ee).buffer))}function l(){return s.createVertexArray()}function c(v){return s.bindVertexArray(v)}function h(v){return s.deleteVertexArray(v)}function u(v,I,V){let X=V.wireframe===!0,ee=n[v.id];ee===void 0&&(ee={},n[v.id]=ee);let Q=ee[I.id];Q===void 0&&(Q={},ee[I.id]=Q);let C=Q[X];return C===void 0&&(C=f(l()),Q[X]=C),C}function f(v){let I=[],V=[],X=[];for(let ee=0;ee<t;ee++)I[ee]=0,V[ee]=0,X[ee]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:V,attributeDivisors:X,object:v,attributes:{},index:null}}function d(v,I,V,X){let ee=r.attributes,Q=I.attributes,C=0,L=V.getAttributes();for(let w in L)if(L[w].location>=0){let G=ee[w],F=Q[w];if(F===void 0&&(w==="instanceMatrix"&&v.instanceMatrix&&(F=v.instanceMatrix),w==="instanceColor"&&v.instanceColor&&(F=v.instanceColor)),G===void 0||G.attribute!==F||F&&G.data!==F.data)return!0;C++}return r.attributesNum!==C||r.index!==X}function p(v,I,V,X){let ee={},Q=I.attributes,C=0,L=V.getAttributes();for(let w in L)if(L[w].location>=0){let G=Q[w];G===void 0&&(w==="instanceMatrix"&&v.instanceMatrix&&(G=v.instanceMatrix),w==="instanceColor"&&v.instanceColor&&(G=v.instanceColor));let F={};F.attribute=G,G&&G.data&&(F.data=G.data),ee[w]=F,C++}r.attributes=ee,r.attributesNum=C,r.index=X}function _(){let v=r.newAttributes;for(let I=0,V=v.length;I<V;I++)v[I]=0}function g(v){m(v,0)}function m(v,I){let V=r.newAttributes,X=r.enabledAttributes,ee=r.attributeDivisors;V[v]=1,X[v]===0&&(s.enableVertexAttribArray(v),X[v]=1),ee[v]!==I&&(s.vertexAttribDivisor(v,I),ee[v]=I)}function M(){let v=r.newAttributes,I=r.enabledAttributes;for(let V=0,X=I.length;V<X;V++)I[V]!==v[V]&&(s.disableVertexAttribArray(V),I[V]=0)}function y(v,I,V,X,ee,Q,C){C===!0?s.vertexAttribIPointer(v,I,V,ee,Q):s.vertexAttribPointer(v,I,V,X,ee,Q)}function x(v,I,V,X){_();let ee=X.attributes,Q=V.getAttributes(),C=I.defaultAttributeValues;for(let L in Q){let w=Q[L];if(w.location>=0){let H=ee[L];if(H===void 0&&(L==="instanceMatrix"&&v.instanceMatrix&&(H=v.instanceMatrix),L==="instanceColor"&&v.instanceColor&&(H=v.instanceColor)),H!==void 0){let G=H.normalized,F=H.itemSize,te=e.get(H);if(te===void 0)continue;let U=te.buffer,ue=te.type,re=te.bytesPerElement,B=ue===s.INT||ue===s.UNSIGNED_INT||H.gpuType===wa;if(H.isInterleavedBufferAttribute){let $=H.data,le=$.stride,be=H.offset;if($.isInstancedInterleavedBuffer){for(let xe=0;xe<w.locationSize;xe++)m(w.location+xe,$.meshPerAttribute);v.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let xe=0;xe<w.locationSize;xe++)g(w.location+xe);s.bindBuffer(s.ARRAY_BUFFER,U);for(let xe=0;xe<w.locationSize;xe++)y(w.location+xe,F/w.locationSize,ue,G,le*re,(be+F/w.locationSize*xe)*re,B)}else{if(H.isInstancedBufferAttribute){for(let $=0;$<w.locationSize;$++)m(w.location+$,H.meshPerAttribute);v.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=H.meshPerAttribute*H.count)}else for(let $=0;$<w.locationSize;$++)g(w.location+$);s.bindBuffer(s.ARRAY_BUFFER,U);for(let $=0;$<w.locationSize;$++)y(w.location+$,F/w.locationSize,ue,G,F*re,F/w.locationSize*$*re,B)}}else if(C!==void 0){let G=C[L];if(G!==void 0)switch(G.length){case 2:s.vertexAttrib2fv(w.location,G);break;case 3:s.vertexAttrib3fv(w.location,G);break;case 4:s.vertexAttrib4fv(w.location,G);break;default:s.vertexAttrib1fv(w.location,G)}}}}M()}function E(){O();for(let v in n){let I=n[v];for(let V in I){let X=I[V];for(let ee in X)h(X[ee].object),delete X[ee];delete I[V]}delete n[v]}}function A(v){if(n[v.id]===void 0)return;let I=n[v.id];for(let V in I){let X=I[V];for(let ee in X)h(X[ee].object),delete X[ee];delete I[V]}delete n[v.id]}function D(v){for(let I in n){let V=n[I];if(V[v.id]===void 0)continue;let X=V[v.id];for(let ee in X)h(X[ee].object),delete X[ee];delete V[v.id]}}function O(){b(),o=!0,r!==i&&(r=i,c(r.object))}function b(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:O,resetDefaultState:b,dispose:E,releaseStatesOfGeometry:A,releaseStatesOfProgram:D,initAttributes:_,enableAttribute:g,disableUnusedAttributes:M}}function t_(s,e,t){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(s.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let d=0;for(let p=0;p<u;p++)d+=h[p];t.update(d,n,1)}function l(c,h,u,f){if(u===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let p=0;p<c.length;p++)o(c[p],h[p],f[p]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let p=0;for(let _=0;_<u;_++)p+=h[_]*f[_];t.update(p,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function n_(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let D=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(D.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(D){return!(D!==an&&n.convert(D)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(D){let O=D===Hs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(D!==Rn&&n.convert(D)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&D!==pn&&!O)}function l(D){if(D==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";D="mediump"}return D==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),y=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),E=p>0,A=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:M,maxVaryings:y,maxFragmentUniforms:x,vertexTextures:E,maxSamples:A}}function i_(s){let e=this,t=null,n=0,i=!1,r=!1,o=new un,a=new Ze,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){let p=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,m=s.get(u);if(!i||p===null||p.length===0||r&&!g)r?h(null):c();else{let M=r?0:n,y=M*4,x=m.clippingState||null;l.value=x,x=h(p,f,y,d);for(let E=0;E!==y;++E)x[E]=t[E];m.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,p){let _=u!==null?u.length:0,g=null;if(_!==0){if(g=l.value,p!==!0||g===null){let m=d+_*4,M=f.matrixWorldInverse;a.getNormalMatrix(M),(g===null||g.length<m)&&(g=new Float32Array(m));for(let y=0,x=d;y!==_;++y,x+=4)o.copy(u[y]).applyMatrix4(M,a),o.normal.toArray(g,x),g[x+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function s_(s){let e=new WeakMap;function t(o,a){return a===Sa?o.mapping=Ki:a===Ea&&(o.mapping=Ji),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Sa||a===Ea)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Jo(l.height);return c.fromEquirectangularTexture(s,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var qs=4,Id=[.125,.215,.35,.446,.526,.582],is=20,kl=new $i,Pd=new ze,zl=null,Hl=0,Vl=0,Gl=!1,ns=(1+Math.sqrt(5))/2,Xs=1/ns,Ld=[new N(-ns,Xs,0),new N(ns,Xs,0),new N(-Xs,0,ns),new N(Xs,0,ns),new N(0,ns,-Xs),new N(0,ns,Xs),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],r_=new N,hc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100,r={}){let{size:o=256,position:a=r_}=r;zl=this._renderer.getRenderTarget(),Hl=this._renderer.getActiveCubeFace(),Vl=this._renderer.getActiveMipmapLevel(),Gl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ud(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(zl,Hl,Vl),this._renderer.xr.enabled=Gl,e.scissorTest=!1,cc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ki||e.mapping===Ji?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),zl=this._renderer.getRenderTarget(),Hl=this._renderer.getActiveCubeFace(),Vl=this._renderer.getActiveMipmapLevel(),Gl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Gt,minFilter:Gt,generateMipmaps:!1,type:Hs,format:an,colorSpace:Ft,depthBuffer:!1},i=Dd(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Dd(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=o_(r)),this._blurMaterial=a_(r,e,t)}return i}_compileMaterial(e){let t=new ot(this._lodPlanes[0],e);this._renderer.compile(t,kl)}_sceneToCubeUV(e,t,n,i,r){let l=new wt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(Pd),u.toneMapping=hi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null));let _=new Ot({name:"PMREM.Background",side:Xt,depthWrite:!1,depthTest:!1}),g=new ot(new Zt,_),m=!1,M=e.background;M?M.isColor&&(_.color.copy(M),e.background=null,m=!0):(_.color.copy(Pd),m=!0);for(let y=0;y<6;y++){let x=y%3;x===0?(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[y],r.y,r.z)):x===1?(l.up.set(0,0,c[y]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[y],r.z)):(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[y]));let E=this._cubeSize;cc(i,x*E,y>2?E:0,E,E),u.setRenderTarget(i),m&&u.render(g,l),u.render(e,l)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=f,e.background=M}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===Ki||e.mapping===Ji;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ud()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Nd());let r=i?this._cubemapMaterial:this._equirectMaterial,o=new ot(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;cc(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,kl)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodPlanes.length;for(let r=1;r<i;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Ld[(i-r-1)%Ld.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,i,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new ot(this._lodPlanes[i],c),f=c.uniforms,d=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*is-1),_=r/p,g=isFinite(r)?1+Math.floor(h*_):is;g>is&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${is}`);let m=[],M=0;for(let D=0;D<is;++D){let O=D/_,b=Math.exp(-O*O/2);m.push(b),D===0?M+=b:D<g&&(M+=2*b)}for(let D=0;D<m.length;D++)m[D]=m[D]/M;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=m,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:y}=this;f.dTheta.value=p,f.mipInt.value=y-n;let x=this._sizeLods[i],E=3*x*(i>y-qs?i-y+qs:0),A=4*(this._cubeSize-x);cc(t,E,A,3*x,2*x),l.setRenderTarget(t),l.render(u,kl)}};function o_(s){let e=[],t=[],n=[],i=s,r=s-qs+1+Id.length;for(let o=0;o<r;o++){let a=Math.pow(2,i);t.push(a);let l=1/a;o>s-qs?l=Id[o-s+qs-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,p=6,_=3,g=2,m=1,M=new Float32Array(_*p*d),y=new Float32Array(g*p*d),x=new Float32Array(m*p*d);for(let A=0;A<d;A++){let D=A%3*2/3-1,O=A>2?0:-1,b=[D,O,0,D+2/3,O,0,D+2/3,O+1,0,D,O,0,D+2/3,O+1,0,D,O+1,0];M.set(b,_*p*A),y.set(f,g*p*A);let v=[A,A,A,A,A,A];x.set(v,m*p*A)}let E=new je;E.setAttribute("position",new gt(M,_)),E.setAttribute("uv",new gt(y,g)),E.setAttribute("faceIndex",new gt(x,m)),e.push(E),i>qs&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Dd(s,e,t){let n=new Fn(s,e,t);return n.texture.mapping=Qr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function cc(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function a_(s,e,t){let n=new Float32Array(is),i=new N(0,1,0);return new sn({name:"SphericalGaussianBlur",defines:{n:is,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ql(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:li,depthTest:!1,depthWrite:!1})}function Nd(){return new sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ql(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:li,depthTest:!1,depthWrite:!1})}function Ud(){return new sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ql(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:li,depthTest:!1,depthWrite:!1})}function Ql(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function c_(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Sa||l===Ea,h=l===Ki||l===Ji;if(c||h){let u=e.get(a),f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new hc(s)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let d=a.image;return c&&d&&d.height>0||h&&d&&i(d)?(t===null&&(t=new hc(s)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function l_(s){let e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let i=t(n);return i===null&&Ts("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function h_(s,e,t,n){let i={},r=new WeakMap;function o(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let p in f.attributes)e.remove(f.attributes[p]);f.removeEventListener("dispose",o),delete i[f.id];let d=r.get(f);d&&(e.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return i[f.id]===!0||(f.addEventListener("dispose",o),i[f.id]=!0,t.memory.geometries++),f}function l(u){let f=u.attributes;for(let d in f)e.update(f[d],s.ARRAY_BUFFER)}function c(u){let f=[],d=u.index,p=u.attributes.position,_=0;if(d!==null){let M=d.array;_=d.version;for(let y=0,x=M.length;y<x;y+=3){let E=M[y+0],A=M[y+1],D=M[y+2];f.push(E,A,A,D,D,E)}}else if(p!==void 0){let M=p.array;_=p.version;for(let y=0,x=M.length/3-1;y<x;y+=3){let E=y+0,A=y+1,D=y+2;f.push(E,A,A,D,D,E)}}else return;let g=new(Dl(f)?vr:yr)(f,1);g.version=_;let m=r.get(u);m&&e.remove(m),r.set(u,g)}function h(u){let f=r.get(u);if(f){let d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function u_(s,e,t){let n;function i(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,d){s.drawElements(n,d,r,f*o),t.update(d,n,1)}function c(f,d,p){p!==0&&(s.drawElementsInstanced(n,d,r,f*o,p),t.update(d,n,p))}function h(f,d,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,p);let g=0;for(let m=0;m<p;m++)g+=d[m];t.update(g,n,1)}function u(f,d,p,_){if(p===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<f.length;m++)c(f[m]/o,d[m],_[m]);else{g.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,_,0,p);let m=0;for(let M=0;M<p;M++)m+=d[M]*_[M];t.update(m,n,1)}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function d_(s){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function f_(s,e,t){let n=new WeakMap,i=new rt;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,f=n.get(a);if(f===void 0||f.count!==u){let b=function(){D.dispose(),n.delete(a),a.removeEventListener("dispose",b)};f!==void 0&&f.texture.dispose();let d=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],y=0;d===!0&&(y=1),p===!0&&(y=2),_===!0&&(y=3);let x=a.attributes.position.count*y,E=1;x>e.maxTextureSize&&(E=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let A=new Float32Array(x*E*4*u),D=new xr(A,x,E,u);D.type=pn,D.needsUpdate=!0;let O=y*4;for(let v=0;v<u;v++){let I=g[v],V=m[v],X=M[v],ee=x*E*4*v;for(let Q=0;Q<I.count;Q++){let C=Q*O;d===!0&&(i.fromBufferAttribute(I,Q),A[ee+C+0]=i.x,A[ee+C+1]=i.y,A[ee+C+2]=i.z,A[ee+C+3]=0),p===!0&&(i.fromBufferAttribute(V,Q),A[ee+C+4]=i.x,A[ee+C+5]=i.y,A[ee+C+6]=i.z,A[ee+C+7]=0),_===!0&&(i.fromBufferAttribute(X,Q),A[ee+C+8]=i.x,A[ee+C+9]=i.y,A[ee+C+10]=i.z,A[ee+C+11]=X.itemSize===4?i.w:1)}}f={count:u,texture:D,size:new _e(x,E)},n.set(a,f),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let d=0;for(let _=0;_<c.length;_++)d+=c[_];let p=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(s,"morphTargetBaseInfluence",p),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",f.size)}return{update:r}}function p_(s,e,t,n){let i=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return u}function o(){i=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var ef=new Nt,Fd=new Ir(1,1),tf=new xr,nf=new Zo,sf=new br,Od=[],Bd=[],kd=new Float32Array(16),zd=new Float32Array(9),Hd=new Float32Array(4);function $s(s,e,t){let n=s[0];if(n<=0||n>0)return s;let i=e*t,r=Od[i];if(r===void 0&&(r=new Float32Array(i),Od[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function It(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Pt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function dc(s,e){let t=Bd[e];t===void 0&&(t=new Int32Array(e),Bd[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function m_(s,e){let t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function g_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;s.uniform2fv(this.addr,e),Pt(t,e)}}function __(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(It(t,e))return;s.uniform3fv(this.addr,e),Pt(t,e)}}function x_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;s.uniform4fv(this.addr,e),Pt(t,e)}}function y_(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(It(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Pt(t,e)}else{if(It(t,n))return;Hd.set(n),s.uniformMatrix2fv(this.addr,!1,Hd),Pt(t,n)}}function v_(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(It(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Pt(t,e)}else{if(It(t,n))return;zd.set(n),s.uniformMatrix3fv(this.addr,!1,zd),Pt(t,n)}}function M_(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(It(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Pt(t,e)}else{if(It(t,n))return;kd.set(n),s.uniformMatrix4fv(this.addr,!1,kd),Pt(t,n)}}function b_(s,e){let t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function S_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;s.uniform2iv(this.addr,e),Pt(t,e)}}function E_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;s.uniform3iv(this.addr,e),Pt(t,e)}}function T_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;s.uniform4iv(this.addr,e),Pt(t,e)}}function w_(s,e){let t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function A_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;s.uniform2uiv(this.addr,e),Pt(t,e)}}function R_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;s.uniform3uiv(this.addr,e),Pt(t,e)}}function C_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;s.uniform4uiv(this.addr,e),Pt(t,e)}}function I_(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Fd.compareFunction=Il,r=Fd):r=ef,t.setTexture2D(e||r,i)}function P_(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||nf,i)}function L_(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||sf,i)}function D_(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||tf,i)}function N_(s){switch(s){case 5126:return m_;case 35664:return g_;case 35665:return __;case 35666:return x_;case 35674:return y_;case 35675:return v_;case 35676:return M_;case 5124:case 35670:return b_;case 35667:case 35671:return S_;case 35668:case 35672:return E_;case 35669:case 35673:return T_;case 5125:return w_;case 36294:return A_;case 36295:return R_;case 36296:return C_;case 35678:case 36198:case 36298:case 36306:case 35682:return I_;case 35679:case 36299:case 36307:return P_;case 35680:case 36300:case 36308:case 36293:return L_;case 36289:case 36303:case 36311:case 36292:return D_}}function U_(s,e){s.uniform1fv(this.addr,e)}function F_(s,e){let t=$s(e,this.size,2);s.uniform2fv(this.addr,t)}function O_(s,e){let t=$s(e,this.size,3);s.uniform3fv(this.addr,t)}function B_(s,e){let t=$s(e,this.size,4);s.uniform4fv(this.addr,t)}function k_(s,e){let t=$s(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function z_(s,e){let t=$s(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function H_(s,e){let t=$s(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function V_(s,e){s.uniform1iv(this.addr,e)}function G_(s,e){s.uniform2iv(this.addr,e)}function W_(s,e){s.uniform3iv(this.addr,e)}function X_(s,e){s.uniform4iv(this.addr,e)}function q_(s,e){s.uniform1uiv(this.addr,e)}function Y_(s,e){s.uniform2uiv(this.addr,e)}function $_(s,e){s.uniform3uiv(this.addr,e)}function Z_(s,e){s.uniform4uiv(this.addr,e)}function K_(s,e,t){let n=this.cache,i=e.length,r=dc(t,i);It(n,r)||(s.uniform1iv(this.addr,r),Pt(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||ef,r[o])}function J_(s,e,t){let n=this.cache,i=e.length,r=dc(t,i);It(n,r)||(s.uniform1iv(this.addr,r),Pt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||nf,r[o])}function j_(s,e,t){let n=this.cache,i=e.length,r=dc(t,i);It(n,r)||(s.uniform1iv(this.addr,r),Pt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||sf,r[o])}function Q_(s,e,t){let n=this.cache,i=e.length,r=dc(t,i);It(n,r)||(s.uniform1iv(this.addr,r),Pt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||tf,r[o])}function ex(s){switch(s){case 5126:return U_;case 35664:return F_;case 35665:return O_;case 35666:return B_;case 35674:return k_;case 35675:return z_;case 35676:return H_;case 5124:case 35670:return V_;case 35667:case 35671:return G_;case 35668:case 35672:return W_;case 35669:case 35673:return X_;case 5125:return q_;case 36294:return Y_;case 36295:return $_;case 36296:return Z_;case 35678:case 36198:case 36298:case 36306:case 35682:return K_;case 35679:case 36299:case 36307:return J_;case 35680:case 36300:case 36308:case 36293:return j_;case 36289:case 36303:case 36311:case 36292:return Q_}}var Xl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=N_(t.type)}},ql=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ex(t.type)}},Yl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(e,t[a.id],n)}}},Wl=/(\w+)(\])?(\[|\.)?/g;function Vd(s,e){s.seq.push(e),s.map[e.id]=e}function tx(s,e,t){let n=s.name,i=n.length;for(Wl.lastIndex=0;;){let r=Wl.exec(n),o=Wl.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Vd(t,c===void 0?new Xl(a,s,e):new ql(a,s,e));break}else{let u=t.map[a];u===void 0&&(u=new Yl(a),Vd(t,u)),t=u}}}var Ys=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);tx(r,o,this)}}setValue(e,t,n,i){let r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,r=e.length;i!==r;++i){let o=e[i];o.id in t&&n.push(o)}return n}};function Gd(s,e,t){let n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}var nx=37297,ix=0;function sx(s,e){let t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Wd=new Ze;function rx(s){tt._getMatrix(Wd,tt.workingColorSpace,s);let e=`mat3( ${Wd.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(s)){case gr:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Xd(s,e,t){let n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+sx(s.getShaderSource(e),a)}else return r}function ox(s,e){let t=rx(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function ax(s,e){let t;switch(e){case nd:t="Linear";break;case id:t="Reinhard";break;case sd:t="Cineon";break;case ba:t="ACESFilmic";break;case od:t="AgX";break;case ad:t="Neutral";break;case rd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var lc=new N;function cx(){tt.getLuminanceCoefficients(lc);let s=lc.x.toFixed(4),e=lc.y.toFixed(4),t=lc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function lx(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ro).join(`
`)}function hx(s){let e=[];for(let t in s){let n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ux(s,e){let t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(e,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function ro(s){return s!==""}function qd(s,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Yd(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var dx=/^[ \t]*#include +<([\w\d./]+)>/gm;function $l(s){return s.replace(dx,px)}var fx=new Map;function px(s,e){let t=Je[e];if(t===void 0){let n=fx.get(e);if(n!==void 0)t=Je[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return $l(t)}var mx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $d(s){return s.replace(mx,gx)}function gx(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Zd(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function _x(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===ml?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===pa?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===qn&&(e="SHADOWMAP_TYPE_VSM"),e}function xx(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ki:case Ji:e="ENVMAP_TYPE_CUBE";break;case Qr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function yx(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ji:e="ENVMAP_MODE_REFRACTION";break}return e}function vx(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case yl:e="ENVMAP_BLENDING_MULTIPLY";break;case ed:e="ENVMAP_BLENDING_MIX";break;case td:e="ENVMAP_BLENDING_ADD";break}return e}function Mx(s){let e=s.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function bx(s,e,t,n){let i=s.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=_x(t),c=xx(t),h=yx(t),u=vx(t),f=Mx(t),d=lx(t),p=hx(r),_=i.createProgram(),g,m,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(ro).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(ro).join(`
`),m.length>0&&(m+=`
`)):(g=[Zd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ro).join(`
`),m=[Zd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==hi?"#define TONE_MAPPING":"",t.toneMapping!==hi?Je.tonemapping_pars_fragment:"",t.toneMapping!==hi?ax("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Je.colorspace_pars_fragment,ox("linearToOutputTexel",t.outputColorSpace),cx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ro).join(`
`)),o=$l(o),o=qd(o,t),o=Yd(o,t),a=$l(a),a=qd(a,t),a=Yd(a,t),o=$d(o),a=$d(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===Pl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Pl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let y=M+g+o,x=M+m+a,E=Gd(i,i.VERTEX_SHADER,y),A=Gd(i,i.FRAGMENT_SHADER,x);i.attachShader(_,E),i.attachShader(_,A),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function D(I){if(s.debug.checkShaderErrors){let V=i.getProgramInfoLog(_)||"",X=i.getShaderInfoLog(E)||"",ee=i.getShaderInfoLog(A)||"",Q=V.trim(),C=X.trim(),L=ee.trim(),w=!0,H=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(w=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,E,A);else{let G=Xd(i,E,"vertex"),F=Xd(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+Q+`
`+G+`
`+F)}else Q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Q):(C===""||L==="")&&(H=!1);H&&(I.diagnostics={runnable:w,programLog:Q,vertexShader:{log:C,prefix:g},fragmentShader:{log:L,prefix:m}})}i.deleteShader(E),i.deleteShader(A),O=new Ys(i,_),b=ux(i,_)}let O;this.getUniforms=function(){return O===void 0&&D(this),O};let b;this.getAttributes=function(){return b===void 0&&D(this),b};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=i.getProgramParameter(_,nx)),v},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ix++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=A,this}var Sx=0,Zl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Kl(e),t.set(e,n)),n}},Kl=class{constructor(e){this.id=Sx++,this.code=e,this.usedTimes=0}};function Ex(s,e,t,n,i,r,o){let a=new As,l=new Zl,c=new Set,h=[],u=i.logarithmicDepthBuffer,f=i.vertexTextures,d=i.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,v,I,V,X){let ee=V.fog,Q=X.geometry,C=b.isMeshStandardMaterial?V.environment:null,L=(b.isMeshStandardMaterial?t:e).get(b.envMap||C),w=L&&L.mapping===Qr?L.image.height:null,H=p[b.type];b.precision!==null&&(d=i.getMaxPrecision(b.precision),d!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));let G=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,F=G!==void 0?G.length:0,te=0;Q.morphAttributes.position!==void 0&&(te=1),Q.morphAttributes.normal!==void 0&&(te=2),Q.morphAttributes.color!==void 0&&(te=3);let U,ue,re,B;if(H){let at=Yn[H];U=at.vertexShader,ue=at.fragmentShader}else U=b.vertexShader,ue=b.fragmentShader,l.update(b),re=l.getVertexShaderID(b),B=l.getFragmentShaderID(b);let $=s.getRenderTarget(),le=s.state.buffers.depth.getReversed(),be=X.isInstancedMesh===!0,xe=X.isBatchedMesh===!0,Re=!!b.map,Ee=!!b.matcap,P=!!L,ie=!!b.aoMap,oe=!!b.lightMap,ne=!!b.bumpMap,Y=!!b.normalMap,me=!!b.displacementMap,de=!!b.emissiveMap,ye=!!b.metalnessMap,Fe=!!b.roughnessMap,Be=b.anisotropy>0,R=b.clearcoat>0,S=b.dispersion>0,K=b.iridescence>0,ce=b.sheen>0,ve=b.transmission>0,he=Be&&!!b.anisotropyMap,z=R&&!!b.clearcoatMap,k=R&&!!b.clearcoatNormalMap,q=R&&!!b.clearcoatRoughnessMap,fe=K&&!!b.iridescenceMap,j=K&&!!b.iridescenceThicknessMap,pe=ce&&!!b.sheenColorMap,Pe=ce&&!!b.sheenRoughnessMap,Le=!!b.specularMap,Te=!!b.specularColorMap,ke=!!b.specularIntensityMap,W=ve&&!!b.transmissionMap,we=ve&&!!b.thicknessMap,Me=!!b.gradientMap,De=!!b.alphaMap,Se=b.alphaTest>0,ge=!!b.alphaHash,Ue=!!b.extensions,Ye=hi;b.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(Ye=s.toneMapping);let pt={shaderID:H,shaderType:b.type,shaderName:b.name,vertexShader:U,fragmentShader:ue,defines:b.defines,customVertexShaderID:re,customFragmentShaderID:B,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:xe,batchingColor:xe&&X._colorsTexture!==null,instancing:be,instancingColor:be&&X.instanceColor!==null,instancingMorph:be&&X.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:$===null?s.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:Ft,alphaToCoverage:!!b.alphaToCoverage,map:Re,matcap:Ee,envMap:P,envMapMode:P&&L.mapping,envMapCubeUVHeight:w,aoMap:ie,lightMap:oe,bumpMap:ne,normalMap:Y,displacementMap:f&&me,emissiveMap:de,normalMapObjectSpace:Y&&b.normalMapType===dd,normalMapTangentSpace:Y&&b.normalMapType===Cl,metalnessMap:ye,roughnessMap:Fe,anisotropy:Be,anisotropyMap:he,clearcoat:R,clearcoatMap:z,clearcoatNormalMap:k,clearcoatRoughnessMap:q,dispersion:S,iridescence:K,iridescenceMap:fe,iridescenceThicknessMap:j,sheen:ce,sheenColorMap:pe,sheenRoughnessMap:Pe,specularMap:Le,specularColorMap:Te,specularIntensityMap:ke,transmission:ve,transmissionMap:W,thicknessMap:we,gradientMap:Me,opaque:b.transparent===!1&&b.blending===Oi&&b.alphaToCoverage===!1,alphaMap:De,alphaTest:Se,alphaHash:ge,combine:b.combine,mapUv:Re&&_(b.map.channel),aoMapUv:ie&&_(b.aoMap.channel),lightMapUv:oe&&_(b.lightMap.channel),bumpMapUv:ne&&_(b.bumpMap.channel),normalMapUv:Y&&_(b.normalMap.channel),displacementMapUv:me&&_(b.displacementMap.channel),emissiveMapUv:de&&_(b.emissiveMap.channel),metalnessMapUv:ye&&_(b.metalnessMap.channel),roughnessMapUv:Fe&&_(b.roughnessMap.channel),anisotropyMapUv:he&&_(b.anisotropyMap.channel),clearcoatMapUv:z&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:k&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:q&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:fe&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:j&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:Pe&&_(b.sheenRoughnessMap.channel),specularMapUv:Le&&_(b.specularMap.channel),specularColorMapUv:Te&&_(b.specularColorMap.channel),specularIntensityMapUv:ke&&_(b.specularIntensityMap.channel),transmissionMapUv:W&&_(b.transmissionMap.channel),thicknessMapUv:we&&_(b.thicknessMap.channel),alphaMapUv:De&&_(b.alphaMap.channel),vertexTangents:!!Q.attributes.tangent&&(Y||Be),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,pointsUvs:X.isPoints===!0&&!!Q.attributes.uv&&(Re||De),fog:!!ee,useFog:b.fog===!0,fogExp2:!!ee&&ee.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:le,skinning:X.isSkinnedMesh===!0,morphTargets:Q.morphAttributes.position!==void 0,morphNormals:Q.morphAttributes.normal!==void 0,morphColors:Q.morphAttributes.color!==void 0,morphTargetsCount:F,morphTextureStride:te,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:Ye,decodeVideoTexture:Re&&b.map.isVideoTexture===!0&&tt.getTransfer(b.map.colorSpace)===lt,decodeVideoTextureEmissive:de&&b.emissiveMap.isVideoTexture===!0&&tt.getTransfer(b.emissiveMap.colorSpace)===lt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===_t,flipSided:b.side===Xt,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ue&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ue&&b.extensions.multiDraw===!0||xe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return pt.vertexUv1s=c.has(1),pt.vertexUv2s=c.has(2),pt.vertexUv3s=c.has(3),c.clear(),pt}function m(b){let v=[];if(b.shaderID?v.push(b.shaderID):(v.push(b.customVertexShaderID),v.push(b.customFragmentShaderID)),b.defines!==void 0)for(let I in b.defines)v.push(I),v.push(b.defines[I]);return b.isRawShaderMaterial===!1&&(M(v,b),y(v,b),v.push(s.outputColorSpace)),v.push(b.customProgramCacheKey),v.join()}function M(b,v){b.push(v.precision),b.push(v.outputColorSpace),b.push(v.envMapMode),b.push(v.envMapCubeUVHeight),b.push(v.mapUv),b.push(v.alphaMapUv),b.push(v.lightMapUv),b.push(v.aoMapUv),b.push(v.bumpMapUv),b.push(v.normalMapUv),b.push(v.displacementMapUv),b.push(v.emissiveMapUv),b.push(v.metalnessMapUv),b.push(v.roughnessMapUv),b.push(v.anisotropyMapUv),b.push(v.clearcoatMapUv),b.push(v.clearcoatNormalMapUv),b.push(v.clearcoatRoughnessMapUv),b.push(v.iridescenceMapUv),b.push(v.iridescenceThicknessMapUv),b.push(v.sheenColorMapUv),b.push(v.sheenRoughnessMapUv),b.push(v.specularMapUv),b.push(v.specularColorMapUv),b.push(v.specularIntensityMapUv),b.push(v.transmissionMapUv),b.push(v.thicknessMapUv),b.push(v.combine),b.push(v.fogExp2),b.push(v.sizeAttenuation),b.push(v.morphTargetsCount),b.push(v.morphAttributeCount),b.push(v.numDirLights),b.push(v.numPointLights),b.push(v.numSpotLights),b.push(v.numSpotLightMaps),b.push(v.numHemiLights),b.push(v.numRectAreaLights),b.push(v.numDirLightShadows),b.push(v.numPointLightShadows),b.push(v.numSpotLightShadows),b.push(v.numSpotLightShadowsWithMaps),b.push(v.numLightProbes),b.push(v.shadowMapType),b.push(v.toneMapping),b.push(v.numClippingPlanes),b.push(v.numClipIntersection),b.push(v.depthPacking)}function y(b,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),v.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reversedDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),b.push(a.mask)}function x(b){let v=p[b.type],I;if(v){let V=Yn[v];I=Sd.clone(V.uniforms)}else I=b.uniforms;return I}function E(b,v){let I;for(let V=0,X=h.length;V<X;V++){let ee=h[V];if(ee.cacheKey===v){I=ee,++I.usedTimes;break}}return I===void 0&&(I=new bx(s,v,b,r),h.push(I)),I}function A(b){if(--b.usedTimes===0){let v=h.indexOf(b);h[v]=h[h.length-1],h.pop(),b.destroy()}}function D(b){l.remove(b)}function O(){l.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:x,acquireProgram:E,releaseProgram:A,releaseShaderCache:D,programs:h,dispose:O}}function Tx(){let s=new WeakMap;function e(o){return s.has(o)}function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function wx(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Kd(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Jd(){let s=[],e=0,t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(u,f,d,p,_,g){let m=s[e];return m===void 0?(m={id:u.id,object:u,geometry:f,material:d,groupOrder:p,renderOrder:u.renderOrder,z:_,group:g},s[e]=m):(m.id=u.id,m.object=u,m.geometry=f,m.material=d,m.groupOrder=p,m.renderOrder=u.renderOrder,m.z=_,m.group=g),e++,m}function a(u,f,d,p,_,g){let m=o(u,f,d,p,_,g);d.transmission>0?n.push(m):d.transparent===!0?i.push(m):t.push(m)}function l(u,f,d,p,_,g){let m=o(u,f,d,p,_,g);d.transmission>0?n.unshift(m):d.transparent===!0?i.unshift(m):t.unshift(m)}function c(u,f){t.length>1&&t.sort(u||wx),n.length>1&&n.sort(f||Kd),i.length>1&&i.sort(f||Kd)}function h(){for(let u=e,f=s.length;u<f;u++){let d=s[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function Ax(){let s=new WeakMap;function e(n,i){let r=s.get(n),o;return r===void 0?(o=new Jd,s.set(n,[o])):i>=r.length?(o=new Jd,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function Rx(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new ze};break;case"SpotLight":t={position:new N,direction:new N,color:new ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new ze,groundColor:new ze};break;case"RectAreaLight":t={color:new ze,position:new N,halfWidth:new N,halfHeight:new N};break}return s[e.id]=t,t}}}function Cx(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}var Ix=0;function Px(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Lx(s){let e=new Rx,t=Cx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new N);let i=new N,r=new $e,o=new $e;function a(c){let h=0,u=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let d=0,p=0,_=0,g=0,m=0,M=0,y=0,x=0,E=0,A=0,D=0;c.sort(Px);for(let b=0,v=c.length;b<v;b++){let I=c[b],V=I.color,X=I.intensity,ee=I.distance,Q=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=V.r*X,u+=V.g*X,f+=V.b*X;else if(I.isLightProbe){for(let C=0;C<9;C++)n.probe[C].addScaledVector(I.sh.coefficients[C],X);D++}else if(I.isDirectionalLight){let C=e.get(I);if(C.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let L=I.shadow,w=t.get(I);w.shadowIntensity=L.intensity,w.shadowBias=L.bias,w.shadowNormalBias=L.normalBias,w.shadowRadius=L.radius,w.shadowMapSize=L.mapSize,n.directionalShadow[d]=w,n.directionalShadowMap[d]=Q,n.directionalShadowMatrix[d]=I.shadow.matrix,M++}n.directional[d]=C,d++}else if(I.isSpotLight){let C=e.get(I);C.position.setFromMatrixPosition(I.matrixWorld),C.color.copy(V).multiplyScalar(X),C.distance=ee,C.coneCos=Math.cos(I.angle),C.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),C.decay=I.decay,n.spot[_]=C;let L=I.shadow;if(I.map&&(n.spotLightMap[E]=I.map,E++,L.updateMatrices(I),I.castShadow&&A++),n.spotLightMatrix[_]=L.matrix,I.castShadow){let w=t.get(I);w.shadowIntensity=L.intensity,w.shadowBias=L.bias,w.shadowNormalBias=L.normalBias,w.shadowRadius=L.radius,w.shadowMapSize=L.mapSize,n.spotShadow[_]=w,n.spotShadowMap[_]=Q,x++}_++}else if(I.isRectAreaLight){let C=e.get(I);C.color.copy(V).multiplyScalar(X),C.halfWidth.set(I.width*.5,0,0),C.halfHeight.set(0,I.height*.5,0),n.rectArea[g]=C,g++}else if(I.isPointLight){let C=e.get(I);if(C.color.copy(I.color).multiplyScalar(I.intensity),C.distance=I.distance,C.decay=I.decay,I.castShadow){let L=I.shadow,w=t.get(I);w.shadowIntensity=L.intensity,w.shadowBias=L.bias,w.shadowNormalBias=L.normalBias,w.shadowRadius=L.radius,w.shadowMapSize=L.mapSize,w.shadowCameraNear=L.camera.near,w.shadowCameraFar=L.camera.far,n.pointShadow[p]=w,n.pointShadowMap[p]=Q,n.pointShadowMatrix[p]=I.shadow.matrix,y++}n.point[p]=C,p++}else if(I.isHemisphereLight){let C=e.get(I);C.skyColor.copy(I.color).multiplyScalar(X),C.groundColor.copy(I.groundColor).multiplyScalar(X),n.hemi[m]=C,m++}}g>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ce.LTC_FLOAT_1,n.rectAreaLTC2=Ce.LTC_FLOAT_2):(n.rectAreaLTC1=Ce.LTC_HALF_1,n.rectAreaLTC2=Ce.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;let O=n.hash;(O.directionalLength!==d||O.pointLength!==p||O.spotLength!==_||O.rectAreaLength!==g||O.hemiLength!==m||O.numDirectionalShadows!==M||O.numPointShadows!==y||O.numSpotShadows!==x||O.numSpotMaps!==E||O.numLightProbes!==D)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=g,n.point.length=p,n.hemi.length=m,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=x+E-A,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=D,O.directionalLength=d,O.pointLength=p,O.spotLength=_,O.rectAreaLength=g,O.hemiLength=m,O.numDirectionalShadows=M,O.numPointShadows=y,O.numSpotShadows=x,O.numSpotMaps=E,O.numLightProbes=D,n.version=Ix++)}function l(c,h){let u=0,f=0,d=0,p=0,_=0,g=h.matrixWorldInverse;for(let m=0,M=c.length;m<M;m++){let y=c[m];if(y.isDirectionalLight){let x=n.directional[u];x.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(g),u++}else if(y.isSpotLight){let x=n.spot[d];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(g),x.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(g),d++}else if(y.isRectAreaLight){let x=n.rectArea[p];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(g),o.identity(),r.copy(y.matrixWorld),r.premultiply(g),o.extractRotation(r),x.halfWidth.set(y.width*.5,0,0),x.halfHeight.set(0,y.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),p++}else if(y.isPointLight){let x=n.point[f];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(g),f++}else if(y.isHemisphereLight){let x=n.hemi[_];x.direction.setFromMatrixPosition(y.matrixWorld),x.direction.transformDirection(g),_++}}}return{setup:a,setupView:l,state:n}}function jd(s){let e=new Lx(s),t=[],n=[];function i(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Dx(s){let e=new WeakMap;function t(i,r=0){let o=e.get(i),a;return o===void 0?(a=new jd(s),e.set(i,[a])):r>=o.length?(a=new jd(s),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var Nx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ux=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Fx(s,e,t){let n=new Ls,i=new _e,r=new _e,o=new rt,a=new ra({depthPacking:ud}),l=new oa,c={},h=t.maxTextureSize,u={[Sn]:Xt,[Xt]:Sn,[_t]:_t},f=new sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _e},radius:{value:4}},vertexShader:Nx,fragmentShader:Ux}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let p=new je;p.setAttribute("position",new gt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new ot(p,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ml;let m=this.type;this.render=function(A,D,O){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||A.length===0)return;let b=s.getRenderTarget(),v=s.getActiveCubeFace(),I=s.getActiveMipmapLevel(),V=s.state;V.setBlending(li),V.buffers.depth.getReversed()===!0?V.buffers.color.setClear(0,0,0,0):V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let X=m!==qn&&this.type===qn,ee=m===qn&&this.type!==qn;for(let Q=0,C=A.length;Q<C;Q++){let L=A[Q],w=L.shadow;if(w===void 0){console.warn("THREE.WebGLShadowMap:",L,"has no shadow.");continue}if(w.autoUpdate===!1&&w.needsUpdate===!1)continue;i.copy(w.mapSize);let H=w.getFrameExtents();if(i.multiply(H),r.copy(w.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/H.x),i.x=r.x*H.x,w.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/H.y),i.y=r.y*H.y,w.mapSize.y=r.y)),w.map===null||X===!0||ee===!0){let F=this.type!==qn?{minFilter:Ut,magFilter:Ut}:{};w.map!==null&&w.map.dispose(),w.map=new Fn(i.x,i.y,F),w.map.texture.name=L.name+".shadowMap",w.camera.updateProjectionMatrix()}s.setRenderTarget(w.map),s.clear();let G=w.getViewportCount();for(let F=0;F<G;F++){let te=w.getViewport(F);o.set(r.x*te.x,r.y*te.y,r.x*te.z,r.y*te.w),V.viewport(o),w.updateMatrices(L,F),n=w.getFrustum(),x(D,O,w.camera,L,this.type)}w.isPointLightShadow!==!0&&this.type===qn&&M(w,O),w.needsUpdate=!1}m=this.type,g.needsUpdate=!1,s.setRenderTarget(b,v,I)};function M(A,D){let O=e.update(_);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Fn(i.x,i.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,s.setRenderTarget(A.mapPass),s.clear(),s.renderBufferDirect(D,null,O,f,_,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,s.setRenderTarget(A.map),s.clear(),s.renderBufferDirect(D,null,O,d,_,null)}function y(A,D,O,b){let v=null,I=O.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(I!==void 0)v=I;else if(v=O.isPointLight===!0?l:a,s.localClippingEnabled&&D.clipShadows===!0&&Array.isArray(D.clippingPlanes)&&D.clippingPlanes.length!==0||D.displacementMap&&D.displacementScale!==0||D.alphaMap&&D.alphaTest>0||D.map&&D.alphaTest>0||D.alphaToCoverage===!0){let V=v.uuid,X=D.uuid,ee=c[V];ee===void 0&&(ee={},c[V]=ee);let Q=ee[X];Q===void 0&&(Q=v.clone(),ee[X]=Q,D.addEventListener("dispose",E)),v=Q}if(v.visible=D.visible,v.wireframe=D.wireframe,b===qn?v.side=D.shadowSide!==null?D.shadowSide:D.side:v.side=D.shadowSide!==null?D.shadowSide:u[D.side],v.alphaMap=D.alphaMap,v.alphaTest=D.alphaToCoverage===!0?.5:D.alphaTest,v.map=D.map,v.clipShadows=D.clipShadows,v.clippingPlanes=D.clippingPlanes,v.clipIntersection=D.clipIntersection,v.displacementMap=D.displacementMap,v.displacementScale=D.displacementScale,v.displacementBias=D.displacementBias,v.wireframeLinewidth=D.wireframeLinewidth,v.linewidth=D.linewidth,O.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let V=s.properties.get(v);V.light=O}return v}function x(A,D,O,b,v){if(A.visible===!1)return;if(A.layers.test(D.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&v===qn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,A.matrixWorld);let X=e.update(A),ee=A.material;if(Array.isArray(ee)){let Q=X.groups;for(let C=0,L=Q.length;C<L;C++){let w=Q[C],H=ee[w.materialIndex];if(H&&H.visible){let G=y(A,H,b,v);A.onBeforeShadow(s,A,D,O,X,G,w),s.renderBufferDirect(O,null,X,G,A,w),A.onAfterShadow(s,A,D,O,X,G,w)}}}else if(ee.visible){let Q=y(A,ee,b,v);A.onBeforeShadow(s,A,D,O,X,Q,null),s.renderBufferDirect(O,null,X,Q,A,null),A.onAfterShadow(s,A,D,O,X,Q,null)}}let V=A.children;for(let X=0,ee=V.length;X<ee;X++)x(V[X],D,O,b,v)}function E(A){A.target.removeEventListener("dispose",E);for(let O in c){let b=c[O],v=A.target.uuid;v in b&&(b[v].dispose(),delete b[v])}}}var Ox={[ma]:ga,[_a]:va,[xa]:Ma,[Bi]:ya,[ga]:ma,[va]:_a,[Ma]:xa,[ya]:Bi};function Bx(s,e){function t(){let W=!1,we=new rt,Me=null,De=new rt(0,0,0,0);return{setMask:function(Se){Me!==Se&&!W&&(s.colorMask(Se,Se,Se,Se),Me=Se)},setLocked:function(Se){W=Se},setClear:function(Se,ge,Ue,Ye,pt){pt===!0&&(Se*=Ye,ge*=Ye,Ue*=Ye),we.set(Se,ge,Ue,Ye),De.equals(we)===!1&&(s.clearColor(Se,ge,Ue,Ye),De.copy(we))},reset:function(){W=!1,Me=null,De.set(-1,0,0,0)}}}function n(){let W=!1,we=!1,Me=null,De=null,Se=null;return{setReversed:function(ge){if(we!==ge){let Ue=e.get("EXT_clip_control");ge?Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.ZERO_TO_ONE_EXT):Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.NEGATIVE_ONE_TO_ONE_EXT),we=ge;let Ye=Se;Se=null,this.setClear(Ye)}},getReversed:function(){return we},setTest:function(ge){ge?$(s.DEPTH_TEST):le(s.DEPTH_TEST)},setMask:function(ge){Me!==ge&&!W&&(s.depthMask(ge),Me=ge)},setFunc:function(ge){if(we&&(ge=Ox[ge]),De!==ge){switch(ge){case ma:s.depthFunc(s.NEVER);break;case ga:s.depthFunc(s.ALWAYS);break;case _a:s.depthFunc(s.LESS);break;case Bi:s.depthFunc(s.LEQUAL);break;case xa:s.depthFunc(s.EQUAL);break;case ya:s.depthFunc(s.GEQUAL);break;case va:s.depthFunc(s.GREATER);break;case Ma:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}De=ge}},setLocked:function(ge){W=ge},setClear:function(ge){Se!==ge&&(we&&(ge=1-ge),s.clearDepth(ge),Se=ge)},reset:function(){W=!1,Me=null,De=null,Se=null,we=!1}}}function i(){let W=!1,we=null,Me=null,De=null,Se=null,ge=null,Ue=null,Ye=null,pt=null;return{setTest:function(at){W||(at?$(s.STENCIL_TEST):le(s.STENCIL_TEST))},setMask:function(at){we!==at&&!W&&(s.stencilMask(at),we=at)},setFunc:function(at,Zn,Pn){(Me!==at||De!==Zn||Se!==Pn)&&(s.stencilFunc(at,Zn,Pn),Me=at,De=Zn,Se=Pn)},setOp:function(at,Zn,Pn){(ge!==at||Ue!==Zn||Ye!==Pn)&&(s.stencilOp(at,Zn,Pn),ge=at,Ue=Zn,Ye=Pn)},setLocked:function(at){W=at},setClear:function(at){pt!==at&&(s.clearStencil(at),pt=at)},reset:function(){W=!1,we=null,Me=null,De=null,Se=null,ge=null,Ue=null,Ye=null,pt=null}}}let r=new t,o=new n,a=new i,l=new WeakMap,c=new WeakMap,h={},u={},f=new WeakMap,d=[],p=null,_=!1,g=null,m=null,M=null,y=null,x=null,E=null,A=null,D=new ze(0,0,0),O=0,b=!1,v=null,I=null,V=null,X=null,ee=null,Q=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),C=!1,L=0,w=s.getParameter(s.VERSION);w.indexOf("WebGL")!==-1?(L=parseFloat(/^WebGL (\d)/.exec(w)[1]),C=L>=1):w.indexOf("OpenGL ES")!==-1&&(L=parseFloat(/^OpenGL ES (\d)/.exec(w)[1]),C=L>=2);let H=null,G={},F=s.getParameter(s.SCISSOR_BOX),te=s.getParameter(s.VIEWPORT),U=new rt().fromArray(F),ue=new rt().fromArray(te);function re(W,we,Me,De){let Se=new Uint8Array(4),ge=s.createTexture();s.bindTexture(W,ge),s.texParameteri(W,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(W,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ue=0;Ue<Me;Ue++)W===s.TEXTURE_3D||W===s.TEXTURE_2D_ARRAY?s.texImage3D(we,0,s.RGBA,1,1,De,0,s.RGBA,s.UNSIGNED_BYTE,Se):s.texImage2D(we+Ue,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Se);return ge}let B={};B[s.TEXTURE_2D]=re(s.TEXTURE_2D,s.TEXTURE_2D,1),B[s.TEXTURE_CUBE_MAP]=re(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),B[s.TEXTURE_2D_ARRAY]=re(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),B[s.TEXTURE_3D]=re(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),$(s.DEPTH_TEST),o.setFunc(Bi),ne(!1),Y(pl),$(s.CULL_FACE),ie(li);function $(W){h[W]!==!0&&(s.enable(W),h[W]=!0)}function le(W){h[W]!==!1&&(s.disable(W),h[W]=!1)}function be(W,we){return u[W]!==we?(s.bindFramebuffer(W,we),u[W]=we,W===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=we),W===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=we),!0):!1}function xe(W,we){let Me=d,De=!1;if(W){Me=f.get(we),Me===void 0&&(Me=[],f.set(we,Me));let Se=W.textures;if(Me.length!==Se.length||Me[0]!==s.COLOR_ATTACHMENT0){for(let ge=0,Ue=Se.length;ge<Ue;ge++)Me[ge]=s.COLOR_ATTACHMENT0+ge;Me.length=Se.length,De=!0}}else Me[0]!==s.BACK&&(Me[0]=s.BACK,De=!0);De&&s.drawBuffers(Me)}function Re(W){return p!==W?(s.useProgram(W),p=W,!0):!1}let Ee={[xi]:s.FUNC_ADD,[Ou]:s.FUNC_SUBTRACT,[Bu]:s.FUNC_REVERSE_SUBTRACT};Ee[ku]=s.MIN,Ee[zu]=s.MAX;let P={[Hu]:s.ZERO,[Vu]:s.ONE,[Gu]:s.SRC_COLOR,[Wo]:s.SRC_ALPHA,[Zu]:s.SRC_ALPHA_SATURATE,[Yu]:s.DST_COLOR,[Xu]:s.DST_ALPHA,[Wu]:s.ONE_MINUS_SRC_COLOR,[Xo]:s.ONE_MINUS_SRC_ALPHA,[$u]:s.ONE_MINUS_DST_COLOR,[qu]:s.ONE_MINUS_DST_ALPHA,[Ku]:s.CONSTANT_COLOR,[Ju]:s.ONE_MINUS_CONSTANT_COLOR,[ju]:s.CONSTANT_ALPHA,[Qu]:s.ONE_MINUS_CONSTANT_ALPHA};function ie(W,we,Me,De,Se,ge,Ue,Ye,pt,at){if(W===li){_===!0&&(le(s.BLEND),_=!1);return}if(_===!1&&($(s.BLEND),_=!0),W!==Fu){if(W!==g||at!==b){if((m!==xi||x!==xi)&&(s.blendEquation(s.FUNC_ADD),m=xi,x=xi),at)switch(W){case Oi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case gl:s.blendFunc(s.ONE,s.ONE);break;case _l:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case xl:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case Oi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case gl:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case _l:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case xl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}M=null,y=null,E=null,A=null,D.set(0,0,0),O=0,g=W,b=at}return}Se=Se||we,ge=ge||Me,Ue=Ue||De,(we!==m||Se!==x)&&(s.blendEquationSeparate(Ee[we],Ee[Se]),m=we,x=Se),(Me!==M||De!==y||ge!==E||Ue!==A)&&(s.blendFuncSeparate(P[Me],P[De],P[ge],P[Ue]),M=Me,y=De,E=ge,A=Ue),(Ye.equals(D)===!1||pt!==O)&&(s.blendColor(Ye.r,Ye.g,Ye.b,pt),D.copy(Ye),O=pt),g=W,b=!1}function oe(W,we){W.side===_t?le(s.CULL_FACE):$(s.CULL_FACE);let Me=W.side===Xt;we&&(Me=!Me),ne(Me),W.blending===Oi&&W.transparent===!1?ie(li):ie(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),o.setFunc(W.depthFunc),o.setTest(W.depthTest),o.setMask(W.depthWrite),r.setMask(W.colorWrite);let De=W.stencilWrite;a.setTest(De),De&&(a.setMask(W.stencilWriteMask),a.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),a.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),de(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?$(s.SAMPLE_ALPHA_TO_COVERAGE):le(s.SAMPLE_ALPHA_TO_COVERAGE)}function ne(W){v!==W&&(W?s.frontFace(s.CW):s.frontFace(s.CCW),v=W)}function Y(W){W!==Nu?($(s.CULL_FACE),W!==I&&(W===pl?s.cullFace(s.BACK):W===Uu?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):le(s.CULL_FACE),I=W}function me(W){W!==V&&(C&&s.lineWidth(W),V=W)}function de(W,we,Me){W?($(s.POLYGON_OFFSET_FILL),(X!==we||ee!==Me)&&(s.polygonOffset(we,Me),X=we,ee=Me)):le(s.POLYGON_OFFSET_FILL)}function ye(W){W?$(s.SCISSOR_TEST):le(s.SCISSOR_TEST)}function Fe(W){W===void 0&&(W=s.TEXTURE0+Q-1),H!==W&&(s.activeTexture(W),H=W)}function Be(W,we,Me){Me===void 0&&(H===null?Me=s.TEXTURE0+Q-1:Me=H);let De=G[Me];De===void 0&&(De={type:void 0,texture:void 0},G[Me]=De),(De.type!==W||De.texture!==we)&&(H!==Me&&(s.activeTexture(Me),H=Me),s.bindTexture(W,we||B[W]),De.type=W,De.texture=we)}function R(){let W=G[H];W!==void 0&&W.type!==void 0&&(s.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function S(){try{s.compressedTexImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function K(){try{s.compressedTexImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ce(){try{s.texSubImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ve(){try{s.texSubImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function he(){try{s.compressedTexSubImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function z(){try{s.compressedTexSubImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function k(){try{s.texStorage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function q(){try{s.texStorage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function fe(){try{s.texImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function j(){try{s.texImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function pe(W){U.equals(W)===!1&&(s.scissor(W.x,W.y,W.z,W.w),U.copy(W))}function Pe(W){ue.equals(W)===!1&&(s.viewport(W.x,W.y,W.z,W.w),ue.copy(W))}function Le(W,we){let Me=c.get(we);Me===void 0&&(Me=new WeakMap,c.set(we,Me));let De=Me.get(W);De===void 0&&(De=s.getUniformBlockIndex(we,W.name),Me.set(W,De))}function Te(W,we){let De=c.get(we).get(W);l.get(we)!==De&&(s.uniformBlockBinding(we,De,W.__bindingPointIndex),l.set(we,De))}function ke(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},H=null,G={},u={},f=new WeakMap,d=[],p=null,_=!1,g=null,m=null,M=null,y=null,x=null,E=null,A=null,D=new ze(0,0,0),O=0,b=!1,v=null,I=null,V=null,X=null,ee=null,U.set(0,0,s.canvas.width,s.canvas.height),ue.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:$,disable:le,bindFramebuffer:be,drawBuffers:xe,useProgram:Re,setBlending:ie,setMaterial:oe,setFlipSided:ne,setCullFace:Y,setLineWidth:me,setPolygonOffset:de,setScissorTest:ye,activeTexture:Fe,bindTexture:Be,unbindTexture:R,compressedTexImage2D:S,compressedTexImage3D:K,texImage2D:fe,texImage3D:j,updateUBOMapping:Le,uniformBlockBinding:Te,texStorage2D:k,texStorage3D:q,texSubImage2D:ce,texSubImage3D:ve,compressedTexSubImage2D:he,compressedTexSubImage3D:z,scissor:pe,viewport:Pe,reset:ke}}function kx(s,e,t,n,i,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new _e,h=new WeakMap,u,f=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(R,S){return d?new OffscreenCanvas(R,S):Es("canvas")}function _(R,S,K){let ce=1,ve=Be(R);if((ve.width>K||ve.height>K)&&(ce=K/Math.max(ve.width,ve.height)),ce<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let he=Math.floor(ce*ve.width),z=Math.floor(ce*ve.height);u===void 0&&(u=p(he,z));let k=S?p(he,z):u;return k.width=he,k.height=z,k.getContext("2d").drawImage(R,0,0,he,z),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ve.width+"x"+ve.height+") to ("+he+"x"+z+")."),k}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ve.width+"x"+ve.height+")."),R;return R}function g(R){return R.generateMipmaps}function m(R){s.generateMipmap(R)}function M(R){return R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?s.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(R,S,K,ce,ve=!1){if(R!==null){if(s[R]!==void 0)return s[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let he=S;if(S===s.RED&&(K===s.FLOAT&&(he=s.R32F),K===s.HALF_FLOAT&&(he=s.R16F),K===s.UNSIGNED_BYTE&&(he=s.R8)),S===s.RED_INTEGER&&(K===s.UNSIGNED_BYTE&&(he=s.R8UI),K===s.UNSIGNED_SHORT&&(he=s.R16UI),K===s.UNSIGNED_INT&&(he=s.R32UI),K===s.BYTE&&(he=s.R8I),K===s.SHORT&&(he=s.R16I),K===s.INT&&(he=s.R32I)),S===s.RG&&(K===s.FLOAT&&(he=s.RG32F),K===s.HALF_FLOAT&&(he=s.RG16F),K===s.UNSIGNED_BYTE&&(he=s.RG8)),S===s.RG_INTEGER&&(K===s.UNSIGNED_BYTE&&(he=s.RG8UI),K===s.UNSIGNED_SHORT&&(he=s.RG16UI),K===s.UNSIGNED_INT&&(he=s.RG32UI),K===s.BYTE&&(he=s.RG8I),K===s.SHORT&&(he=s.RG16I),K===s.INT&&(he=s.RG32I)),S===s.RGB_INTEGER&&(K===s.UNSIGNED_BYTE&&(he=s.RGB8UI),K===s.UNSIGNED_SHORT&&(he=s.RGB16UI),K===s.UNSIGNED_INT&&(he=s.RGB32UI),K===s.BYTE&&(he=s.RGB8I),K===s.SHORT&&(he=s.RGB16I),K===s.INT&&(he=s.RGB32I)),S===s.RGBA_INTEGER&&(K===s.UNSIGNED_BYTE&&(he=s.RGBA8UI),K===s.UNSIGNED_SHORT&&(he=s.RGBA16UI),K===s.UNSIGNED_INT&&(he=s.RGBA32UI),K===s.BYTE&&(he=s.RGBA8I),K===s.SHORT&&(he=s.RGBA16I),K===s.INT&&(he=s.RGBA32I)),S===s.RGB&&(K===s.UNSIGNED_INT_5_9_9_9_REV&&(he=s.RGB9_E5),K===s.UNSIGNED_INT_10F_11F_11F_REV&&(he=s.R11F_G11F_B10F)),S===s.RGBA){let z=ve?gr:tt.getTransfer(ce);K===s.FLOAT&&(he=s.RGBA32F),K===s.HALF_FLOAT&&(he=s.RGBA16F),K===s.UNSIGNED_BYTE&&(he=z===lt?s.SRGB8_ALPHA8:s.RGBA8),K===s.UNSIGNED_SHORT_4_4_4_4&&(he=s.RGBA4),K===s.UNSIGNED_SHORT_5_5_5_1&&(he=s.RGB5_A1)}return(he===s.R16F||he===s.R32F||he===s.RG16F||he===s.RG32F||he===s.RGBA16F||he===s.RGBA32F)&&e.get("EXT_color_buffer_float"),he}function x(R,S){let K;return R?S===null||S===Ri||S===Vs?K=s.DEPTH24_STENCIL8:S===pn?K=s.DEPTH32F_STENCIL8:S===zs&&(K=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Ri||S===Vs?K=s.DEPTH_COMPONENT24:S===pn?K=s.DEPTH_COMPONENT32F:S===zs&&(K=s.DEPTH_COMPONENT16),K}function E(R,S){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==Ut&&R.minFilter!==Gt?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function A(R){let S=R.target;S.removeEventListener("dispose",A),O(S),S.isVideoTexture&&h.delete(S)}function D(R){let S=R.target;S.removeEventListener("dispose",D),v(S)}function O(R){let S=n.get(R);if(S.__webglInit===void 0)return;let K=R.source,ce=f.get(K);if(ce){let ve=ce[S.__cacheKey];ve.usedTimes--,ve.usedTimes===0&&b(R),Object.keys(ce).length===0&&f.delete(K)}n.remove(R)}function b(R){let S=n.get(R);s.deleteTexture(S.__webglTexture);let K=R.source,ce=f.get(K);delete ce[S.__cacheKey],o.memory.textures--}function v(R){let S=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let ce=0;ce<6;ce++){if(Array.isArray(S.__webglFramebuffer[ce]))for(let ve=0;ve<S.__webglFramebuffer[ce].length;ve++)s.deleteFramebuffer(S.__webglFramebuffer[ce][ve]);else s.deleteFramebuffer(S.__webglFramebuffer[ce]);S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer[ce])}else{if(Array.isArray(S.__webglFramebuffer))for(let ce=0;ce<S.__webglFramebuffer.length;ce++)s.deleteFramebuffer(S.__webglFramebuffer[ce]);else s.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&s.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let ce=0;ce<S.__webglColorRenderbuffer.length;ce++)S.__webglColorRenderbuffer[ce]&&s.deleteRenderbuffer(S.__webglColorRenderbuffer[ce]);S.__webglDepthRenderbuffer&&s.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let K=R.textures;for(let ce=0,ve=K.length;ce<ve;ce++){let he=n.get(K[ce]);he.__webglTexture&&(s.deleteTexture(he.__webglTexture),o.memory.textures--),n.remove(K[ce])}n.remove(R)}let I=0;function V(){I=0}function X(){let R=I;return R>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+i.maxTextures),I+=1,R}function ee(R){let S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function Q(R,S){let K=n.get(R);if(R.isVideoTexture&&ye(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&K.__version!==R.version){let ce=R.image;if(ce===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ce.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{B(K,R,S);return}}else R.isExternalTexture&&(K.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,K.__webglTexture,s.TEXTURE0+S)}function C(R,S){let K=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&K.__version!==R.version){B(K,R,S);return}t.bindTexture(s.TEXTURE_2D_ARRAY,K.__webglTexture,s.TEXTURE0+S)}function L(R,S){let K=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&K.__version!==R.version){B(K,R,S);return}t.bindTexture(s.TEXTURE_3D,K.__webglTexture,s.TEXTURE0+S)}function w(R,S){let K=n.get(R);if(R.version>0&&K.__version!==R.version){$(K,R,S);return}t.bindTexture(s.TEXTURE_CUBE_MAP,K.__webglTexture,s.TEXTURE0+S)}let H={[yi]:s.REPEAT,[Ln]:s.CLAMP_TO_EDGE,[bs]:s.MIRRORED_REPEAT},G={[Ut]:s.NEAREST,[Ta]:s.NEAREST_MIPMAP_NEAREST,[ji]:s.NEAREST_MIPMAP_LINEAR,[Gt]:s.LINEAR,[ks]:s.LINEAR_MIPMAP_NEAREST,[An]:s.LINEAR_MIPMAP_LINEAR},F={[fd]:s.NEVER,[yd]:s.ALWAYS,[pd]:s.LESS,[Il]:s.LEQUAL,[md]:s.EQUAL,[xd]:s.GEQUAL,[gd]:s.GREATER,[_d]:s.NOTEQUAL};function te(R,S){if(S.type===pn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===Gt||S.magFilter===ks||S.magFilter===ji||S.magFilter===An||S.minFilter===Gt||S.minFilter===ks||S.minFilter===ji||S.minFilter===An)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,H[S.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,H[S.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,H[S.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,G[S.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,G[S.minFilter]),S.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,F[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Ut||S.minFilter!==ji&&S.minFilter!==An||S.type===pn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){let K=e.get("EXT_texture_filter_anisotropic");s.texParameterf(R,K.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,i.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function U(R,S){let K=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",A));let ce=S.source,ve=f.get(ce);ve===void 0&&(ve={},f.set(ce,ve));let he=ee(S);if(he!==R.__cacheKey){ve[he]===void 0&&(ve[he]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,K=!0),ve[he].usedTimes++;let z=ve[R.__cacheKey];z!==void 0&&(ve[R.__cacheKey].usedTimes--,z.usedTimes===0&&b(S)),R.__cacheKey=he,R.__webglTexture=ve[he].texture}return K}function ue(R,S,K){return Math.floor(Math.floor(R/K)/S)}function re(R,S,K,ce){let he=R.updateRanges;if(he.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,S.width,S.height,K,ce,S.data);else{he.sort((j,pe)=>j.start-pe.start);let z=0;for(let j=1;j<he.length;j++){let pe=he[z],Pe=he[j],Le=pe.start+pe.count,Te=ue(Pe.start,S.width,4),ke=ue(pe.start,S.width,4);Pe.start<=Le+1&&Te===ke&&ue(Pe.start+Pe.count-1,S.width,4)===Te?pe.count=Math.max(pe.count,Pe.start+Pe.count-pe.start):(++z,he[z]=Pe)}he.length=z+1;let k=s.getParameter(s.UNPACK_ROW_LENGTH),q=s.getParameter(s.UNPACK_SKIP_PIXELS),fe=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,S.width);for(let j=0,pe=he.length;j<pe;j++){let Pe=he[j],Le=Math.floor(Pe.start/4),Te=Math.ceil(Pe.count/4),ke=Le%S.width,W=Math.floor(Le/S.width),we=Te,Me=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,ke),s.pixelStorei(s.UNPACK_SKIP_ROWS,W),t.texSubImage2D(s.TEXTURE_2D,0,ke,W,we,Me,K,ce,S.data)}R.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,k),s.pixelStorei(s.UNPACK_SKIP_PIXELS,q),s.pixelStorei(s.UNPACK_SKIP_ROWS,fe)}}function B(R,S,K){let ce=s.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(ce=s.TEXTURE_2D_ARRAY),S.isData3DTexture&&(ce=s.TEXTURE_3D);let ve=U(R,S),he=S.source;t.bindTexture(ce,R.__webglTexture,s.TEXTURE0+K);let z=n.get(he);if(he.version!==z.__version||ve===!0){t.activeTexture(s.TEXTURE0+K);let k=tt.getPrimaries(tt.workingColorSpace),q=S.colorSpace===ui?null:tt.getPrimaries(S.colorSpace),fe=S.colorSpace===ui||k===q?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,fe);let j=_(S.image,!1,i.maxTextureSize);j=Fe(S,j);let pe=r.convert(S.format,S.colorSpace),Pe=r.convert(S.type),Le=y(S.internalFormat,pe,Pe,S.colorSpace,S.isVideoTexture);te(ce,S);let Te,ke=S.mipmaps,W=S.isVideoTexture!==!0,we=z.__version===void 0||ve===!0,Me=he.dataReady,De=E(S,j);if(S.isDepthTexture)Le=x(S.format===Gs,S.type),we&&(W?t.texStorage2D(s.TEXTURE_2D,1,Le,j.width,j.height):t.texImage2D(s.TEXTURE_2D,0,Le,j.width,j.height,0,pe,Pe,null));else if(S.isDataTexture)if(ke.length>0){W&&we&&t.texStorage2D(s.TEXTURE_2D,De,Le,ke[0].width,ke[0].height);for(let Se=0,ge=ke.length;Se<ge;Se++)Te=ke[Se],W?Me&&t.texSubImage2D(s.TEXTURE_2D,Se,0,0,Te.width,Te.height,pe,Pe,Te.data):t.texImage2D(s.TEXTURE_2D,Se,Le,Te.width,Te.height,0,pe,Pe,Te.data);S.generateMipmaps=!1}else W?(we&&t.texStorage2D(s.TEXTURE_2D,De,Le,j.width,j.height),Me&&re(S,j,pe,Pe)):t.texImage2D(s.TEXTURE_2D,0,Le,j.width,j.height,0,pe,Pe,j.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){W&&we&&t.texStorage3D(s.TEXTURE_2D_ARRAY,De,Le,ke[0].width,ke[0].height,j.depth);for(let Se=0,ge=ke.length;Se<ge;Se++)if(Te=ke[Se],S.format!==an)if(pe!==null)if(W){if(Me)if(S.layerUpdates.size>0){let Ue=Bl(Te.width,Te.height,S.format,S.type);for(let Ye of S.layerUpdates){let pt=Te.data.subarray(Ye*Ue/Te.data.BYTES_PER_ELEMENT,(Ye+1)*Ue/Te.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Se,0,0,Ye,Te.width,Te.height,1,pe,pt)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Se,0,0,0,Te.width,Te.height,j.depth,pe,Te.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,Se,Le,Te.width,Te.height,j.depth,0,Te.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else W?Me&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,Se,0,0,0,Te.width,Te.height,j.depth,pe,Pe,Te.data):t.texImage3D(s.TEXTURE_2D_ARRAY,Se,Le,Te.width,Te.height,j.depth,0,pe,Pe,Te.data)}else{W&&we&&t.texStorage2D(s.TEXTURE_2D,De,Le,ke[0].width,ke[0].height);for(let Se=0,ge=ke.length;Se<ge;Se++)Te=ke[Se],S.format!==an?pe!==null?W?Me&&t.compressedTexSubImage2D(s.TEXTURE_2D,Se,0,0,Te.width,Te.height,pe,Te.data):t.compressedTexImage2D(s.TEXTURE_2D,Se,Le,Te.width,Te.height,0,Te.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):W?Me&&t.texSubImage2D(s.TEXTURE_2D,Se,0,0,Te.width,Te.height,pe,Pe,Te.data):t.texImage2D(s.TEXTURE_2D,Se,Le,Te.width,Te.height,0,pe,Pe,Te.data)}else if(S.isDataArrayTexture)if(W){if(we&&t.texStorage3D(s.TEXTURE_2D_ARRAY,De,Le,j.width,j.height,j.depth),Me)if(S.layerUpdates.size>0){let Se=Bl(j.width,j.height,S.format,S.type);for(let ge of S.layerUpdates){let Ue=j.data.subarray(ge*Se/j.data.BYTES_PER_ELEMENT,(ge+1)*Se/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ge,j.width,j.height,1,pe,Pe,Ue)}S.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,pe,Pe,j.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Le,j.width,j.height,j.depth,0,pe,Pe,j.data);else if(S.isData3DTexture)W?(we&&t.texStorage3D(s.TEXTURE_3D,De,Le,j.width,j.height,j.depth),Me&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,pe,Pe,j.data)):t.texImage3D(s.TEXTURE_3D,0,Le,j.width,j.height,j.depth,0,pe,Pe,j.data);else if(S.isFramebufferTexture){if(we)if(W)t.texStorage2D(s.TEXTURE_2D,De,Le,j.width,j.height);else{let Se=j.width,ge=j.height;for(let Ue=0;Ue<De;Ue++)t.texImage2D(s.TEXTURE_2D,Ue,Le,Se,ge,0,pe,Pe,null),Se>>=1,ge>>=1}}else if(ke.length>0){if(W&&we){let Se=Be(ke[0]);t.texStorage2D(s.TEXTURE_2D,De,Le,Se.width,Se.height)}for(let Se=0,ge=ke.length;Se<ge;Se++)Te=ke[Se],W?Me&&t.texSubImage2D(s.TEXTURE_2D,Se,0,0,pe,Pe,Te):t.texImage2D(s.TEXTURE_2D,Se,Le,pe,Pe,Te);S.generateMipmaps=!1}else if(W){if(we){let Se=Be(j);t.texStorage2D(s.TEXTURE_2D,De,Le,Se.width,Se.height)}Me&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,pe,Pe,j)}else t.texImage2D(s.TEXTURE_2D,0,Le,pe,Pe,j);g(S)&&m(ce),z.__version=he.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function $(R,S,K){if(S.image.length!==6)return;let ce=U(R,S),ve=S.source;t.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+K);let he=n.get(ve);if(ve.version!==he.__version||ce===!0){t.activeTexture(s.TEXTURE0+K);let z=tt.getPrimaries(tt.workingColorSpace),k=S.colorSpace===ui?null:tt.getPrimaries(S.colorSpace),q=S.colorSpace===ui||z===k?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,q);let fe=S.isCompressedTexture||S.image[0].isCompressedTexture,j=S.image[0]&&S.image[0].isDataTexture,pe=[];for(let ge=0;ge<6;ge++)!fe&&!j?pe[ge]=_(S.image[ge],!0,i.maxCubemapSize):pe[ge]=j?S.image[ge].image:S.image[ge],pe[ge]=Fe(S,pe[ge]);let Pe=pe[0],Le=r.convert(S.format,S.colorSpace),Te=r.convert(S.type),ke=y(S.internalFormat,Le,Te,S.colorSpace),W=S.isVideoTexture!==!0,we=he.__version===void 0||ce===!0,Me=ve.dataReady,De=E(S,Pe);te(s.TEXTURE_CUBE_MAP,S);let Se;if(fe){W&&we&&t.texStorage2D(s.TEXTURE_CUBE_MAP,De,ke,Pe.width,Pe.height);for(let ge=0;ge<6;ge++){Se=pe[ge].mipmaps;for(let Ue=0;Ue<Se.length;Ue++){let Ye=Se[Ue];S.format!==an?Le!==null?W?Me&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ue,0,0,Ye.width,Ye.height,Le,Ye.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ue,ke,Ye.width,Ye.height,0,Ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):W?Me&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ue,0,0,Ye.width,Ye.height,Le,Te,Ye.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ue,ke,Ye.width,Ye.height,0,Le,Te,Ye.data)}}}else{if(Se=S.mipmaps,W&&we){Se.length>0&&De++;let ge=Be(pe[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,De,ke,ge.width,ge.height)}for(let ge=0;ge<6;ge++)if(j){W?Me&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,pe[ge].width,pe[ge].height,Le,Te,pe[ge].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,ke,pe[ge].width,pe[ge].height,0,Le,Te,pe[ge].data);for(let Ue=0;Ue<Se.length;Ue++){let pt=Se[Ue].image[ge].image;W?Me&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ue+1,0,0,pt.width,pt.height,Le,Te,pt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ue+1,ke,pt.width,pt.height,0,Le,Te,pt.data)}}else{W?Me&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,Le,Te,pe[ge]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,ke,Le,Te,pe[ge]);for(let Ue=0;Ue<Se.length;Ue++){let Ye=Se[Ue];W?Me&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ue+1,0,0,Le,Te,Ye.image[ge]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ue+1,ke,Le,Te,Ye.image[ge])}}}g(S)&&m(s.TEXTURE_CUBE_MAP),he.__version=ve.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function le(R,S,K,ce,ve,he){let z=r.convert(K.format,K.colorSpace),k=r.convert(K.type),q=y(K.internalFormat,z,k,K.colorSpace),fe=n.get(S),j=n.get(K);if(j.__renderTarget=S,!fe.__hasExternalTextures){let pe=Math.max(1,S.width>>he),Pe=Math.max(1,S.height>>he);ve===s.TEXTURE_3D||ve===s.TEXTURE_2D_ARRAY?t.texImage3D(ve,he,q,pe,Pe,S.depth,0,z,k,null):t.texImage2D(ve,he,q,pe,Pe,0,z,k,null)}t.bindFramebuffer(s.FRAMEBUFFER,R),de(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ce,ve,j.__webglTexture,0,me(S)):(ve===s.TEXTURE_2D||ve>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ve<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,ce,ve,j.__webglTexture,he),t.bindFramebuffer(s.FRAMEBUFFER,null)}function be(R,S,K){if(s.bindRenderbuffer(s.RENDERBUFFER,R),S.depthBuffer){let ce=S.depthTexture,ve=ce&&ce.isDepthTexture?ce.type:null,he=x(S.stencilBuffer,ve),z=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,k=me(S);de(S)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,k,he,S.width,S.height):K?s.renderbufferStorageMultisample(s.RENDERBUFFER,k,he,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,he,S.width,S.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,z,s.RENDERBUFFER,R)}else{let ce=S.textures;for(let ve=0;ve<ce.length;ve++){let he=ce[ve],z=r.convert(he.format,he.colorSpace),k=r.convert(he.type),q=y(he.internalFormat,z,k,he.colorSpace),fe=me(S);K&&de(S)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,fe,q,S.width,S.height):de(S)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,fe,q,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,q,S.width,S.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function xe(R,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let ce=n.get(S.depthTexture);ce.__renderTarget=S,(!ce.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),Q(S.depthTexture,0);let ve=ce.__webglTexture,he=me(S);if(S.depthTexture.format===Ss)de(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ve,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ve,0);else if(S.depthTexture.format===Gs)de(S)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ve,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ve,0);else throw new Error("Unknown depthTexture format")}function Re(R){let S=n.get(R),K=R.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==R.depthTexture){let ce=R.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),ce){let ve=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,ce.removeEventListener("dispose",ve)};ce.addEventListener("dispose",ve),S.__depthDisposeCallback=ve}S.__boundDepthTexture=ce}if(R.depthTexture&&!S.__autoAllocateDepthBuffer){if(K)throw new Error("target.depthTexture not supported in Cube render targets");let ce=R.texture.mipmaps;ce&&ce.length>0?xe(S.__webglFramebuffer[0],R):xe(S.__webglFramebuffer,R)}else if(K){S.__webglDepthbuffer=[];for(let ce=0;ce<6;ce++)if(t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer[ce]),S.__webglDepthbuffer[ce]===void 0)S.__webglDepthbuffer[ce]=s.createRenderbuffer(),be(S.__webglDepthbuffer[ce],R,!1);else{let ve=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,he=S.__webglDepthbuffer[ce];s.bindRenderbuffer(s.RENDERBUFFER,he),s.framebufferRenderbuffer(s.FRAMEBUFFER,ve,s.RENDERBUFFER,he)}}else{let ce=R.texture.mipmaps;if(ce&&ce.length>0?t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=s.createRenderbuffer(),be(S.__webglDepthbuffer,R,!1);else{let ve=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,he=S.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,he),s.framebufferRenderbuffer(s.FRAMEBUFFER,ve,s.RENDERBUFFER,he)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ee(R,S,K){let ce=n.get(R);S!==void 0&&le(ce.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),K!==void 0&&Re(R)}function P(R){let S=R.texture,K=n.get(R),ce=n.get(S);R.addEventListener("dispose",D);let ve=R.textures,he=R.isWebGLCubeRenderTarget===!0,z=ve.length>1;if(z||(ce.__webglTexture===void 0&&(ce.__webglTexture=s.createTexture()),ce.__version=S.version,o.memory.textures++),he){K.__webglFramebuffer=[];for(let k=0;k<6;k++)if(S.mipmaps&&S.mipmaps.length>0){K.__webglFramebuffer[k]=[];for(let q=0;q<S.mipmaps.length;q++)K.__webglFramebuffer[k][q]=s.createFramebuffer()}else K.__webglFramebuffer[k]=s.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){K.__webglFramebuffer=[];for(let k=0;k<S.mipmaps.length;k++)K.__webglFramebuffer[k]=s.createFramebuffer()}else K.__webglFramebuffer=s.createFramebuffer();if(z)for(let k=0,q=ve.length;k<q;k++){let fe=n.get(ve[k]);fe.__webglTexture===void 0&&(fe.__webglTexture=s.createTexture(),o.memory.textures++)}if(R.samples>0&&de(R)===!1){K.__webglMultisampledFramebuffer=s.createFramebuffer(),K.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,K.__webglMultisampledFramebuffer);for(let k=0;k<ve.length;k++){let q=ve[k];K.__webglColorRenderbuffer[k]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,K.__webglColorRenderbuffer[k]);let fe=r.convert(q.format,q.colorSpace),j=r.convert(q.type),pe=y(q.internalFormat,fe,j,q.colorSpace,R.isXRRenderTarget===!0),Pe=me(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,Pe,pe,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+k,s.RENDERBUFFER,K.__webglColorRenderbuffer[k])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(K.__webglDepthRenderbuffer=s.createRenderbuffer(),be(K.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(he){t.bindTexture(s.TEXTURE_CUBE_MAP,ce.__webglTexture),te(s.TEXTURE_CUBE_MAP,S);for(let k=0;k<6;k++)if(S.mipmaps&&S.mipmaps.length>0)for(let q=0;q<S.mipmaps.length;q++)le(K.__webglFramebuffer[k][q],R,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+k,q);else le(K.__webglFramebuffer[k],R,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+k,0);g(S)&&m(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(z){for(let k=0,q=ve.length;k<q;k++){let fe=ve[k],j=n.get(fe),pe=s.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(pe=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(pe,j.__webglTexture),te(pe,fe),le(K.__webglFramebuffer,R,fe,s.COLOR_ATTACHMENT0+k,pe,0),g(fe)&&m(pe)}t.unbindTexture()}else{let k=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(k=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(k,ce.__webglTexture),te(k,S),S.mipmaps&&S.mipmaps.length>0)for(let q=0;q<S.mipmaps.length;q++)le(K.__webglFramebuffer[q],R,S,s.COLOR_ATTACHMENT0,k,q);else le(K.__webglFramebuffer,R,S,s.COLOR_ATTACHMENT0,k,0);g(S)&&m(k),t.unbindTexture()}R.depthBuffer&&Re(R)}function ie(R){let S=R.textures;for(let K=0,ce=S.length;K<ce;K++){let ve=S[K];if(g(ve)){let he=M(R),z=n.get(ve).__webglTexture;t.bindTexture(he,z),m(he),t.unbindTexture()}}}let oe=[],ne=[];function Y(R){if(R.samples>0){if(de(R)===!1){let S=R.textures,K=R.width,ce=R.height,ve=s.COLOR_BUFFER_BIT,he=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,z=n.get(R),k=S.length>1;if(k)for(let fe=0;fe<S.length;fe++)t.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,z.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,z.__webglMultisampledFramebuffer);let q=R.texture.mipmaps;q&&q.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,z.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,z.__webglFramebuffer);for(let fe=0;fe<S.length;fe++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ve|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ve|=s.STENCIL_BUFFER_BIT)),k){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,z.__webglColorRenderbuffer[fe]);let j=n.get(S[fe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,j,0)}s.blitFramebuffer(0,0,K,ce,0,0,K,ce,ve,s.NEAREST),l===!0&&(oe.length=0,ne.length=0,oe.push(s.COLOR_ATTACHMENT0+fe),R.depthBuffer&&R.resolveDepthBuffer===!1&&(oe.push(he),ne.push(he),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,ne)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,oe))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),k)for(let fe=0;fe<S.length;fe++){t.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.RENDERBUFFER,z.__webglColorRenderbuffer[fe]);let j=n.get(S[fe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,z.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.TEXTURE_2D,j,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,z.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let S=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[S])}}}function me(R){return Math.min(i.maxSamples,R.samples)}function de(R){let S=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function ye(R){let S=o.render.frame;h.get(R)!==S&&(h.set(R,S),R.update())}function Fe(R,S){let K=R.colorSpace,ce=R.format,ve=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||K!==Ft&&K!==ui&&(tt.getTransfer(K)===lt?(ce!==an||ve!==Rn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",K)),S}function Be(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=X,this.resetTextureUnits=V,this.setTexture2D=Q,this.setTexture2DArray=C,this.setTexture3D=L,this.setTextureCube=w,this.rebindTextures=Ee,this.setupRenderTarget=P,this.updateRenderTargetMipmap=ie,this.updateMultisampleRenderTarget=Y,this.setupDepthRenderbuffer=Re,this.setupFrameBufferTexture=le,this.useMultisampledRTT=de}function zx(s,e){function t(n,i=ui){let r,o=tt.getTransfer(i);if(n===Rn)return s.UNSIGNED_BYTE;if(n===Aa)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Ra)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Sl)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===El)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Ml)return s.BYTE;if(n===bl)return s.SHORT;if(n===zs)return s.UNSIGNED_SHORT;if(n===wa)return s.INT;if(n===Ri)return s.UNSIGNED_INT;if(n===pn)return s.FLOAT;if(n===Hs)return s.HALF_FLOAT;if(n===Tl)return s.ALPHA;if(n===wl)return s.RGB;if(n===an)return s.RGBA;if(n===Ss)return s.DEPTH_COMPONENT;if(n===Gs)return s.DEPTH_STENCIL;if(n===Ca)return s.RED;if(n===Ia)return s.RED_INTEGER;if(n===Al)return s.RG;if(n===Pa)return s.RG_INTEGER;if(n===La)return s.RGBA_INTEGER;if(n===eo||n===to||n===no||n===io)if(o===lt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===eo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===to)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===no)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===io)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===eo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===to)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===no)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===io)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Da||n===Na||n===Ua||n===Fa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Da)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Na)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ua)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Fa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Oa||n===Ba||n===ka)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Oa||n===Ba)return o===lt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ka)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===za||n===Ha||n===Va||n===Ga||n===Wa||n===Xa||n===qa||n===Ya||n===$a||n===Za||n===Ka||n===Ja||n===ja||n===Qa)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===za)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ha)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Va)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ga)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Wa)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Xa)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===qa)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ya)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===$a)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Za)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ka)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ja)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ja)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Qa)return o===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ec||n===tc||n===nc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===ec)return o===lt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===tc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===nc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ic||n===sc||n===rc||n===oc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ic)return r.COMPRESSED_RED_RGTC1_EXT;if(n===sc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===rc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===oc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Vs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}var Hx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Vx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Jl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Pr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new sn({vertexShader:Hx,fragmentShader:Vx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ot(new zn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},jl=class extends Un{constructor(e,t){super();let n=this,i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,p=null,_=typeof XRWebGLBinding<"u",g=new Jl,m={},M=t.getContextAttributes(),y=null,x=null,E=[],A=[],D=new _e,O=null,b=new wt;b.viewport=new rt;let v=new wt;v.viewport=new rt;let I=[b,v],V=new fa,X=null,ee=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let $=E[B];return $===void 0&&($=new Rs,E[B]=$),$.getTargetRaySpace()},this.getControllerGrip=function(B){let $=E[B];return $===void 0&&($=new Rs,E[B]=$),$.getGripSpace()},this.getHand=function(B){let $=E[B];return $===void 0&&($=new Rs,E[B]=$),$.getHandSpace()};function Q(B){let $=A.indexOf(B.inputSource);if($===-1)return;let le=E[$];le!==void 0&&(le.update(B.inputSource,B.frame,c||o),le.dispatchEvent({type:B.type,data:B.inputSource}))}function C(){i.removeEventListener("select",Q),i.removeEventListener("selectstart",Q),i.removeEventListener("selectend",Q),i.removeEventListener("squeeze",Q),i.removeEventListener("squeezestart",Q),i.removeEventListener("squeezeend",Q),i.removeEventListener("end",C),i.removeEventListener("inputsourceschange",L);for(let B=0;B<E.length;B++){let $=A[B];$!==null&&(A[B]=null,E[B].disconnect($))}X=null,ee=null,g.reset();for(let B in m)delete m[B];e.setRenderTarget(y),d=null,f=null,u=null,i=null,x=null,re.stop(),n.isPresenting=!1,e.setPixelRatio(O),e.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){r=B,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){a=B,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(B){c=B},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(B){if(i=B,i!==null){if(y=e.getRenderTarget(),i.addEventListener("select",Q),i.addEventListener("selectstart",Q),i.addEventListener("selectend",Q),i.addEventListener("squeeze",Q),i.addEventListener("squeezestart",Q),i.addEventListener("squeezeend",Q),i.addEventListener("end",C),i.addEventListener("inputsourceschange",L),M.xrCompatible!==!0&&await t.makeXRCompatible(),O=e.getPixelRatio(),e.getSize(D),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let le=null,be=null,xe=null;M.depth&&(xe=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,le=M.stencil?Gs:Ss,be=M.stencil?Vs:Ri);let Re={colorFormat:t.RGBA8,depthFormat:xe,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Re),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),x=new Fn(f.textureWidth,f.textureHeight,{format:an,type:Rn,depthTexture:new Ir(f.textureWidth,f.textureHeight,be,void 0,void 0,void 0,void 0,void 0,void 0,le),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let le={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,t,le),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new Fn(d.framebufferWidth,d.framebufferHeight,{format:an,type:Rn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),re.setContext(i),re.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function L(B){for(let $=0;$<B.removed.length;$++){let le=B.removed[$],be=A.indexOf(le);be>=0&&(A[be]=null,E[be].disconnect(le))}for(let $=0;$<B.added.length;$++){let le=B.added[$],be=A.indexOf(le);if(be===-1){for(let Re=0;Re<E.length;Re++)if(Re>=A.length){A.push(le),be=Re;break}else if(A[Re]===null){A[Re]=le,be=Re;break}if(be===-1)break}let xe=E[be];xe&&xe.connect(le)}}let w=new N,H=new N;function G(B,$,le){w.setFromMatrixPosition($.matrixWorld),H.setFromMatrixPosition(le.matrixWorld);let be=w.distanceTo(H),xe=$.projectionMatrix.elements,Re=le.projectionMatrix.elements,Ee=xe[14]/(xe[10]-1),P=xe[14]/(xe[10]+1),ie=(xe[9]+1)/xe[5],oe=(xe[9]-1)/xe[5],ne=(xe[8]-1)/xe[0],Y=(Re[8]+1)/Re[0],me=Ee*ne,de=Ee*Y,ye=be/(-ne+Y),Fe=ye*-ne;if($.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(Fe),B.translateZ(ye),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert(),xe[10]===-1)B.projectionMatrix.copy($.projectionMatrix),B.projectionMatrixInverse.copy($.projectionMatrixInverse);else{let Be=Ee+ye,R=P+ye,S=me-Fe,K=de+(be-Fe),ce=ie*P/R*Be,ve=oe*P/R*Be;B.projectionMatrix.makePerspective(S,K,ce,ve,Be,R),B.projectionMatrixInverse.copy(B.projectionMatrix).invert()}}function F(B,$){$===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices($.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(i===null)return;let $=B.near,le=B.far;g.texture!==null&&(g.depthNear>0&&($=g.depthNear),g.depthFar>0&&(le=g.depthFar)),V.near=v.near=b.near=$,V.far=v.far=b.far=le,(X!==V.near||ee!==V.far)&&(i.updateRenderState({depthNear:V.near,depthFar:V.far}),X=V.near,ee=V.far),V.layers.mask=B.layers.mask|6,b.layers.mask=V.layers.mask&3,v.layers.mask=V.layers.mask&5;let be=B.parent,xe=V.cameras;F(V,be);for(let Re=0;Re<xe.length;Re++)F(xe[Re],be);xe.length===2?G(V,b,v):V.projectionMatrix.copy(b.projectionMatrix),te(B,V,be)};function te(B,$,le){le===null?B.matrix.copy($.matrixWorld):(B.matrix.copy(le.matrixWorld),B.matrix.invert(),B.matrix.multiply($.matrixWorld)),B.matrix.decompose(B.position,B.quaternion,B.scale),B.updateMatrixWorld(!0),B.projectionMatrix.copy($.projectionMatrix),B.projectionMatrixInverse.copy($.projectionMatrixInverse),B.isPerspectiveCamera&&(B.fov=Hi*2*Math.atan(1/B.projectionMatrix.elements[5]),B.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(B){l=B,f!==null&&(f.fixedFoveation=B),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=B)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(V)},this.getCameraTexture=function(B){return m[B]};let U=null;function ue(B,$){if(h=$.getViewerPose(c||o),p=$,h!==null){let le=h.views;d!==null&&(e.setRenderTargetFramebuffer(x,d.framebuffer),e.setRenderTarget(x));let be=!1;le.length!==V.cameras.length&&(V.cameras.length=0,be=!0);for(let P=0;P<le.length;P++){let ie=le[P],oe=null;if(d!==null)oe=d.getViewport(ie);else{let Y=u.getViewSubImage(f,ie);oe=Y.viewport,P===0&&(e.setRenderTargetTextures(x,Y.colorTexture,Y.depthStencilTexture),e.setRenderTarget(x))}let ne=I[P];ne===void 0&&(ne=new wt,ne.layers.enable(P),ne.viewport=new rt,I[P]=ne),ne.matrix.fromArray(ie.transform.matrix),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.projectionMatrix.fromArray(ie.projectionMatrix),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert(),ne.viewport.set(oe.x,oe.y,oe.width,oe.height),P===0&&(V.matrix.copy(ne.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),be===!0&&V.cameras.push(ne)}let xe=i.enabledFeatures;if(xe&&xe.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){u=n.getBinding();let P=u.getDepthInformation(le[0]);P&&P.isValid&&P.texture&&g.init(P,i.renderState)}if(xe&&xe.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let P=0;P<le.length;P++){let ie=le[P].camera;if(ie){let oe=m[ie];oe||(oe=new Pr,m[ie]=oe);let ne=u.getCameraImage(ie);oe.sourceTexture=ne}}}}for(let le=0;le<E.length;le++){let be=A[le],xe=E[le];be!==null&&xe!==void 0&&xe.update(be,$,c||o)}U&&U(B,$),$.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:$}),p=null}let re=new Qd;re.setAnimationLoop(ue),this.setAnimationLoop=function(B){U=B},this.dispose=function(){}}},ts=new En,Gx=new $e;function Wx(s,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,Nl(s)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function i(g,m,M,y,x){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(g,m):m.isMeshToonMaterial?(r(g,m),u(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m)):m.isMeshStandardMaterial?(r(g,m),f(g,m),m.isMeshPhysicalMaterial&&d(g,m,x)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),_(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&a(g,m)):m.isPointsMaterial?l(g,m,M,y):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Xt&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Xt&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let M=e.get(m),y=M.envMap,x=M.envMapRotation;y&&(g.envMap.value=y,ts.copy(x),ts.x*=-1,ts.y*=-1,ts.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ts.y*=-1,ts.z*=-1),g.envMapRotation.value.setFromMatrix4(Gx.makeRotationFromEuler(ts)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function a(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,M,y){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*M,g.scale.value=y*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function f(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function d(g,m,M){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Xt&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function _(g,m){let M=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Xx(s,e,t,n){let i={},r={},o=[],a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,y){let x=y.program;n.uniformBlockBinding(M,x)}function c(M,y){let x=i[M.id];x===void 0&&(p(M),x=h(M),i[M.id]=x,M.addEventListener("dispose",g));let E=y.program;n.updateUBOMapping(M,E);let A=e.render.frame;r[M.id]!==A&&(f(M),r[M.id]=A)}function h(M){let y=u();M.__bindingPointIndex=y;let x=s.createBuffer(),E=M.__size,A=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,x),s.bufferData(s.UNIFORM_BUFFER,E,A),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,y,x),x}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(M){let y=i[M.id],x=M.uniforms,E=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,y);for(let A=0,D=x.length;A<D;A++){let O=Array.isArray(x[A])?x[A]:[x[A]];for(let b=0,v=O.length;b<v;b++){let I=O[b];if(d(I,A,b,E)===!0){let V=I.__offset,X=Array.isArray(I.value)?I.value:[I.value],ee=0;for(let Q=0;Q<X.length;Q++){let C=X[Q],L=_(C);typeof C=="number"||typeof C=="boolean"?(I.__data[0]=C,s.bufferSubData(s.UNIFORM_BUFFER,V+ee,I.__data)):C.isMatrix3?(I.__data[0]=C.elements[0],I.__data[1]=C.elements[1],I.__data[2]=C.elements[2],I.__data[3]=0,I.__data[4]=C.elements[3],I.__data[5]=C.elements[4],I.__data[6]=C.elements[5],I.__data[7]=0,I.__data[8]=C.elements[6],I.__data[9]=C.elements[7],I.__data[10]=C.elements[8],I.__data[11]=0):(C.toArray(I.__data,ee),ee+=L.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,V,I.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(M,y,x,E){let A=M.value,D=y+"_"+x;if(E[D]===void 0)return typeof A=="number"||typeof A=="boolean"?E[D]=A:E[D]=A.clone(),!0;{let O=E[D];if(typeof A=="number"||typeof A=="boolean"){if(O!==A)return E[D]=A,!0}else if(O.equals(A)===!1)return O.copy(A),!0}return!1}function p(M){let y=M.uniforms,x=0,E=16;for(let D=0,O=y.length;D<O;D++){let b=Array.isArray(y[D])?y[D]:[y[D]];for(let v=0,I=b.length;v<I;v++){let V=b[v],X=Array.isArray(V.value)?V.value:[V.value];for(let ee=0,Q=X.length;ee<Q;ee++){let C=X[ee],L=_(C),w=x%E,H=w%L.boundary,G=w+H;x+=H,G!==0&&E-G<L.storage&&(x+=E-G),V.__data=new Float32Array(L.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=x,x+=L.storage}}}let A=x%E;return A>0&&(x+=E-A),M.__size=x,M.__cache={},this}function _(M){let y={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(y.boundary=4,y.storage=4):M.isVector2?(y.boundary=8,y.storage=8):M.isVector3||M.isColor?(y.boundary=16,y.storage=12):M.isVector4?(y.boundary=16,y.storage=16):M.isMatrix3?(y.boundary=48,y.storage=48):M.isMatrix4?(y.boundary=64,y.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),y}function g(M){let y=M.target;y.removeEventListener("dispose",g);let x=o.indexOf(y.__bindingPointIndex);o.splice(x,1),s.deleteBuffer(i[y.id]),delete i[y.id],delete r[y.id]}function m(){for(let M in i)s.deleteBuffer(i[M]);o=[],i={},r={}}return{bind:l,update:c,dispose:m}}var uc=class{constructor(e={}){let{canvas:t=vd(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;let p=new Uint32Array(4),_=new Int32Array(4),g=null,m=null,M=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=hi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let x=this,E=!1;this._outputColorSpace=bt;let A=0,D=0,O=null,b=-1,v=null,I=new rt,V=new rt,X=null,ee=new ze(0),Q=0,C=t.width,L=t.height,w=1,H=null,G=null,F=new rt(0,0,C,L),te=new rt(0,0,C,L),U=!1,ue=new Ls,re=!1,B=!1,$=new $e,le=new N,be=new rt,xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Re=!1;function Ee(){return O===null?w:1}let P=n;function ie(T,Z){return t.getContext(T,Z)}try{let T={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",Me,!1),t.addEventListener("webglcontextrestored",De,!1),t.addEventListener("webglcontextcreationerror",Se,!1),P===null){let Z="webgl2";if(P=ie(Z,T),P===null)throw ie(Z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let oe,ne,Y,me,de,ye,Fe,Be,R,S,K,ce,ve,he,z,k,q,fe,j,pe,Pe,Le,Te,ke;function W(){oe=new l_(P),oe.init(),Le=new zx(P,oe),ne=new n_(P,oe,e,Le),Y=new Bx(P,oe),ne.reversedDepthBuffer&&f&&Y.buffers.depth.setReversed(!0),me=new d_(P),de=new Tx,ye=new kx(P,oe,Y,de,ne,Le,me),Fe=new s_(x),Be=new c_(x),R=new xm(P),Te=new e_(P,R),S=new h_(P,R,me,Te),K=new p_(P,S,R,me),j=new f_(P,ne,ye),k=new i_(de),ce=new Ex(x,Fe,Be,oe,ne,Te,k),ve=new Wx(x,de),he=new Ax,z=new Dx(oe),fe=new Q0(x,Fe,Be,Y,K,d,l),q=new Fx(x,K,ne),ke=new Xx(P,me,ne,Y),pe=new t_(P,oe,me),Pe=new u_(P,oe,me),me.programs=ce.programs,x.capabilities=ne,x.extensions=oe,x.properties=de,x.renderLists=he,x.shadowMap=q,x.state=Y,x.info=me}W();let we=new jl(x,P);this.xr=we,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let T=oe.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=oe.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return w},this.setPixelRatio=function(T){T!==void 0&&(w=T,this.setSize(C,L,!1))},this.getSize=function(T){return T.set(C,L)},this.setSize=function(T,Z,se=!0){if(we.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}C=T,L=Z,t.width=Math.floor(T*w),t.height=Math.floor(Z*w),se===!0&&(t.style.width=T+"px",t.style.height=Z+"px"),this.setViewport(0,0,T,Z)},this.getDrawingBufferSize=function(T){return T.set(C*w,L*w).floor()},this.setDrawingBufferSize=function(T,Z,se){C=T,L=Z,w=se,t.width=Math.floor(T*se),t.height=Math.floor(Z*se),this.setViewport(0,0,T,Z)},this.getCurrentViewport=function(T){return T.copy(I)},this.getViewport=function(T){return T.copy(F)},this.setViewport=function(T,Z,se,ae){T.isVector4?F.set(T.x,T.y,T.z,T.w):F.set(T,Z,se,ae),Y.viewport(I.copy(F).multiplyScalar(w).round())},this.getScissor=function(T){return T.copy(te)},this.setScissor=function(T,Z,se,ae){T.isVector4?te.set(T.x,T.y,T.z,T.w):te.set(T,Z,se,ae),Y.scissor(V.copy(te).multiplyScalar(w).round())},this.getScissorTest=function(){return U},this.setScissorTest=function(T){Y.setScissorTest(U=T)},this.setOpaqueSort=function(T){H=T},this.setTransparentSort=function(T){G=T},this.getClearColor=function(T){return T.copy(fe.getClearColor())},this.setClearColor=function(){fe.setClearColor(...arguments)},this.getClearAlpha=function(){return fe.getClearAlpha()},this.setClearAlpha=function(){fe.setClearAlpha(...arguments)},this.clear=function(T=!0,Z=!0,se=!0){let ae=0;if(T){let J=!1;if(O!==null){let Ae=O.texture.format;J=Ae===La||Ae===Pa||Ae===Ia}if(J){let Ae=O.texture.type,Ie=Ae===Rn||Ae===Ri||Ae===zs||Ae===Vs||Ae===Aa||Ae===Ra,Oe=fe.getClearColor(),Ne=fe.getClearAlpha(),Xe=Oe.r,qe=Oe.g,Ve=Oe.b;Ie?(p[0]=Xe,p[1]=qe,p[2]=Ve,p[3]=Ne,P.clearBufferuiv(P.COLOR,0,p)):(_[0]=Xe,_[1]=qe,_[2]=Ve,_[3]=Ne,P.clearBufferiv(P.COLOR,0,_))}else ae|=P.COLOR_BUFFER_BIT}Z&&(ae|=P.DEPTH_BUFFER_BIT),se&&(ae|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(ae)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Me,!1),t.removeEventListener("webglcontextrestored",De,!1),t.removeEventListener("webglcontextcreationerror",Se,!1),fe.dispose(),he.dispose(),z.dispose(),de.dispose(),Fe.dispose(),Be.dispose(),K.dispose(),Te.dispose(),ke.dispose(),ce.dispose(),we.dispose(),we.removeEventListener("sessionstart",Pn),we.removeEventListener("sessionend",kh),Ii.stop()};function Me(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function De(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;let T=me.autoReset,Z=q.enabled,se=q.autoUpdate,ae=q.needsUpdate,J=q.type;W(),me.autoReset=T,q.enabled=Z,q.autoUpdate=se,q.needsUpdate=ae,q.type=J}function Se(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ge(T){let Z=T.target;Z.removeEventListener("dispose",ge),Ue(Z)}function Ue(T){Ye(T),de.remove(T)}function Ye(T){let Z=de.get(T).programs;Z!==void 0&&(Z.forEach(function(se){ce.releaseProgram(se)}),T.isShaderMaterial&&ce.releaseShaderCache(T))}this.renderBufferDirect=function(T,Z,se,ae,J,Ae){Z===null&&(Z=xe);let Ie=J.isMesh&&J.matrixWorld.determinant()<0,Oe=kf(T,Z,se,ae,J);Y.setMaterial(ae,Ie);let Ne=se.index,Xe=1;if(ae.wireframe===!0){if(Ne=S.getWireframeAttribute(se),Ne===void 0)return;Xe=2}let qe=se.drawRange,Ve=se.attributes.position,et=qe.start*Xe,ht=(qe.start+qe.count)*Xe;Ae!==null&&(et=Math.max(et,Ae.start*Xe),ht=Math.min(ht,(Ae.start+Ae.count)*Xe)),Ne!==null?(et=Math.max(et,0),ht=Math.min(ht,Ne.count)):Ve!=null&&(et=Math.max(et,0),ht=Math.min(ht,Ve.count));let Et=ht-et;if(Et<0||Et===1/0)return;Te.setup(J,ae,Oe,se,Ne);let mt,dt=pe;if(Ne!==null&&(mt=R.get(Ne),dt=Pe,dt.setIndex(mt)),J.isMesh)ae.wireframe===!0?(Y.setLineWidth(ae.wireframeLinewidth*Ee()),dt.setMode(P.LINES)):dt.setMode(P.TRIANGLES);else if(J.isLine){let We=ae.linewidth;We===void 0&&(We=1),Y.setLineWidth(We*Ee()),J.isLineSegments?dt.setMode(P.LINES):J.isLineLoop?dt.setMode(P.LINE_LOOP):dt.setMode(P.LINE_STRIP)}else J.isPoints?dt.setMode(P.POINTS):J.isSprite&&dt.setMode(P.TRIANGLES);if(J.isBatchedMesh)if(J._multiDrawInstances!==null)Ts("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),dt.renderMultiDrawInstances(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount,J._multiDrawInstances);else if(oe.get("WEBGL_multi_draw"))dt.renderMultiDraw(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount);else{let We=J._multiDrawStarts,vt=J._multiDrawCounts,st=J._multiDrawCount,Qt=Ne?R.get(Ne).bytesPerElement:1,rs=de.get(ae).currentProgram.getUniforms();for(let en=0;en<st;en++)rs.setValue(P,"_gl_DrawID",en),dt.render(We[en]/Qt,vt[en])}else if(J.isInstancedMesh)dt.renderInstances(et,Et,J.count);else if(se.isInstancedBufferGeometry){let We=se._maxInstanceCount!==void 0?se._maxInstanceCount:1/0,vt=Math.min(se.instanceCount,We);dt.renderInstances(et,Et,vt)}else dt.render(et,Et)};function pt(T,Z,se){T.transparent===!0&&T.side===_t&&T.forceSinglePass===!1?(T.side=Xt,T.needsUpdate=!0,uo(T,Z,se),T.side=Sn,T.needsUpdate=!0,uo(T,Z,se),T.side=_t):uo(T,Z,se)}this.compile=function(T,Z,se=null){se===null&&(se=T),m=z.get(se),m.init(Z),y.push(m),se.traverseVisible(function(J){J.isLight&&J.layers.test(Z.layers)&&(m.pushLight(J),J.castShadow&&m.pushShadow(J))}),T!==se&&T.traverseVisible(function(J){J.isLight&&J.layers.test(Z.layers)&&(m.pushLight(J),J.castShadow&&m.pushShadow(J))}),m.setupLights();let ae=new Set;return T.traverse(function(J){if(!(J.isMesh||J.isPoints||J.isLine||J.isSprite))return;let Ae=J.material;if(Ae)if(Array.isArray(Ae))for(let Ie=0;Ie<Ae.length;Ie++){let Oe=Ae[Ie];pt(Oe,se,J),ae.add(Oe)}else pt(Ae,se,J),ae.add(Ae)}),m=y.pop(),ae},this.compileAsync=function(T,Z,se=null){let ae=this.compile(T,Z,se);return new Promise(J=>{function Ae(){if(ae.forEach(function(Ie){de.get(Ie).currentProgram.isReady()&&ae.delete(Ie)}),ae.size===0){J(T);return}setTimeout(Ae,10)}oe.get("KHR_parallel_shader_compile")!==null?Ae():setTimeout(Ae,10)})};let at=null;function Zn(T){at&&at(T)}function Pn(){Ii.stop()}function kh(){Ii.start()}let Ii=new Qd;Ii.setAnimationLoop(Zn),typeof self<"u"&&Ii.setContext(self),this.setAnimationLoop=function(T){at=T,we.setAnimationLoop(T),T===null?Ii.stop():Ii.start()},we.addEventListener("sessionstart",Pn),we.addEventListener("sessionend",kh),this.render=function(T,Z){if(Z!==void 0&&Z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),Z.parent===null&&Z.matrixWorldAutoUpdate===!0&&Z.updateMatrixWorld(),we.enabled===!0&&we.isPresenting===!0&&(we.cameraAutoUpdate===!0&&we.updateCamera(Z),Z=we.getCamera()),T.isScene===!0&&T.onBeforeRender(x,T,Z,O),m=z.get(T,y.length),m.init(Z),y.push(m),$.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),ue.setFromProjectionMatrix($,bn,Z.reversedDepth),B=this.localClippingEnabled,re=k.init(this.clippingPlanes,B),g=he.get(T,M.length),g.init(),M.push(g),we.enabled===!0&&we.isPresenting===!0){let Ae=x.xr.getDepthSensingMesh();Ae!==null&&yc(Ae,Z,-1/0,x.sortObjects)}yc(T,Z,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort(H,G),Re=we.enabled===!1||we.isPresenting===!1||we.hasDepthSensing()===!1,Re&&fe.addToRenderList(g,T),this.info.render.frame++,re===!0&&k.beginShadows();let se=m.state.shadowsArray;q.render(se,T,Z),re===!0&&k.endShadows(),this.info.autoReset===!0&&this.info.reset();let ae=g.opaque,J=g.transmissive;if(m.setupLights(),Z.isArrayCamera){let Ae=Z.cameras;if(J.length>0)for(let Ie=0,Oe=Ae.length;Ie<Oe;Ie++){let Ne=Ae[Ie];Hh(ae,J,T,Ne)}Re&&fe.render(T);for(let Ie=0,Oe=Ae.length;Ie<Oe;Ie++){let Ne=Ae[Ie];zh(g,T,Ne,Ne.viewport)}}else J.length>0&&Hh(ae,J,T,Z),Re&&fe.render(T),zh(g,T,Z);O!==null&&D===0&&(ye.updateMultisampleRenderTarget(O),ye.updateRenderTargetMipmap(O)),T.isScene===!0&&T.onAfterRender(x,T,Z),Te.resetDefaultState(),b=-1,v=null,y.pop(),y.length>0?(m=y[y.length-1],re===!0&&k.setGlobalState(x.clippingPlanes,m.state.camera)):m=null,M.pop(),M.length>0?g=M[M.length-1]:g=null};function yc(T,Z,se,ae){if(T.visible===!1)return;if(T.layers.test(Z.layers)){if(T.isGroup)se=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(Z);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||ue.intersectsSprite(T)){ae&&be.setFromMatrixPosition(T.matrixWorld).applyMatrix4($);let Ie=K.update(T),Oe=T.material;Oe.visible&&g.push(T,Ie,Oe,se,be.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||ue.intersectsObject(T))){let Ie=K.update(T),Oe=T.material;if(ae&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),be.copy(T.boundingSphere.center)):(Ie.boundingSphere===null&&Ie.computeBoundingSphere(),be.copy(Ie.boundingSphere.center)),be.applyMatrix4(T.matrixWorld).applyMatrix4($)),Array.isArray(Oe)){let Ne=Ie.groups;for(let Xe=0,qe=Ne.length;Xe<qe;Xe++){let Ve=Ne[Xe],et=Oe[Ve.materialIndex];et&&et.visible&&g.push(T,Ie,et,se,be.z,Ve)}}else Oe.visible&&g.push(T,Ie,Oe,se,be.z,null)}}let Ae=T.children;for(let Ie=0,Oe=Ae.length;Ie<Oe;Ie++)yc(Ae[Ie],Z,se,ae)}function zh(T,Z,se,ae){let J=T.opaque,Ae=T.transmissive,Ie=T.transparent;m.setupLightsView(se),re===!0&&k.setGlobalState(x.clippingPlanes,se),ae&&Y.viewport(I.copy(ae)),J.length>0&&ho(J,Z,se),Ae.length>0&&ho(Ae,Z,se),Ie.length>0&&ho(Ie,Z,se),Y.buffers.depth.setTest(!0),Y.buffers.depth.setMask(!0),Y.buffers.color.setMask(!0),Y.setPolygonOffset(!1)}function Hh(T,Z,se,ae){if((se.isScene===!0?se.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[ae.id]===void 0&&(m.state.transmissionRenderTarget[ae.id]=new Fn(1,1,{generateMipmaps:!0,type:oe.has("EXT_color_buffer_half_float")||oe.has("EXT_color_buffer_float")?Hs:Rn,minFilter:An,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));let Ae=m.state.transmissionRenderTarget[ae.id],Ie=ae.viewport||I;Ae.setSize(Ie.z*x.transmissionResolutionScale,Ie.w*x.transmissionResolutionScale);let Oe=x.getRenderTarget(),Ne=x.getActiveCubeFace(),Xe=x.getActiveMipmapLevel();x.setRenderTarget(Ae),x.getClearColor(ee),Q=x.getClearAlpha(),Q<1&&x.setClearColor(16777215,.5),x.clear(),Re&&fe.render(se);let qe=x.toneMapping;x.toneMapping=hi;let Ve=ae.viewport;if(ae.viewport!==void 0&&(ae.viewport=void 0),m.setupLightsView(ae),re===!0&&k.setGlobalState(x.clippingPlanes,ae),ho(T,se,ae),ye.updateMultisampleRenderTarget(Ae),ye.updateRenderTargetMipmap(Ae),oe.has("WEBGL_multisampled_render_to_texture")===!1){let et=!1;for(let ht=0,Et=Z.length;ht<Et;ht++){let mt=Z[ht],dt=mt.object,We=mt.geometry,vt=mt.material,st=mt.group;if(vt.side===_t&&dt.layers.test(ae.layers)){let Qt=vt.side;vt.side=Xt,vt.needsUpdate=!0,Vh(dt,se,ae,We,vt,st),vt.side=Qt,vt.needsUpdate=!0,et=!0}}et===!0&&(ye.updateMultisampleRenderTarget(Ae),ye.updateRenderTargetMipmap(Ae))}x.setRenderTarget(Oe,Ne,Xe),x.setClearColor(ee,Q),Ve!==void 0&&(ae.viewport=Ve),x.toneMapping=qe}function ho(T,Z,se){let ae=Z.isScene===!0?Z.overrideMaterial:null;for(let J=0,Ae=T.length;J<Ae;J++){let Ie=T[J],Oe=Ie.object,Ne=Ie.geometry,Xe=Ie.group,qe=Ie.material;qe.allowOverride===!0&&ae!==null&&(qe=ae),Oe.layers.test(se.layers)&&Vh(Oe,Z,se,Ne,qe,Xe)}}function Vh(T,Z,se,ae,J,Ae){T.onBeforeRender(x,Z,se,ae,J,Ae),T.modelViewMatrix.multiplyMatrices(se.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),J.onBeforeRender(x,Z,se,ae,T,Ae),J.transparent===!0&&J.side===_t&&J.forceSinglePass===!1?(J.side=Xt,J.needsUpdate=!0,x.renderBufferDirect(se,Z,ae,J,T,Ae),J.side=Sn,J.needsUpdate=!0,x.renderBufferDirect(se,Z,ae,J,T,Ae),J.side=_t):x.renderBufferDirect(se,Z,ae,J,T,Ae),T.onAfterRender(x,Z,se,ae,J,Ae)}function uo(T,Z,se){Z.isScene!==!0&&(Z=xe);let ae=de.get(T),J=m.state.lights,Ae=m.state.shadowsArray,Ie=J.state.version,Oe=ce.getParameters(T,J.state,Ae,Z,se),Ne=ce.getProgramCacheKey(Oe),Xe=ae.programs;ae.environment=T.isMeshStandardMaterial?Z.environment:null,ae.fog=Z.fog,ae.envMap=(T.isMeshStandardMaterial?Be:Fe).get(T.envMap||ae.environment),ae.envMapRotation=ae.environment!==null&&T.envMap===null?Z.environmentRotation:T.envMapRotation,Xe===void 0&&(T.addEventListener("dispose",ge),Xe=new Map,ae.programs=Xe);let qe=Xe.get(Ne);if(qe!==void 0){if(ae.currentProgram===qe&&ae.lightsStateVersion===Ie)return Wh(T,Oe),qe}else Oe.uniforms=ce.getUniforms(T),T.onBeforeCompile(Oe,x),qe=ce.acquireProgram(Oe,Ne),Xe.set(Ne,qe),ae.uniforms=Oe.uniforms;let Ve=ae.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ve.clippingPlanes=k.uniform),Wh(T,Oe),ae.needsLights=Hf(T),ae.lightsStateVersion=Ie,ae.needsLights&&(Ve.ambientLightColor.value=J.state.ambient,Ve.lightProbe.value=J.state.probe,Ve.directionalLights.value=J.state.directional,Ve.directionalLightShadows.value=J.state.directionalShadow,Ve.spotLights.value=J.state.spot,Ve.spotLightShadows.value=J.state.spotShadow,Ve.rectAreaLights.value=J.state.rectArea,Ve.ltc_1.value=J.state.rectAreaLTC1,Ve.ltc_2.value=J.state.rectAreaLTC2,Ve.pointLights.value=J.state.point,Ve.pointLightShadows.value=J.state.pointShadow,Ve.hemisphereLights.value=J.state.hemi,Ve.directionalShadowMap.value=J.state.directionalShadowMap,Ve.directionalShadowMatrix.value=J.state.directionalShadowMatrix,Ve.spotShadowMap.value=J.state.spotShadowMap,Ve.spotLightMatrix.value=J.state.spotLightMatrix,Ve.spotLightMap.value=J.state.spotLightMap,Ve.pointShadowMap.value=J.state.pointShadowMap,Ve.pointShadowMatrix.value=J.state.pointShadowMatrix),ae.currentProgram=qe,ae.uniformsList=null,qe}function Gh(T){if(T.uniformsList===null){let Z=T.currentProgram.getUniforms();T.uniformsList=Ys.seqWithValue(Z.seq,T.uniforms)}return T.uniformsList}function Wh(T,Z){let se=de.get(T);se.outputColorSpace=Z.outputColorSpace,se.batching=Z.batching,se.batchingColor=Z.batchingColor,se.instancing=Z.instancing,se.instancingColor=Z.instancingColor,se.instancingMorph=Z.instancingMorph,se.skinning=Z.skinning,se.morphTargets=Z.morphTargets,se.morphNormals=Z.morphNormals,se.morphColors=Z.morphColors,se.morphTargetsCount=Z.morphTargetsCount,se.numClippingPlanes=Z.numClippingPlanes,se.numIntersection=Z.numClipIntersection,se.vertexAlphas=Z.vertexAlphas,se.vertexTangents=Z.vertexTangents,se.toneMapping=Z.toneMapping}function kf(T,Z,se,ae,J){Z.isScene!==!0&&(Z=xe),ye.resetTextureUnits();let Ae=Z.fog,Ie=ae.isMeshStandardMaterial?Z.environment:null,Oe=O===null?x.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:Ft,Ne=(ae.isMeshStandardMaterial?Be:Fe).get(ae.envMap||Ie),Xe=ae.vertexColors===!0&&!!se.attributes.color&&se.attributes.color.itemSize===4,qe=!!se.attributes.tangent&&(!!ae.normalMap||ae.anisotropy>0),Ve=!!se.morphAttributes.position,et=!!se.morphAttributes.normal,ht=!!se.morphAttributes.color,Et=hi;ae.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(Et=x.toneMapping);let mt=se.morphAttributes.position||se.morphAttributes.normal||se.morphAttributes.color,dt=mt!==void 0?mt.length:0,We=de.get(ae),vt=m.state.lights;if(re===!0&&(B===!0||T!==v)){let Ht=T===v&&ae.id===b;k.setState(ae,T,Ht)}let st=!1;ae.version===We.__version?(We.needsLights&&We.lightsStateVersion!==vt.state.version||We.outputColorSpace!==Oe||J.isBatchedMesh&&We.batching===!1||!J.isBatchedMesh&&We.batching===!0||J.isBatchedMesh&&We.batchingColor===!0&&J.colorTexture===null||J.isBatchedMesh&&We.batchingColor===!1&&J.colorTexture!==null||J.isInstancedMesh&&We.instancing===!1||!J.isInstancedMesh&&We.instancing===!0||J.isSkinnedMesh&&We.skinning===!1||!J.isSkinnedMesh&&We.skinning===!0||J.isInstancedMesh&&We.instancingColor===!0&&J.instanceColor===null||J.isInstancedMesh&&We.instancingColor===!1&&J.instanceColor!==null||J.isInstancedMesh&&We.instancingMorph===!0&&J.morphTexture===null||J.isInstancedMesh&&We.instancingMorph===!1&&J.morphTexture!==null||We.envMap!==Ne||ae.fog===!0&&We.fog!==Ae||We.numClippingPlanes!==void 0&&(We.numClippingPlanes!==k.numPlanes||We.numIntersection!==k.numIntersection)||We.vertexAlphas!==Xe||We.vertexTangents!==qe||We.morphTargets!==Ve||We.morphNormals!==et||We.morphColors!==ht||We.toneMapping!==Et||We.morphTargetsCount!==dt)&&(st=!0):(st=!0,We.__version=ae.version);let Qt=We.currentProgram;st===!0&&(Qt=uo(ae,Z,J));let rs=!1,en=!1,ir=!1,Mt=Qt.getUniforms(),cn=We.uniforms;if(Y.useProgram(Qt.program)&&(rs=!0,en=!0,ir=!0),ae.id!==b&&(b=ae.id,en=!0),rs||v!==T){Y.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),Mt.setValue(P,"projectionMatrix",T.projectionMatrix),Mt.setValue(P,"viewMatrix",T.matrixWorldInverse);let qt=Mt.map.cameraPosition;qt!==void 0&&qt.setValue(P,le.setFromMatrixPosition(T.matrixWorld)),ne.logarithmicDepthBuffer&&Mt.setValue(P,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(ae.isMeshPhongMaterial||ae.isMeshToonMaterial||ae.isMeshLambertMaterial||ae.isMeshBasicMaterial||ae.isMeshStandardMaterial||ae.isShaderMaterial)&&Mt.setValue(P,"isOrthographic",T.isOrthographicCamera===!0),v!==T&&(v=T,en=!0,ir=!0)}if(J.isSkinnedMesh){Mt.setOptional(P,J,"bindMatrix"),Mt.setOptional(P,J,"bindMatrixInverse");let Ht=J.skeleton;Ht&&(Ht.boneTexture===null&&Ht.computeBoneTexture(),Mt.setValue(P,"boneTexture",Ht.boneTexture,ye))}J.isBatchedMesh&&(Mt.setOptional(P,J,"batchingTexture"),Mt.setValue(P,"batchingTexture",J._matricesTexture,ye),Mt.setOptional(P,J,"batchingIdTexture"),Mt.setValue(P,"batchingIdTexture",J._indirectTexture,ye),Mt.setOptional(P,J,"batchingColorTexture"),J._colorsTexture!==null&&Mt.setValue(P,"batchingColorTexture",J._colorsTexture,ye));let ln=se.morphAttributes;if((ln.position!==void 0||ln.normal!==void 0||ln.color!==void 0)&&j.update(J,se,Qt),(en||We.receiveShadow!==J.receiveShadow)&&(We.receiveShadow=J.receiveShadow,Mt.setValue(P,"receiveShadow",J.receiveShadow)),ae.isMeshGouraudMaterial&&ae.envMap!==null&&(cn.envMap.value=Ne,cn.flipEnvMap.value=Ne.isCubeTexture&&Ne.isRenderTargetTexture===!1?-1:1),ae.isMeshStandardMaterial&&ae.envMap===null&&Z.environment!==null&&(cn.envMapIntensity.value=Z.environmentIntensity),en&&(Mt.setValue(P,"toneMappingExposure",x.toneMappingExposure),We.needsLights&&zf(cn,ir),Ae&&ae.fog===!0&&ve.refreshFogUniforms(cn,Ae),ve.refreshMaterialUniforms(cn,ae,w,L,m.state.transmissionRenderTarget[T.id]),Ys.upload(P,Gh(We),cn,ye)),ae.isShaderMaterial&&ae.uniformsNeedUpdate===!0&&(Ys.upload(P,Gh(We),cn,ye),ae.uniformsNeedUpdate=!1),ae.isSpriteMaterial&&Mt.setValue(P,"center",J.center),Mt.setValue(P,"modelViewMatrix",J.modelViewMatrix),Mt.setValue(P,"normalMatrix",J.normalMatrix),Mt.setValue(P,"modelMatrix",J.matrixWorld),ae.isShaderMaterial||ae.isRawShaderMaterial){let Ht=ae.uniformsGroups;for(let qt=0,vc=Ht.length;qt<vc;qt++){let Pi=Ht[qt];ke.update(Pi,Qt),ke.bind(Pi,Qt)}}return Qt}function zf(T,Z){T.ambientLightColor.needsUpdate=Z,T.lightProbe.needsUpdate=Z,T.directionalLights.needsUpdate=Z,T.directionalLightShadows.needsUpdate=Z,T.pointLights.needsUpdate=Z,T.pointLightShadows.needsUpdate=Z,T.spotLights.needsUpdate=Z,T.spotLightShadows.needsUpdate=Z,T.rectAreaLights.needsUpdate=Z,T.hemisphereLights.needsUpdate=Z}function Hf(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return D},this.getRenderTarget=function(){return O},this.setRenderTargetTextures=function(T,Z,se){let ae=de.get(T);ae.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,ae.__autoAllocateDepthBuffer===!1&&(ae.__useRenderToTexture=!1),de.get(T.texture).__webglTexture=Z,de.get(T.depthTexture).__webglTexture=ae.__autoAllocateDepthBuffer?void 0:se,ae.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,Z){let se=de.get(T);se.__webglFramebuffer=Z,se.__useDefaultFramebuffer=Z===void 0};let Vf=P.createFramebuffer();this.setRenderTarget=function(T,Z=0,se=0){O=T,A=Z,D=se;let ae=!0,J=null,Ae=!1,Ie=!1;if(T){let Ne=de.get(T);if(Ne.__useDefaultFramebuffer!==void 0)Y.bindFramebuffer(P.FRAMEBUFFER,null),ae=!1;else if(Ne.__webglFramebuffer===void 0)ye.setupRenderTarget(T);else if(Ne.__hasExternalTextures)ye.rebindTextures(T,de.get(T.texture).__webglTexture,de.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Ve=T.depthTexture;if(Ne.__boundDepthTexture!==Ve){if(Ve!==null&&de.has(Ve)&&(T.width!==Ve.image.width||T.height!==Ve.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ye.setupDepthRenderbuffer(T)}}let Xe=T.texture;(Xe.isData3DTexture||Xe.isDataArrayTexture||Xe.isCompressedArrayTexture)&&(Ie=!0);let qe=de.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(qe[Z])?J=qe[Z][se]:J=qe[Z],Ae=!0):T.samples>0&&ye.useMultisampledRTT(T)===!1?J=de.get(T).__webglMultisampledFramebuffer:Array.isArray(qe)?J=qe[se]:J=qe,I.copy(T.viewport),V.copy(T.scissor),X=T.scissorTest}else I.copy(F).multiplyScalar(w).floor(),V.copy(te).multiplyScalar(w).floor(),X=U;if(se!==0&&(J=Vf),Y.bindFramebuffer(P.FRAMEBUFFER,J)&&ae&&Y.drawBuffers(T,J),Y.viewport(I),Y.scissor(V),Y.setScissorTest(X),Ae){let Ne=de.get(T.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Ne.__webglTexture,se)}else if(Ie){let Ne=Z;for(let Xe=0;Xe<T.textures.length;Xe++){let qe=de.get(T.textures[Xe]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Xe,qe.__webglTexture,se,Ne)}}else if(T!==null&&se!==0){let Ne=de.get(T.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ne.__webglTexture,se)}b=-1},this.readRenderTargetPixels=function(T,Z,se,ae,J,Ae,Ie,Oe=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ne=de.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ie!==void 0&&(Ne=Ne[Ie]),Ne){Y.bindFramebuffer(P.FRAMEBUFFER,Ne);try{let Xe=T.textures[Oe],qe=Xe.format,Ve=Xe.type;if(!ne.textureFormatReadable(qe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ne.textureTypeReadable(Ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Z>=0&&Z<=T.width-ae&&se>=0&&se<=T.height-J&&(T.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Oe),P.readPixels(Z,se,ae,J,Le.convert(qe),Le.convert(Ve),Ae))}finally{let Xe=O!==null?de.get(O).__webglFramebuffer:null;Y.bindFramebuffer(P.FRAMEBUFFER,Xe)}}},this.readRenderTargetPixelsAsync=async function(T,Z,se,ae,J,Ae,Ie,Oe=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ne=de.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ie!==void 0&&(Ne=Ne[Ie]),Ne)if(Z>=0&&Z<=T.width-ae&&se>=0&&se<=T.height-J){Y.bindFramebuffer(P.FRAMEBUFFER,Ne);let Xe=T.textures[Oe],qe=Xe.format,Ve=Xe.type;if(!ne.textureFormatReadable(qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ne.textureTypeReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let et=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,et),P.bufferData(P.PIXEL_PACK_BUFFER,Ae.byteLength,P.STREAM_READ),T.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Oe),P.readPixels(Z,se,ae,J,Le.convert(qe),Le.convert(Ve),0);let ht=O!==null?de.get(O).__webglFramebuffer:null;Y.bindFramebuffer(P.FRAMEBUFFER,ht);let Et=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Md(P,Et,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,et),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,Ae),P.deleteBuffer(et),P.deleteSync(Et),Ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,Z=null,se=0){let ae=Math.pow(2,-se),J=Math.floor(T.image.width*ae),Ae=Math.floor(T.image.height*ae),Ie=Z!==null?Z.x:0,Oe=Z!==null?Z.y:0;ye.setTexture2D(T,0),P.copyTexSubImage2D(P.TEXTURE_2D,se,0,0,Ie,Oe,J,Ae),Y.unbindTexture()};let Gf=P.createFramebuffer(),Wf=P.createFramebuffer();this.copyTextureToTexture=function(T,Z,se=null,ae=null,J=0,Ae=null){Ae===null&&(J!==0?(Ts("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Ae=J,J=0):Ae=0);let Ie,Oe,Ne,Xe,qe,Ve,et,ht,Et,mt=T.isCompressedTexture?T.mipmaps[Ae]:T.image;if(se!==null)Ie=se.max.x-se.min.x,Oe=se.max.y-se.min.y,Ne=se.isBox3?se.max.z-se.min.z:1,Xe=se.min.x,qe=se.min.y,Ve=se.isBox3?se.min.z:0;else{let ln=Math.pow(2,-J);Ie=Math.floor(mt.width*ln),Oe=Math.floor(mt.height*ln),T.isDataArrayTexture?Ne=mt.depth:T.isData3DTexture?Ne=Math.floor(mt.depth*ln):Ne=1,Xe=0,qe=0,Ve=0}ae!==null?(et=ae.x,ht=ae.y,Et=ae.z):(et=0,ht=0,Et=0);let dt=Le.convert(Z.format),We=Le.convert(Z.type),vt;Z.isData3DTexture?(ye.setTexture3D(Z,0),vt=P.TEXTURE_3D):Z.isDataArrayTexture||Z.isCompressedArrayTexture?(ye.setTexture2DArray(Z,0),vt=P.TEXTURE_2D_ARRAY):(ye.setTexture2D(Z,0),vt=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,Z.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Z.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,Z.unpackAlignment);let st=P.getParameter(P.UNPACK_ROW_LENGTH),Qt=P.getParameter(P.UNPACK_IMAGE_HEIGHT),rs=P.getParameter(P.UNPACK_SKIP_PIXELS),en=P.getParameter(P.UNPACK_SKIP_ROWS),ir=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,mt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,mt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Xe),P.pixelStorei(P.UNPACK_SKIP_ROWS,qe),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ve);let Mt=T.isDataArrayTexture||T.isData3DTexture,cn=Z.isDataArrayTexture||Z.isData3DTexture;if(T.isDepthTexture){let ln=de.get(T),Ht=de.get(Z),qt=de.get(ln.__renderTarget),vc=de.get(Ht.__renderTarget);Y.bindFramebuffer(P.READ_FRAMEBUFFER,qt.__webglFramebuffer),Y.bindFramebuffer(P.DRAW_FRAMEBUFFER,vc.__webglFramebuffer);for(let Pi=0;Pi<Ne;Pi++)Mt&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,de.get(T).__webglTexture,J,Ve+Pi),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,de.get(Z).__webglTexture,Ae,Et+Pi)),P.blitFramebuffer(Xe,qe,Ie,Oe,et,ht,Ie,Oe,P.DEPTH_BUFFER_BIT,P.NEAREST);Y.bindFramebuffer(P.READ_FRAMEBUFFER,null),Y.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(J!==0||T.isRenderTargetTexture||de.has(T)){let ln=de.get(T),Ht=de.get(Z);Y.bindFramebuffer(P.READ_FRAMEBUFFER,Gf),Y.bindFramebuffer(P.DRAW_FRAMEBUFFER,Wf);for(let qt=0;qt<Ne;qt++)Mt?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ln.__webglTexture,J,Ve+qt):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ln.__webglTexture,J),cn?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ht.__webglTexture,Ae,Et+qt):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ht.__webglTexture,Ae),J!==0?P.blitFramebuffer(Xe,qe,Ie,Oe,et,ht,Ie,Oe,P.COLOR_BUFFER_BIT,P.NEAREST):cn?P.copyTexSubImage3D(vt,Ae,et,ht,Et+qt,Xe,qe,Ie,Oe):P.copyTexSubImage2D(vt,Ae,et,ht,Xe,qe,Ie,Oe);Y.bindFramebuffer(P.READ_FRAMEBUFFER,null),Y.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else cn?T.isDataTexture||T.isData3DTexture?P.texSubImage3D(vt,Ae,et,ht,Et,Ie,Oe,Ne,dt,We,mt.data):Z.isCompressedArrayTexture?P.compressedTexSubImage3D(vt,Ae,et,ht,Et,Ie,Oe,Ne,dt,mt.data):P.texSubImage3D(vt,Ae,et,ht,Et,Ie,Oe,Ne,dt,We,mt):T.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,Ae,et,ht,Ie,Oe,dt,We,mt.data):T.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,Ae,et,ht,mt.width,mt.height,dt,mt.data):P.texSubImage2D(P.TEXTURE_2D,Ae,et,ht,Ie,Oe,dt,We,mt);P.pixelStorei(P.UNPACK_ROW_LENGTH,st),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Qt),P.pixelStorei(P.UNPACK_SKIP_PIXELS,rs),P.pixelStorei(P.UNPACK_SKIP_ROWS,en),P.pixelStorei(P.UNPACK_SKIP_IMAGES,ir),Ae===0&&Z.generateMipmaps&&P.generateMipmap(vt),Y.unbindTexture()},this.initRenderTarget=function(T){de.get(T).__webglFramebuffer===void 0&&ye.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?ye.setTextureCube(T,0):T.isData3DTexture?ye.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?ye.setTexture2DArray(T,0):ye.setTexture2D(T,0),Y.unbindTexture()},this.resetState=function(){A=0,D=0,O=null,Y.reset(),Te.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}};var rf={type:"change"},th={type:"start"},af={type:"end"},fc=new On,of=new un,qx=Math.cos(70*mn.DEG2RAD),Lt=new N,jt=2*Math.PI,ut={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},eh=1e-6,pc=class extends jr{constructor(e,t=null){super(e,t),this.state=ut.NONE,this.target=new N,this.cursor=new N,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:wi.ROTATE,MIDDLE:wi.DOLLY,RIGHT:wi.PAN},this.touches={ONE:Ai.ROTATE,TWO:Ai.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new N,this._lastQuaternion=new Wt,this._lastTargetPosition=new N,this._quat=new Wt().setFromUnitVectors(e.up,new N(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ti,this._sphericalDelta=new Ti,this._scale=1,this._panOffset=new N,this._rotateStart=new _e,this._rotateEnd=new _e,this._rotateDelta=new _e,this._panStart=new _e,this._panEnd=new _e,this._panDelta=new _e,this._dollyStart=new _e,this._dollyEnd=new _e,this._dollyDelta=new _e,this._dollyDirection=new N,this._mouse=new _e,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=$x.bind(this),this._onPointerDown=Yx.bind(this),this._onPointerUp=Zx.bind(this),this._onContextMenu=ny.bind(this),this._onMouseWheel=jx.bind(this),this._onKeyDown=Qx.bind(this),this._onTouchStart=ey.bind(this),this._onTouchMove=ty.bind(this),this._onMouseDown=Kx.bind(this),this._onMouseMove=Jx.bind(this),this._interceptControlDown=iy.bind(this),this._interceptControlUp=sy.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(rf),this.update(),this.state=ut.NONE}update(e=null){let t=this.object.position;Lt.copy(t).sub(this.target),Lt.applyQuaternion(this._quat),this._spherical.setFromVector3(Lt),this.autoRotate&&this.state===ut.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=jt:n>Math.PI&&(n-=jt),i<-Math.PI?i+=jt:i>Math.PI&&(i-=jt),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Lt.setFromSpherical(this._spherical),Lt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Lt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Lt.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new N(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new N(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Lt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(fc.origin.copy(this.object.position),fc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(fc.direction))<qx?this.object.lookAt(this.target):(of.setFromNormalAndCoplanarPoint(this.object.up,this.target),fc.intersectPlane(of,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>eh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>eh||this._lastTargetPosition.distanceToSquared(this.target)>eh?(this.dispatchEvent(rf),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?jt/60*this.autoRotateSpeed*e:jt/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Lt.setFromMatrixColumn(t,0),Lt.multiplyScalar(-e),this._panOffset.add(Lt)}_panUp(e,t){this.screenSpacePanning===!0?Lt.setFromMatrixColumn(t,1):(Lt.setFromMatrixColumn(t,0),Lt.crossVectors(this.object.up,Lt)),Lt.multiplyScalar(e),this._panOffset.add(Lt)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let i=this.object.position;Lt.copy(i).sub(this.target);let r=Lt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),i=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=i/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(jt*this._rotateDelta.x/t.clientHeight),this._rotateUp(jt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panStart.set(n,i)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,r=Math.sqrt(n*n+i*i);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(i,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(jt*this._rotateDelta.x/t.clientHeight),this._rotateUp(jt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,r=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new _e,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Yx(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s)))}function $x(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function Zx(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(af),this.state=ut.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Kx(s){let e;switch(s.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case wi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=ut.DOLLY;break;case wi.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=ut.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=ut.ROTATE}break;case wi.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=ut.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=ut.PAN}break;default:this.state=ut.NONE}this.state!==ut.NONE&&this.dispatchEvent(th)}function Jx(s){switch(this.state){case ut.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case ut.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case ut.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function jx(s){this.enabled===!1||this.enableZoom===!1||this.state!==ut.NONE||(s.preventDefault(),this.dispatchEvent(th),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(af))}function Qx(s){this.enabled!==!1&&this._handleKeyDown(s)}function ey(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case Ai.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=ut.TOUCH_ROTATE;break;case Ai.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=ut.TOUCH_PAN;break;default:this.state=ut.NONE}break;case 2:switch(this.touches.TWO){case Ai.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=ut.TOUCH_DOLLY_PAN;break;case Ai.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=ut.TOUCH_DOLLY_ROTATE;break;default:this.state=ut.NONE}break;default:this.state=ut.NONE}this.state!==ut.NONE&&this.dispatchEvent(th)}function ty(s){switch(this._trackPointer(s),this.state){case ut.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case ut.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case ut.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case ut.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=ut.NONE}}function ny(s){this.enabled!==!1&&s.preventDefault()}function iy(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function sy(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function lf(s,e=!1){let t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},o={},a=s[0].morphTargetsRelative,l=new je,c=0;for(let h=0;h<s.length;++h){let u=s[h],f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in u.morphAttributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(e){let d;if(t)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(t){let h=0,u=[];for(let f=0;f<s.length;++f){let d=s[f].index;for(let p=0;p<d.count;++p)u.push(d.getX(p)+h);h+=s[f].attributes.position.count}l.setIndex(u)}for(let h in r){let u=cf(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<u;++f){let d=[];for(let _=0;_<o[h].length;++_)d.push(o[h][_][f]);let p=cf(d);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(p)}}return l}function cf(s){let e,t,n,i=-1,r=0;for(let c=0;c<s.length;++c){let h=s[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new gt(o,t,n),l=0;for(let c=0;c<s.length;++c){let h=s[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let f=0,d=h.count;f<d;f++)for(let p=0;p<t;p++){let _=h.getComponent(f,p);a.setComponent(f+u,p,_)}}else o.set(h.array,l);l+=h.count*t}return i!==void 0&&(a.gpuType=i),a}function nh(s,e){if(e===Rl)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===Ws||e===so){let t=s.getIndex();if(t===null){let o=[],a=s.getAttribute("position");if(a!==void 0){for(let l=0;l<a.count;l++)o.push(l);s.setIndex(o),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}let n=t.count-2,i=[];if(e===Ws)for(let o=1;o<=n;o++)i.push(t.getX(0)),i.push(t.getX(o)),i.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(t.getX(o)),i.push(t.getX(o+1)),i.push(t.getX(o+2))):(i.push(t.getX(o+2)),i.push(t.getX(o+1)),i.push(t.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}var Js=(s,e={})=>new At({color:s,roughness:.92,flatShading:!0,...e}),ih=[5860707,6847342,8161911,9279872,5400158].map(s=>Js(s)),Ks=[8625222,10136918,7441991,11582310,9611602].map(s=>Js(s)),sh=194,nt=()=>(sh=sh*1664525+1013904223>>>0,sh/4294967296);function Rt(s,e,t,n,i=0,r=0,o=0){let a=new ot(t,n);return a.name=e,a.position.set(i,r,o),a.castShadow=!0,a.receiveShadow=!0,s.add(a),a}var In=s=>.9+Math.sin(s*.36)*.68,oo=s=>.7*(4.9+Math.sin(s*.6)*.24),Cn=1.5;function hf(s,{rodinBridge:e=!1}={}){let t=new it;t.name="Terrain \xB7 sculpted river canyon",s.add(t);let n=[],i=[];for(let b=0;b<=22;b++){let v=-11+b,I=In(v),V=oo(v)-Cn;n.push([I-V,v]),i.push([I+V,v])}let r=[[-14.5,-10.7],[-11,-11.3],[-3.2,-11.1],...n,[-7.3,11.1],[-12.9,10.3],[-15.1,7.4],[-15.4,1.2],[-14.8,-6.8]],o=[...i.slice().reverse(),[9.8,-11.4],[14.4,-9.4],[15.3,-4],[15.4,2],[14.4,8.3],[12.6,10.8],[8.5,11.2]],a=b=>Math.abs(b.reduce((v,I,V)=>{let X=b[(V+1)%b.length];return v+I[0]*X[1]-X[0]*I[1]},0))/2,l={west:a(r),east:a(o),previousTotal:399.8128330241873};l.total=l.west+l.east,l.increasePercent=(l.total/l.previousTotal-1)*100,t.userData.landArea=l,t.userData.bankSeparation={westTranslation:-Cn,eastTranslation:Cn,addedChannelWidth:Cn*2,widthAtBridge:oo(1.5)*2,minimumWidth:9.32*.7,maximumWidth:10.28*.7};function c(b,v,I,V){let X=!1;for(let ee=0,Q=b.length-1;ee<b.length;Q=ee++){let C=b[Q],L=b[ee];C[1]>I!=L[1]>I&&v<(L[0]-C[0])*(I-C[1])/(L[1]-C[1])+C[0]&&(X=!X);let w=L[0]-C[0],H=L[1]-C[1],G=Math.max(0,Math.min(1,((v-C[0])*w+(I-C[1])*H)/(w*w+H*H)));if(Math.hypot(v-C[0]-G*w,I-C[1]-G*H)<V)return!1}return X}function h(b,v){let I=new it;I.name=v+" translated bank",I.position.x=v==="West"?-Cn:Cn,t.add(I);let V=new on(b.map(([Q,C])=>new _e(Q,-C))),X=new bi(V,{depth:4.55,bevelEnabled:!0,bevelThickness:.25,bevelSize:.2,bevelSegments:1,curveSegments:1});X.rotateX(-Math.PI/2),Rt(I,v+" rock body",X,[Ks[0],ih[0]],0,-2.6,0);let ee=new Si(V);ee.rotateX(-Math.PI/2),Rt(I,v+" meadow",ee,Ks[0],0,2.22,0);for(let Q=0;Q<70;Q++){let C=(v==="West"?-11:3.4)+nt()*7.4,L=-10.5+nt()*21;if(v==="West"&&C>In(L)-2.3||v==="East"&&C<In(L)+2.4||Math.abs(L)>9.2||Math.abs(C)>9.8)continue;let w=.3+nt()*.9,H=Ks[Math.floor(nt()*5)],G=2.232+nt()*.008,F=nt()*6,te=.5+nt()*.6;if(!c(b,C,L,w*Math.max(1,te)))continue;let U=Rt(I,"Meadow color patch",new Dr(w,6),H,C,G,L);U.rotation.x=-Math.PI/2,U.rotation.z=F,U.scale.y=te,U.castShadow=!1}}h(r,"West"),h(o,"East");for(let[b,v]of[n,i].entries())v.forEach(([I,V],X)=>{let ee=I+(b===0?-Cn:Cn);if(!(e&&V>-1.8&&V<4.8)){for(let Q=0;Q<2;Q++){let C=1.4+nt()*1.4,L=new Tn(1,0),w=Rt(t,"Fractured bank stone",L,ih[(X+Q)%5],ee+(b===0?-.12:.12),Q===0?-.6:.85,V);w.scale.set(.55+nt()*.25,C*.46,.66+nt()*.3),w.rotation.set(nt()*.13,nt()*.6,nt()*.15)}X%2===0&&Rt(t,"Moss cap",new Tn(1,0),Ks[X%5],ee+(b===0?-.25:.25),2.18,V).scale.set(.8,.17,.64)}});let u=Js(13022334),f=Js(11776396);function d(b,v){let I=b[0][0]<0?-Cn:Cn,V=new Us(b.map(L=>new N(L[0]+I,2.255,L[1]))),X=[],ee=[];for(let L=0;L<=64;L++){let w=V.getPoint(L/64),H=V.getTangent(L/64),G=new N(-H.z,0,H.x).multiplyScalar(v*(.95+.07*Math.sin(L)));if(X.push(w.x+G.x,w.y,w.z+G.z,w.x-G.x,w.y,w.z-G.z),L<64){let F=L*2;ee.push(F,F+2,F+1,F+1,F+2,F+3)}}let Q=new je;Q.setAttribute("position",new Ge(X,3)),Q.setIndex(ee),Q.computeVertexNormals();let C=Rt(t,"Winding woodland path",Q,u);C.castShadow=!1}d([[-12.6,8.4],[-10.3,8],[-8.2,7.3],[-6.5,7],[-5.4,4.8],[-4.5,2.2],[-3.7,1.5],[-1,1.5]],.68),d([[-4.6,3],[-5.1,1],[-5.3,-1.5]],.63),d([[3,1.5],[5.2,1.8],[7.3,1],[9.9,-.2]],.6);for(let b=0;b<50;b++){let v=-1+nt()*10,I=-5.4-Cn+Math.sin(v*.5)*.8+(nt()-.5)*2.5,V=Rt(t,"Path stepping stone",new fn(.14+nt()*.13,.2,.06,5),f,I,2.29,v);V.rotation.y=nt()*6,V.scale.z=.65+nt()*.4}let p={uTime:{value:0},uNight:{value:0}},_=new sn({uniforms:p,side:_t,vertexShader:"varying vec3 vWorld; void main(){vec4 p=modelMatrix*vec4(position,1.);vWorld=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}",fragmentShader:`precision highp float; varying vec3 vWorld; uniform float uTime; uniform float uNight;
    void main(){vec2 p=vWorld.xz;float s=sin(p.y*5.0-uTime*1.5+sin(p.x*6.)*.8);float s2=sin(p.y*9.8-uTime*2.0+p.x*3.);float lines=pow(max(0.,s*s2),13.);float broad=sin(p.x*3.+p.y*.9+uTime*.4)*.5+.5;vec3 col=mix(vec3(.16,.49,.48),vec3(.44,.73,.66),broad*.6);col=mix(col,vec3(.83,.95,.82),lines*.7);col*=mix(1.,.48,uNight);gl_FragColor=vec4(col,1.);}`}),g=[],m=[];for(let b=0;b<=96;b++){let v=-11.06+b/96*22.12,I=In(v),V=oo(v);if(g.push(I-V,.22,v,I+V,.22,v),b<96){let X=b*2;m.push(X,X+2,X+1,X+1,X+2,X+3)}}let M=new je;M.setAttribute("position",new Ge(g,3)),M.setIndex(m),M.computeVertexNormals();let y=Rt(t,"Flowing turquoise river",M,_);y.castShadow=!1,y.receiveShadow=!1;let x=new At({color:8047042,emissive:3108205,emissiveIntensity:.14,transparent:!0,opacity:.7,roughness:.32,side:_t}),E=Rt(t,"Front waterfall",new zn(oo(11.06)*2,3,36,8),x,In(11.06),-1.25,11.06);E.castShadow=!1;let A=new Ot({color:14874590,transparent:!0,opacity:.72}),D=[];for(let b=0;b<60;b++){let v=Rt(t,"Waterfall white filament",new zn(.025+nt()*.045,.35+nt()*.95),A,In(11.06)+(nt()-.5)*(oo(11.06)*2-.3),-nt()*2.8,11.08+nt()*.035);v.userData.phase=nt()*3,D.push(v),v.castShadow=!1}let O=[];for(let b=0;b<96;b++){let v=-10.5+nt()*21.3,I=In(v)+(nt()-.5)*5.74,V=Rt(t,"Drifting foam",new wn(.1+nt()*.2,.012,3,9,Math.PI*(.5+nt())),A,I,.25,v);V.rotation.x=-Math.PI/2,V.rotation.z=nt()*6,V.scale.x=1.4,V.userData.originZ=v,V.userData.xOffset=I-In(v),V.userData.phase=nt()*6,O.push(V),V.castShadow=!1}for(let b=0;b<22;b++){let v=-9+nt()*19,I=In(v)+(nt()-.5)*5.6;if(Math.abs(v-1.5)<3.3)continue;let V=Rt(t,"River boulder",new Tn(.32+nt()*.35,0),ih[b%5],I,.25,v);V.scale.set(1,.65,1.3),V.rotation.y=nt()*6,Rt(t,"River boulder moss",new Tn(.27,0),Ks[b%5],I,.46,v).scale.set(1,.3,1.2)}return e?ry(t):(oy(t),t.children.find(v=>v.name==="Stone bridge \xB7 complete arch vault").scale.set(1.4,1,1.4)),{root:t,waterUniforms:p,falls:D,ripples:O}}function ry(s){let e=[{name:"west bank",x0:-4.2,x1:-3.2,thickness:.4,ends:[[2.236,2.90522],[2.236,2.89569],[2.236,2.87815],[2.236,2.87397],[2.236,2.7438],[2.236,2.89975],[2.236,2.89395],[2.236,2.88834],[2.236,2.88337]]},{name:"west deck seam",x0:-1,x1:-.3,thickness:.36,ends:[[3.83646,3.97298],[3.83735,3.97614],[3.83736,3.98056],[3.83675,3.98451],[3.73975,3.91904],[3.84065,4.01796],[3.84163,4.01554],[3.84167,4.01476],[3.84341,4.01559]]},{name:"east deck seam",x0:3.2,x1:3.9,thickness:.22,ends:[[3.91225,3.74379],[3.90681,3.73395],[3.89988,3.72383],[3.89458,3.71463],[3.83218,3.57135],[3.89682,3.6896],[3.90394,3.70544],[3.9106,3.72259],[3.91767,3.73843]]},{name:"east bank",x0:6.2,x1:6.9,thickness:.24,ends:[[2.67826,2.236],[2.67132,2.236],[2.66241,2.236],[2.65059,2.236],[2.53921,2.236],[2.66019,2.236],[2.65749,2.236],[2.65189,2.236],[2.64702,2.236]]}],t=Js(12237210);for(let n of e){let i=[],r=[],o=n.ends.length,a=o*2;for(let h of[!1,!0])for(let u=0;u<o;u++)for(let f=0;f<2;f++)i.push(f?n.x1:n.x0,n.ends[u][f]-(h?n.thickness:0),.7+u*.2);for(let h=0;h<o-1;h++){let u=h*2,f=u+1,d=u+2,p=u+3;r.push(u,d,f,f,d,p,a+u,a+f,a+d,a+f,a+p,a+d),r.push(u,a+u,d,d,a+u,a+d,f,p,a+f,p,a+p,a+f)}r.push(0,1,a,1,a+1,a,a-2,a*2-2,a-1,a-1,a*2-2,a*2-1);let l=new je;l.setAttribute("position",new Ge(i,3)),l.setIndex(r),l.computeVertexNormals(),l.scale(.7,1,.7),l.translate(1.25*.3,0,1.5*.3);let c=Rt(s,`Bridge approach ramp \xB7 ${n.name}`,l,t);c.userData.walkableBridgeTransition=!0,c.userData.intentionalBridgeContact=!0,c.userData.dimensions={length:(n.x1-n.x0)*.7,width:1.12,thickness:n.thickness},c.userData.bridgePlacement={x:1.25,z:1.5,y:.5,width:9.24,height:3.8,depth:3.92}}}function oy(s){let e=new it;e.name="Stone bridge \xB7 complete arch vault",e.position.set(.9,0,1.5),s.add(e);let t=[11184512,12038794,10067065,12630416,9148282].map(a=>Js(a)),n=3.15,i=2.24,r=a=>i+.68*Math.cos(a/n*Math.PI/2),o=a=>.28+2.05*Math.sqrt(Math.max(0,1-(a/n)**2));for(let a=0;a<19;a++){let l=-n+a/19*n*2,c=-n+(a+1)/19*n*2-.025,h=new on;h.moveTo(l,o(l)),h.lineTo(c,o(c)),h.lineTo(c,r(c)),h.lineTo(l,r(l)),h.closePath();let u=new bi(h,{depth:2.05,bevelEnabled:!0,bevelThickness:.025,bevelSize:.024,bevelSegments:1,steps:1}),f=Rt(e,"Arch voussoir "+a,u,t[a%5],0,0,-1.025)}for(let a=0;a<21;a++){let l=-n+(a+.5)/21*n*2,c=r(l),h=Rt(e,"Deck paving slab",new Zt(n*2/21-.018,.13,1.94),t[(a+1)%5],l,c+.05,0);h.rotation.z=-.68*Math.PI/(2*n)*Math.sin(l/n*Math.PI/2);for(let u of[-1.02,1.02]){let f=Rt(e,"Mossy stone parapet",new Zt(.295,.43,.3),t[(a+3)%5],l,c+.33,u);f.rotation.z=h.rotation.z;let d=Rt(e,"Parapet coping",new Zt(.31,.095,.36),t[(a+2)%5],l,c+.59,u);d.rotation.z=h.rotation.z}}for(let a of[-3.1,3.1])for(let l of[-.9,.9])Rt(e,"Bridge footing",new Zt(.65,1.65,.7),t[2],a,1.36,l);for(let a=0;a<12;a++){let l=(nt()-.5)*5.7,c=a%2?1.22:-1.22;Rt(e,"Tiny bridge moss",new Tn(.11+nt()*.08,0),Ks[a%5],l,r(l)+.38,c).scale.set(1.7,.55,.4)}}function uf(s,{rodin:e=!1,expanded:t=!1}={}){let n=new it;n.name="Handcrafted woodland settlement",s.add(n);let i=(C,L={})=>new At({color:C,roughness:.88,flatShading:!0,...L}),r=i("#64452f"),o=i("#a47b4c"),a=i("#3d3228"),l=i("#d9c99b"),c=i("#84887b"),h=i("#a4a38c"),u=["#b65d3b","#c77548","#d28a54","#b96d47","#d79b65"].map(C=>i(C)),f=["#427579","#4f8c8b","#639c96","#3d6e73"].map(C=>i(C)),d=i("#c4a65d",{metalness:.35}),p=i("#545d55",{metalness:.55}),_=i("#ffce75",{emissive:"#ffb54c",emissiveIntensity:1.35}),g=i("#b9b386",{side:_t}),m=0;function M(C,L,w,H,G=n){let F=new ot(C,L);return F.name=w||`Settlement detail ${++m}`,H&&F.position.set(...H),F.castShadow=!0,F.receiveShadow=!0,G.add(F),F}function y(C,L,w,H=r,G=n){return M(new Zt(...w),H,C,L,G)}function x(C,L,w,H=.1,G=r,F=n,te=H){let U=new N(...L),ue=new N(...w),re=ue.clone().sub(U),B=M(new Zt(H,re.length(),te),G,C,U.clone().add(ue).multiplyScalar(.5).toArray(),F);return B.quaternion.setFromUnitVectors(new N(0,1,0),re.normalize()),B}function E(C,L,w,H,G,F=r,te=n,U=10){return M(new fn(w,H,G,U),F,C,L,te)}function A(C,L,w=n){let H=new it;return H.name=C,H.position.set(...L),w.add(H),H}function D(C,L,w,H,G,F,te){let U=L/2,ue=Math.atan2(G,U),re=Math.hypot(U,G);for(let B of[-1,1]){let $=y(`${te} roof deck ${B}`,[B*U/2,H+G/2,0],[re+.12,.13,w],a,C);$.rotation.z=-B*ue;let le=Math.ceil(re/.36),be=Math.ceil(w/.37);for(let xe=0;xe<le;xe++)for(let Re=0;Re<be;Re++){let Ee=(xe+.5)/le,P=B*U*Ee,ie=H+G*(1-Ee)+.085,oe=-w/2+(Re+.5)*w/be+(xe%2?.07:0),ne=y(`${te} fired tile ${B} ${xe} ${Re}`,[P,ie,oe],[re/le+.075,.075,w/be+.025],F[(xe*3+Re*7+(B+1))%F.length],C);ne.rotation.z=-B*ue}x(`${te} carved eave ${B}`,[B*(U+.035),H,-w/2-.11],[B*(U+.035),H,w/2+.11],.16,o,C)}x(`${te} ridge cap`,[0,H+G+.17,-w/2-.15],[0,H+G+.17,w/2+.15],.18,o,C);for(let B of[-w/2-.08,w/2+.08])x(`${te} gable fascia left`,[-U-.08,H,B],[0,H+G+.1,B],.16,o,C),x(`${te} gable fascia right`,[0,H+G+.1,B],[U+.08,H,B],.16,o,C),x(`${te} ridge finial`,[0,H+G+.06,B],[0,H+G+.43,B+(B>0?.15:-.15)],.11,r,C)}if(!t){let w=function(F,te,U=!1){let ue=A("Warm leaded cottage window",F,te);U&&(ue.rotation.y=Math.PI/2),y("Window dark inset",[0,0,0],[1.08,1.2,.12],a,ue),y("Window honey glass",[0,0,.075],[.89,1.01,.045],_,ue);for(let re of[-.49,0,.49])y("Window mullion",[re,0,.13],[.075,1.17,.07],r,ue);for(let re of[-.55,0,.55])y("Window cross rail",[0,re,.13],[1.08,.07,.07],r,ue);y("Window sill",[0,-.64,.17],[1.27,.13,.36],o,ue);for(let re of[-1,1]){y("Open shutter",[re*.76,0,.02],[.39,1.13,.08],o,ue);for(let B=0;B<3;B++)y("Shutter board seam",[re*.76-.13+B*.13,0,.075],[.025,1.06,.02],r,ue);for(let B of[-.38,.38])y("Shutter brace",[re*.76,B,.09],[.42,.065,.03],r,ue)}},C=A("Wayfarer cottage",[-5.4,2.2,-3.9]);y("Cottage foundation",[0,.24,0],[4.3,.48,3.5],c,C);for(let F=0;F<2;F++)for(let te=0;te<8;te++)y(`Front foundation block ${F} ${te}`,[-1.86+te*.53+F%2*.08,.12+F*.23,1.77],[.48,.2,.13],te%3?h:c,C);y("Cream plaster cottage walls",[0,1.65,0],[4.05,2.45,3.35],l,C);for(let F of[-1.69,1.69]){let te=new on;te.moveTo(-2.025,2.83),te.lineTo(2.025,2.83),te.lineTo(0,4.35),te.closePath(),M(new bi(te,{depth:.12,bevelEnabled:!1}),l,"Cream gable wall",[0,0,F],C),x("Gable central king post",[0,2.8,F+.14],[0,4.23,F+.14],.14,r,C),x("Gable diagonal left",[-1.85,2.83,F+.14],[0,4.25,F+.14],.12,r,C),x("Gable diagonal right",[1.85,2.83,F+.14],[0,4.25,F+.14],.12,r,C);for(let U of[-2.05,-.52,2.05])y("Cottage vertical timber",[U,1.65,F+.1],[.15,2.5,.17],r,C);for(let U of[.58,1.18,2.82])y("Cottage horizontal timber",[0,U,F+.12],[4.23,.15,.17],r,C)}for(let F of[-2.08,2.08]){for(let te of[-1.7,0,1.7])y("Side wall post",[F,1.66,te],[.17,2.5,.16],r,C);for(let te of[.58,1.18,2.82])y("Side wall beam",[F,te,0],[.17,.15,3.45],r,C)}D(C,4.75,4.08,2.87,1.62,u,"Terracotta main");let L=A("Blue roof rear annex",[1.03,0,-2.18],C);y("Annex stone foot",[0,.25,0],[2.8,.5,2.2],c,L),y("Annex plaster",[0,1.5,0],[2.65,2.2,2.1],l,L);for(let F of[-1.36,1.36])for(let te of[-1.05,1.05])y("Annex corner beam",[F,1.52,te],[.15,2.28,.15],r,L);D(L,3.13,2.65,2.6,1.17,f,"Teal rear"),y("Chimney shaft",[-1.12,4.02,-1.1],[.52,1.45,.56],h,C),y("Chimney cap",[-1.12,4.77,-1.1],[.7,.17,.74],c,C),y("Chimney dark opening",[-1.12,4.87,-1.1],[.38,.015,.42],a,C);for(let F=0;F<5;F++)y("Chimney stone seam",[-1.12,3.5+F*.25,-.806],[.53,.025,.015],c,C);w([-1.25,1.98,1.87],C),w([2.19,1.98,-.65],C,!0),y("Door recess",[.89,1.46,1.85],[1.2,1.9,.16],a,C);for(let F=0;F<6;F++)y(`Oak door plank ${F}`,[.4+F*.19,1.43,1.96],[.176,1.74,.1],F%2?o:r,C);for(let F of[.82,1.98])y("Door iron crossbar",[.88,F,2.03],[1.03,.07,.055],p,C);M(new wn(.075,.021,5,12),d,"Door brass ring",[1.19,1.39,2.09],C),y("Door carved lintel",[.88,2.46,1.96],[1.45,.16,.29],o,C);for(let F=0;F<8;F++)y("Porch floorboard",[-1.35+F*.24,.54,2.2],[.225,.12,.92],o,C);for(let F of[-2.1,-.35])y("Porch upright",[F,1.7,2.63],[.14,2.35,.14],r,C),x("Porch corner brace",[F,2.32,2.63],[F+(F<-1?.4:-.4),2.68,2.63],.09,o,C);y("Porch railing",[-1.24,1.18,2.63],[1.86,.12,.12],o,C);for(let F=0;F<6;F++)y("Porch rail spindle",[-2+F*.31,.87,2.63],[.065,.56,.065],r,C);let H=y("Small porch canopy",[-1.22,2.77,2.22],[2.12,.14,1.2],r,C);H.rotation.x=.13;for(let F=0;F<6;F++)y("Porch canopy slat",[-2.08+F*.35,2.87,2.22],[.31,.08,1.2],u[F%5],C).rotation.x=.13;for(let F=0;F<4;F++)y("Entry stair "+F,[.95,.08+F*.12,3.05-F*.28],[1.58,.15+F*.24,.4],F%2?c:h,C);let G=A("Entry hanging lantern",[1.75,2.2,2.05],C);y("Lantern wall bracket",[0,.29,-.09],[.06,.07,.36],p,G),y("Lantern glowing core",[0,0,.1],[.18,.25,.18],_,G);for(let F of[-.12,.12])for(let te of[-.02,.22])y("Lantern metal corner",[F,0,te],[.025,.31,.025],p,G);y("Lantern top",[0,.18,.1],[.31,.07,.31],p,G),y("Lantern bottom",[0,-.18,.1],[.29,.06,.29],p,G)}function O(C,L=1,w=n){let H=A("Coopered oak barrel",C,w);H.scale.setScalar(L),E("Barrel stave body",[0,.43,0],.34,.34,.82,o,H,12);for(let G=0;G<12;G++){let F=G*Math.PI/6;x("Barrel stave dark joint",[Math.cos(F)*.343,.06,Math.sin(F)*.343],[Math.cos(F)*.343,.8,Math.sin(F)*.343],.017,r,H)}for(let G of[.14,.7])E("Barrel iron hoop",[0,G,0],.36,.36,.055,p,H,12);E("Barrel wooden lid",[0,.86,0],.32,.32,.04,r,H,12);for(let G=-2;G<=2;G++)y("Barrel lid seam",[G*.11,.885,0],[.014,.01,.49],a,H);return H}function b(C,L=.7,w=n){let H=A("Braced supply crate",C,w);y("Crate boards",[0,L/2,0],[L,L,L],o,H);for(let G of[-L/2-.02,L/2+.02]){for(let F=0;F<5;F++)y("Crate plank joint",[-L/2+(F+.5)*L/5,L/2,G],[.018,L,.018],r,H);for(let F of[-L/2+.05,L/2-.05])y("Crate corner batten",[F,L/2,G],[.09,L,.06],r,H);for(let F of[.06,L-.06])y("Crate horizontal batten",[0,F,G],[L,.09,.06],r,H);x("Crate diagonal brace",[-L*.39,.13,G+.04],[L*.39,L-.13,G+.04],.085,r,H,.04)}return H}if(t||(O([-3.14,2.2,-1.59],.85),O([-3.7,2.2,-1.17],.7)),!e){let C=A("Merchant wooden handcart",[-7,2.2,-.4]);C.rotation.y=-.18;for(let L=0;L<6;L++)y("Cart bed plank",[-.66+L*.26,.64,0],[.24,.12,1.85],o,C);for(let L of[-.83,.83]){for(let w=0;w<3;w++)y("Cart sideboard",[L,.85+w*.19,0],[.09,.16,1.93],o,C);for(let w of[-.85,.85])y("Cart side stake",[L,1.04,w],[.13,.9,.13],r,C);x("Cart forward shaft",[L,.66,.6],[L,.34,2.22],.105,r,C)}for(let L of[-.93,.93])for(let w=0;w<3;w++)y("Cart end board",[0,.85+w*.19,L],[1.65,.16,.1],o,C);x("Cart wheel axle",[-1.13,.52,0],[1.13,.52,0],.14,p,C);for(let L of[-1.02,1.02]){let w=A("Spoked wooden cart wheel",[L,.55,0],C),H=M(new wn(.51,.075,6,16),r,"Wooden wheel rim",[0,0,0],w);H.rotation.y=Math.PI/2;let G=M(new wn(.55,.025,4,16),p,"Wheel iron tire",[0,0,0],w);G.rotation.y=Math.PI/2;let F=E("Wheel wooden hub",[0,0,0],.12,.12,.24,o,w,10);F.rotation.z=Math.PI/2;for(let te=0;te<10;te++){let U=te*Math.PI/5;x("Wheel radial spoke",[0,0,0],[0,Math.cos(U)*.49,Math.sin(U)*.49],.045,o,w)}}b([-.35,.71,-.43],.65,C),b([.4,.71,-.42],.55,C);for(let L of[-.35,.3])M(new kn(.37,2),i("#c8bc88"),"Linen grain sack",[L,1.04,.4],C).scale.set(.8,1.2,.8),E("Tied sack neck",[L,1.49,.4],.065,.12,.12,r,C,7)}if(!t){let C=A("Ranger canvas tent",[-2.25,2.2,-2.7]);C.rotation.y=.28;let L=new je;L.setAttribute("position",new Ge([-1,0,-.85,0,1.75,-.85,-1,0,.85,0,1.75,-.85,0,1.75,.85,-1,0,.85,1,0,-.85,1,0,.85,0,1.75,-.85,0,1.75,-.85,1,0,.85,0,1.75,.85,-1,0,-.85,1,0,-.85,0,1.75,-.85],3)),L.computeVertexNormals(),M(L,g,"Stitched olive canvas",null,C);for(let H of[-.88,.88]){x("Tent pole left",[-1.03,0,H],[.11,1.96,H],.055,r,C),x("Tent pole right",[1.03,0,H],[-.11,1.96,H],.055,r,C);for(let G of[-1.4,1.4])x("Tent rope",[0,1.68,H],[G,.07,H+(H>0?.55:-.55)],.014,o,C),x("Tent peg",[G,0,H+(H>0?.55:-.55)],[G,.23,H+(H>0?.55:-.55)],.035,r,C)}x("Tent ridge pole",[0,1.77,-1],[0,1.77,1.03],.07,r,C);let w=new je;w.setAttribute("position",new Ge([-1,0,.86,-.25,0,.86,0,1.75,.86,1,0,.86,0,1.75,.86,.52,0,.86],3)),w.computeVertexNormals(),M(w,g,"Open folded tent doorway",null,C),y("Tent bedroll",[0,.1,.1],[.55,.16,1.15],i("#758c7c"),C),b([-1.05,2.2,-2.25],.65),b([-3.4,2.2,-3.05],.55)}let v=A("Stone ring campfire",t?[-8.5,2.2,1.5]:[-2.5,2.2,0]);for(let C=0;C<9;C++){let L=C*Math.PI*2/9,w=M(new Tn(.2,0),C%2?c:h,"Fire ring stone",[Math.cos(L)*.56,.12,Math.sin(L)*.56],v);w.scale.set(1.15,.68,.9),w.rotation.y=C}for(let C=0;C<4;C++){let L=E("Firewood log",[0,.14+C*.03,0],.09,.11,.9,C%2?r:a,v,7);L.rotation.z=Math.PI/2,L.rotation.y=C*Math.PI/4}let I=i("#ff671f",{emissive:"#ff4913",emissiveIntensity:2}),V=[i("#ff992b",{emissive:"#ff7417",emissiveIntensity:2.4}),i("#ffcc48",{emissive:"#ffb52b",emissiveIntensity:2.7}),i("#fff19b",{emissive:"#ffda4f",emissiveIntensity:3})];M(new qi(.25,9,5),I,"Glowing coal bed",[0,.18,0],v).scale.y=.25;let X=[];for(let C=0;C<7;C++){let L=C*2.4,w=C?.19:0,H=M(new Wi(C?.13:.21,C?.43:.73,5),V[C%3],"Animated golden flame "+C,[Math.cos(L)*w,.36+(C?0:.13),Math.sin(L)*w],v);H.rotation.z=Math.sin(C)*.18,H.userData.baseY=H.position.y,H.userData.phase=C*1.71,H.castShadow=!1,X.push(H)}let ee=new Xn("#ff9c43",11,7,2);ee.position.set(0,.85,0),v.add(ee);let Q=new Xn("#ffd38c",4,5,2);Q.position.set(...t?[-8,4,-1.7]:[-3.7,4.2,-1.7]),n.add(Q);for(let C of t?[[-9.65,2.2,1.5],[-8.7,2.2,2.7]]:[[-3.55,2.2,.65],[-1.37,2.2,.63]]){let L=A("Camp tree stump stool",C);E("Stump bark",[0,.24,0],.3,.38,.48,r,L,9),E("Stump cut wood",[0,.49,0],.29,.29,.035,o,L,12);for(let w of[.1,.2]){let H=M(new wn(w,.008,3,16),r,"Tree stump growth ring",[0,.514,0],L);H.rotation.x=Math.PI/2}}if(!t){let C=A("Forgotten brass-bound treasure chest",[7,2.2,-1]);C.rotation.y=-.35,y("Chest bottom",[0,.29,0],[1.12,.58,.77],r,C);for(let U=0;U<5;U++)y("Chest face oak plank",[0,.07+U*.11,.397],[1.09,.095,.035],o,C);let L=[],w=[],H=10;for(let U of[-.57,.57])for(let ue=0;ue<=H;ue++){let re=ue*Math.PI/H;L.push(U,.57+Math.sin(re)*.38,Math.cos(re)*.39)}for(let U=0;U<H;U++)w.push(U,H+1+U,U+1,U+1,H+1+U,H+2+U);let G=L.length/3;L.push(-.57,.57,0);let F=L.length/3;L.push(.57,.57,0);for(let U=0;U<H;U++)w.push(G,U+1,U,F,H+1+U,H+2+U);let te=new je;te.setAttribute("position",new Ge(L,3)),te.setIndex(w),te.computeVertexNormals(),M(te,i("#997347",{side:_t}),"Chest curved wooden lid",null,C);for(let U of[-.45,.45]){for(let ue=0;ue<H;ue++){let re=ue*Math.PI/H,B=(ue+1)*Math.PI/H;x("Chest lid brass strap",[U,.58+Math.sin(re)*.39,Math.cos(re)*.4],[U,.58+Math.sin(B)*.39,Math.cos(B)*.4],.055,d,C)}for(let ue of[-.41,.41])y("Chest vertical brass binding",[U,.29,ue],[.065,.59,.035],d,C)}for(let U of[.06,.56])for(let ue of[-.41,.41])y("Chest brass rim",[0,U,ue],[1.15,.045,.035],d,C);y("Chest lock plate",[0,.47,.433],[.17,.23,.05],d,C),y("Chest keyhole",[0,.47,.465],[.035,.07,.012],a,C);for(let U of[-.6,.6]){let ue=M(new wn(.11,.02,5,12),d,"Chest carrying ring",[U,.33,0],C);ue.rotation.y=Math.PI/2}}return{campfire:v,flames:X,lights:[ee,Q],root:n}}var df={cart:"\u63A8\u8F66",tree:"\u53E4\u6811",rock:"\u82D4\u77F3",grass:"\u8349\u4E1B",cottage:"\u68EE\u6797\u6728\u5C4B",tent:"\u5E06\u5E03\u5E10\u7BF7",barrel:"\u6A61\u6728\u6876",crate:"\u8865\u7ED9\u6728\u7BB1",chest:"\u5B9D\u7BB1",bridge:"\u77F3\u62F1\u6865",outcrop:"\u82D4\u85D3\u5047\u5C71",crystal:"\u84DD\u8272\u6676\u7C07",fern_large:"\u5927\u8568\u8349"},yt=(s,e,t,n,i,r=0,o="max",a={})=>({id:s,kind:e,x:t,z:n,size:i,rotation:r,axis:o,...a}),ff=[yt("cottage","cottage",-6.5,-4.5,5.4),yt("tent","tent",-10,4.6,3.35),yt("cart","cart",-11.4,.5,3.8),yt("barrel-a","barrel",-10.7,-3.4,1.25,0,"y"),yt("barrel-b","barrel",-10.7,-5,1.1,.5,"y"),yt("crate-a","crate",-10.7,-6.25,.95,.1),yt("crate-b","crate",-12.4,4.3,1.05,.2),yt("crate-c","crate",-8.4,6.95,.85,-.1),yt("chest","chest",7.1,-1.3,1.95,.1),yt("bridge","bridge",1.25,1.5,9.24,0,"x",{y:.5,height:3.8,depth:3.92,alignLongAxis:!0}),yt("outcrop","outcrop",9.2,-5.8,5.6,-.25,"y"),yt("crystal-a","crystal",5,-3.2,2.25,.3),yt("crystal-b","crystal",9.4,5.4,2.05,1.6),yt("crystal-c","crystal",-12,9,1.45,.6),yt("tree-a","tree",-13.1,-7.8,7,1.5,"y"),yt("tree-c","tree",4.8,-9.5,6.3,0,"y"),yt("tree-d","tree",13.1,-6.8,6,Math.PI/2,"y"),yt("tree-e","tree",-13.1,-3.6,7.3,1.5,"y"),yt("tree-f","tree",13.2,-.1,7.2,1.5,"y"),yt("tree-g","tree",-13.2,6.65,6,Math.PI/2,"y"),yt("tree-h","tree",12.1,7.8,6.2,0,"y"),...[[-3.8,8.7,2.5,2.1],[5.5,8.8,2.6,3.3],[11.6,3.2,2.2,4.4],[-13.2,3,1.45,5.2],[-4,4.8,1.5,.3],[4.5,-5.6,1.5,2.2]].map((s,e)=>yt(`rock-${e}`,"rock",...s)),...[[-9.1,8.7,1.5,.2],[-3.4,6.8,2.1,1.1],[5.1,6.7,2.1,2.3],[10.8,.1,2,3.4],[5.3,-7.15,1.65,4],[-10.3,-8.9,1.3,.7],[-4.6,3.9,1.3,1.7],[7.6,4.3,1.6,2.7],[9.5,8,1.65,1.5]].map((s,e)=>yt(`fern-${e}`,"fern_large",...s)),...[[-12,2.6,.9],[-9.8,-9.3,.8],[-2.7,9.5,.8],[-2.4,7.4,.85],[7.1,9,.85],[10.7,6.3,.85],[13.8,3.7,.9],[12.2,-3.3,.9],[7.2,-8.6,.9],[-6.3,10,.7],[4.1,4.7,.95],[6.7,5.8,.9],[-5.1,5.5,.75],[-7.5,-8.9,.65],[5.5,-1.3,.75],[7.7,7.4,.8]].map((s,e)=>yt(`grass-${e}`,"grass",...s,e*2.399,"y"))].map(s=>s.kind==="bridge"?s:{...s,x:s.x+(s.x<1.25?-1.5:1.5)}),rh=[{id:"bridge approach",x0:-3.8,z0:1.5,x1:6,z1:1.5,width:1.8},{id:"cottage entrance",x0:-6.2,z0:-.8,x1:-5.2,z1:1.4,width:1.35},{id:"left meadow trail",x0:-5.2,z0:1.4,x1:-7.5,z1:8.8,width:1.2},{id:"tent entrance",x0:-10,z0:6.24,x1:-10,z1:7.3,width:1.1}].map(s=>s.id==="bridge approach"?{...s,x0:s.x0-1.5,x1:s.x1+1.5,width:2.24}:{...s,x0:s.x0-1.5,x1:s.x1-1.5});function oh(s,e,t){let n=t.x1-t.x0,i=t.z1-t.z0,r=Math.max(0,Math.min(1,((s-t.x0)*n+(e-t.z0)*i)/(n*n+i*i)));return Math.hypot(s-t.x0-r*n,e-t.z0-r*i)}var pf=[];function mf(s){pf=s}function mc(s,e,t=0){return rh.some(n=>oh(s,e,n)<n.width/2+t+.15)||Math.hypot(s+8.5,e-1.5)<1.7+t?!0:pf.some(n=>s>n.minX-t-.15&&s<n.maxX+t+.15&&e>n.minZ-t-.15&&e<n.maxZ+t+.15)}function gf(s,{rodin:e=!1,expanded:t=!1}={}){let n=81397,i=()=>(n=n*1664525+1013904223>>>0,n/4294967296),r=(U,ue)=>U+i()*(ue-U),o=(U,ue={})=>new At({color:U,roughness:.89,...ue}),a=[o("#685c43"),o("#7c7352"),o("#938561"),o("#4a5242")],l=["#467351","#5e8751","#86a355","#b2bb68","#375e4d","#79954e"].map(U=>o(U)),c=["#7eaa54","#9aba63","#b6c67a","#4d8157"].map(U=>o(U,{side:_t})),h=["#758b79","#91a18c","#627d73","#9ca98d"].map(U=>o(U)),u=o("#91b65d"),f=o("#6fe0ee",{emissive:"#2f94ad",emissiveIntensity:.38,metalness:.13,roughness:.35}),d=o("#427fa5"),p=o("#4e9b7c",{side:_t}),_=o("#ffda83",{emissive:"#ffb954",emissiveIntensity:.5}),g=new it;g.name="Authored forest and flora",s.add(g);let m=new kn(1,2),M=new qi(1,8,6),y=U=>new N(...U);function x(U,ue,re=g){let B=new ot(U,ue);return B.castShadow=!0,B.receiveShadow=!0,re.add(B),B}function E(U,ue,re,B=g,$=m){let le=x($,re,B);return le.position.set(...U),le.scale.set(...ue),le}function A(U,ue,re,B,$,le=g,be=8){let xe=y(U),Re=y(ue),Ee=Re.clone().sub(xe),P=x(new fn(B,re,Ee.length(),be),$,le);return P.position.copy(xe.add(Re).multiplyScalar(.5)),P.quaternion.setFromUnitVectors(new N(0,1,0),Ee.normalize()),P}let D=new kn(1,2),O=D.attributes.position;for(let U=0;U<O.count;U++){let ue=O.getX(U),re=O.getY(U),B=O.getZ(U),$=1+.07*Math.sin(ue*17+B*13)*Math.cos(re*21);O.setXYZ(U,ue*$,re*$,B*$)}D.computeVertexNormals();function b(U,ue,re,B,$){let le=new it;le.name="Branching ancient broadleaf",le.position.set(U,2.2,ue),g.add(le);let be=r(-.5,.5),xe=r(-.3,.3);A([0,0,0],[be*.5,re*.5,xe],B*.52,B*.32,a[0],le,11),A([be*.5,re*.5,xe],[be,re*.87,0],B*.33,B*.15,a[1],le,10);for(let Ee=0;Ee<7;Ee++){let P=Ee/7*Math.PI*2+i()*.4,ie=[Math.cos(P)*B*r(1.8,2.7),.02,Math.sin(P)*B*r(1.8,2.7)],oe=[ie[0]*.45,.25,ie[2]*.45];A([0,.6,0],oe,B*.28,B*.19,a[0],le),A(oe,ie,B*.19,.035,a[1],le)}let Re=[];for(let Ee=0;Ee<5;Ee++){let P=Ee*Math.PI*2/5+.4,ie=r(1.5,2.3)*B,oe=[be*.65,re*r(.43,.62),0],ne=[Math.cos(P)*ie*.57,re*.76,Math.sin(P)*ie*.57],Y=[Math.cos(P)*ie+be,re*r(.92,1.05),Math.sin(P)*ie];A(oe,ne,B*.23,B*.14,a[Ee%3],le),A(ne,Y,B*.15,.045,a[1],le),Re.push(Y);let me=[Y[0]+Math.sin(P)*.6,Y[1]-.2,Y[2]+Math.cos(P)*.65];A(ne,me,B*.1,.025,a[2],le)}Re.push([be,re*1.04,0]),Re.forEach((Ee,P)=>{let ie=B*r(1.25,1.8);E(Ee,[ie*1.15,ie*.72,ie],l[(P+$)%l.length],le,D);for(let oe=0;oe<3;oe++){let ne=oe*2.094+i();E([Ee[0]+Math.cos(ne)*ie*.65,Ee[1]+r(-.35,.6),Ee[2]+Math.sin(ne)*ie*.65],[ie*.69,ie*.52,ie*.66],l[(P+oe+$)%l.length],le,D)}});for(let Ee=0;Ee<4;Ee++){let P=Ee*Math.PI/2+.25;A([Math.cos(P)*B*.45,.55,Math.sin(P)*B*.45],[be*.4+Math.cos(P)*B*.28,re*.43,Math.sin(P)*B*.28],.025,.012,a[2],le,4)}for(let Ee=0;Ee<9;Ee++){let P=Ee*.61,ie=E([Math.cos(P)*B*.48,.35+Ee*.29,Math.sin(P)*B*.48],[.16,.23,.055],p,le,M);ie.rotation.z=P}}e||[[-9,-8.5,8.2,1.05,0],[-4.8,-10,8.6,.92,1],[0,-10.5,9.6,.92,4],[4.8,-10,8.4,1.05,0],[9.4,-9,10,1.1,3],[-13.5,-2.2,8.5,1,0],[-13.5,3.9,6.4,.78,1],[13.7,-3.8,8.3,.85,2],[-7.8,-10.3,9.2,.73,2],[7.9,-9.8,8.9,.76,1]].forEach(U=>b(...U));function v(U,ue,re,B=g,$=2.2){E([U,$+re*.28,ue],[re,re*.62,re*.75],h[Math.floor(i()*h.length)],B).rotation.set(r(-.2,.2),i()*6.28,r(-.12,.12)),E([U-re*.09,$+re*.65,ue],[re*.83,re*.12,re*.61],u,B)}e||[[-8,7,1.2],[-4.2,8.2,1.2],[-2.4,8.7,.85],[4.6,8.6,1],[8.8,6.3,1.3],[8,-5,1.1],[-8.9,-5.5,.7],[6.5,-7.7,1.3]].forEach(U=>v(...U));function I(U,ue,re){let B=new it;B.position.set(U,2.2,ue),B.name="Luminous blue crystal growth",g.add(B),v(0,0,re*.7,B,0);for(let le=0;le<7;le++){let be=le*2.399,xe=le===0?0:re*r(.2,.6),Re=re*r(.5,1.4),Ee=x(new fn(0,re*.17,Re,5,1),le%3===0?d:f,B);Ee.position.set(Math.cos(be)*xe,Re*.46+.15,Math.sin(be)*xe),Ee.rotation.z=Math.cos(be)*.18,Ee.rotation.x=Math.sin(be)*.18;let P=x(new fn(re*.17,re*.13,Re*.53,5),f,B);P.position.copy(Ee.position),P.position.y-=Re*.25,P.rotation.copy(Ee.rotation)}let $=new Xn("#55d7ff",1.5,3.6,2);$.position.set(0,.8,0),B.add($)}t||(I(7,-3,1),I(9,5,.9),I(-8.8,5.8,.65));let V=new on;V.moveTo(0,0),V.quadraticCurveTo(.33,.42,0,1),V.quadraticCurveTo(-.29,.38,0,0);let X=new Si(V,5);function ee(U,ue,re){if(t)return;let B=new it;B.position.set(U,2.24,ue),g.add(B);for(let $=0;$<7;$++){let le=$*.897,be=re*r(.65,1.1),xe=[Math.cos(le)*be*.72,be*.55,Math.sin(le)*be*.72];A([0,0,0],xe,.012,.005,p,B,4);for(let Re=1;Re<5;Re++){let Ee=Re/5;for(let P of[-1,1]){let ie=x(X,p,B);ie.position.set(xe[0]*Ee,xe[1]*Ee,xe[2]*Ee),ie.rotation.set(-.8,le+P*1.1,P*.7),ie.scale.setScalar(re*(1-Ee)*.46+.06)}}}}function Q(U,ue,re){if(t&&mc(U,ue,re*.3))return;let B=2.2,$=re*r(.45,.75);A([U,B,ue],[U+.04,B+$,ue],.011,.008,p,g,5);for(let be=0;be<5;be++){let xe=be*Math.PI*2/5,Re=E([U+Math.cos(xe)*re*.12,B+$+Math.sin(xe)*re*.12,ue],[re*.075,re*.16,re*.038],f,g,M);Re.rotation.z=-xe+Math.PI/2}E([U,B+$,ue+.035],[re*.06,re*.06,re*.06],_,g,M);let le=x(X,p);le.position.set(U,B+$*.3,ue),le.rotation.set(-.6,1.1,-.9),le.scale.setScalar(re*.4)}let C=new je;C.setAttribute("position",new Ge([-.045,0,0,.045,0,0,.065,.38,.025,.045,0,0,.11,.68,.06,.065,.38,.025],3)),C.computeVertexNormals();function L(U,ue,re){if(!e)for(let B=0;B<5;B++){let $=x(C,c[B%4]);$.position.set(U+r(-.11,.11),2.22,ue+r(-.11,.11)),$.rotation.y=i()*6.28,$.scale.setScalar(re*r(.7,1.3))}}function w(U,ue){return!(t&&Math.abs(U-1.25)<4.2||t&&mc(U,ue,.5)||U>-1.6&&U<3.8||U>-8.5&&U<-.8&&ue>-6.6&&ue<2.3||ue>0&&ue<2.7&&U>-3.4&&U<5||U>-6.1&&U<-3.4&&ue>2.6&&ue<7.9)}for(let U=0;U<180;U++){let ue=r(-10.3,10.3),re=r(-8.7,9.6);w(ue,re)&&(L(ue,re,r(.45,1.05)),U%9===0&&ee(ue+.2,re,r(.6,1)),U%(t?10:5)===0&&Q(ue-.1,re,r(.7,1)),!t&&U%13===0&&v(ue,re,r(.18,.35)))}[[-8,5.7,1.2],[-7.8,7.8,1.25],[-2.1,7.3,.8],[4.3,7.8,1.2],[9.1,2.9,1.1],[-8.7,-1.3,1]].forEach(U=>ee(...U)),[[-7.5,6.3,1.2],[-6.9,7.5,1],[-2.3,6.7,.9],[4.4,7.3,1],[8.4,4.7,1.1],[7.8,-3.7,1]].filter(U=>!t||w(U[0],U[1])&&!mc(U[0],U[1],U[2]*.3)).forEach(U=>Q(...U));let H=[],G=o("#89eeed",{emissive:"#3cbbd1",emissiveIntensity:.45,side:_t,roughness:.5}),F=new on;F.moveTo(0,0),F.bezierCurveTo(.14,.32,.48,.4,.4,.1),F.bezierCurveTo(.53,-.12,.13,-.3,0,0);let te=new Si(F,9);if([[-8,4,5],[-2,4.7,-6],[5.6,4.9,-4.5],[7,3.8,4],[-7,3.8,8],[1,7,-8]].forEach((U,ue)=>{let re=new it;re.name="Animated turquoise butterfly",re.position.set(...U),g.add(re);let B=[];for(let $ of[-1,1]){let le=new it,be=x(te,G,le);be.scale.x=$,re.add(le),B.push(le)}A([0,-.12,0],[0,.12,0],.022,.013,d,re,5),re.scale.setScalar(.55+ue*.025),re.rotation.x=-.35,H.push({group:re,wings:B,origin:y(U),phase:ue*1.7})}),!t){let B=function($,le,be,xe,Re,Ee){let P=[],ie=[],oe=[{h:0,r:1.1,dx:0,dz:0},{h:.28,r:1,dx:-.11,dz:.04},{h:.63,r:.9,dx:.05,dz:-.05},{h:.92,r:.84,dx:-.11,dz:.02},{h:1,r:.67,dx:-.17,dz:0}];oe.forEach((Y,me)=>re.forEach(([de,ye],Fe)=>{let Be=1+.06*Math.sin(Fe*2.1+Ee+me*.8);P.push($+(de*Y.r*Be+Y.dx)*xe,2.2+be*Y.h+(me===4?.1*Math.sin(Fe*2.8+Ee):0),le+(ye*Y.r*Be+Y.dz)*Re)}));for(let Y=0;Y<oe.length-1;Y++)for(let me=0;me<8;me++){let de=(me+1)%8,ye=Y*8+me,Fe=Y*8+de,Be=(Y+1)*8+me,R=(Y+1)*8+de;ie.push(ye,Be,Fe,Fe,Be,R)}for(let Y=1;Y<7;Y++)ie.push(32,32+Y+1,32+Y);let ne=new je;ne.setAttribute("position",new Ge(P,3)),ne.setIndex(ie);for(let Y=0;Y<ie.length;Y+=6)ne.addGroup(Y,Math.min(6,ie.length-Y),(Math.floor(Y/6)+Ee)%4);ne.computeVertexNormals(),x(ne,ue,U),E([$-xe*.14,2.2+be+.02,le],[xe*.64,.14,Re*.67],u,U);for(let Y=0;Y<3;Y++){let me=2.2+be*(.2+Y*.24),de=Y%2===0?-.45:.3;E([$+xe*de,me,le+Re*.73],[xe*.62,.12,Re*.3],ue[(Y+1)%4],U),E([$+xe*de,me+.1,le+Re*.74],[xe*.57,.07,Re*.27],u,U)}for(let Y=0;Y<3;Y++){let me=null;for(let de=0;de<12;de++){let ye=de/11,Fe=2.2+be*(.95-ye*.72),Be=$+xe*(Y*.34-.44)+Math.sin(ye*8+Y)*.1,R=le+Re*(.68+.19*ye),S=[Be,Fe,R];me&&A(me,S,.014,.013,p,U,4);let K=E([Be+(de%2===0?.09:-.09),Fe-.04,R+.035],[.12,.17,.035],l[(Y+de)%3],U,M);K.rotation.z=de%2===0?-.65:.65,me=S}}if(Ee!==1)for(let Y=0;Y<3;Y++){let me=x(new Wi(.09+Y*.015,.38+Y*.12,5),f,U);me.position.set($-xe*.27+Y*.15,2.2+be*.46+Y*.08,le+Re*.85),me.rotation.z=(Y-1)*.25}},U=new it;U.name="Layered moss and ivy escarpment",g.add(U);let ue=["#8a9b91","#788d87","#617b78","#a1ada0"].map($=>o($,{flatShading:!0})),re=[[1,.05],[.74,.65],[.12,.91],[-.62,.76],[-1,.2],[-.79,-.62],[-.12,-.9],[.66,-.72]];B(7.45,-5.7,3.15,1.08,.91,0),B(8.9,-6.95,4.85,1.12,1.02,1),B(6.65,-7.75,4.05,.93,.86,2),B(9.45,-5.45,2.4,.73,.71,3)}return{butterflies:H}}var Qs=class extends Wn{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new fh(t)}),this.register(function(t){return new ph(t)}),this.register(function(t){return new Sh(t)}),this.register(function(t){return new Eh(t)}),this.register(function(t){return new Th(t)}),this.register(function(t){return new gh(t)}),this.register(function(t){return new _h(t)}),this.register(function(t){return new xh(t)}),this.register(function(t){return new yh(t)}),this.register(function(t){return new dh(t)}),this.register(function(t){return new vh(t)}),this.register(function(t){return new mh(t)}),this.register(function(t){return new bh(t)}),this.register(function(t){return new Mh(t)}),this.register(function(t){return new hh(t)}),this.register(function(t){return new wh(t)}),this.register(function(t){return new Ah(t)})}load(e,t,n,i){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let c=ci.extractUrlBase(e);o=ci.resolveURL(c,this.path)}else o=ci.extractUrlBase(e);this.manager.itemStart(e);let a=function(c){i?i(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Os(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,o,function(h){t(h),r.manager.itemEnd(e)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r,o={},a={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Mf){try{o[Qe.KHR_BINARY_GLTF]=new Rh(e)}catch(u){i&&i(u);return}r=JSON.parse(o[Qe.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new Uh(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,o[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let u=r.extensionsUsed[h],f=r.extensionsRequired||[];switch(u){case Qe.KHR_MATERIALS_UNLIT:o[u]=new uh;break;case Qe.KHR_DRACO_MESH_COMPRESSION:o[u]=new Ch(r,this.dracoLoader);break;case Qe.KHR_TEXTURE_TRANSFORM:o[u]=new Ih;break;case Qe.KHR_MESH_QUANTIZATION:o[u]=new Ph;break;default:f.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}};function ay(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}var Qe={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},hh=class{constructor(e){this.parser=e,this.name=Qe.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,h=new ze(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],Ft);let u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Ei(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Xn(h),c.distance=u;break;case"spot":c=new Kr(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),$n(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return n._getNodeRef(t.cache,a,l)})}},uh=class{constructor(){this.name=Qe.KHR_MATERIALS_UNLIT}getMaterialType(){return Ot}extendParams(e,t,n){let i=[];e.color=new ze(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Ft),e.opacity=o[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,bt))}return Promise.all(i)}},dh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}},fh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Kt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){let a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new _e(a,a)}return Promise.all(r)}},ph=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_DISPERSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Kt}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return t.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}},mh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Kt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(r)}},gh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_SHEEN}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Kt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[];t.sheenColor=new ze(0,0,0),t.sheenRoughness=0,t.sheen=1;let o=i.extensions[this.name];if(o.sheenColorFactor!==void 0){let a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],Ft)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,bt)),o.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(r)}},_h=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Kt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(r)}},xh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_VOLUME}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Kt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;let a=o.attenuationColor||[1,1,1];return t.attenuationColor=new ze().setRGB(a[0],a[1],a[2],Ft),Promise.all(r)}},yh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_IOR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Kt}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}},vh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_SPECULAR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Kt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));let a=o.specularColorFactor||[1,1,1];return t.specularColor=new ze().setRGB(a[0],a[1],a[2],Ft),o.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,bt)),Promise.all(r)}},Mh=class{constructor(e){this.parser=e,this.name=Qe.EXT_MATERIALS_BUMP}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Kt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(r)}},bh=class{constructor(e){this.parser=e,this.name=Qe.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Kt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(r)}},Sh=class{constructor(e){this.parser=e,this.name=Qe.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let r=i.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},Eh=class{constructor(e){this.parser=e,this.name=Qe.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=i.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},Th=class{constructor(e){this.parser=e,this.name=Qe.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=i.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},wh=class{constructor(e){this.name=Qe.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let l=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,f=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,f,i.mode,i.filter).then(function(d){return d.buffer}):o.ready.then(function(){let d=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(d),h,u,f,i.mode,i.filter),d})})}else return null}},Ah=class{constructor(e){this.name=Qe.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let c of i.primitives)if(c.mode!==gn.TRIANGLES&&c.mode!==gn.TRIANGLE_STRIP&&c.mode!==gn.TRIANGLE_FAN&&c.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],l={};for(let c in o)a.push(this.parser.getDependency("accessor",o[c]).then(h=>(l[c]=h,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{let h=c.pop(),u=h.isGroup?h.children:[h],f=c[0].count,d=[];for(let p of u){let _=new $e,g=new N,m=new Wt,M=new N(1,1,1),y=new Rr(p.geometry,p.material,f);for(let x=0;x<f;x++)l.TRANSLATION&&g.fromBufferAttribute(l.TRANSLATION,x),l.ROTATION&&m.fromBufferAttribute(l.ROTATION,x),l.SCALE&&M.fromBufferAttribute(l.SCALE,x),y.setMatrixAt(x,_.compose(g,m,M));for(let x in l)if(x==="_COLOR_0"){let E=l[x];y.instanceColor=new vi(E.array,E.itemSize,E.normalized)}else x!=="TRANSLATION"&&x!=="ROTATION"&&x!=="SCALE"&&p.geometry.setAttribute(x,l[x]);xt.prototype.copy.call(y,p),this.parser.assignFinalMaterial(y),d.push(y)}return h.isGroup?(h.clear(),h.add(...d),h):d[0]}))}},Mf="glTF",ao=12,_f={JSON:1313821514,BIN:5130562},Rh=class{constructor(e){this.name=Qe.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,ao),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Mf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-ao,r=new DataView(e,ao),o=0;for(;o<i;){let a=r.getUint32(o,!0);o+=4;let l=r.getUint32(o,!0);if(o+=4,l===_f.JSON){let c=new Uint8Array(e,ao+o,a);this.content=n.decode(c)}else if(l===_f.BIN){let c=ao+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Ch=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Qe.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(let h in o){let u=Dh[h]||h.toLowerCase();a[u]=o[h]}for(let h in e.attributes){let u=Dh[h]||h.toLowerCase();if(o[h]!==void 0){let f=n.accessors[e.attributes[h]],d=js[f.componentType];c[u]=d.name,l[u]=f.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,f){i.decodeDracoFile(h,function(d){for(let p in d.attributes){let _=d.attributes[p],g=l[p];g!==void 0&&(_.normalized=g)}u(d)},a,c,Ft,f)})})}},Ih=class{constructor(){this.name=Qe.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},Ph=class{constructor(){this.name=Qe.KHR_MESH_QUANTIZATION}},gc=class extends ri{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let o=0;o!==i;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,h=i-t,u=(n-t)/h,f=u*u,d=f*u,p=e*c,_=p-c,g=-2*d+3*f,m=d-f,M=1-g,y=m-f+u;for(let x=0;x!==a;x++){let E=o[_+x+a],A=o[_+x+l]*h,D=o[p+x+a],O=o[p+x]*h;r[x]=M*E+y*A+g*D+m*O}return r}},cy=new Wt,Lh=class extends gc{interpolate_(e,t,n,i){let r=super.interpolate_(e,t,n,i);return cy.fromArray(r).normalize().toArray(r),r}},gn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},js={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},xf={9728:Ut,9729:Gt,9984:Ta,9985:ks,9986:ji,9987:An},yf={33071:Ln,33648:bs,10497:yi},ah={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Dh={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ci={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},ly={CUBICSPLINE:void 0,LINEAR:zi,STEP:ki},ch={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function hy(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new At({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Sn})),s.DefaultMaterial}function ss(s,e,t){for(let n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function $n(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function uy(s,e,t){let n=!1,i=!1,r=!1;for(let c=0,h=e.length;c<h;c++){let u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);let o=[],a=[],l=[];for(let c=0,h=e.length;c<h;c++){let u=e[c];if(n){let f=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):s.attributes.position;o.push(f)}if(i){let f=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):s.attributes.normal;a.push(f)}if(r){let f=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):s.attributes.color;l.push(f)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){let h=c[0],u=c[1],f=c[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=f),s.morphTargetsRelative=!0,s})}function dy(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function fy(s){let e,t=s.extensions&&s.extensions[Qe.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+lh(t.attributes):e=s.indices+":"+lh(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+lh(s.targets[n]);return e}function lh(s){let e="",t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function Nh(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function py(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var my=new $e,Uh=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new ay,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,o=-1;if(typeof navigator<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let l=a.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&o<98?this.textureLoader=new Yr(this.options.manager):this.textureLoader=new Jr(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Os(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return ss(r,a,i),$n(a,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(let l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){let o=t[i].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let i=0,r=e.length;i<r;i++){let o=e[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),r=(o,a)=>{let l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(let[c,h]of o.children.entries())r(h,a.children[c])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Qe.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(r,o){n.load(ci.resolveURL(t.uri,i.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let o=ah[i.type],a=js[i.componentType],l=i.normalized===!0,c=new a(i.count*o);return Promise.resolve(new gt(c,o,l))}let r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],l=ah[i.type],c=js[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,f=i.byteOffset||0,d=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0,_,g;if(d&&d!==u){let m=Math.floor(f/d),M="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+m+":"+i.count,y=t.cache.get(M);y||(_=new c(a,m*d,i.count*d/h),y=new Cs(_,d/h),t.cache.add(M,y)),g=new Is(y,l,f%d/h,p)}else a===null?_=new c(i.count*l):_=new c(a,f,i.count*l),g=new gt(_,l,p);if(i.sparse!==void 0){let m=ah.SCALAR,M=js[i.sparse.indices.componentType],y=i.sparse.indices.byteOffset||0,x=i.sparse.values.byteOffset||0,E=new M(o[1],y,i.sparse.count*m),A=new c(o[2],x,i.sparse.count*l);a!==null&&(g=new gt(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let D=0,O=E.length;D<O;D++){let b=E[D];if(g.setX(b,A[D*l]),l>=2&&g.setY(b,A[D*l+1]),l>=3&&g.setZ(b,A[D*l+2]),l>=4&&g.setW(b,A[D*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=p}return g})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let l=n.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let i=this,r=this.json,o=r.textures[e],a=r.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);let f=(r.samplers||{})[o.sampler]||{};return h.magFilter=xf[f.magFilter]||Gt,h.minFilter=xf[f.minFilter]||An,h.wrapS=yf[f.wrapS]||yi,h.wrapT=yf[f.wrapT]||yi,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Ut&&h.minFilter!==Gt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let o=i.images[e],a=self.URL||self.webkitURL,l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=n.getDependency("bufferView",o.bufferView).then(function(u){c=!0;let f=new Blob([u],{type:o.mimeType});return l=a.createObjectURL(f),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let h=Promise.resolve(l).then(function(u){return new Promise(function(f,d){let p=f;t.isImageBitmapLoader===!0&&(p=function(_){let g=new Nt(_);g.needsUpdate=!0,f(g)}),t.load(ci.resolveURL(u,r.path),p,void 0,d)})}).then(function(u){return c===!0&&a.revokeObjectURL(l),$n(u,o),u.userData.mimeType=o.mimeType||py(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[Qe.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[Qe.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let l=r.associations.get(o);o=r.extensions[Qe.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,l)}}return i!==void 0&&(o.colorSpace=i),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new Bn,$t.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(a,l)),n=l}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new Mi,$t.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(a,l)),n=l}if(i||r||o){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=n.clone(),r&&(l.vertexColors=!0),o&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return At}loadMaterial(e){let t=this,n=this.json,i=this.extensions,r=n.materials[e],o,a={},l=r.extensions||{},c=[];if(l[Qe.KHR_MATERIALS_UNLIT]){let u=i[Qe.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),c.push(u.extendParams(a,r,t))}else{let u=r.pbrMetallicRoughness||{};if(a.color=new ze(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){let f=u.baseColorFactor;a.color.setRGB(f[0],f[1],f[2],Ft),a.opacity=f[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",u.baseColorTexture,bt)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=_t);let h=r.alphaMode||ch.OPAQUE;if(h===ch.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===ch.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==Ot&&(c.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new _e(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;a.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&o!==Ot&&(c.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==Ot){let u=r.emissiveFactor;a.emissive=new ze().setRGB(u[0],u[1],u[2],Ft)}return r.emissiveTexture!==void 0&&o!==Ot&&c.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,bt)),Promise.all(c).then(function(){let u=new o(a);return r.name&&(u.name=r.name),$n(u,r),t.associations.set(u,{materials:e}),r.extensions&&ss(i,u,r),u})}createUniqueName(e){let t=ft.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function r(a){return n[Qe.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return vf(l,a,t)})}let o=[];for(let a=0,l=e.length;a<l;a++){let c=e[a],h=fy(c),u=i[h];if(u)o.push(u.promise);else{let f;c.extensions&&c.extensions[Qe.KHR_DRACO_MESH_COMPRESSION]?f=r(c):f=vf(new je,c,t),i[h]={primitive:c,promise:f},o.push(f)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,i=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let l=0,c=o.length;l<c;l++){let h=o[l].material===void 0?hy(this.cache):this.getDependency("material",o[l].material);a.push(h)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(l){let c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let d=0,p=h.length;d<p;d++){let _=h[d],g=o[d],m,M=c[d];if(g.mode===gn.TRIANGLES||g.mode===gn.TRIANGLE_STRIP||g.mode===gn.TRIANGLE_FAN||g.mode===void 0)m=r.isSkinnedMesh===!0?new Tr(_,M):new ot(_,M),m.isSkinnedMesh===!0&&m.normalizeSkinWeights(),g.mode===gn.TRIANGLE_STRIP?m.geometry=nh(m.geometry,so):g.mode===gn.TRIANGLE_FAN&&(m.geometry=nh(m.geometry,Ws));else if(g.mode===gn.LINES)m=new Gi(_,M);else if(g.mode===gn.LINE_STRIP)m=new Vi(_,M);else if(g.mode===gn.LINE_LOOP)m=new Cr(_,M);else if(g.mode===gn.POINTS)m=new si(_,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(m.geometry.morphAttributes).length>0&&dy(m,r),m.name=t.createUniqueName(r.name||"mesh_"+e),$n(m,r),g.extensions&&ss(i,m,g),t.assignFinalMaterial(m),u.push(m)}for(let d=0,p=u.length;d<p;d++)t.associations.set(u[d],{meshes:e,primitives:d});if(u.length===1)return r.extensions&&ss(i,u[0],r),u[0];let f=new it;r.extensions&&ss(i,f,r),t.associations.set(f,{meshes:e});for(let d=0,p=u.length;d<p;d++)f.add(u[d]);return f})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new wt(mn.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new $i(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),$n(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let r=i.pop(),o=i,a=[],l=[];for(let c=0,h=o.length;c<h;c++){let u=o[c];if(u){a.push(u);let f=new $e;r!==null&&f.fromArray(r.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Ar(a,l)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,o=[],a=[],l=[],c=[],h=[];for(let u=0,f=i.channels.length;u<f;u++){let d=i.channels[u],p=i.samplers[d.sampler],_=d.target,g=_.node,m=i.parameters!==void 0?i.parameters[p.input]:p.input,M=i.parameters!==void 0?i.parameters[p.output]:p.output;_.node!==void 0&&(o.push(this.getDependency("node",g)),a.push(this.getDependency("accessor",m)),l.push(this.getDependency("accessor",M)),c.push(p),h.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){let f=u[0],d=u[1],p=u[2],_=u[3],g=u[4],m=[];for(let y=0,x=f.length;y<x;y++){let E=f[y],A=d[y],D=p[y],O=_[y],b=g[y];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();let v=n._createAnimationTracks(E,A,D,O,b);if(v)for(let I=0;I<v.length;I++)m.push(v[I])}let M=new qr(r,void 0,m);return $n(M,i),M})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=i.weights.length;l<c;l++)a.morphTargetInfluences[l]=i.weights[l]}),o})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=i.children||[];for(let c=0,h=a.length;c<h;c++)o.push(n.getDependency("node",a[c]));let l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(o),l]).then(function(c){let h=c[0],u=c[1],f=c[2];f!==null&&h.traverse(function(d){d.isSkinnedMesh&&d.bind(f,my)});for(let d=0,p=u.length;d<p;d++)h.add(u[d]);return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?i.createUniqueName(r.name):"",a=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),r.camera!==void 0&&a.push(i.getDependency("camera",r.camera).then(function(c){return i._getNodeRef(i.cameraCache,r.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let h;if(r.isBone===!0?h=new Ps:c.length>1?h=new it:c.length===1?h=c[0]:h=new xt,h!==c[0])for(let u=0,f=c.length;u<f;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=o),$n(h,r),r.extensions&&ss(n,h,r),r.matrix!==void 0){let u=new $e;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(r.mesh!==void 0&&i.meshCache.refs[r.mesh]>1){let u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,r=new it;n.name&&(r.name=i.createUniqueName(n.name)),$n(r,n),n.extensions&&ss(t,r,n);let o=n.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(i.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let h=0,u=l.length;h<u;h++)r.add(l[h]);let c=h=>{let u=new Map;for(let[f,d]of i.associations)(f instanceof $t||f instanceof Nt)&&u.set(f,d);return h.traverse(f=>{let d=i.associations.get(f);d!=null&&u.set(f,d)}),u};return i.associations=c(r),r})}_createAnimationTracks(e,t,n,i,r){let o=[],a=e.name?e.name:e.uuid,l=[];Ci[r.path]===Ci.weights?e.traverse(function(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}):l.push(a);let c;switch(Ci[r.path]){case Ci.weights:c=Hn;break;case Ci.rotation:c=Vn;break;case Ci.translation:case Ci.scale:c=Gn;break;default:switch(n.itemSize){case 1:c=Hn;break;case 2:case 3:default:c=Gn;break}break}let h=i.interpolation!==void 0?ly[i.interpolation]:zi,u=this._getArrayFromAccessor(n);for(let f=0,d=l.length;f<d;f++){let p=new c(l[f]+"."+Ci[r.path],t.array,u,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(p),o.push(p)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=Nh(t.constructor),i=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof Vn?Lh:gc;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function gy(s,e,t){let n=e.attributes,i=new Ct;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(i.set(new N(l[0],l[1],l[2]),new N(c[0],c[1],c[2])),a.normalized){let h=Nh(js[a.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new N,l=new N;for(let c=0,h=r.length;c<h;c++){let u=r[c];if(u.POSITION!==void 0){let f=t.json.accessors[u.POSITION],d=f.min,p=f.max;if(d!==void 0&&p!==void 0){if(l.setX(Math.max(Math.abs(d[0]),Math.abs(p[0]))),l.setY(Math.max(Math.abs(d[1]),Math.abs(p[1]))),l.setZ(Math.max(Math.abs(d[2]),Math.abs(p[2]))),f.normalized){let _=Nh(js[f.componentType]);l.multiplyScalar(_)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}s.boundingBox=i;let o=new Yt;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=o}function vf(s,e,t){let n=e.attributes,i=[];function r(o,a){return t.getDependency("accessor",o).then(function(l){s.setAttribute(a,l)})}for(let o in n){let a=Dh[o]||o.toLowerCase();a in s.attributes||i.push(r(n[o],a))}if(e.indices!==void 0&&!s.index){let o=t.getDependency("accessor",e.indices).then(function(a){s.setIndex(a)});i.push(o)}return tt.workingColorSpace!==Ft&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${tt.workingColorSpace}" not supported.`),$n(s,e),gy(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?uy(s,e.targets,t):s})}async function bf(){let s=new Qs,e=await Promise.all(Object.keys(df).map(async t=>{let i=(await s.loadAsync(`assets/rodin/${t}/scene.glb`)).scene;i.name=`Rodin ${t} source`,i.traverse(a=>{if(!a.isMesh)return;a.castShadow=!0,a.receiveShadow=!0;let l=c=>{let h;return c.isMeshStandardMaterial?h=c.clone():h=new At({map:c.map,color:c.color?.clone()||new ze("white"),transparent:c.transparent,opacity:c.opacity,alphaTest:c.alphaTest,side:c.side}),h.roughness=.95,h.metalness=0,h.normalScale&&h.normalScale.multiplyScalar(.4),h.color.multiply(new ze(t==="fern_large"?9483399:t==="crystal"?13692415:t==="grass"?13030301:t==="tree"?13686706:t==="rock"?13818300:14733742)),h.map&&(h.map.colorSpace=bt,h.map.anisotropy=4),h.envMapIntensity=.25,h};a.material=Array.isArray(a.material)?a.material.map(l):l(a.material)});let r=new Ct().setFromObject(i),o=r.getSize(new N);if(!Number.isFinite(o.y)||o.y<1e-4)throw new Error(`${t} has invalid model bounds`);return[t,{model:i,size:o,bounds:r}]}));return Object.fromEntries(e)}function Sf(s,e){let t=new it;t.name="Rodin generated woodland props",s.add(t);let n=[],i=[];for(let r of ff){if(r.enabled===!1||!e[r.kind])continue;let o=e[r.kind],a=new it,l=o.model.clone(!0);r.alignLongAxis&&o.size.z>o.size.x&&l.rotateY(Math.PI/2);let c=new Ct().setFromObject(l),h=c.getSize(new N),u=c.getCenter(new N);l.position.sub(new N(u.x,c.min.y,u.z)),a.add(l),a.name=r.id,a.userData.layoutId=r.id,a.userData.kind=r.kind;let f=r.size/(r.axis==="max"?Math.max(h.x,h.y,h.z):h[r.axis||"y"]);a.scale.setScalar(f),r.kind==="grass"&&(a.scale.x*=1.35,a.scale.z*=1.35),r.height&&(a.scale.y=r.height/h.y),r.depth&&(a.scale.z=r.depth/h.z),a.rotation.y=r.rotation||0,a.position.set(r.x,r.y??(r.kind==="grass"?2.18:2.225),r.z),a.traverse(p=>{p.userData.generatedProp=!0}),t.add(a),a.updateMatrixWorld(!0);let d=new Ct().setFromObject(a);i.push({minX:d.min.x,maxX:d.max.x,minZ:d.min.z,maxZ:d.max.z}),n.push({...r,bounds:{min:d.min.toArray(),max:d.max.toArray()}})}return mf(i),t.userData.inventory=n,t}var _n=[{id:"tuantuan",name:"\u56E2\u56E2",animal:"kangaroo",emoji:"\u{1F998}",color:"#eaba43",signature:"\u628A\u5C0F\u4E8B\u8FC7\u6210\u597D\u65E5\u5B50\u3002",height:2.1},{id:"ali",name:"\u963F\u6817",animal:"fox",emoji:"\u{1F98A}",color:"#c8794e",signature:"\u4ECA\u5929\u4E5F\u60F3\u8D70\u8FDC\u4E00\u70B9\u3002",height:1.9},{id:"xiaomian",name:"\u5C0F\u7720",animal:"rabbit",emoji:"\u{1F430}",color:"#b5c2a5",signature:"\u6162\u4E00\u70B9\uFF0C\u4E5F\u4F1A\u62B5\u8FBE\u3002",height:1.85},{id:"shanshan",name:"\u5C71\u5C71",animal:"bear",emoji:"\u{1F43B}",color:"#aa8265",signature:"\u6536\u96C6\u68EE\u6797\u91CC\u7684\u597D\u5929\u6C14\u3002",height:2}].map(s=>({...s,modelUrl:`assets/rodin-friends/${s.animal}/scene.glb`})),nr=[{id:"happy",label:"\u5F00\u5FC3",icon:"\u2600"},{id:"emo",label:"emo",icon:"\u2601"},{id:"tired",label:"\u75B2\u60EB",icon:"\u263E"},{id:"busy",label:"\u5FD9\u788C",icon:"\u231B"},{id:"relax",label:"\u6478\u9C7C",icon:"\u{1F41F}"},{id:"music",label:"\u542C\u6B4C",icon:"\u266B"},{id:"exercise",label:"\u8FD0\u52A8",icon:"\u2197"},{id:"travel",label:"\u65C5\u884C",icon:"\u2708"}],Cf=864e5,_y=s=>structuredClone(s),er=()=>globalThis.crypto?.randomUUID?.()||`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,_c=["forest","river","camp","sky"].map(s=>`assets/social/${s}.svg`),Fh=()=>({version:1,profile:{id:"me",name:"\u6797\u95F4\u65C5\u4EBA",signature:"\u5728\u8FD9\u91CC\uFF0C\u9047\u89C1\u751F\u6D3B\u7684\u5C0F\u5C0F\u56DE\u58F0\u3002",emoji:"\u{1F33F}"},friends:[],messages:[],statuses:{},posts:[],drafts:{},scrolls:{},settings:{demoPaused:!1,demoCursor:0},seenPosts:{},events:[]}),Ef=s=>new Promise((e,t)=>{s.onsuccess=()=>e(s.result),s.onerror=()=>t(s.error)});function Tf(s){return new Promise((e,t)=>{s.oncomplete=e,s.onerror=()=>t(s.error||new Error("\u672C\u5730\u4FDD\u5B58\u5931\u8D25")),s.onabort=()=>t(s.error||new Error("\u672C\u5730\u4FDD\u5B58\u5DF2\u4E2D\u65AD"))})}function co(s){let e=new Error(s?.name==="QuotaExceededError"?"\u672C\u5730\u7A7A\u95F4\u4E0D\u8DB3\uFF0C\u8BF7\u91CA\u653E\u6D4F\u89C8\u5668\u5B58\u50A8\u7A7A\u95F4\u540E\u91CD\u8BD5\u3002":"\u65E0\u6CD5\u4FDD\u5B58\u5230\u6B64\u6D4F\u89C8\u5668\uFF0C\u8BF7\u68C0\u67E5\u5B58\u50A8\u6743\u9650\u540E\u91CD\u8BD5\u3002");return e.cause=s,e}function lo(s,e){if(!s.friends.includes(e))throw new Error("\u8BF7\u5148\u6DFB\u52A0\u8FD9\u4F4D\u597D\u53CB\u3002")}function wf(s,e){e!=="me"&&lo(s,e)}function tr(s,e=4e3){return String(s||"").trim().slice(0,e)}function Oh(s){if(!nr.some(t=>t.id===s.kind))throw new Error("\u8BF7\u9009\u62E9\u4E00\u4E2A\u72B6\u6001\u3002");let e=Date.now();return{id:er(),kind:s.kind,text:tr(s.text,500),mediaId:s.mediaId||null,createdAt:e,expiresAt:e+Cf}}function Af(s,e,t=er()){let n=tr(s.text),i=(s.mediaIds||[]).slice();if(i.length>9)throw new Error("\u670B\u53CB\u5708\u6700\u591A\u6DFB\u52A0\u4E5D\u5F20\u7167\u7247\u3002");if(!n&&!i.length)throw new Error("\u5199\u4E00\u70B9\u5185\u5BB9\u6216\u6DFB\u52A0\u4E00\u5F20\u7167\u7247\u5427\u3002");return{id:t,authorId:e,text:n,mediaIds:i,createdAt:Date.now(),likes:[],comments:[]}}function Rf(s){let e=s.type||"text";if(!["text","image","sticker","moment"].includes(e))throw new Error("\u4E0D\u652F\u6301\u7684\u6D88\u606F\u7C7B\u578B\u3002");let t=tr(s.text);if((e==="text"||e==="sticker")&&!t)throw new Error("\u6D88\u606F\u4E0D\u80FD\u4E3A\u7A7A\u3002");if(e==="image"&&!s.mediaId)throw new Error("\u8BF7\u5148\u9009\u62E9\u56FE\u7247\u3002");if(e==="moment"&&!s.momentId)throw new Error("\u8FD9\u6761\u56DE\u5FC6\u4E0D\u5B58\u5728\u3002");return{type:e,text:t,mediaId:s.mediaId||null,momentId:s.momentId||null}}function xy(s,e){let t=_n.findIndex(r=>r.id===e),n=Date.now(),i=[["\u4ECA\u5929\u7684\u68EE\u6797\uFF0C\u6BD4\u6628\u5929\u53C8\u7EFF\u4E86\u4E00\u70B9\u3002","\u6865\u8FB9\u7684\u6C34\u58F0\uFF0C\u662F\u6700\u597D\u7684\u767D\u566A\u97F3\u3002","\u56F4\u7740\u7BDD\u706B\u5750\u4E00\u4F1A\u513F\uFF0C\u70E6\u607C\u4E5F\u6162\u6162\u53D8\u5C0F\u4E86\u3002","\u6CA1\u6709\u7279\u522B\u7684\u4E8B\uFF0C\u53EA\u662F\u60F3\u548C\u4F60\u5206\u4EAB\u4E00\u7247\u6674\u5929\u3002"],["\u80CC\u4E0A\u5C0F\u5305\uFF0C\u53BB\u627E\u4E00\u6761\u6CA1\u8D70\u8FC7\u7684\u5C0F\u8DEF\u3002","\u65C5\u884C\u7684\u610F\u4E49\uFF0C\u4E5F\u85CF\u5728\u505C\u4E0B\u6765\u7684\u65F6\u5019\u3002","\u6211\u7684\u9732\u8425\u6E05\u5355\uFF1A\u4E00\u76CF\u706F\uFF0C\u4E00\u676F\u8336\uFF0C\u8FD8\u6709\u597D\u670B\u53CB\u3002","\u4ECA\u5929\u8D70\u5F97\u4E0D\u8FDC\uFF0C\u4F46\u770B\u89C1\u4E86\u5F88\u591A\u3002"],["\u53F6\u5B50\u5728\u53D1\u5446\uFF0C\u6211\u4E5F\u5728\u3002","\u628A\u4ECA\u5929\u8C03\u6210\u9759\u97F3\uFF0C\u542C\u542C\u6EAA\u6C34\u3002","\u56F0\u4E86\u5C31\u4F11\u606F\u4E00\u4E0B\uFF0C\u4E16\u754C\u4F1A\u7B49\u4F60\u7684\u3002","\u5982\u679C\u5FEB\u4E50\u6709\u989C\u8272\uFF0C\u5927\u6982\u662F\u6D45\u6D45\u7684\u7EFF\u3002"],["\u8BA4\u771F\u6536\u96C6\u6BCF\u4E00\u675F\u7A7F\u8FC7\u6811\u53F6\u7684\u5149\u3002","\u6162\u6162\u8D70\uFF0C\u4E5F\u80FD\u9047\u89C1\u5F88\u597D\u7684\u98CE\u666F\u3002","\u4ECA\u5929\u7684\u4EFB\u52A1\uFF1A\u7167\u770B\u7BDD\u706B\uFF0C\u7B49\u5F85\u670B\u53CB\u3002","\u613F\u4F60\u4ECA\u665A\u7761\u4E00\u4E2A\u6696\u6696\u7684\u89C9\u3002"]][t];for(let r=0;r<4;r++){let o=_n[(t+r+1)%4].id;s.posts.push({id:`seed-${e}-${r}`,authorId:e,text:i[r],mediaIds:r===3?[]:[_c[(r+t)%4]],createdAt:n-r*Cf-36e5,likes:[o,...r===0?[_n[(t+2)%4].id]:[]],comments:r===0?[{id:`seed-comment-${e}`,authorId:o,text:"\u4E0B\u6B21\u4E00\u8D77\u53BB\uFF01",createdAt:n-18e5}]:[]})}s.statuses[e]=Oh({kind:["happy","travel","relax","music"][t],text:i[0],mediaId:_c[t]})}async function If({dbName:s="forest-letters-social-v1",indexedDB:e=globalThis.indexedDB}={}){if(!e)throw new Error("\u6B64\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u672C\u5730\u5B58\u50A8\uFF0C\u8BF7\u4F7F\u7528\u73B0\u4EE3\u6D4F\u89C8\u5668\u6253\u5F00\u3002");let t=e.open(s,1);t.onupgradeneeded=()=>{let d=t.result;d.createObjectStore("state"),d.createObjectStore("media")};let n=await new Promise((d,p)=>{t.onsuccess=()=>d(t.result),t.onerror=()=>p(co(t.error)),t.onblocked=()=>p(new Error("\u8BF7\u5173\u95ED\u5176\u4ED6\u65E7\u7248\u672C\u9875\u9762\uFF0C\u518D\u5237\u65B0\u6B64\u9875\u9762\u3002"))});n.onversionchange=()=>n.close();let i;try{i=await Ef(n.transaction("state","readonly").objectStore("state").get("main"))}catch(d){throw n.close(),co(d)}let r=i?{...Fh(),...i,settings:{...Fh().settings,...i.settings}}:Fh(),o=new Set,a=new Map,l=Promise.resolve(),c=!1,h=d=>{for(let p of o)try{p(r,d)}catch(_){console.error("Social subscriber failed",_)}};function u(d,p,_={}){let g=l.then(async()=>{if(c)throw new Error("\u793E\u4EA4\u5B58\u50A8\u5DF2\u5173\u95ED\u3002");let m=_y(r),M=p(m);if(M===!1)return!1;try{let y=n.transaction("state","readwrite"),x=Tf(y);y.objectStore("state").put(m,"main"),await x}catch(y){throw co(y)}return r=m,h({type:d,..._}),M===void 0?!0:M});return l=g.catch(()=>{}),g}let f={get state(){return r},subscribe(d){return o.add(d),()=>o.delete(d)},addFriend(d){return u("friend-added",p=>{if(!_n.some(_=>_.id===d))throw new Error("\u672A\u627E\u5230\u8FD9\u4F4D\u597D\u53CB\u3002");if(p.friends.includes(d))return!1;p.friends.push(d),xy(p,d)},{friendId:d})},sendMessage(d,p){return u("message-sent",_=>{lo(_,d);let g=Rf(p);if(g.type==="moment"&&!_.posts.some(M=>M.id===g.momentId))throw new Error("\u8FD9\u6761\u56DE\u5FC6\u4E0D\u5B58\u5728\u3002");let m={id:er(),friendId:d,senderId:"me",...g,createdAt:Date.now(),read:!0};return _.messages.push(m),m},{friendId:d,payload:p})},receiveMessage(d,p,_){return u("message-received",g=>{if(lo(g,d),_&&g.events.includes(_))return!1;let m={id:_||er(),friendId:d,senderId:d,...Rf(p),createdAt:Date.now(),read:!1};return g.messages.push(m),_&&g.events.push(_),m},{friendId:d,eventId:_})},markRead(d){return u("read",p=>{let _=!1;for(let g of p.messages)g.friendId===d&&!g.read&&(g.read=!0,_=!0);return _},{friendId:d})},setDraft(d,p){return u("draft",_=>{lo(_,d),_.drafts[d]=String(p||"").slice(0,4e3)},{friendId:d})},setScroll(d,p){return u("scroll",_=>{_.scrolls[d]=Math.max(0,Number(p)||0)},{friendId:d})},publishStatus(d,p="me"){return u("status",_=>{wf(_,p),_.statuses[p]=Oh(d)},{authorId:p})},clearStatus(d="me"){return u("status",p=>{if(!p.statuses[d])return!1;delete p.statuses[d]},{authorId:d})},publishPost(d,p="me"){return u("post",_=>{wf(_,p);let g=Af(d,p);return _.posts.push(g),g},{authorId:p})},toggleLike(d){return u("like",p=>{let _=p.posts.find(g=>g.id===d);if(!_)throw new Error("\u8FD9\u6761\u56DE\u5FC6\u4E0D\u5B58\u5728\u3002");_.likes=_.likes.includes("me")?_.likes.filter(g=>g!=="me"):[..._.likes,"me"]},{postId:d})},addComment(d,p){return u("comment",_=>{let g=_.posts.find(M=>M.id===d),m=tr(p,1e3);if(!g)throw new Error("\u8FD9\u6761\u56DE\u5FC6\u4E0D\u5B58\u5728\u3002");if(!m)throw new Error("\u8BC4\u8BBA\u4E0D\u80FD\u4E3A\u7A7A\u3002");g.comments.push({id:er(),authorId:"me",text:m,createdAt:Date.now()})},{postId:d})},markPostsSeen(d){return u("posts-seen",p=>{p.seenPosts[d]=Date.now()},{friendId:d})},updateProfile(d){return u("profile",p=>{if(d.name!==void 0){let _=tr(d.name,24);if(!_)throw new Error("\u6635\u79F0\u4E0D\u80FD\u4E3A\u7A7A\u3002");p.profile.name=_}d.signature!==void 0&&(p.profile.signature=tr(d.signature,100))})},setDemoPaused(d){return u("demo-paused",p=>{p.settings.demoPaused=!!d})},restartDemo(){return u("demo-restart",d=>{d.settings.demoCursor=0,d.settings.demoPaused=!1})},demoEvent(d,p){return u("demo-event",_=>{lo(_,d);let g=`ambient-${p}-${d}`;if(_.settings.demoCursor=p+1,_.events.includes(g))return;_.events.push(g);let m=p%3;m===0&&_.messages.push({id:g,friendId:d,senderId:d,type:"text",text:["\u521A\u521A\u542C\u89C1\u6EAA\u6C34\u7684\u58F0\u97F3\uFF0C\u7A81\u7136\u60F3\u548C\u4F60\u8BF4\u58F0\u55E8\u3002","\u4ECA\u5929\u6709\u4EC0\u4E48\u8BA9\u4F60\u5F00\u5FC3\u7684\u5C0F\u4E8B\u5417\uFF1F","\u6211\u5728\u8FD9\u91CC\uFF0C\u7B49\u4F60\u6709\u7A7A\u6765\u5750\u4E00\u4F1A\u513F\u3002"][Math.floor(p/3)%3],mediaId:null,momentId:null,createdAt:Date.now(),read:!1}),m===1&&(_.statuses[d]=Oh({kind:nr[(p+2)%nr.length].id,text:"\u7ED9\u4ECA\u5929\u7559\u4E00\u4E2A\u5C0F\u5C0F\u7684\u6CE8\u811A\u3002",mediaId:_c[p%4]})),m===2&&_.posts.push(Af({text:"\u53C8\u6536\u96C6\u5230\u4E00\u6BB5\u60F3\u4E0E\u4F60\u5206\u4EAB\u7684\u65F6\u5149\u3002",mediaIds:[_c[p%4]]},d,g))},{friendId:d,cursor:p})},async importImage(d){if(!d||d.size>10*1024*1024)throw new Error("\u6BCF\u5F20\u56FE\u7247\u4E0D\u80FD\u8D85\u8FC7 10 MB\u3002");if(!/^image\/(jpeg|png|webp|gif|avif|bmp)$/i.test(d.type))throw new Error("\u8BF7\u9009\u62E9 JPG\u3001PNG\u3001WebP\u3001GIF\u3001AVIF \u6216 BMP \u56FE\u7247\u3002");let p;try{p=await createImageBitmap(d)}catch{throw new Error("\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u5F20\u56FE\u7247\uFF0C\u8BF7\u6362\u4E00\u5F20\u91CD\u8BD5\u3002")}let _=Math.min(1,1600/Math.max(p.width,p.height)),g=document.createElement("canvas");g.width=Math.max(1,Math.round(p.width*_)),g.height=Math.max(1,Math.round(p.height*_)),g.getContext("2d").drawImage(p,0,0,g.width,g.height),p.close();let m=await new Promise(y=>g.toBlob(y,"image/webp",.84));if(!m)throw new Error("\u56FE\u7247\u538B\u7F29\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002");let M=`media-${er()}`;try{let y=n.transaction("media","readwrite"),x=Tf(y);y.objectStore("media").put(m,M),await x}catch(y){throw co(y)}return M},async mediaUrl(d){if(!d)return"";if(/^assets\/[a-zA-Z0-9_./-]+$/.test(d)&&!d.includes(".."))return d;if(a.has(d))return a.get(d);let p;try{p=await Ef(n.transaction("media","readonly").objectStore("media").get(d))}catch(g){throw co(g)}if(!p)throw new Error("\u8FD9\u5F20\u672C\u5730\u56FE\u7247\u6682\u65F6\u65E0\u6CD5\u8BFB\u53D6\u3002");let _=URL.createObjectURL(p);return a.set(d,_),_},dispose(){c=!0,o.clear();for(let d of a.values())URL.revokeObjectURL(d);a.clear(),l.finally(()=>n.close())}};for(let[d,p]of Object.entries(r.statuses))p.expiresAt<=Date.now()&&await f.clearStatus(d);return f}function Pf(s){let e=!1,t=!1,n=performance.now(),i=6e4,r=new Map;function o(f,d,p,_){!s.state.events.includes(f)&&!r.has(f)&&r.set(f,{key:f,friendId:d,payload:p,remaining:_})}function a(f){o(`greeting-${f}`,f,{type:"text",text:`\u4F60\u597D\u5440\uFF0C\u6211\u662F${_n.find(d=>d.id===f)?.name||"\u4F60\u7684\u670B\u53CB"}\u3002\u5F88\u9AD8\u5174\u5728\u8FD9\u7247\u68EE\u6797\u9047\u89C1\u4F60 \u{1F33F}`},2e3)}function l(f){let d=_n.findIndex(g=>g.id===f.friendId),p=["\u6536\u5230\u4F60\u7684\u6765\u4FE1\u5566\uFF01\u4ECA\u5929\u7684\u9633\u5149\u4E5F\u5206\u4F60\u4E00\u534A\u3002","\u8BB0\u4E0B\u4E86\uFF01\u4E0B\u6B21\u4E00\u8D77\u53BB\u6EAA\u8FB9\u8D70\u8D70\u5427\u3002","\u55EF\u55EF\uFF0C\u6211\u5728\u8BA4\u771F\u542C\u3002\u6162\u6162\u8BF4\uFF0C\u4E0D\u7740\u6025\u3002","\u770B\u89C1\u4F60\u7684\u6D88\u606F\uFF0C\u4ECA\u5929\u53C8\u591A\u4E86\u4E00\u70B9\u6E29\u6696\u3002"],_=f.type==="sticker"?{type:"sticker",text:["\u{1F33B}","\u{1F98A}","\u{1F430}","\u{1F43B}"][d]}:f.type==="image"?{type:"text",text:"\u8FD9\u5F20\u7167\u7247\u771F\u597D\u770B\uFF0C\u8C22\u8C22\u4F60\u628A\u8FD9\u4E00\u523B\u5206\u4EAB\u7ED9\u6211\u3002"}:f.type==="moment"?{type:"text",text:"\u4F60\u4E5F\u559C\u6B22\u8FD9\u6BB5\u56DE\u5FC6\u5440\uFF01\u770B\u5230\u5B83\uFF0C\u6211\u53C8\u60F3\u8D77\u90A3\u5929\u4E86\u3002"}:{type:"text",text:p[d]};o(`reply-${f.id}`,f.friendId,_,1e3+f.createdAt%2001)}for(let f of s.state.friends)a(f);for(let f of s.state.messages)f.senderId==="me"&&l(f);let c=s.subscribe((f,d)=>{if(d.type==="friend-added"&&a(d.friendId),d.type==="message-sent"){let p=f.messages[f.messages.length-1];l(p)}if(d.type==="demo-restart"){i=2e3;for(let p of f.friends)a(p)}});async function h(){let f=performance.now(),d=Math.min(500,Math.max(0,f-n));if(n=f,!(e||t)){t=!0;try{for(let[p,_]of Object.entries(s.state.statuses))_.expiresAt<=Date.now()&&await s.clearStatus(p);if(globalThis.document?.hidden||s.state.settings.demoPaused)return;for(let p of r.values())if(p.remaining-=d,p.remaining<=0){await s.receiveMessage(p.friendId,p.payload,p.key),r.delete(p.key);break}if(s.state.friends.length&&(i-=d,i<=0)){let p=s.state.settings.demoCursor||0,_=s.state.friends[p%s.state.friends.length];await s.demoEvent(_,p),i=45e3+(p*7919+15317)%30001}}catch(p){console.warn("Local demo paused after a storage failure",p),i=6e4}finally{t=!1}}}let u=setInterval(h,250);return{dispose(){e=!0,clearInterval(u),c(),r.clear()}}}function Lf(s,e,{range:t=3.2,step:n=.4}={}){let i=[{x:e.x,z:e.z,y:e.y,links:[]}],r=new Map([["0,0",0]]),o=[[0,0,0]],a=.12,l=(c,h)=>s.inspect(c,h,e.radius+a,[],{walking:!0});if(!l(e.x,e.z).ok)return{nodes:i,radius:e.radius+a};for(let c=0;c<o.length;c++){let[h,u,f]=o[c];for(let[d,p]of[[1,0],[0,1],[-1,0],[0,-1]]){let _=h+d,g=u+p;if(Math.hypot(_*n,g*n)>t)continue;let m=`${_},${g}`,M=r.get(m);if(M===-1)continue;let y=e.x+_*n,x=e.z+g*n;if(M===void 0){let D=l(y,x);if(!D.ok){r.set(m,-1);continue}M=i.length,r.set(m,M),i.push({x:y,z:x,y:D.y,links:[]}),o.push([_,g,M])}let E=i[f],A=!0;for(let D=.25;D<1;D+=.25)if(!l(E.x+(y-E.x)*D,E.z+(x-E.z)*D).ok){A=!1;break}A&&!E.links.includes(M)&&(E.links.push(M),i[M].links.push(f))}}return{nodes:i,radius:e.radius+a}}function Df(s,e,t=0){let{nodes:n}=s,i=new Map([[e,-1]]),r=[e];for(let h=0;h<r.length;h++)for(let u of n[r[h]].links)i.has(u)||(i.set(u,r[h]),r.push(u));let o=n[e],a=r.filter(h=>h!==e).sort((h,u)=>Math.hypot(n[u].x-o.x,n[u].z-o.z)-Math.hypot(n[h].x-o.x,n[h].z-o.z));if(!a.length)return[];let l=a[t*7%Math.min(12,a.length)],c=[];for(;l!==e;)c.push(l),l=i.get(l);return c.reverse()}function Nf(s,e,t,n){return n.every(i=>{let r=e.x-s.x,o=e.z-s.z,a=r*r+o*o,l=a?Math.max(0,Math.min(1,((i.x-s.x)*r+(i.z-s.z)*o)/a)):0;return Math.hypot(s.x+r*l-i.x,s.z+o*l-i.z)>=t+i.radius+.6})}var Uf=["kangaroo","fox","rabbit","bear"],yy={kangaroo:[-5.9,-3],fox:[-9.5,5.4],rabbit:[-6,7.5],bear:[8,4.4]},vy=new N(0,-1,0),Bh=(s,e,t,n)=>{let i=n[0]-t[0],r=n[1]-t[1],o=i*i+r*r,a=o?mn.clamp(((s-t[0])*i+(e-t[1])*r)/o,0,1):0;return Math.hypot(s-t[0]-a*i,e-t[1]-a*r)};function My(s,e,t){let n=(o,a)=>(a[0]-o[0])*(e-o[1])-(a[1]-o[1])*(s-o[0]),i=(t[1][0]-t[0][0])*(t[2][1]-t[0][1])-(t[1][1]-t[0][1])*(t[2][0]-t[0][0]),r=[n(t[0],t[1]),n(t[1],t[2]),n(t[2],t[0])];return Math.abs(i)>1e-8&&(r.every(o=>o>=0)||r.every(o=>o<=0))?0:Math.min(Bh(s,e,t[0],t[1]),Bh(s,e,t[1],t[2]),Bh(s,e,t[2],t[0]))}function by({scene:s,terrain:e,generated:t}){s.updateMatrixWorld(!0);let n=[],i=[],r=[];e.root.traverse(c=>{c.isMesh&&c.name.endsWith(" meadow")&&n.push(c)});let o=[...t?.children||[]];s.traverse(c=>{c.isGroup&&/campfire|stump|stool/i.test(c.name)&&o.push(c)});for(let c of o){let h=[],u=new Bs,f=[];c.traverse(d=>{if(!d.isMesh||!d.geometry?.attributes.position)return;i.push(d);let p=new ot(d.geometry,new Ot({side:_t}));p.matrixAutoUpdate=!1,p.matrixWorld.copy(d.matrixWorld),f.push(p);let _=d.geometry.attributes.position,g=d.geometry.index,m=g?g.count:_.count;for(let M=0;M<m;M+=3){let y=[0,1,2].map(E=>new N().fromBufferAttribute(_,g?g.getX(M+E):M+E).applyMatrix4(d.matrixWorld));if(Math.max(...y.map(E=>E.y))<2.27||Math.min(...y.map(E=>E.y))>4.45)continue;let x=y;for(let[E,A]of[[2.27,!0],[4.45,!1]]){let D=x;x=[];for(let O=0;O<D.length;O++){let b=D[O],v=D[(O+1)%D.length],I=A?b.y>=E:b.y<=E,V=A?v.y>=E:v.y<=E;I&&x.push(b),I!==V&&x.push(b.clone().lerp(v,(E-b.y)/(v.y-b.y)))}}for(let E=1;E+1<x.length;E++){let A=[x[0],x[E],x[E+1]].map(O=>[O.x,O.z]),D=new Bs().setFromPoints(A.map(O=>new _e(...O)));u.union(D),h.push({points:A,box:D})}}}),r.push({id:c.userData.layoutId||c.name,bounds:u,triangles:h,solidMeshes:f})}let a=new Zi;function l(c,h,u,f=[],{walking:d=!1}={}){let p=rh.find(M=>oh(c,h,M)<M.width/2+u+.1);if(p&&!d)return{ok:!1,reason:"walkway",id:p.id};if(Math.hypot(c+8.5,h-1.5)<1.7+u+.35)return{ok:!1,reason:"campfire"};if(f.some(M=>Math.hypot(M.x-c,M.z-h)<M.radius+u+.6))return{ok:!1,reason:"friend clearance"};let _=2.22;for(let M=0;M<13;M++){let y=M?u+.12:0,x=(M-1)/12*Math.PI*2;a.set(new N(c+Math.cos(x)*y,8,h+Math.sin(x)*y),vy),a.far=8;let E=a.intersectObjects(n,!1)[0];if(!E)return{ok:!1,reason:"no meadow support"};_=Math.max(_,E.point.y)}let g=new _e(c,h),m=u+.35;for(let M of r)if(!(M.bounds.distanceToPoint(g)>=m)){for(let y of M.triangles)if(!(y.box.distanceToPoint(g)>=m)&&My(c,h,y.points)<m)return{ok:!1,reason:"obstacle",id:M.id};if(M.bounds.containsPoint(g)){a.set(new N(c,3.1,h),new N(1,0,0)),a.far=100;let y=a.intersectObjects(M.solidMeshes,!1).map(E=>E.distance);if(y.filter((E,A)=>!A||E-y[A-1]>1e-4).length%2)return{ok:!1,reason:"inside obstacle",id:M.id}}}return{ok:!0,y:_}}return{meadows:n,occluders:i,obstacles:r,inspect:l}}function Sy(s,e){let t=[];for(let[n,i]of e.slice(0,8).entries()){let r=yy[i.animal]||[-5,5],o=i.radius??.55,a=[];for(let c=-9.5;c<=9.5;c+=.65)for(let h=-15;h<=15.5;h+=.65)r[0]<0==h<0&&a.push({x:h,z:c,score:Math.hypot(h-r[0],c-r[1])});a.sort((c,h)=>c.score-h.score||c.z-h.z||c.x-h.x);let l=null;for(let c of a){let h=s.inspect(c.x,c.z,o+.12,t,{walking:!0});if(!h.ok)continue;if([[1,0],[-1,0],[0,1],[0,-1]].some(([f,d])=>[.25,.5,.75,1].every(p=>s.inspect(c.x+f*p,c.z+d*p,o+.12,t,{walking:!0}).ok))){l={id:i.id,animal:i.animal,x:c.x,y:h.y,z:c.z,radius:o,height:i.height||1.9};break}}l?t.push(l):t.push({id:i.id,animal:i.animal,unplaced:!0,radius:o,index:n})}return t}function Ey(s,e,t){let n=new Zi,i=null;for(let r of[0,.3,-.3,.6,-.6,1,-1,Math.PI]){let o=e.clone().add(t.clone().applyAxisAngle(new N(0,1,0),r)),a=0;for(let l of[0,.6,-.6]){let c=e.clone().add(new N(0,l,0)),h=c.sub(o),u=h.length();n.set(o,h.normalize()),n.far=Math.max(0,u-.12),n.intersectObjects(s.occluders,!1).length||a++}if((!i||a>i.visibleSamples)&&(i={position:o,angle:r,visibleSamples:a}),a===3)break}return i}function Ty(s){let e=new it,t=new At({color:s.color||14531698,roughness:1}),n=new ot(new Lr(.28,.62,4,8),t);n.position.y=.7,e.add(n);let i=new ot(new kn(.36,1),t);i.position.y=1.4,e.add(i);let r=new ot(new Gr(.12),new Ot({color:16774611}));return r.position.set(0,1.45,.35),e.add(r),e.userData.placeholder=!0,e}async function Ff({scene:s,camera:e,controls:t,renderer:n,terrain:i,generated:r,onSelect:o,reduced:a}){let l=by({scene:s,terrain:i,generated:r}),c=new it;c.name="Social companions \xB7 interactive",s.add(c);let h=new Qs,u=new Map,f=new Map,d=new Zi;await Promise.all(Uf.map(async L=>{try{let w=await h.loadAsync(`assets/rodin-friends/${L}/scene.glb`);u.set(L,w.scene)}catch{console.warn(`Social companion ${L}: visible identity placeholder until the local model is available.`)}}));let p=null,_=null,g=null,m=0,M=null,y=[],x=()=>typeof a=="boolean"?a:!!a?.matches,E={method:"Ground disk raycasts; actual obstacle triangles clipped to 2.27\u20134.45m; body radius plus 0.35m; WALKWAYS; 0.6m inter-character separation.",slots:[],missingModels:Uf.filter(L=>!u.has(L)),unplaced:[]};function A(L){let w=new it,H=u.get(L.animal)?.clone(!0)||Ty(L),G=new Ct().setFromObject(H),F=G.getSize(new N),te=L.height||1.9,U=te/F.y;H.scale.multiplyScalar(U),H.position.sub(new N((G.min.x+G.max.x)/2,G.min.y,(G.min.z+G.max.z)/2).multiplyScalar(U));let ue=new it;ue.add(H),w.add(ue);let re=Math.hypot(F.x,F.z)*U/2,B=new ot(new Wr(re+.12,re+.21,40),new Ot({color:16769952,transparent:!0,opacity:.8,side:_t,depthWrite:!1}));B.rotation.x=-Math.PI/2,B.position.y=.025,B.visible=!1,w.add(B);let $={phase:{value:0},amount:{value:0}},le=new it;le.visible=!1,H.traverse(Ee=>{if(!Ee.isMesh)return;Ee.castShadow=!0,Ee.receiveShadow=!0,Ee.geometry.computeBoundingBox();let P=Ee.geometry.boundingBox,ie=P.min.y,oe=P.max.y-ie,ne=(P.min.x+P.max.x)/2,Y=me=>{let de=me.clone();return de.isMeshStandardMaterial&&(de.roughness=.96,de.metalness=0,de.envMapIntensity=.25),de.onBeforeCompile=ye=>{ye.uniforms.walkPhase=$.phase,ye.uniforms.walkAmount=$.amount,ye.vertexShader=`uniform float walkPhase; uniform float walkAmount;
`+ye.vertexShader,ye.vertexShader=ye.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
          float legWeight=1.0-smoothstep(${(ie+oe*.13).toFixed(6)},${(ie+oe*.34).toFixed(6)},position.y);
          float stride=sin(walkPhase+(position.x<${ne.toFixed(6)}?0.0:3.141593));
          transformed.z+=stride*${(oe*.035).toFixed(6)}*legWeight*walkAmount;
          transformed.y+=max(0.0,stride)*${(oe*.022).toFixed(6)}*legWeight*walkAmount;`)},de.customProgramCacheKey=()=>`companion-walk-${ie}-${oe}-${ne}`,de};Ee.material=Array.isArray(Ee.material)?Ee.material.map(Y):Y(Ee.material)}),H.updateMatrixWorld(!0),H.traverse(Ee=>{if(!Ee.isMesh)return;let P=new Gi(new Nr(Ee.geometry,38),new Mi({color:16770468,transparent:!0,opacity:.36}));P.applyMatrix4(Ee.matrixWorld),le.add(P)}),ue.add(le);let be=new je,xe=new Float32Array(36);be.setAttribute("position",new gt(xe,3));let Re=new si(be,new Bn({color:15002796,size:.09,transparent:!0,opacity:1,depthWrite:!1}));return w.add(Re),w.name=`Friend \xB7 ${L.id}`,w.userData.friendId=L.id,w.userData.placeholder=!!H.userData.placeholder,w.traverse(Ee=>{Ee.userData.socialCharacter=!0,Ee.userData.friendId=L.id}),c.add(w),{friend:L,group:w,bodyHolder:ue,ring:B,outline:le,motes:Re,motePositions:xe,height:te,radius:Math.max(.35,re),spawn:performance.now(),occluded:!1,gait:$,walk:null}}function D(L){let w=L.slice(0,8),H=new Set(w.map(F=>F.id));for(let[F,te]of f)H.has(F)||(te.group.removeFromParent(),f.delete(F));for(let F of w)f.has(F.id)||f.set(F.id,A(F));let G=Sy(l,w.map(F=>({...F,radius:f.get(F.id).radius})));for(let F of G){let te=f.get(F.id);if(te.slot=F,te.group.visible=!F.unplaced,!F.unplaced){te.group.position.set(F.x,F.y,F.z);let U=Lf(l,F);te.walk={graph:U,node:0,route:[],sequence:F.id.length,wait:.8+F.id.length%4*.7,phase:0,heading:.35,speed:.24+F.id.length%3*.025}}}return E.walking=[...f.values()].map(F=>({id:F.friend.id,nodes:F.walk?.graph.nodes.length||0,edges:F.walk?.graph.nodes.reduce((te,U)=>te+U.links.length,0)||0})),E.slots=G,E.unplaced=G.filter(F=>F.unplaced).map(F=>F.id),s.updateMatrixWorld(!0),p&&!H.has(p)&&I(),G}function O(L,w){let H=w.clone().sub(L),G=H.length();return d.set(L,H.normalize()),d.far=Math.max(0,G-.12),d.intersectObjects(l.occluders,!1).length>0}function b(L,w,H){g={start:performance.now(),fromPosition:e.position.clone(),fromTarget:t.target.clone(),position:L,target:w,done:H},t.enabled=!1}function v(L){let w=f.get(L);if(!w||w.slot?.unplaced)return!1;_||(_={position:e.position.clone(),target:t.target.clone(),enabled:t.enabled}),p=L;for(let[te,U]of f)U.ring.visible=te===L,U.outline.visible=te===L;let H=w.group.position.clone().add(new N(0,w.height*.58,0)),G=_.position.clone().sub(_.target).multiplyScalar(.85),F=Ey(l,H,G);return E.lastFocus={id:L,angle:F.angle,visibleBodySamples:F.visibleSamples},b(F.position,H,()=>{}),!0}function I(){p=null;for(let L of f.values())L.ring.visible=!1,L.outline.visible=!1;if(_){let L=_;b(L.position,L.target,()=>{t.enabled=L.enabled,_=null})}}function V(L){L.button===0&&(M={x:L.clientX,y:L.clientY,id:L.pointerId})}function X(L){if(!M||M.id!==L.pointerId)return;let w=M;if(M=null,Math.hypot(L.clientX-w.x,L.clientY-w.y)>6)return;let H=n.domElement.getBoundingClientRect();d.setFromCamera(new _e((L.clientX-H.left)/H.width*2-1,-(L.clientY-H.top)/H.height*2+1),e),d.far=1/0;let G=d.intersectObjects([...f.values()].filter(F=>F.group.visible).map(F=>F.bodyHolder),!0).find(F=>F.object.isMesh);if(G){if(d.far=Math.max(0,G.distance-.02),d.intersectObjects(l.occluders,!1).length)return;let F=G.object.userData.friendId;F&&o?.(F)}}n.domElement.addEventListener("pointerdown",V),n.domElement.addEventListener("pointerup",X);let ee=()=>{M=null};n.domElement.addEventListener("pointercancel",ee);function Q(L,w){if(p&&n.domElement.clientWidth<=850){let te=n.domElement.clientWidth,U=n.domElement.clientHeight;(!e.view?.enabled||e.view.offsetY!==U*.26)&&e.setViewOffset(te,U,0,U*.26,te,U)}else e.view?.enabled&&e.clearViewOffset();if(g){let te=x()?1:mn.clamp((L-g.start)/450,0,1),U=te*te*(3-2*te);if(e.position.lerpVectors(g.fromPosition,g.position,U),t.target.lerpVectors(g.fromTarget,g.target,U),e.lookAt(t.target),te===1){let ue=g.done;g=null,ue?.()}}let G=n.domElement.getBoundingClientRect();y=[];let F=L-m>300;F&&(m=L);for(let[te,U]of f){if(!U.group.visible)continue;let ue=L/1e3,re=(L-U.spawn)/1e3,B=x()?0:1,$=U.walk,le=Math.min(w||0,.05),be=!1;if($&&p!==te&&B&&!document.hidden&&re>1&&($.wait=Math.max(0,$.wait-le),!$.route.length&&$.wait===0&&($.route=Df($.graph,$.node,$.sequence++),$.route.length||($.wait=3)),$.route.length&&$.wait===0)){let ne=$.graph.nodes[$.route[0]],Y=ne.x-U.group.position.x,me=ne.z-U.group.position.z,de=Math.hypot(Y,me),ye=Math.min(de,le*$.speed),Fe={x:U.group.position.x+Y/Math.max(de,1e-6)*ye,z:U.group.position.z+me/Math.max(de,1e-6)*ye},Be=[...f.values()].filter(R=>R!==U&&R.group.visible).map(R=>({x:R.group.position.x,z:R.group.position.z,radius:R.radius+.08}));Nf(U.group.position,Fe,U.radius+.08,Be)?(U.group.position.set(Fe.x,ne.y,Fe.z),$.heading=Math.atan2(Y,me),be=ye>0,$.phase+=ye*17,(de<.015||ye>=de)&&($.node=$.route.shift(),$.route.length||($.wait=2+$.sequence%4))):$.wait=.7}U.gait.phase.value=$?.phase||0,U.gait.amount.value=mn.lerp(U.gait.amount.value,be?1:0,Math.min(1,le*8)),U.bodyHolder.scale.y=1+Math.sin(ue*1.8+te.length)*.013*B;let xe=(L-(U.messageAt||-1/0))/1e3;U.bodyHolder.rotation.z=Math.sin(($?.phase||0)*.5)*.012*U.gait.amount.value,U.bodyHolder.position.y=re<.7?Math.sin(re/.7*Math.PI)*.16*B:xe<.55?Math.sin(xe/.55*Math.PI)*.12*B:0;let Re=Math.atan2(e.position.x-U.group.position.x,e.position.z-U.group.position.z),Ee=p===te?Re:$?.heading??.35,P=Math.atan2(Math.sin(Ee-U.bodyHolder.rotation.y),Math.cos(Ee-U.bodyHolder.rotation.y));if(U.bodyHolder.rotation.y+=P*Math.min(1,le*3),U.motes.visible=re<1.7&&!x(),U.motes.visible){for(let ne=0;ne<12;ne++){let Y=ne*2.399+re*2;U.motePositions[ne*3]=Math.cos(Y)*(U.radius+.15),U.motePositions[ne*3+1]=.15+re*.8+ne%3*.15,U.motePositions[ne*3+2]=Math.sin(Y)*(U.radius+.15)}U.motes.geometry.attributes.position.needsUpdate=!0,U.motes.material.opacity=Math.max(0,1-re/1.7)}U.group.updateMatrixWorld(!0);let ie=U.group.position.clone().add(new N(0,U.height+.3,0));F&&(U.occluded=O(e.position,U.group.position.clone().add(new N(0,U.height*.7,0))));let oe=ie.project(e);y.push({id:te,worldX:U.group.position.x,worldZ:U.group.position.z,walking:be,x:(oe.x*.5+.5)*G.width,y:(-.5*oe.y+.5)*G.height,visible:oe.z>-1&&oe.z<1&&Math.abs(oe.x)<1.15&&Math.abs(oe.y)<1.15,occluded:U.occluded,placeholder:U.group.userData.placeholder})}}function C(){n.domElement.removeEventListener("pointerdown",V),n.domElement.removeEventListener("pointerup",X),n.domElement.removeEventListener("pointercancel",ee),c.removeFromParent(),f.clear()}return{sync:D,focus:v,restore:I,update:Q,pulse:L=>{let w=f.get(L);w&&(w.messageAt=performance.now())},getAnchors:()=>y,getScreenAnchor:L=>y.find(w=>w.id===L)||null,dispose:C,audit:E}}var He=s=>String(s??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Of=s=>new Date(s).toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"}),xc=s=>new Date(s).toLocaleDateString("zh-CN",{month:"long",day:"numeric"}),wy=[["\u{1F33C}","\u9001\u4F60\u4E00\u6735\u5C0F\u82B1"],["\u{1F43E}","\u6211\u6765\u5566\uFF01"],["\u2615","\u6B47\u4E00\u4F1A\u513F"],["\u{1F319}","\u665A\u5B89\u597D\u68A6"],["\u{1FAF6}","\u63A5\u4F4F\u6E29\u67D4"],["\u{1F340}","\u597D\u8FD0\u53D1\u751F"]],Ay=["\u{1F60A}","\u{1F970}","\u{1F602}","\u{1F979}","\u{1F914}","\u{1F634}","\u{1F62D}","\u2728","\u{1F49B}","\u{1F33F}","\u{1F308}","\u{1F44D}"];function Bf({store:s,characters:e}){let t=document.createElement("div");t.id="social",document.body.append(t),t.innerHTML=`
    <div class="social-corner"><span class="seed-mark">\u2767</span><span>\u6797\u95F4\u6765\u4FE1<small>\u670B\u53CB\u4F4F\u5728\u98CE\u666F\u91CC</small></span></div>
    <div class="demo-badge"><i></i> \u672C\u5730\u6F14\u793A <span id="demo-indicator">\xB7 \u81EA\u52A8\u6545\u4E8B</span></div>
    <div id="friend-anchors"></div>
    <div id="first-invitation" class="invitation"><span class="invitation-icon">\u2709</span><h1>\u7ED9\u98CE\u666F\uFF0C\u6DFB\u4E00\u4F4D\u670B\u53CB\u3002</h1><p>\u4ECE\u4E00\u6B21\u95EE\u597D\u5F00\u59CB\uFF0C\u8BA9\u5C0F\u5C0F\u7684\u6EAA\u8C37\u70ED\u95F9\u8D77\u6765\u3002</p><button class="primary" data-action="directory">\u8BA4\u8BC6\u7B2C\u4E00\u4F4D\u670B\u53CB <span>\u2197</span></button></div>
    <nav class="social-dock"><button data-action="directory" class="dock-button"><span>\u2667</span> \u597D\u53CB <b id="total-unread" hidden></b></button><button data-action="me" class="dock-button"><span>\u25C9</span> \u6211</button></nav>
    <section id="directory" class="drawer paper" hidden aria-label="\u597D\u53CB\u901A\u8BAF\u5F55"><header><div><small>OUR LITTLE NEIGHBOURHOOD</small><h2>\u6EAA\u8C37\u91CC\u7684\u670B\u53CB</h2></div><button class="icon-button" data-action="close-directory" aria-label="\u5173\u95ED\u901A\u8BAF\u5F55">\xD7</button></header><p class="muted">\u6BCF\u4E00\u6B21\u8BA4\u8BC6\uFF0C\u90FD\u662F\u98CE\u666F\u7684\u65B0\u4E00\u9875\u3002</p><label class="search">\u2315 <input id="friend-search" placeholder="\u641C\u7D22\u6635\u79F0\u6216\u6F14\u793A ID" aria-label="\u641C\u7D22\u597D\u53CB"></label><div class="directory-tabs"><button data-action="directory-tab" data-tab="all" class="active">\u6DFB\u52A0\u597D\u53CB</button><button data-action="directory-tab" data-tab="added">\u6211\u7684\u670B\u53CB <span id="friend-count"></span></button></div><div id="friend-list"></div></section>
    <section id="meeting" hidden aria-label="\u597D\u53CB\u4F1A\u5BA2\u7A7A\u95F4">
      <header class="meeting-title"><span id="meeting-avatar" class="avatar"></span><div><h2 id="meeting-name"></h2><p id="meeting-signature"></p></div><button class="icon-button" data-action="close-meeting" aria-label="\u8FD4\u56DE\u6EAA\u8C37">\xD7</button></header>
      <nav class="mobile-tabs"><button data-action="meeting-tab" data-tab="chat" class="active">\u804A\u5929</button><button data-action="meeting-tab" data-tab="memories">\u8BB0\u5FC6</button></nav>
      <section class="chat-panel paper"><header><div><span class="tiny-dot"></span> \u5728\u8FD9\u91CC\uFF0C\u6162\u6162\u804A</div><small>\u672C\u5730\u6A21\u62DF\u5BF9\u8BDD</small></header><div id="chat-messages" aria-live="polite" aria-label="\u804A\u5929\u8BB0\u5F55"></div><div id="chat-attachment" hidden></div><div id="chat-picker" hidden></div><form id="chat-form"><div class="composer-tools"><button type="button" data-action="emoji" aria-label="\u9009\u62E9\u8868\u60C5">\u263A</button><button type="button" data-action="stickers" aria-label="\u9009\u62E9\u8868\u60C5\u5305">\u2667</button><button type="button" data-action="chat-image" aria-label="\u53D1\u9001\u56FE\u7247">\u25A7</button><span>\u628A\u4ECA\u5929\u8BF4\u7ED9\u4ED6\u542C</span></div><textarea id="chat-input" rows="2" maxlength="3000" placeholder="\u5199\u4E00\u5C01\u5F88\u77ED\u7684\u4FE1\u2026" aria-label="\u8F93\u5165\u6D88\u606F"></textarea><div class="composer-bottom"><small>Enter \u53D1\u9001 \xB7 Shift + Enter \u6362\u884C</small><button class="primary" type="submit">\u53D1\u9001 \u2197</button></div></form></section>
      <section class="memory-panel"><header><div><small>PIECES OF A LIFE</small><h2>\u4ED6\u7684\u8BB0\u5FC6\u5FAE\u5149</h2></div><span id="memory-count"></span></header><div id="memory-orbs"></div><div id="post-detail" class="paper" hidden></div></section>
    </section>
    <dialog id="social-dialog" class="paper"></dialog><dialog id="photo-dialog"><button class="icon-button" data-action="close-photo" aria-label="\u5173\u95ED\u5927\u56FE">\xD7</button><img alt="\u5B8C\u6574\u7167\u7247"></dialog>
    <input id="chat-file" type="file" accept="image/*" hidden><div id="social-toast" role="status"></div>`;let n=z=>t.querySelector("#"+z),i=null,r=null,o=null,a="all",l=null,c=null,h=null,u=null,f=[],d=null,p=0,_=0,g="",m="",M="",y,x,E,A=0,D=0,O=0,b=new Map,v=new Map,I=new Map,V=new Map,X=z=>z==="me"?s.state.profile:_n.find(k=>k.id===z)||{id:z,name:"\u6797\u95F4\u670B\u53CB",emoji:"\u{1F33F}",signature:""},ee=z=>nr.find(k=>k.id===z)||{icon:"\u2728",label:z||"\u6B64\u523B"},Q=()=>!!i&&!document.hidden&&(innerWidth>850||n("meeting").dataset.tab==="chat"),C=()=>!!i&&!document.hidden&&(innerWidth>850||n("meeting").dataset.tab==="memories"),L=z=>{let k=s.state.statuses[z];return k&&k.expiresAt>Date.now()?k:null},w=z=>s.state.posts.filter(k=>k.authorId===z).sort((k,q)=>q.createdAt-k.createdAt),H=z=>s.state.messages.filter(k=>k.friendId===z&&k.senderId!=="me"&&!k.read).length,G=z=>`<span class="avatar" style="--friend-color:${He(X(z).color||"#a9bc98")}">${He(X(z).emoji||"\u{1F331}")}</span>`;function F(z){n("social-toast").textContent=z,n("social-toast").classList.add("visible"),clearTimeout(E),E=setTimeout(()=>n("social-toast").classList.remove("visible"),4e3)}async function te(z){try{return await z()}catch(k){return console.error(k),F(k.message||"\u6CA1\u6709\u4FDD\u5B58\u6210\u529F\uFF0C\u8BF7\u91CD\u8BD5\u3002"),null}}async function U(z=t){for(let k of z.querySelectorAll("img[data-media]")){let q=k.dataset.media;try{let fe=await s.mediaUrl(q);k.isConnected&&k.dataset.media===q&&(k.src=fe)}catch{k.alt="\u56FE\u7247\u6682\u4E0D\u53EF\u7528",k.classList.add("unavailable")}}}function ue(z,k=""){return`<button type="button" class="photo-button ${k}" data-action="photo" data-media="${He(z)}"><img data-media="${He(z)}" alt="\u52A8\u6001\u56FE\u7247" loading="lazy"></button>`}function re(z){return`${G(z)}<div><strong>${He(X(z).name)}</strong><p>${He(X(z).signature)}</p></div>`}function B(){let z=n("friend-search").value.trim().toLowerCase(),k=_n.filter(q=>(a==="all"||s.state.friends.includes(q.id))&&`${q.name} ${q.id} ${q.animal}`.toLowerCase().includes(z));n("friend-count").textContent=s.state.friends.length,n("friend-list").innerHTML=k.map(q=>{let fe=s.state.friends.includes(q.id);return`<article class="friend-card" style="--friend-color:${He(q.color)}"><div class="friend-portrait"><img src="assets/rodin-friends/${He(q.animal)}/portrait.webp" alt="${He(q.name)}\u7684\u4E09\u7EF4\u5F62\u8C61"><span>${He(q.animal.toUpperCase())}</span></div><div class="friend-card-copy"><h3>${He(q.name)}${fe?'<i class="tiny-dot"></i>':""}</h3><p>${He(q.signature)}</p><small>@${He(q.id)}</small><button class="${fe?"secondary":"primary"}" data-action="${fe?"open-friend":"add-friend"}" data-id="${q.id}">${fe?"\u53BB\u627E\u4ED6 \u2197":"\uFF0B \u6DFB\u52A0\u5230\u6EAA\u8C37"}</button></div></article>`}).join("")||'<p class="empty-note">\u8FD9\u91CC\u8FD8\u6CA1\u6709\u627E\u5230\u670B\u53CB\u3002\u8BD5\u8BD5\u522B\u7684\u540D\u5B57\u5427\u3002</p>'}function $(){n("first-invitation").hidden=s.state.friends.length>0;let z=s.state.friends.reduce((q,fe)=>q+H(fe),0);n("total-unread").textContent=z,n("total-unread").hidden=!z,n("demo-indicator").textContent=s.state.settings.demoPaused?"\xB7 \u6545\u4E8B\u5DF2\u6682\u505C":"\xB7 \u81EA\u52A8\u6545\u4E8B";let k=s.state.friends.join(",");k!==g&&(g=k,e.sync(s.state.friends.map(X)),B());for(let q of s.state.friends){let fe=s.state.messages.filter(j=>j.friendId===q&&j.senderId!=="me").at(-1);fe&&V.get(q)?.id!==fe.id&&(V.has(q)&&e.pulse?.(q),V.set(q,{id:fe.id,at:performance.now()}))}le()}function le(){for(let z of s.state.friends){let k=b.get(z);k||(k=document.createElement("div"),k.className="friend-anchor",k.dataset.friend=z,n("friend-anchors").append(k),b.set(z,k));let q=L(z),fe=q&&ee(q.kind),j=s.state.messages.filter(ke=>ke.friendId===z&&ke.senderId!=="me"),pe=j.at(-1),Pe=H(z);k.classList.toggle("has-unread",Pe>0);let Le=w(z).some(ke=>ke.createdAt>(s.state.seenPosts[z]||0)),Te=`<div class="anchor-identity"><button class="anchor-name" data-action="open-friend" data-id="${z}">${He(X(z).name)} ${Le?'<i class="memory-spark"></i>':""}</button>${q?`<button class="status-badge" data-action="status" data-id="${z}" aria-label="\u67E5\u770B${He(X(z).name)}\u7684${He(fe.label)}\u72B6\u6001">${He(fe.icon)} <span>${He(fe.label)}</span></button>`:""}</div>${pe?`<button class="head-message" data-action="open-friend" data-id="${z}">${pe.type==="image"?`<img data-media="${He(pe.mediaId)}" alt="\u56FE\u7247\u6D88\u606F">`:pe.type==="sticker"?`<span class="mini-sticker">${He(pe.text)}</span>`:He(pe.text||"\u5206\u4EAB\u4E86\u4E00\u6BB5\u56DE\u5FC6")} ${Pe?`<b>${Pe}</b>`:""}</button><button class="unread-dot" data-action="open-friend" data-id="${z}" aria-label="${He(X(z).name)}\u6709${Pe}\u6761\u672A\u8BFB" ${Pe?"":"hidden"}>${Pe}</button>`:""}`;k._html!==Te&&(k._html=Te,k.innerHTML=Te,U(k))}}function be(){if(!i)return;I.set(i,n("chat-input").value);let z=i,k=n("chat-input").value;te(()=>s.setDraft(z,k)),te(()=>s.setScroll(z,n("chat-messages").scrollTop))}function xe(z){let k=e.getScreenAnchor(z);return k?{x:k.x,y:k.y}:{x:innerWidth/2,y:innerHeight/2}}async function Re(z){if(!s.state.friends.includes(z))return;O++,i!==z&&(be(),c=null,n("chat-attachment").hidden=!0);let k=i!==z;if(i=z,r=null,l=null,n("chat-picker").hidden=!0,n("directory").hidden=!0,n("meeting").hidden=!1,n("meeting").dataset.tab="chat",t.classList.add("in-meeting"),n("meeting-avatar").textContent=X(z).emoji,n("meeting-name").textContent=X(z).name,n("meeting-signature").textContent=X(z).signature,n("chat-input").value=I.get(z)??s.state.drafts[z]??"",n("memory-orbs").hidden=!1,n("post-detail").hidden=!0,e.focus(z),k){let q=xe(z),fe=t.querySelector(".chat-panel"),j=fe.getBoundingClientRect();matchMedia("(prefers-reduced-motion: reduce)").matches||fe.animate([{opacity:0,transform:`translate(${q.x-j.left-j.width/2}px,${q.y-j.top-j.height/2}px) scale(.07)`},{opacity:1,transform:"translate(0,0) scale(1)"}],{duration:450,easing:"cubic-bezier(.2,.7,.2,1)"})}m="",P(!0),ie(),Q()&&await te(()=>s.markRead(z)),C()&&await te(()=>s.markPostsSeen(z))}function Ee(){be();let z=i,k=++O,q=z&&xe(z),fe=t.querySelector(".chat-panel");if(i=null,r=null,c=null,t.classList.remove("in-meeting"),e.restore(),q&&!matchMedia("(prefers-reduced-motion: reduce)").matches){let j=fe.getBoundingClientRect();fe.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:`translate(${q.x-j.left-j.width/2}px,${q.y-j.top-j.height/2}px) scale(.08)`}],{duration:220,easing:"ease-in"}),setTimeout(()=>{O===k&&(n("meeting").hidden=!0)},220)}else n("meeting").hidden=!0}function P(z=!1){if(!i)return;let k=s.state.messages.filter(Me=>Me.friendId===i),q=v.get(i)||80,fe=k.slice(-q),j=i+"|"+fe.map(Me=>Me.id).join("|");if(j===m&&!z)return;m=j;let pe=n("chat-messages"),Pe=pe.scrollHeight-pe.scrollTop-pe.clientHeight<90,Le=pe.scrollTop,Te=pe.scrollHeight,ke=0;pe.innerHTML=(k.length>q?'<button class="load-earlier" data-action="earlier">\u67E5\u770B\u66F4\u65E9\u7684\u6D88\u606F</button>':'<div class="chat-day">\u6BCF\u4E00\u6B21\u5BF9\u8BDD\uFF0C\u90FD\u503C\u5F97\u73CD\u85CF</div>')+fe.map(Me=>{let De="";Me.createdAt-ke>300*1e3&&(De=`<div class="chat-time">${xc(Me.createdAt)} ${Of(Me.createdAt)}</div>`,ke=Me.createdAt);let Se=He(Me.text);if(Me.type==="image"&&(Se=ue(Me.mediaId,"chat-photo")),Me.type==="sticker"&&(Se=`<div class="sticker-message"><span>${He(Me.text.split(" ")[0])}</span><small>${He(Me.text.split(" ").slice(1).join(" "))}</small></div>`),Me.type==="moment"){let ge=s.state.posts.find(Ue=>Ue.id===Me.momentId);Se=`<button class="shared-memory" data-action="post" data-id="${He(Me.momentId)}"><small>\u2727 \u4E00\u6BB5\u8BB0\u5FC6</small>${He(ge?.text||"\u8FD9\u6BB5\u56DE\u5FC6\u6682\u4E0D\u53EF\u7528")}</button>`}return De+`<div class="message ${Me.senderId==="me"?"outgoing":"incoming"}" data-message="${He(Me.id)}">${G(Me.senderId)}<div class="message-body ${Me.type}">${Se}</div></div>`}).join(""),U(pe);let W=i,we=++p;requestAnimationFrame(()=>{if(!(i!==W||we!==p))if(z){let Me=s.state.scrolls[W];pe.scrollTop=Me??pe.scrollHeight}else Pe?pe.scrollTop=pe.scrollHeight:pe.scrollTop=Le+Math.max(0,pe.scrollHeight-Te)})}function ie(){if(!i)return;let z=w(i);n("memory-count").textContent=`${z.length} \u6BB5\u8BB0\u5FC6`,t.querySelector(".memory-panel h2").textContent="\u4ED6\u7684\u8BB0\u5FC6\u5FAE\u5149",n("memory-orbs").innerHTML=oe(z),U(n("memory-orbs")),r&&!["own-post","my-memories"].includes(h)&&me(r)}function oe(z){return z.map((k,q)=>`<button class="memory-orb-wrap" data-action="post" data-id="${He(k.id)}" style="--orb-order:${q%6}" title="${He(k.text.slice(0,80))}"><span class="memory-orb">${k.mediaIds.length?`<img data-media="${He(k.mediaIds[0])}" alt="${He(k.text.slice(0,40)||"\u8BB0\u5FC6\u7F29\u7565\u56FE")}">`:`<span class="orb-text">\u2767<em>${He(k.text.slice(0,34))}</em></span>`}<span class="orb-glint"></span></span><span class="orb-date">${xc(k.createdAt)}</span><span class="orb-caption">${He(k.text.slice(0,22))}</span></button>`).join("")||'<div class="empty-note">\u628A\u4ECA\u5929\u7559\u5728\u8FD9\u91CC\uFF0C<br>\u5B83\u4F1A\u6210\u4E3A\u660E\u5929\u7684\u5FAE\u5149\u3002</div>'}function ne(z,k=!1){return`<div class="post-top"><button class="text-button" data-action="${k?"my-memories":"back-orbs"}">\u2190 \u8BB0\u5FC6\u5FAE\u5149</button><span>${xc(z.createdAt)}</span></div><div class="profile-line">${re(z.authorId)}</div><p class="post-text">${He(z.text)}</p><div class="post-photos count-${z.mediaIds.length}">${z.mediaIds.map(q=>ue(q)).join("")}</div><div class="post-actions"><button class="${z.likes.includes("me")?"liked":""}" data-action="like" data-id="${He(z.id)}">${z.likes.includes("me")?"\u2665":"\u2661"} ${z.likes.length} \u559C\u6B22</button>${k?"":`<button data-action="share-post" data-id="${He(z.id)}">\u2727 \u804A\u804A\u8FD9\u6761</button>`}</div><div class="post-likes">${z.likes.length?z.likes.map(q=>`<span>${He(X(q).emoji)} ${He(X(q).name)}</span>`).join(""):"\u8FD8\u6CA1\u6709\u4EBA\u70B9\u8D5E\uFF0C\u9001\u51FA\u7B2C\u4E00\u4EFD\u559C\u6B22\u5427\u3002"}</div><div class="comments">${z.comments.map(q=>`<p><strong>${He(X(q.authorId).name)}</strong> ${He(q.text)}</p>`).join("")}</div><form class="comment-form" data-post="${He(z.id)}"><input name="comment" value="${He(Y.get(z.id)||"")}" maxlength="500" placeholder="\u7559\u4E0B\u4E00\u70B9\u6E29\u6696\u2026" aria-label="\u8BC4\u8BBA\u5185\u5BB9" required><button class="secondary" type="submit">\u53D1\u9001</button></form>`}let Y=new Map;t.addEventListener("input",z=>{let k=z.target.closest(".comment-form");k&&Y.set(k.dataset.post,z.target.value)});function me(z){let k=s.state.posts.find(q=>q.id===z);if(!k)return F("\u8FD9\u6BB5\u8BB0\u5FC6\u6682\u4E0D\u53EF\u7528\u3002");if(h==="my-memories"||h==="own-post"){o=z,h="own-post",n("social-dialog").innerHTML=`<button class="dialog-close icon-button" data-action="close-dialog" aria-label="\u5173\u95ED">\xD7</button>${ne(k,!0)}`,U(n("social-dialog"));return}r=z,n("memory-orbs").hidden=!0,n("post-detail").hidden=!1,n("post-detail").innerHTML=ne(k),U(n("post-detail")),t.querySelector("#meeting").dataset.tab="memories"}function de(z,k){h=k;let q=n("social-dialog");q.innerHTML=`<button class="dialog-close icon-button" data-action="close-dialog" aria-label="\u5173\u95ED\u5F39\u7A97">\xD7</button>${z}`,q.open||q.showModal(),U(q)}function ye(z){let k=L(z);if(!k){F("\u8FD9\u4E2A\u72B6\u6001\u5DF2\u7ECF\u7ED3\u675F\u4E86\u3002");return}u=z;let q=ee(k.kind);de(`<div class="status-cover"><span>${He(q.icon)}</span><small>\u6B64\u523B\u7684\u5FC3\u60C5</small><h2>${He(q.label)}</h2></div><div class="profile-line">${re(z)}</div><p class="status-text">${He(k.text||"\u8BA9\u5FC3\u60C5\u5728\u8FD9\u91CC\u5F85\u4E00\u4F1A\u513F\u3002")}</p>${k.mediaId?ue(k.mediaId,"status-photo"):""}<p class="muted">${xc(k.createdAt)} ${Of(k.createdAt)} \xB7 24 \u5C0F\u65F6\u540E\u6D88\u6563</p>${z==="me"?'<button class="secondary" data-action="clear-status">\u7ED3\u675F\u8FD9\u4E2A\u72B6\u6001</button>':""}`,"status")}function Fe(){let z=L("me");de(`<small class="eyebrow">MY LITTLE CORNER</small><h2>\u6211\u7684\u6797\u95F4\u89D2\u843D</h2><div class="profile-line">${re("me")}</div><form id="profile-form"><label>\u6635\u79F0<input name="name" value="${He(s.state.profile.name)}" maxlength="24" required></label><label>\u4E2A\u6027\u7B7E\u540D<textarea name="signature" maxlength="100" rows="2">${He(s.state.profile.signature)}</textarea></label><button class="secondary" type="submit">\u4FDD\u5B58\u8D44\u6599</button></form><div class="me-actions"><button data-action="publish-status">${z?He(ee(z.kind).icon):"\u2600"}<strong>${z?"\u66F4\u65B0\u72B6\u6001":"\u53D1\u5E03\u72B6\u6001"}</strong><small>\u8BA9\u670B\u53CB\u77E5\u9053\u6B64\u523B\u7684\u4F60</small></button><button data-action="publish-post">\u2727<strong>\u7559\u4E0B\u4E00\u6BB5\u8BB0\u5FC6</strong><small>\u6587\u5B57\u4E0E\u7167\u7247\uFF0C\u90FD\u4F1A\u53D1\u5149</small></button><button data-action="my-memories">\u25CC<strong>\u6211\u7684\u8BB0\u5FC6\u5FAE\u5149</strong><small>${w("me").length} \u6761\u670B\u53CB\u5708</small></button>${z?'<button data-action="status" data-id="me">\u25C9<strong>\u67E5\u770B\u6211\u7684\u72B6\u6001</strong><small>\u53EF\u4EE5\u968F\u65F6\u7ED3\u675F</small></button>':""}</div><div class="demo-controls"><div><strong>\u672C\u5730\u6F14\u793A</strong><p>\u670B\u53CB\u7684\u56DE\u590D\u4E0E\u66F4\u65B0\u6765\u81EA\u9884\u8BBE\u6545\u4E8B\u3002</p></div><button class="secondary" data-action="pause-demo">${s.state.settings.demoPaused?"\u7EE7\u7EED\u6545\u4E8B":"\u6682\u505C\u6545\u4E8B"}</button><button class="text-button" data-action="replay-demo">\u91CD\u64AD\u6545\u4E8B</button></div>`,"me")}function Be(z){D++,d=z,f=[],de(`<small class="eyebrow">${z==="status"?"A FEELING, FOR TODAY":"A MEMORY, TO KEEP"}</small><h2>${z==="status"?"\u6B64\u523B\uFF0C\u4F60\u662F\u4EC0\u4E48\u5FC3\u60C5\uFF1F":"\u628A\u4ECA\u5929\u53D8\u6210\u4E00\u9897\u5FAE\u5149"}</h2><form id="publish-form">${z==="status"?`<div class="state-options">${nr.map((k,q)=>`<label><input type="radio" name="kind" value="${He(k.id)}" ${q===0?"checked":""}><span>${He(k.icon)} ${He(k.label)}</span></label>`).join("")}</div>`:""}<textarea name="text" rows="4" maxlength="2000" placeholder="${z==="status"?"\u8BB0\u5F55\u6B64\u523B\u7684\u5FC3\u60C5\u2026":"\u4ECA\u5929\u6709\u4EC0\u4E48\u503C\u5F97\u8BB0\u4F4F\uFF1F"}" aria-label="\u53D1\u5E03\u6587\u6848"></textarea><label class="upload-area">\uFF0B ${z==="status"?"\u6DFB\u52A0\u4E00\u5F20\u7167\u7247":"\u6DFB\u52A0\u7167\u7247\uFF08\u6700\u591A\u4E5D\u5F20\uFF09"}<input id="publish-files" type="file" accept="image/*" ${z==="post"?"multiple":""}></label><div id="publish-previews"></div><p class="muted">${z==="status"?"24 \u5C0F\u65F6\u540E\u81EA\u52A8\u7ED3\u675F\u3002":"\u53EA\u4FDD\u5B58\u5728\u5F53\u524D\u6D4F\u89C8\u5668\u3002"} \u6BCF\u5F20\u56FE\u7247\u4E0D\u8D85\u8FC7 10 MB\u3002</p><button class="primary" type="submit">${z==="status"?"\u5C31\u7528\u8FD9\u4E2A\u72B6\u6001":"\u53D1\u5E03\u8FD9\u6BB5\u8BB0\u5FC6"} \u2197</button></form>`,"publish")}function R(){o=null,de(`<small class="eyebrow">MY MEMORIES</small><h2>\u6211\u7684\u8BB0\u5FC6\u5FAE\u5149</h2><div class="own-orbs">${oe(w("me"))}</div>`,"my-memories")}function S(z){l=l===z?null:z;let k=n("chat-picker");k.hidden=!l,k.innerHTML=l==="emoji"?`<div class="emoji-grid">${Ay.map(q=>`<button data-action="insert-emoji" data-value="${q}">${q}</button>`).join("")}</div>`:l==="stickers"?`<div class="sticker-grid">${wy.map(([q,fe])=>`<button data-action="send-sticker" data-value="${q} ${fe}"><span>${q}</span>${fe}</button>`).join("")}</div>`:""}async function K(z){if(!i)return!1;let k=i,q=n("chat-input").value,fe=c,j=z.type==="text"||z.type==="image";j&&clearTimeout(x);let pe=await te(async()=>(await s.sendMessage(k,z),!0));return pe&&(n("chat-picker").hidden=!0,l=null,k===i&&(j&&n("chat-input").value===q&&(n("chat-input").value="",I.set(k,""),await te(()=>s.setDraft(k,""))),j&&c===fe&&(c=null,n("chat-attachment").hidden=!0),n("chat-messages").scrollTop=n("chat-messages").scrollHeight)),!!pe}t.addEventListener("click",async z=>{let k=z.target.closest("[data-action]");if(!k)return;let q=k.dataset.action,fe=k.dataset.id;if(q==="directory"&&(n("directory").hidden=!1,B()),q==="close-directory"&&(n("directory").hidden=!0),q==="directory-tab"&&(a=k.dataset.tab,t.querySelectorAll(".directory-tabs button").forEach(j=>j.classList.toggle("active",j===k)),B()),q==="add-friend"){k.disabled=!0;let j=await te(async()=>(await s.addFriend(fe),!0));k.disabled=!1,j&&(B(),F(`${X(fe).name}\u6765\u5230\u6EAA\u8C37\u4E86\u3002`))}if(q==="open-friend"&&Re(fe),q==="close-meeting"&&Ee(),q==="status"&&ye(fe),q==="me"&&Fe(),q==="close-dialog"&&n("social-dialog").close(),q==="close-photo"&&n("photo-dialog").close(),q==="photo"){let j=await te(()=>s.mediaUrl(k.dataset.media));j&&(n("photo-dialog").querySelector("img").src=j,n("photo-dialog").showModal())}if(q==="post"&&me(fe),q==="back-orbs"&&(r=null,n("post-detail").hidden=!0,n("memory-orbs").hidden=!1),q==="like"){if(!await te(async()=>(await s.toggleLike(fe),!0)))return;let pe=t.querySelector('[data-action="like"][data-id="'+CSS.escape(fe)+'"]');if(!pe)return;pe.animate([{transform:"scale(1)"},{transform:"scale(1.18)",color:"#c48660"},{transform:"scale(1)"}],{duration:350});let Pe=document.createElement("span");Pe.className="like-spark",Pe.textContent="\u2726",pe.append(Pe),setTimeout(()=>Pe.remove(),700)}if(q==="share-post"){if(!await K({type:"moment",momentId:fe,text:"\u60F3\u548C\u4F60\u804A\u804A\u8FD9\u6BB5\u8BB0\u5FC6"}))return;n("meeting").dataset.tab="chat",F("\u8BB0\u5FC6\u5DF2\u653E\u8FDB\u5BF9\u8BDD\uFF0C\u63A5\u7740\u8BF4\u70B9\u4EC0\u4E48\u5427\u3002"),n("chat-input").focus()}if((q==="emoji"||q==="stickers")&&S(q),q==="insert-emoji"){let j=n("chat-input");j.setRangeText(k.dataset.value,j.selectionStart,j.selectionEnd,"end"),j.dispatchEvent(new Event("input")),j.focus()}q==="send-sticker"&&await K({type:"sticker",text:k.dataset.value}),q==="chat-image"&&n("chat-file").click(),q==="remove-attachment"&&(c=null,n("chat-attachment").hidden=!0),q==="earlier"&&(v.set(i,(v.get(i)||80)+80),m="",P()),q==="meeting-tab"&&(n("meeting").dataset.tab=k.dataset.tab,Q()&&te(()=>s.markRead(i)),C()&&te(()=>s.markPostsSeen(i)),t.querySelectorAll(".mobile-tabs button").forEach(j=>j.classList.toggle("active",j===k))),q==="publish-status"&&Be("status"),q==="publish-post"&&Be("post"),q==="my-memories"&&R(),q==="clear-status"&&await te(async()=>(await s.clearStatus(),!0))&&Fe(),q==="pause-demo"&&(await te(()=>s.setDemoPaused(!s.state.settings.demoPaused)),Fe()),q==="replay-demo"&&await te(async()=>(await s.restartDemo(),!0))&&F("\u6545\u4E8B\u4ECE\u5934\u5F00\u59CB\uFF0C\u4F60\u7684\u5185\u5BB9\u90FD\u4F1A\u4FDD\u7559\u3002")}),t.addEventListener("submit",async z=>{z.preventDefault();let k=z.target,q=k.querySelector('[type="submit"]');if(!q?.disabled){if(k.id==="chat-form"){let fe=n("chat-input").value.trim();if(!fe&&!c)return;q.disabled=!0;try{await K(c?{type:"image",mediaId:c,text:fe}:{type:"text",text:fe})}finally{q.disabled=!1}return}if(k.classList.contains("comment-form")){let j=k.elements.comment.value.trim();if(!j)return;q.disabled=!0,await te(async()=>{Y.delete(k.dataset.post);try{await s.addComment(k.dataset.post,j)}catch(Pe){throw Y.set(k.dataset.post,j),Pe}return!0})||(q.disabled=!1);return}if(k.id==="profile-form"){let fe=new FormData(k);await te(async()=>(await s.updateProfile({name:String(fe.get("name")).trim(),signature:String(fe.get("signature")).trim()}),!0))&&F("\u8D44\u6599\u5DF2\u4FDD\u5B58\u3002");return}if(k.id==="publish-form"){let fe=new FormData(k),j=String(fe.get("text")).trim();if(d==="post"&&!j&&!f.length)return F("\u5199\u4E00\u70B9\u6587\u5B57\uFF0C\u6216\u6DFB\u4E00\u5F20\u7167\u7247\u5427\u3002");q.disabled=!0;let pe=await te(async()=>(d==="status"?await s.publishStatus({kind:fe.get("kind"),text:j,mediaId:f[0]}):await s.publishPost({text:j,mediaIds:f}),!0));q.disabled=!1,pe&&(F(d==="status"?"\u5FC3\u60C5\u5DF2\u6302\u5728\u4ECA\u5929\u7684\u679D\u5934\u3002":"\u65B0\u7684\u8BB0\u5FC6\u5FAE\u5149\uFF0C\u5DF2\u7ECF\u70B9\u4EAE\u3002"),Fe())}}}),n("friend-search").addEventListener("input",B),n("chat-input").addEventListener("input",()=>{if(!i)return;let z=i,k=n("chat-input").value;I.set(z,k),clearTimeout(x),x=setTimeout(()=>te(()=>s.setDraft(z,k)),250)}),n("chat-input").addEventListener("keydown",z=>{z.key==="Enter"&&!z.shiftKey&&!z.isComposing&&z.keyCode!==229&&(z.preventDefault(),n("chat-form").requestSubmit())}),n("chat-messages").addEventListener("scroll",()=>{if(!i)return;let z=i,k=n("chat-messages").scrollTop;clearTimeout(y),y=setTimeout(()=>te(()=>s.setScroll(z,k)),250)}),n("chat-file").addEventListener("change",async z=>{let k=z.target.files[0];if(!k)return;c=null,n("chat-attachment").hidden=!0;let q=i,fe=++A,j=await te(()=>s.importImage(k));z.target.value="",j&&i===q&&fe===A&&(c=j,n("chat-attachment").hidden=!1,n("chat-attachment").innerHTML=`<img data-media="${He(j)}" alt="\u5F85\u53D1\u9001\u56FE\u7247"><span>\u56FE\u7247\u51C6\u5907\u597D\u4E86</span><button class="icon-button" data-action="remove-attachment" aria-label="\u79FB\u9664\u56FE\u7247">\xD7</button>`,U(n("chat-attachment")))}),t.addEventListener("change",async z=>{if(z.target.id!=="publish-files")return;let k=[...z.target.files],q=d==="status"?1:9;if(k.length>q)return F(`\u6700\u591A\u9009\u62E9 ${q} \u5F20\u7167\u7247\u3002`);f=[],n("publish-previews").innerHTML="";let fe=++D,j=n("publish-form"),pe=j.querySelector('[type="submit"]');pe.disabled=!0;let Pe=[],Le=!1;for(let Te of k){let ke=await te(()=>s.importImage(Te));if(!ke){Le=!0;break}Pe.push(ke)}j.isConnected&&fe===D&&(Le||(f=Pe,n("publish-previews").innerHTML=Pe.map(Te=>`<img data-media="${He(Te)}" alt="\u5F85\u53D1\u5E03\u7167\u7247">`).join(""),U(n("publish-previews"))),pe.disabled=!1)}),n("social-dialog").addEventListener("close",()=>{h=null,u=null});for(let z of["social-dialog","photo-dialog"])n(z).addEventListener("click",k=>{if(k.target===n(z)){let q=n(z).getBoundingClientRect();(k.clientX<q.left||k.clientX>q.right||k.clientY<q.top||k.clientY>q.bottom)&&n(z).close()}});window.addEventListener("keydown",z=>{z.key==="Escape"&&!n("social-dialog").open&&!n("photo-dialog").open&&(n("directory").hidden?i&&Ee():n("directory").hidden=!0)}),document.addEventListener("visibilitychange",()=>{Q()&&H(i)&&te(()=>s.markRead(i))});let ce=setInterval(()=>{le(),h==="status"&&!L(u)&&(n("social-dialog").close(),F("\u8FD9\u4E2A\u72B6\u6001\u5DF2\u7ED3\u675F\u3002"))},3e4),ve=s.subscribe((z,k)=>{if(!["draft","scroll"].some(q=>k?.type?.toLowerCase().includes(q))){if($(),i){P();let q=JSON.stringify(w(i));q!==M&&(M=q,ie()),Q()&&H(i)&&te(()=>s.markRead(i)),C()&&w(i).some(fe=>fe.createdAt>(s.state.seenPosts[i]||0))&&te(()=>s.markPostsSeen(i))}h==="own-post"&&o&&me(o),h==="status"&&L(u)&&ye(u)}});$(),B();function he(z){if(z-_<80)return;_=z;let k=e.getAnchors(),q=[],fe=0;for(let j of k){let pe=b.get(j.id);if(!pe)continue;pe.dataset.worldX=j.worldX?.toFixed(3),pe.dataset.worldZ=j.worldZ?.toFixed(3),pe.dataset.walking=String(!!j.walking),pe.hidden=!j.visible,pe.classList.toggle("selected",i===j.id),pe.classList.toggle("occluded",!!j.occluded);let Le=z-(V.get(j.id)?.at||-1/0)<8e3&&fe<3||i===j.id;Le&&fe++,pe.classList.toggle("show-message",Le);let Te=Math.max(100,Math.min(innerWidth-100,j.x)),ke=Math.max(90,Math.min(innerHeight-100,j.y));for(let W of q)Math.abs(W.x-Te)<145&&Math.abs(W.y-ke)<40&&(Te=Math.max(80,Math.min(innerWidth-80,Te+(Te<W.x?-1:1)*(148-Math.abs(W.x-Te)))));ke=Math.max(70,ke),q.push({x:Te,y:ke}),pe.style.transform=`translate(${Math.round(Te)}px,${Math.round(ke)}px) translate(-50%,-100%)`}}return{openFriend:Re,update:he,closeMeeting:Ee,toast:F,get activeFriend(){return i},dispose(){ve(),clearInterval(ce),clearTimeout(x),clearTimeout(y),t.remove()}}}async function Ry(){let s=w=>document.getElementById(w),e=new Er;e.background=new ze(2112050),e.fog=new Sr(2112050,innerWidth<700?.0055:.013);let t=matchMedia("(prefers-reduced-motion: reduce)"),n=new uc({antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0});n.setPixelRatio(Math.min(devicePixelRatio,1.65)),n.setSize(innerWidth,innerHeight),n.shadowMap.enabled=!0,n.shadowMap.type=pa,n.outputColorSpace=bt,n.toneMapping=ba,n.toneMappingExposure=1.23,s("viewport").append(n.domElement);let i=new wt(37,innerWidth/innerHeight,.1,500),r=new pc(i,n.domElement);r.enableDamping=!0,r.dampingFactor=.065,r.minDistance=6,r.maxDistance=105,r.maxPolarAngle=Math.PI*.485,r.minPolarAngle=.15,r.autoRotateSpeed=.35,r.target.set(0,2,0),r.enablePan=!0;let o=new $r(13099986,4084275,2);e.add(o);let a=new Ei(16769953,3.7);a.position.set(-11,22,8),a.castShadow=!0,a.shadow.mapSize.set(2048,2048),Object.assign(a.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:1,far:65}),a.shadow.bias=-4e-4,a.shadow.normalBias=.045,a.shadow.radius=3,e.add(a);let l=new Ei(10144709,1.2);l.position.set(12,8,-15),e.add(l);let c=null;try{c=await bf()}catch(w){console.warn("Local Rodin assets unavailable; retaining procedural props.",w)}let h=hf(e,{rodinBridge:!!c?.bridge}),u=c?Sf(e,c):null,f=uf(e,{rodin:!!c,expanded:!!c?.cottage}),d=gf(e,{rodin:!!c,expanded:!!c?.cottage}),p,_=await Ff({scene:e,camera:i,controls:r,renderer:n,terrain:h,generated:u,reduced:t,onSelect:w=>p?.openFriend(w)}),g=await If();p=Bf({store:g,characters:_});let m=new URLSearchParams(location.search).has("stress"),M=m?null:Pf(g);m&&(_.sync([..._n,..._n.map(w=>({...w,id:w.id+"-stress"}))]),s("viewport").dataset.stressCharacters=String(_.audit.slots.length));let y=new Set([...f.flames||[]]);for(let w of d.butterflies||[])w.group.traverse(H=>y.add(H));let x=new Map;e.updateMatrixWorld(!0),e.traverse(w=>{if(!w.isMesh||w.userData.socialCharacter||w.userData.generatedProp||y.has(w)||w.material.transparent||w.material.isShaderMaterial||Array.isArray(w.material)||w.name.includes("foam")||w.name.includes("filament"))return;let H=w.material.uuid+w.castShadow+w.receiveShadow;x.has(H)||x.set(H,[]),x.get(H).push(w)});for(let w of x.values()){if(w.length<8)continue;let H=w.map(te=>{let U=te.geometry.clone();U.index&&(U=U.toNonIndexed()),U.applyMatrix4(te.matrixWorld);for(let ue of Object.keys(U.attributes))["position","normal","uv"].includes(ue)||U.deleteAttribute(ue);return U.attributes.uv||U.setAttribute("uv",new Ge(new Float32Array(U.attributes.position.count*2),2)),U}),G=lf(H,!1);if(!G)continue;let F=new ot(G,w[0].material);F.name="Batched detail \xB7 "+w[0].name,F.castShadow=w[0].castShadow,F.receiveShadow=w[0].receiveShadow,e.add(F),w.forEach(te=>te.removeFromParent()),H.forEach(te=>te.dispose())}u&&(s("viewport").dataset.rodinInstances=String(u.userData.inventory.length),s("viewport").dataset.rodinKinds=Object.keys(c).join(",")),s("viewport").dataset.people="0",s("viewport").dataset.landArea=String(h.root.userData.landArea?.total||567.807833);let E=new ot(new zn(1e3,1e3),new At({color:2506547,roughness:1}));E.rotation.x=-Math.PI/2,E.position.y=-3.07,E.receiveShadow=!0,E.name="Matte forest display ground",e.add(E);let A=42,D=new Float32Array(A*3),O=[];for(let w=0;w<A;w++){let H=w*2.399,G=3+w%9*.8;O.push([Math.cos(H)*G,2.6+w%5*.45,Math.sin(H)*G])}let b=new je;b.setAttribute("position",new gt(D,3));let v=new si(b,new Bn({color:15136163,size:.075,transparent:!0,opacity:.75,depthWrite:!1,sizeAttenuation:!0}));v.name="Floating firefly lights",v.frustumCulled=!1,e.add(v);let I=0,V=performance.now();function X(){r.target.set(0,2.1,0),i.position.set(27,28,40),innerWidth<700&&i.position.sub(r.target).multiplyScalar(1.95).add(r.target),r.update()}window.addEventListener("keydown",w=>{if(!(w.target.closest("input,textarea,[contenteditable],dialog")||!r.enabled)&&(w.key==="Home"&&(X(),w.preventDefault()),["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","-","="].includes(w.key)&&!w.target.closest("button,input"))){let H=i.position.clone().sub(r.target),G=new Ti().setFromVector3(H);w.key==="ArrowLeft"&&(G.theta-=.12),w.key==="ArrowRight"&&(G.theta+=.12),w.key==="ArrowUp"&&(G.phi-=.08),w.key==="ArrowDown"&&(G.phi+=.08),(w.key==="+"||w.key==="=")&&(G.radius*=.9),w.key==="-"&&(G.radius*=1.1),G.phi=mn.clamp(G.phi,.15,Math.PI*.485),G.radius=mn.clamp(G.radius,6,105),i.position.copy(r.target).add(new N().setFromSpherical(G)),r.update(),w.preventDefault()}});let ee=innerWidth<700;window.addEventListener("resize",()=>{i.aspect=innerWidth/innerHeight,i.updateProjectionMatrix(),e.fog.density=innerWidth<700?.0055:.013,n.setSize(innerWidth,innerHeight),ee!==innerWidth<700&&(ee=innerWidth<700,X(),p.activeFriend&&_.focus(p.activeFriend))}),X();let Q=0,C=performance.now();function L(w){let H=Math.min((w-V)/1e3,.05);V=w,t.matches||(I+=H),r.update(H),_.update(w,H),p.update(w),h.waterUniforms.uTime.value=I;for(let G of h.falls)G.position.y=-((I*1.3+G.userData.phase)%2.8);for(let G of h.ripples){let F=(G.userData.originZ+11+I*.26)%22-11;G.position.z=F,G.position.x=In(F)+G.userData.xOffset}for(let G=0;G<f.flames.length;G++){let F=f.flames[G];F.scale.y=.85+Math.sin(I*7+G*1.6)*.16,F.rotation.y=I*.3+G}f.lights?.[0]&&(f.lights[0].intensity=2.5+Math.sin(I*9)*.5);for(let G of d.butterflies||[]){G.group.position.copy(G.origin),G.group.position.y+=Math.sin(I*1.3+G.phase)*.25,G.group.position.x+=Math.sin(I*.5+G.phase)*.35;for(let F=0;F<G.wings.length;F++)G.wings[F].rotation.y=(F?1:-1)*Math.sin(I*9+G.phase)*.85}for(let G=0;G<A;G++)D[G*3]=O[G][0]+Math.sin(I*.4+G)*.3,D[G*3+1]=O[G][1]+Math.sin(I*.6+G)*.25,D[G*3+2]=O[G][2]+Math.cos(I*.3+G)*.2;b.attributes.position.needsUpdate=!0,n.render(e,i),Q++,w-C>3e3&&(s("viewport").dataset.fps=(Q*1e3/(w-C)).toFixed(1),C=w,Q=0),requestAnimationFrame(L)}n.render(e,i),s("viewport").dataset.loaded="true",requestAnimationFrame(L),window.addEventListener("webglcontextlost",w=>{w.preventDefault(),console.warn("WebGL context lost; reload to restore the scene.")})}Ry().catch(s=>{console.error(s);let e=document.createElement("div");e.style.cssText="position:fixed;bottom:24px;left:24px;background:#fff8df;padding:20px;border-radius:14px;color:#354f40",e.textContent="\u573A\u666F\u6682\u672A\u5B8C\u6210\u52A0\u8F7D\uFF1A"+s.message,document.body.append(e)});})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
