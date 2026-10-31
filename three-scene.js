import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('wedding3d');
if (canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x211a15);
  scene.fog = new THREE.FogExp2(0x8d7961, 0.012);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
  camera.position.set(0, 5.2, 18);
  camera.lookAt(0, 4.1, -8);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;

  scene.add(new THREE.HemisphereLight(0xfff4df, 0x51402d, 2.0));
  const key = new THREE.DirectionalLight(0xffedcf, 3.2);
  key.position.set(-5, 12, 8); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); scene.add(key);
  const fill = new THREE.PointLight(0xffdca0, 75, 42); fill.position.set(0, 9, -10); scene.add(fill);
  const backGlow = new THREE.PointLight(0xfff0d2, 55, 32); backGlow.position.set(0, 6, -27); scene.add(backGlow);

  const mat = (color, roughness=0.7, metalness=0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const ivory = mat(0xf2e8d7, .38);
  const marble = mat(0xe5d9c7, .24, .12);
  const gold = mat(0xb38a4b, .28, .72);
  const darkGold = mat(0x76562d, .32, .65);
  const white = mat(0xfffdf6, .32);
  const green = mat(0x53664a, .82);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(34, 72), mat(0x8d7962,.32,.18));
  floor.rotation.x = -Math.PI/2; floor.position.set(0,-.08,-12); floor.receiveShadow = true; scene.add(floor);

  // Center aisle runner with real perspective and subtle satin reflection
  const runner = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 48), new THREE.MeshStandardMaterial({color:0xf4ead9,roughness:.24,metalness:.08}));
  runner.rotation.x=-Math.PI/2; runner.position.set(0,.015,-13); runner.receiveShadow=true; scene.add(runner);
  for(let z=7;z>-34;z-=3){
    const seam = new THREE.Mesh(new THREE.BoxGeometry(5.15,.012,.018), mat(0xc7aa7b,.42,.25));
    seam.position.set(0,.03,z); scene.add(seam);
  }

  // Grand ballroom side walls, gold skirting and repeating marble pillars
  for (const side of [-1,1]) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(.45,11,48), ivory);
    wall.position.set(side*10,5.3,-12); wall.receiveShadow=true; scene.add(wall);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(.18,.22,48), gold);
    rail.position.set(side*9.72,.35,-12); scene.add(rail);
    for(let z=6;z>-34;z-=8){
      const pillar = new THREE.Group(); pillar.position.set(side*6.4,0,z);
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.43,.52,8.2,24), marble);
      shaft.position.y=4.1; shaft.castShadow=true; shaft.receiveShadow=true; pillar.add(shaft);
      for(const y of [.25,7.95,8.28]){
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(.72,.72,.22,24),gold);
        cap.position.y=y; pillar.add(cap);
      }
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.55,.28,1.55),marble); base.position.y=.15; pillar.add(base);
      scene.add(pillar);
    }
  }

  // Repeating gold-trimmed arches across the ballroom
  for(let z=-1;z>-34;z-=8){
    const points=[];
    for(let i=0;i<=40;i++){
      const a=Math.PI-(Math.PI*i/40);
      points.push(new THREE.Vector3(Math.cos(a)*6.3,5.2+Math.sin(a)*4.3,z));
    }
    const curve=new THREE.CatmullRomCurve3(points);
    const arch=new THREE.Mesh(new THREE.TubeGeometry(curve,64,.075,8,false),gold);
    arch.castShadow=true; scene.add(arch);
    const arch2=new THREE.Mesh(new THREE.TubeGeometry(curve,64,.025,6,false),white);
    arch2.position.z=.09; scene.add(arch2);
  }

  // White flower clusters on both sides: petals, centers, stems and leaves
  function makeFlower(parent,x,y,z,scale=1){
    const group=new THREE.Group(); group.position.set(x,y,z); group.scale.setScalar(scale); parent.add(group);
    const petalMat=white;
    for(let i=0;i<7;i++){
      const a=i*Math.PI*2/7;
      const petal=new THREE.Mesh(new THREE.SphereGeometry(.16,12,10),petalMat);
      petal.scale.set(.78,1.35,.48); petal.position.set(Math.cos(a)*.22,Math.sin(a)*.22,0); petal.rotation.z=a; group.add(petal);
    }
    const center=new THREE.Mesh(new THREE.SphereGeometry(.105,12,10),gold); group.add(center);
  }
  function flowerStand(x,z){
    const group=new THREE.Group(); group.position.set(x,0,z); scene.add(group);
    const urn=new THREE.Mesh(new THREE.CylinderGeometry(.35,.48,.9,20),gold); urn.position.y=.45; urn.castShadow=true; group.add(urn);
    const bowl=new THREE.Mesh(new THREE.SphereGeometry(.78,18,12),green); bowl.scale.y=.52; bowl.position.y=1.15; group.add(bowl);
    for(let i=0;i<18;i++){
      const a=i*2.399; const r=.25+(i%4)*.13;
      makeFlower(group,Math.cos(a)*r,1.35+(i%3)*.12,Math.sin(a)*r,.72+(i%3)*.12);
      const leaf=new THREE.Mesh(new THREE.SphereGeometry(.18,10,8),green);
      leaf.scale.set(1.8,.45,.65); leaf.position.set(Math.cos(a)*r*.9,1.12,Math.sin(a)*r*.9); leaf.rotation.y=a; group.add(leaf);
    }
  }
  for(const side of [-1,1]) for(let z=4;z>-31;z-=7) flowerStand(side*(4.9+(Math.abs(z)%2)*.25),z);

  // Crystal chandeliers suspended along the central axis
  function chandelier(z,scale=1){
    const g=new THREE.Group(); g.position.set(0,8.9,z); g.scale.setScalar(scale); scene.add(g);
    const stem=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,1.2,12),gold); stem.position.y=.7; g.add(stem);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1.05,.075,10,48),gold); ring.position.y=.05; ring.rotation.x=Math.PI/2; g.add(ring);
    const hub=new THREE.Mesh(new THREE.SphereGeometry(.38,20,16),gold); hub.position.y=.05; g.add(hub);
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6;
      const arm=new THREE.Mesh(new THREE.CylinderGeometry(.035,.055,.9,8),gold);
      arm.position.set(Math.cos(a)*.75,.18,Math.sin(a)*.75); arm.rotation.z=Math.cos(a)*-.5; arm.rotation.x=Math.sin(a)*.5; g.add(arm);
      const crystal=new THREE.Mesh(new THREE.OctahedronGeometry(.16,0),new THREE.MeshPhysicalMaterial({color:0xfff4d8,roughness:.08,metalness:.18,transmission:.25,transparent:true,opacity:.9}));
      crystal.position.set(Math.cos(a)*1.12,-.42,Math.sin(a)*1.12); crystal.scale.y=1.8; g.add(crystal);
      const bulb=new THREE.PointLight(0xffe7b5,7,8); bulb.position.set(Math.cos(a)*.8,.05,Math.sin(a)*.8); g.add(bulb);
    }
  }
  chandelier(1,1.0); chandelier(-13,.82); chandelier(-27,.68);

  // Tall, pleated velvet curtains built as actual 3D meshes
  function curtainMesh(){
    const w=5.5,h=12,cols=90,rows=16,verts=[],uv=[],idx=[];
    for(let y=0;y<=rows;y++) for(let x=0;x<=cols;x++){
      const u=x/cols, v=y/rows;
      const pleat=Math.cos(u*Math.PI*30)*.16;
      verts.push(u*w, v*h, pleat);
      uv.push(u,1-v);
    }
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
      const a=y*(cols+1)+x,b=a+1,c=a+cols+1,d=c+1;idx.push(a,c,b,b,c,d);
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();
    const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0xe8d9c4,roughness:.88,side:THREE.DoubleSide}));
    m.castShadow=true;return m;
  }
  const leftCurtain=new THREE.Group();leftCurtain.position.set(-5.5,0,8.5);leftCurtain.add(curtainMesh());scene.add(leftCurtain);
  const rightCurtain=new THREE.Group();rightCurtain.position.set(0,0,8.5);const rightMesh=curtainMesh();rightMesh.scale.x=-1;rightCurtain.add(rightMesh);scene.add(rightCurtain);
  // Curtain pelmets and gold tiebacks
  const pelmet=new THREE.Mesh(new THREE.BoxGeometry(11.3,.35,.55),gold);pelmet.position.set(0,11.8,8.4);scene.add(pelmet);
  for(const side of [-1,1]){
    const tie=new THREE.Mesh(new THREE.TorusGeometry(.22,.055,8,24),gold);tie.position.set(side*4.4,5.4,8.1);tie.rotation.y=Math.PI/2;scene.add(tie);
  }

  // A soft field of drifting petals in the foreground
  const petalGeo=new THREE.SphereGeometry(.075,8,6);
  const petalMat=new THREE.MeshStandardMaterial({color:0xfff1d8,roughness:.65});
  const petals=[];
  for(let i=0;i<26;i++){
    const p=new THREE.Mesh(petalGeo,petalMat);p.scale.set(1.5,.45,.25);
    p.position.set((Math.random()-.5)*11,Math.random()*8-1,Math.random()*-25+4);
    p.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);scene.add(p);petals.push(p);
  }

  let opened=false, start=0;
  window.openThreeScene=()=>{
    if(opened)return;opened=true;start=performance.now();
    leftCurtain.userData.from=-5.5;rightCurtain.userData.from=0;
  };
  const clock=new THREE.Clock();
  function resize(){
    const w=canvas.clientWidth||window.innerWidth,h=canvas.clientHeight||window.innerHeight;
    renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<600?48:42;camera.updateProjectionMatrix();
  }
  window.addEventListener('resize',resize,{passive:true});resize();
  function render(now){
    requestAnimationFrame(render);
    const t=clock.getElapsedTime();
    petals.forEach((p,i)=>{p.position.y+=Math.sin(t*.5+i)*.0009;p.position.x+=Math.sin(t*.25+i)*.0012;p.rotation.z+=.0015;});
    if(opened){
      const k=Math.min(1,(now-start)/3600),ease=1-Math.pow(1-k,3);
      leftCurtain.position.x=-5.5-5.9*ease;rightCurtain.position.x=5.9*ease;
      camera.position.z=18-10.5*ease;camera.position.y=5.2-1.15*ease;
      camera.lookAt(0,4.2-ease*.6,-8-ease*4);
      if(k===1){fill.intensity=95;backGlow.intensity=80;}
    }
    renderer.render(scene,camera);
  }
  requestAnimationFrame(render);
}
