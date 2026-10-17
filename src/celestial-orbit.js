import * as T from 'three';
// A stylized equinox: each body spends exactly half the cycle above the horizon.
export function celestialOrbit(seconds){
 const angle=((seconds%720)+720)%720/720*Math.PI*2;
 const sun=new T.Vector3(Math.cos(angle),Math.sin(angle)*.8,-Math.sin(angle)*.6);
 return{sun,moon:sun.clone().negate()};
}
export function createCelestialBodies(scene){
 const geometry=new T.SphereGeometry(1,24,16);
 const sunMaterial=new T.MeshBasicMaterial({color:0xffe3a1,toneMapped:false,fog:false});
 const moonMaterial=new T.MeshBasicMaterial({color:0xdce8ff,toneMapped:false,fog:false});
 const sun=new T.Mesh(geometry,sunMaterial),moon=new T.Mesh(geometry,moonMaterial);
 sun.name='Visible sun';moon.name='Visible moon';scene.add(sun,moon);
 const haloGeometry=new T.PlaneGeometry(1,1);
 function halo(color){const material=new T.ShaderMaterial({uniforms:{tint:{value:new T.Color(color)},strength:{value:1}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec2 vUv; uniform vec3 tint; uniform float strength; void main(){float r=length(vUv-.5)*2.;float a=exp(-r*r*6.)*(1.-smoothstep(.3,1.,r));gl_FragColor=vec4(tint,a*strength);}',transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});const mesh=new T.Mesh(haloGeometry,material);mesh.frustumCulled=false;scene.add(mesh);return mesh;}
 const sunHalo=halo(0xffac55),moonHalo=halo(0x99bdff);
 return{sun,moon,update(orbit,camera){
  // Sky objects are camera-relative; their directions exactly match the lights.
  for(const [body,direction,radius] of [[sun,orbit.sun,5],[moon,orbit.moon,4]]){
   body.position.copy(camera.position).addScaledVector(direction,220);body.scale.setScalar(radius);
   body.visible=direction.y>0;
    const glow=body===sun?sunHalo:moonHalo,low=1-T.MathUtils.smoothstep(direction.y,0,.4);
    glow.position.copy(body.position);glow.quaternion.copy(camera.quaternion);glow.scale.setScalar(body===sun?42+low*28:30);
    glow.visible=body.visible;glow.material.uniforms.strength.value=(body===sun?.7+low*.3:.3)*T.MathUtils.smoothstep(direction.y,0,.025);
    if(body===sun){sunMaterial.color.setHex(0xfff1c0).lerp(new T.Color(0xff8b3e),low);glow.material.uniforms.tint.value.copy(sunMaterial.color);}
  }
 },dispose(){sun.removeFromParent();moon.removeFromParent();sunHalo.removeFromParent();moonHalo.removeFromParent();haloGeometry.dispose();sunHalo.material.dispose();moonHalo.material.dispose();geometry.dispose();sunMaterial.dispose();moonMaterial.dispose();}};
}
