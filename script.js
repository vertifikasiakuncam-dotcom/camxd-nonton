import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas=document.querySelector('#scene3d');
const cover=document.querySelector('#cover');
const invitation=document.querySelector('#invitation');
const openButton=document.querySelector('#openInvite');
let renderer,scene,camera,clock,leftDoor,rightDoor,doorProgress=0,opening=false,openStarted=false;

try{
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
  renderer.setSize(cover.clientWidth,cover.clientHeight);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.15;

  scene=new THREE.Scene();
  scene.background=new THREE.Color(0x17130e);
  scene.fog=new THREE.Fog(0x17130e,24,48);
  camera=new THREE.PerspectiveCamera(42,cover.clientWidth/cover.clientHeight,.1,100);
  camera.position.set(0,5.2,23);
  camera.lookAt(0,4.1,0);
  clock=new THREE.Clock();

  const ivory=new THREE.MeshStandardMaterial({color:0xf0e8d8,roughness:.38,metalness:.08});
  const pale=new THREE.MeshStandardMaterial({color:0xfffaf0,roughness:.3,metalness:.04});
  const gold=new THREE.MeshStandardMaterial({color:0xb99452,roughness:.25,metalness:.78});
  const shadow=new THREE.MeshStandardMaterial({color:0xcfc0a5,roughness:.5,metalness:.12});
  const dark=new THREE.MeshStandardMaterial({color:0x4a3823,roughness:.35,metalness:.4});
  const floorMat=new THREE.MeshStandardMaterial({color:0x8b8172,roughness:.3,metalness:.18});

  function box(w,h,d,material,x,y,z,parent=scene){
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
    mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  function cylinder(rt,rb,h,material,x,y,z,parent=scene){
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,32),material);
    mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }

  scene.add(new THREE.HemisphereLight(0xfff5df,0x554737,2.2));
  const sun=new THREE.DirectionalLight(0xffdfaa,3.2);sun.position.set(-7,13,12);sun.castShadow=true;scene.add(sun);
  const glow=new THREE.PointLight(0xffd58c,95,32);glow.position.set(0,6,-5);scene.add(glow);
  const fill=new THREE.PointLight(0xffffff,38,28);fill.position.set(0,5,9);scene.add(fill);

  // Palace forecourt and a visible path beyond the doors
  box(30,.35,38,floorMat,0,-.28,-5);
  for(let i=0;i<6;i++)box(8+i*.8,.09,.9,pale,0,-.07,-1-i*2.2);
  // Back courtyard: bright inner arch, fountain and garden silhouettes
  box(12,8,.5,ivory,0,4.2,-12);
  box(8,.18,.65,gold,0,7.8,-11.65);
  const innerArch=new THREE.Mesh(new THREE.TorusGeometry(3.8,.22,16,64,Math.PI),gold);
  innerArch.position.set(0,4.2,-11.55);scene.add(innerArch);
  cylinder(.8,1.15,.35,gold,0,.15,-8.5);
  cylinder(.48,.7,.8,pale,0,.65,-8.5);
  const water=new THREE.Mesh(new THREE.SphereGeometry(.35,24,16),new THREE.MeshStandardMaterial({color:0xd9eff0,metalness:.4,roughness:.12}));
  water.position.set(0,1.15,-8.5);scene.add(water);

  // Main facade, columns and capitals
  box(15,.65,1.2,pale,0,9.25,-3.8);
  box(15,.4,1.35,gold,0,9.65,-3.8);
  for(const x of [-6.1,6.1]){
    box(1.15,9.3,1.25,ivory,x,4.65,-3.8);
    cylinder(.72,.72,.48,gold,x,9.45,-3.8);
    cylinder(.5,.5,.32,pale,x,9.85,-3.8);
    box(1.45,.35,1.5,gold,x,10.08,-3.8);
    for(let k=0;k<3;k++){
      const flute=box(.055,7.7,.045,pale,x-0.3+k*.3,4.7,-3.13);
    }
    // ornate column base
    box(1.65,.45,1.7,gold,x,.22,-3.8);
    box(1.4,.35,1.5,pale,x,.58,-3.8);
  }
  // Architrave and decorative gold trim
  box(10.8,.28,.55,gold,0,8.95,-3.2);
  box(10.3,.16,.45,pale,0,8.68,-3.2);
  // Fixed side panels frame the doors
  box(1.25,7.25,.65,ivory,-4.55,4.05,-3.25);
  box(1.25,7.25,.65,ivory,4.55,4.05,-3.25);
  for(const x of [-4.55,4.55]){
    box(1.38,.12,.78,gold,x,7.72,-2.88);
    box(1.38,.12,.78,gold,x,.38,-2.88);
    box(.07,6.8,.08,gold,x,4.05,-2.82);
  }

  // Two hinged, ivory-and-gold doors with raised panels
  function makeDoor(group,side){
    const cx=side*1.58;
    box(3.16,6.65,.48,ivory,cx,0,0,group);
    for(const y of [-2.15,0,2.15]){
      const ph=1.75;
      box(2.55,ph,.13,shadow,cx,y,.27,group);
      box(2.36,ph-.18,.09,pale,cx,y,.36,group);
      box(2.5,.055,.06,gold,cx,y+ph/2,.43,group);
      box(2.5,.055,.06,gold,cx,y-ph/2,.43,group);
      box(.055,ph,.06,gold,cx-1.25,y,.43,group);
      box(.055,ph,.06,gold,cx+1.25,y,.43,group);
    }
    // central crest and ring detail
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.48,.065,12,40),gold);
    ring.position.set(cx,0,.53);group.add(ring);
    const center=new THREE.Mesh(new THREE.SphereGeometry(.19,20,16),gold);
    center.position.set(cx,0,.55);group.add(center);
    const handle=new THREE.Mesh(new THREE.SphereGeometry(.10,18,14),dark);
    handle.position.set(-side*.32,-.08,.56);group.add(handle);
    box(.08,6.2,.07,gold,side*3.05,0,.45,group);
  }
  leftDoor=new THREE.Group();leftDoor.position.set(-3.0,4.0,-2.8);makeDoor(leftDoor,1);scene.add(leftDoor);
  rightDoor=new THREE.Group();rightDoor.position.set(3.0,4.0,-2.8);makeDoor(rightDoor,-1);scene.add(rightDoor);

  // Soft floating light particles, kept subtle
  const count=90,positions=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    positions[i*3]=(Math.random()-.5)*13;
    positions[i*3+1]=Math.random()*9;
    positions[i*3+2]=(Math.random()-.5)*13-2;
  }
  const particleGeometry=new THREE.BufferGeometry();
  particleGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const particles=new THREE.Points(particleGeometry,new THREE.PointsMaterial({color:0xffdf9e,size:.035,transparent:true,opacity:.55}));
  scene.add(particles);

  function render(){
    requestAnimationFrame(render);
    const dt=Math.min(clock.getDelta(),.05);
    const elapsed=clock.elapsedTime;
    if(opening){
      doorProgress=Math.min(1,doorProgress+dt/2.1);
    }
    const eased=doorProgress*doorProgress*(3-2*doorProgress);
    leftDoor.rotation.y=-1.22*eased;
    rightDoor.rotation.y=1.22*eased;
    const targetZ=opening?23-3.2*eased:23;
    camera.position.z=THREE.MathUtils.damp(camera.position.z,targetZ,2.2,dt);
    camera.position.y=THREE.MathUtils.damp(camera.position.y,5.2+.12*Math.sin(elapsed*.35),1.8,dt);
    camera.lookAt(0,4.1,-1.2*eased);
    particles.rotation.y=elapsed*.012;
    renderer.render(scene,camera);
    if(opening&&doorProgress>=1&&!openStarted){
      openStarted=true;
      window.setTimeout(()=>{
        cover.style.transition='opacity .7s ease';
        cover.style.opacity='0';
        window.setTimeout(()=>{
          cover.style.display='none';
          invitation.classList.remove('hidden');
          window.scrollTo(0,0);
        },720);
      },250);
    }
  }
  render();

  function resize(){
    const w=cover.clientWidth,h=cover.clientHeight;
    camera.aspect=w/h;camera.updateProjectionMatrix();
    renderer.setSize(w,h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
  }
  window.addEventListener('resize',resize);
  if(window.ResizeObserver)new ResizeObserver(resize).observe(cover);
}catch(error){
  console.error('3D palace initialization failed:',error);
  canvas.style.background='linear-gradient(180deg,#d9cdb7,#f4eee2 48%,#74614a)';
}

