import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const canvas=document.querySelector('#scene3d');let renderer,scene,camera,left,right,clock,opened=false;
try{
 renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;
 scene=new THREE.Scene();scene.background=new THREE.Color(0x090909);scene.fog=new THREE.Fog(0x090909,13,38);
 camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.1,100);camera.position.set(0,4.2,17);camera.lookAt(0,3,0);clock=new THREE.Clock();
 scene.add(new THREE.HemisphereLight(0xffffff,0x39302a,2.1));const key=new THREE.DirectionalLight(0xffe5bd,3);key.position.set(-5,10,8);key.castShadow=true;scene.add(key);
 const fill=new THREE.PointLight(0xffffff,70,30);fill.position.set(0,5,-1);scene.add(fill);
 const mat=(c,r=.5,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});const ivory=mat(0xece8df,.32),white=mat(0xffffff,.25),black=mat(0x101010,.2,.35),marble=mat(0x242424,.22,.3),gold=mat(0xb89a69,.25,.75);
 function box(w,h,d,m,x,y,z,parent=scene){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
 box(40,.25,45,marble,0,-.35,-8);box(15,8,1.2,ivory,0,4,-5);box(18,.5,2,white,0,.1,-4.5);
 for(const s of [-1,1]){box(4.5,10,1.5,white,s*9,5,-5);for(let i=0;i<3;i++){let x=s*(2.8+i*2);let c=new THREE.Mesh(new THREE.CylinderGeometry(.28,.38,7.5,20),white);c.position.set(x,3.8,-3.8);scene.add(c);let cap=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.25,20),gold);cap.position.set(x,7.65,-3.8);scene.add(cap)}box(2,12,2,ivory,s*10,6,-5);let roof=new THREE.Mesh(new THREE.ConeGeometry(1.55,2.6,4),black);roof.position.set(s*10,13.2,-5);roof.rotation.y=Math.PI/4;scene.add(roof)}
 box(7,.7,1.2,white,0,8.1,-3.9);box(.65,7.5,1.2,white,-3.5,4.2,-3.9);box(.65,7.5,1.2,white,3.5,4.2,-3.9);
 const doorIvory=mat(0xf4efe3,.28,.12),doorGold=mat(0xc5a15e,.22,.78),doorShadow=mat(0xd7c9ad,.38,.18);
 function makeDoor(group,hingeSide){
  const sign=hingeSide;
  box(3.12,6.35,.42,doorIvory,sign*1.56,0,0,group);
  // inset raised panels and gilded borders
  for(const y of [-2.35,0,2.2]){
   const h=y===0?1.65:1.55;
   box(2.48,h,.10,doorShadow,sign*1.56,y,.25,group);
   box(2.30,h-.16,.08,doorIvory,sign*1.56,y,.32,group);
   box(2.38,.045,.035,doorGold,sign*1.56,y+h/2,.39,group);
   box(2.38,.045,.035,doorGold,sign*1.56,y-h/2,.39,group);
  }
  box(.055,5.9,.05,doorGold,sign*1.56,0,.39,group);
  box(.055,5.9,.05,doorGold,sign*3.02,0,.39,group);
  const med=new THREE.Mesh(new THREE.SphereGeometry(.23,24,16),doorGold);med.position.set(sign*1.56,0,.48);group.add(med);
  const handle=new THREE.Mesh(new THREE.SphereGeometry(.105,20,16),doorGold);handle.position.set(-sign*.25,-.05,.52);group.add(handle);
  const crest=new THREE.Mesh(new THREE.TorusGeometry(.48,.055,12,48),doorGold);crest.position.set(sign*1.56,0,.48);group.add(crest);
  const crest2=new THREE.Mesh(new THREE.TorusGeometry(.29,.035,12,40),doorGold);crest2.position.set(sign*1.56,0,.49);group.add(crest2);
 }
 left=new THREE.Group();left.position.set(-3.15,3.4,-2.9);makeDoor(left,1);scene.add(left);
 right=new THREE.Group();right.position.set(3.15,3.4,-2.9);makeDoor(right,-1);scene.add(right);
 for(let i=0;i<5;i++)box(10+i*1.5,.22,1.1,ivory,0,-.12+i*.03,1+i*1.1);
 const n=180,p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=(Math.random()-.5)*18;p[i*3+1]=Math.random()*11;p[i*3+2]=(Math.random()-.5)*18-2}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(p,3));const dust=new THREE.Points(geo,new THREE.PointsMaterial({color:0xd8bd8d,size:.045,transparent:true,opacity:.75}));scene.add(dust);
 function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime(),dt=Math.min(clock.getDelta(),.05);if(opened){left.rotation.y=THREE.MathUtils.damp(left.rotation.y,-1.12,2,dt);right.rotation.y=THREE.MathUtils.damp(right.rotation.y,1.12,2,dt)}else{left.rotation.y=Math.sin(t*.35)*.02;right.rotation.y=-Math.sin(t*.35)*.02}dust.rotation.y=t*.018;camera.position.x=Math.sin(t*.16)*.18;camera.position.y=4.2+Math.sin(t*.28)*.08;camera.lookAt(0,3,0);renderer.render(scene,camera)}animate();
 addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5))});
}catch(err){console.warn('3D scene unavailable',err);canvas.style.background='radial-gradient(ellipse at 50% 35%,#777064,#171614 55%,#050505)'}
const params=new URLSearchParams(location.search);const guest=params.get('to');if(guest)document.querySelector('#guestName').textContent=guest;
const openButton=document.querySelector('#openInvite');
openButton.addEventListener('click',()=>{
 if(openButton.disabled)return;
 openButton.disabled=true;
 openButton.textContent='MEMBUKA ISTANA...';
 opened=true;
 document.querySelector('#cover').classList.add('opening');
 window.setTimeout(()=>{
  document.querySelector('#cover').style.display='none';
  document.querySelector('#invitation').classList.remove('hidden');
  window.scrollTo(0,0);
 },1500);
});
const weddingDate=new Date('2027-01-07T08:00:00+08:00');function tick(){const d=Math.max(0,weddingDate-new Date()),v=[Math.floor(d/86400000),Math.floor(d/3600000)%24,Math.floor(d/60000)%60,Math.floor(d/1000)%60];['days','hours','minutes','seconds'].forEach((id,i)=>document.getElementById(id).textContent=String(v[i]).padStart(2,'0'))}tick();setInterval(tick,1000);
document.querySelector('#rsvpForm').addEventListener('submit',e=>{e.preventDefault();const n=document.querySelector('#rsvpName').value.trim(),a=document.querySelector('#attendance').value,c=document.querySelector('#guestCount').value,m=document.querySelector('#message').value.trim();alert('Terima kasih. Nomor WhatsApp konfirmasi akan ditambahkan setelah data kontak diberikan.')});

// Premium scroll reveal: progressive enhancement, content remains visible without IntersectionObserver.
document.querySelectorAll('#invitation .section-pad, #invitation .event-card, #invitation .couple-frame, #invitation .names-block').forEach(el=>el.classList.add('reveal'));
if('IntersectionObserver' in window){
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}
 }),{threshold:.12,rootMargin:'0px 0px -35px 0px'});
 document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}
