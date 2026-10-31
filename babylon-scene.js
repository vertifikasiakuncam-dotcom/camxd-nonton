(() => {
  const canvas=document.getElementById("wedding3d");
  if(!canvas || !window.BABYLON) return;
  const engine=new BABYLON.Engine(canvas,true,{preserveDrawingBuffer:false,stencil:true,antialias:true,powerPreference:"high-performance"});
  engine.setHardwareScalingLevel(Math.max(1,window.devicePixelRatio>1.5?1.35:1));
  const scene=new BABYLON.Scene(engine);
  scene.clearColor=new BABYLON.Color4(.035,.025,.065,1);
  scene.fogMode=BABYLON.Scene.FOGMODE_EXP2;scene.fogDensity=.008;scene.fogColor=new BABYLON.Color3(.20,.15,.29);
  const camera=new BABYLON.ArcRotateCamera("guestCamera",-Math.PI/2,1.18,24,new BABYLON.Vector3(0,5,-5),scene);
  camera.lowerRadiusLimit=10;camera.upperRadiusLimit=32;camera.lowerBetaLimit=.72;camera.upperBetaLimit=1.48;
  camera.wheelPrecision=55;camera.panningSensibility=0;camera.inertia=.82;camera.angularSensibilityX=850;camera.angularSensibilityY=850;
  camera.attachControl(canvas,true);camera.inputs.attached.pointers.buttons=[0];
  const hemi=new BABYLON.HemisphericLight("moonFill",new BABYLON.Vector3(0,1,0),scene);hemi.intensity=.78;hemi.diffuse=new BABYLON.Color3(.72,.69,1);
  const warm=new BABYLON.PointLight("goldenGlow",new BABYLON.Vector3(0,10,-12),scene);warm.intensity=110;warm.diffuse=new BABYLON.Color3(1,.72,.39);warm.range=42;
  const key=new BABYLON.DirectionalLight("celestial",new BABYLON.Vector3(-.4,-1,.25),scene);key.position=new BABYLON.Vector3(8,18,12);key.intensity=1.45;
  const mat=(name,color,metal=0,rough=.42)=>{const m=new BABYLON.PBRMaterial(name,scene);m.albedoColor=BABYLON.Color3.FromHexString(color);m.metallic=metal;m.roughness=rough;return m};
  const ivory=mat("Pearl marble","#eee6df",.18,.25),gold=mat("Royal gold","#c69b56",.78,.22),plum=mat("Midnight velvet","#332443",.12,.72),floorMat=mat("Polished amethyst marble","#6b5878",.25,.2),white=mat("Ivory silk","#fff8ed",.05,.34),leaf=mat("Sage leaves","#536b57",0,.8),crystal=mat("Crystal glass","#d9eaff",.3,.08);
  crystal.alpha=.62;
  const box=(name,w,h,d,x,y,z,m)=>{const o=BABYLON.MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene);o.position.set(x,y,z);o.material=m;return o};
  const cyl=(name,top,bottom,h,x,y,z,m,tess=32)=>{const o=BABYLON.MeshBuilder.CreateCylinder(name,{diameterTop:top,diameterBottom:bottom,height:h,tessellation:tess},scene);o.position.set(x,y,z);o.material=m;return o};
  const sphere=(name,diam,x,y,z,m)=>{const o=BABYLON.MeshBuilder.CreateSphere(name,{diameter:diam,segments:16},scene);o.position.set(x,y,z);o.material=m;return o};
  const floor=BABYLON.MeshBuilder.CreateGround("marble ballroom",{width:34,height:54,subdivisions:2},scene);floor.position.z=-8;floor.material=floorMat;
  const aisle=BABYLON.MeshBuilder.CreateGround("ivory aisle",{width:5.6,height:39,subdivisions:1},scene);aisle.position.set(0,.025,-9);aisle.material=white;
  // Inlaid gold borders and floor medallions
  for(const x of [-2.88,2.88])box("gold floor inlay",.045,.025,39,x,.04,-9,gold);
  for(let z=8;z>-28;z-=5){const med=BABYLON.MeshBuilder.CreateTorus("floor ornament",{diameter:1.35,thickness:.018,tessellation:48},scene);med.rotation.x=Math.PI/2;med.position.set(0,.055,z);med.material=gold;}
  // Tall walls, cornices and fantasy chapel ribs
  box("left ballroom wall",.55,13,48,-11,6,-8,plum);box("right ballroom wall",.55,13,48,11,6,-8,plum);
  for(const side of [-1,1]){
    box("wall gold skirting",.09,.22,48,side*10.68,.55,-8,gold);
    for(let z=9;z>-29;z-=9){
      const col=cyl("fluted marble pillar",.82,.95,10,side*7.4,5,z,ivory,48);
      cyl("pillar base",1.5,1.5,.35,side*7.4,.35,z,gold);
      cyl("pillar capital",1.35,1.05,.42,side*7.4,10.05,z,gold);
      for(let a=0;a<8;a++){const ang=a*Math.PI/4;const rib=box("pillar flute",.045,8.7,.045,side*7.4+Math.cos(ang)*.405,5,z+Math.sin(ang)*.405,white);}
      box("wall pilaster panel",.12,4.8,.12,side*10.65,6,z, gold);
    }
  }
  // Pointed fantasy arches, double gold ribs
  for(let z=6;z>-30;z-=9){
    const pts=[new BABYLON.Vector3(-7.4,9.9,z),new BABYLON.Vector3(-6.6,12,z),new BABYLON.Vector3(-3.5,13.2,z),new BABYLON.Vector3(0,14.4,z),new BABYLON.Vector3(3.5,13.2,z),new BABYLON.Vector3(6.6,12,z),new BABYLON.Vector3(7.4,9.9,z)];
    const path=BABYLON.Curve3.CreateCatmullRomSpline(pts,28,false).getPoints();
    const arch=BABYLON.MeshBuilder.CreateTube("gothic gold arch",{path,radius:.095,tessellation:12},scene);arch.material=gold;
    const arch2=BABYLON.MeshBuilder.CreateTube("inner pearl arch",{path,radius:.035,tessellation:8},scene);arch2.material=white;
  }
  // Elevated altar dais and floral backdrop
  const dais=box("ceremonial dais",12,.55,3,0,.3,-25,ivory);dais.material=ivory;
  for(let step=0;step<3;step++)box("dais gold step",10-step*1.1,.18,.65,0,.18+step*.18,-22.7-step*.38,gold);
  const halo=BABYLON.MeshBuilder.CreateTorus("royal halo",{diameter:7,thickness:.12,tessellation:96},scene);halo.position.set(0,7.1,-27);halo.material=gold;
  const halo2=BABYLON.MeshBuilder.CreateTorus("inner halo",{diameter:5.7,thickness:.045,tessellation:96},scene);halo2.position.set(0,7.1,-27);halo2.material=white;
  // Flower stands with layered blossoms and foliage
  function bouquet(x,z){
    cyl("gold flower urn",.65,.9,1,x,.55,z,gold);
    sphere("green arrangement",1.45,x,1.5,z,leaf);
    for(let i=0;i<26;i++){
      const a=i*2.399,r=.25+(i%5)*.105,y=1.55+(i%4)*.12;
      const px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;
      for(let p=0;p<5;p++){const ang=p*Math.PI*2/5;const pet=sphere("rose petal",.26,px+Math.cos(ang)*.12,y+Math.sin(ang)*.09,pz,white);pet.scaling.set(.75,1.15,.65);}
      sphere("rose heart",.12,px,y,pz,gold);
    }
  }
  for(const side of [-1,1])for(let z=7;z>-26;z-=6.5)bouquet(side*4.4,z);
  // Crystal chandeliers, golden branches and animated glints
  const glints=[];
  function chandelier(z,scale){
    const root=new BABYLON.TransformNode("crystal chandelier",scene);root.position.set(0,11,z);root.scaling.setAll(scale);
    const stem=cyl("chandelier stem",.08,.08,1.4,0,.8,0,gold);stem.parent=root;
    const ring=BABYLON.MeshBuilder.CreateTorus("gold chandelier ring",{diameter:2.5,thickness:.085,tessellation:64},scene);ring.parent=root;ring.position.y=.05;ring.material=gold;
    sphere("chandelier crown",.58,0,.05,0,gold).parent=root;
    for(let i=0;i<12;i++){const a=i*Math.PI/6,x=Math.cos(a),zv=Math.sin(a);
      const arm=cyl("branch",.06,.09,.9,x*.75,.15,zv*.75,gold,12);arm.parent=root;arm.rotation.z=-x*.5;arm.rotation.x=zv*.5;
      const drop=sphere("crystal drop",.24,x*1.25,-.48,zv*1.25,crystal);drop.parent=root;drop.scaling.set(.55,1.8,.55);glints.push(drop);
      const lamp=new BABYLON.PointLight("chandelier light",new BABYLON.Vector3(x*1.05,0,zv*1.05),scene);lamp.parent=root;lamp.intensity=3.4*scale;lamp.range=7;lamp.diffuse=new BABYLON.Color3(1,.78,.5);
    }
  }
  chandelier(2,1);chandelier(-12,.78);chandelier(-25,.6);
  // Velvet entrance curtains: pleated panels on tracks
  const curtainPanels=[];
  for(const side of [-1,1]){
    const panel=new BABYLON.TransformNode("velvet curtain panel",scene);panel.position.set(side*-0.1,0,10);
    const mesh=BABYLON.MeshBuilder.CreateGround("pleated velvet", {width:5.2,height:12,subdivisions:48},scene);mesh.parent=panel;mesh.position.set(side*-2.65,6,0);mesh.rotation.x=0;
    const positions=mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    for(let i=0;i<positions.length;i+=3){const x=positions[i],y=positions[i+1];positions[i+2]=Math.cos(x*9)*.11;}
    mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind,positions);mesh.material=plum;mesh.convertToFlatShadedMesh();
    curtainPanels.push({node:panel,side});
  }
  // Floating magical dust
  const dust=[];
  for(let i=0;i<95;i++){const p=sphere("starlight",.035+Math.random()*.035,(Math.random()-.5)*17,Math.random()*12,Math.random()*-38+5,gold);dust.push({mesh:p,phase:Math.random()*6});}
  // Small crystal pillars along aisle
  for(const side of [-1,1])for(let z=5;z>-27;z-=6){
    const stand=cyl("crystal pedestal",.42,.62,1.15,side*3.45,.58,z,gold);
    const orb=sphere("enchanted crystal",.42,side*3.45,1.35,z,crystal);orb.material=crystal;
    const light=new BABYLON.PointLight("crystal aura",new BABYLON.Vector3(side*3.45,1.5,z),scene);light.intensity=4;light.range=5;light.diffuse=new BABYLON.Color3(.62,.72,1);
  }
  let entering=false,entryStart=0;
  window.enterFantasyScene=()=>{entering=true;entryStart=performance.now();};
  let t=0;
  scene.onBeforeRenderObservable.add(()=>{
    t+=engine.getDeltaTime()*.001;
    dust.forEach((d,i)=>{d.mesh.position.y+=Math.sin(t*1.1+d.phase)*.0018;d.mesh.position.x+=Math.cos(t*.7+d.phase)*.0012;});
    glints.forEach((g,i)=>g.rotation.y+=.006);
    if(entering){const k=Math.min(1,(performance.now()-entryStart)/3600),ease=1-Math.pow(1-k,3);camera.radius=24-7*ease;camera.target.set(0,5,-5-9*ease);camera.alpha=-Math.PI/2+Math.sin(ease*Math.PI)*.12;camera.beta=1.18-.12*ease;}
  });
  engine.runRenderLoop(()=>scene.render());
  window.addEventListener("resize",()=>engine.resize());
  document.addEventListener("visibilitychange",()=>{if(document.hidden)engine.stopRenderLoop();else engine.runRenderLoop(()=>scene.render());});
})();