const params=new URLSearchParams(location.search);
const guest=params.get('to');
if(guest)document.querySelector('#guestName').textContent=guest;

openButton.addEventListener('click',()=>{
  if(opening)return;
  opening=true;
  openButton.disabled=true;
  openButton.textContent='PINTU ISTANA TERBUKA...';
  cover.classList.add('opening');
});

const weddingDate=new Date('2027-01-07T08:00:00+08:00');
function tick(){
  const d=Math.max(0,weddingDate-new Date());
  const v=[Math.floor(d/86400000),Math.floor(d/3600000)%24,Math.floor(d/60000)%60,Math.floor(d/1000)%60];
  ['days','hours','minutes','seconds'].forEach((id,i)=>{
    const el=document.getElementById(id);
    if(el)el.textContent=String(v[i]).padStart(2,'0');
  });
}
tick();setInterval(tick,1000);

document.querySelector('#rsvpForm').addEventListener('submit',e=>{
  e.preventDefault();
  alert('Terima kasih. Sistem pengiriman RSVP akan diaktifkan setelah koneksi database disiapkan.');
});

// Scroll reveal
document.querySelectorAll('#invitation .section-pad, #invitation .event-card, #invitation .couple-frame, #invitation .names-block').forEach(el=>el.classList.add('reveal'));
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
  }),{threshold:.12,rootMargin:'0px 0px -35px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}else{
  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
}
