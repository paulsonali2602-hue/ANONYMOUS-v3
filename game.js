const Game={
 running:false,scene:null,camera:null,renderer:null,clock:null,player:null,watcher:null,limbs:[],velY:0,onGround:true,
 input:{x:0,y:0},look:{x:0,y:0},keys:{},yaw:0,pitch:.34,camDist:8,camHeight:4.6,timer:120,lastStep:0,warning:0,
 start(){if(this.running)return;this.running=true;this.timer=120;A.state.paused=false;$("pause").textContent="II";this.build();this.timerLoop();this.animate()},
 stop(){this.running=false;if(this.timerInt)clearInterval(this.timerInt);if(this.raf)cancelAnimationFrame(this.raf);if(this.renderer){this.renderer.dispose();this.renderer.domElement.remove();this.renderer=null}window.onresize=null},
 build(){
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x111111);this.scene.fog=new THREE.FogExp2(0x111111,.012);
  this.camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,350);
  this.renderer=new THREE.WebGLRenderer({antialias:true});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));this.renderer.setSize(innerWidth,innerHeight);this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.shadowMap.enabled=A.state.shadows;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.domElement.className="game-canvas";$("game").prepend(this.renderer.domElement);
  this.clock=new THREE.Clock();
  this.scene.add(new THREE.HemisphereLight(0xffffff,0x303030,.72));
  const moon=new THREE.DirectionalLight(0xffffff,1.7);moon.position.set(-40,65,25);moon.castShadow=true;moon.shadow.mapSize.set(1536,1536);moon.shadow.camera.left=-80;moon.shadow.camera.right=80;moon.shadow.camera.top=80;moon.shadow.camera.bottom=-80;this.scene.add(moon);
  const moonDisc=new THREE.Mesh(new THREE.SphereGeometry(3.2,24,16),new THREE.MeshBasicMaterial({color:0xffffff}));moonDisc.position.set(-55,52,-95);this.scene.add(moonDisc);
  this.stars();this.ground();this.cabin();this.forest();this.makePlayer();this.makeWatcher();this.controls();window.onresize=()=>this.resize()
 },
 material(c,rough=1){return new THREE.MeshStandardMaterial({color:c,roughness:rough})},
 stars(){for(let i=0;i<280;i++){const p=new THREE.Mesh(new THREE.SphereGeometry(.025+Math.random()*.035,5,5),new THREE.MeshBasicMaterial({color:0xffffff}));const a=Math.random()*Math.PI*2,r=90+Math.random()*110;p.position.set(Math.cos(a)*r,35+Math.random()*90,Math.sin(a)*r-20);this.scene.add(p)}},
 ground(){
  const g=new THREE.PlaneGeometry(180,180,70,70);g.rotateX(-Math.PI/2);const p=g.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,Math.sin(x*.06)*.45+Math.cos(z*.075)*.35+Math.sin((x-z)*.025)*.4)}
  g.computeVertexNormals();const m=this.material(0x454545);const mesh=new THREE.Mesh(g,m);mesh.receiveShadow=true;this.scene.add(mesh);
  for(let i=0;i<750;i++){const x=(Math.random()-.5)*170,z=(Math.random()-.5)*170,h=.08+Math.random()*.22;const b=new THREE.Mesh(new THREE.BoxGeometry(.025,h,.025),this.material(0x858585));b.position.set(x,h/2,z);b.rotation.y=Math.random()*6.28;this.scene.add(b)}
 },
 cabin(){
  const q=new THREE.Group();q.position.set(0,0,-23);this.scene.add(q);const wall=this.material(0x686868),dark=this.material(0x202020),trim=this.material(0xbdbdbd);
  const base=new THREE.Mesh(new THREE.BoxGeometry(14,7,10),wall);base.position.y=3.5;base.castShadow=base.receiveShadow=true;q.add(base);
  const roof=new THREE.Mesh(new THREE.ConeGeometry(9.4,4,4),dark);roof.rotation.y=Math.PI/4;roof.position.y=9.2;roof.scale.z=.72;roof.castShadow=true;q.add(roof);
  const door=new THREE.Mesh(new THREE.BoxGeometry(2.2,4.8,.18),dark);door.position.set(0,2.4,5.1);q.add(door);
  const porch=new THREE.Mesh(new THREE.BoxGeometry(5,.25,2.5),dark);porch.position.set(0,.15,6);porch.receiveShadow=true;q.add(porch);
  [-4.2,4.2].forEach(x=>{const w=new THREE.Mesh(new THREE.BoxGeometry(2.5,2,.15),trim);w.position.set(x,4.1,5.08);q.add(w);const bar=new THREE.Mesh(new THREE.BoxGeometry(.12,1.9,.2),dark);bar.position.set(x,4.1,5.2);q.add(bar)});
  for(let x=-6;x<=6;x+=2){const seam=new THREE.Mesh(new THREE.BoxGeometry(.06,6.7,10.05),dark);seam.position.set(x,3.5,0);q.add(seam)}
  const lamp=new THREE.PointLight(0xffffff,10,16);lamp.position.set(0,4.5,5.8);q.add(lamp);
  const chimney=new THREE.Mesh(new THREE.BoxGeometry(1.2,3.2,1.2),dark);chimney.position.set(3,9.8,-1);q.add(chimney)
 },
 forest(){
  for(let i=0;i<32;i++){const a=Math.random()*6.28,r=18+Math.random()*60,x=Math.cos(a)*r,z=Math.sin(a)*r-15;if(Math.abs(x)<11&&z>-31&&z<-10){i--;continue}this.tree(x,z)}
  for(let i=0;i<12;i++){const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.5+Math.random()*1.2,0),this.material(0x353535));rock.position.set((Math.random()-.5)*75,.45,(Math.random()-.5)*75);rock.scale.y=.55;rock.castShadow=true;this.scene.add(rock)}
 },
 tree(x,z){const g=new THREE.Group();const t=new THREE.Mesh(new THREE.CylinderGeometry(.28,.42,4.8,7),this.material(0x252525));t.position.y=2.4;t.castShadow=true;g.add(t);for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(3-i*.5,3.8,7),this.material(0x333333));c.position.y=4.7+i*1.9;c.castShadow=true;g.add(c)}g.position.set(x,0,z);this.scene.add(g)},
 makePlayer(){
  const s=A.state,scale=s.body;this.player=new THREE.Group();const light=this.material(0xd8d8d8),black=this.material(0x070707),skin=this.material(0xffffff);
  const torso=new THREE.Mesh(new THREE.BoxGeometry(1.15*scale,1.5*scale,.72*scale),light);torso.position.y=2.35;torso.castShadow=true;this.player.add(torso);
  const head=new THREE.Mesh(new THREE.BoxGeometry(.9*s.head,.9*s.head,.9*s.head),skin);head.position.y=3.55*scale;head.castShadow=true;this.player.add(head);
  [-.19,.19].forEach(x=>{const e=new THREE.Mesh(new THREE.BoxGeometry(.12,.14,.04),black);e.position.set(x,.06+3.55*scale,.46);this.player.add(e)});
  const mouth=new THREE.Mesh(new THREE.BoxGeometry(.38,.055,.035),black);mouth.position.set(0,3.36*scale,.46);this.player.add(mouth);
  this.limbs=[];
  [-.76,.76].forEach(x=>{const a=new THREE.Mesh(new THREE.BoxGeometry(.3*scale,1.38*scale,.34*scale),light);a.position.set(x,2.3*scale,0);a.castShadow=true;this.player.add(a);this.limbs.push(a)});
  [-.32,.32].forEach(x=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.34*scale,1.5*scale,.38*scale),black);l.position.set(x,.75*scale,0);l.castShadow=true;this.player.add(l);const shoe=new THREE.Mesh(new THREE.BoxGeometry(.43*scale,.3*scale,.6*scale),black);shoe.position.set(x,.18*scale,.11);shoe.castShadow=true;this.player.add(shoe);this.limbs.push(l)});
  this.player.position.set(0,0,4);this.scene.add(this.player)
 },
 makeWatcher(){const g=new THREE.Group(),m=this.material(0x050505);const body=new THREE.Mesh(new THREE.BoxGeometry(1.2,2.5,.8),m);body.position.y=1.8;body.castShadow=true;g.add(body);const head=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),m);head.position.y=3.55;g.add(head);[-.2,.2].forEach(x=>{const e=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,.04),this.material(0xffffff));e.position.set(x,3.6,.52);g.add(e)});g.position.set(28,0,-34);this.watcher=g;this.scene.add(g)},
 controls(){
  addEventListener("keydown",e=>this.keys[e.code]=true);addEventListener("keyup",e=>this.keys[e.code]=false);
  const j=$("joystick"),st=$("stick");let active=false;
  const move=e=>{const r=j.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),max=r.width*.34,len=Math.hypot(dx,dy),k=len>max?max/len:1;const x=dx*k,y=dy*k;st.style.transform=`translate(${x}px,${y}px)`;this.input.x=x/max;this.input.y=y/max};
  j.onpointerdown=e=>{active=true;j.setPointerCapture(e.pointerId);move(e)};j.onpointermove=e=>active&&move(e);j.onpointerup=()=>{active=false;this.input.x=this.input.y=0;st.style.transform=""};
  let lx=0,ly=0,look=false;const z=$("lookZone");z.onpointerdown=e=>{look=true;lx=e.clientX;ly=e.clientY;z.setPointerCapture(e.pointerId)};z.onpointermove=e=>{if(!look)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;this.yaw-=dx*.006*A.state.sensitivity;this.pitch=Math.max(.05,Math.min(.85,this.pitch-dy*.004*A.state.sensitivity))};z.onpointerup=()=>look=false
 },
 jump(){if(!this.running||!this.onGround)return;this.velY=7.5;this.onGround=false;A.tone("jump")},
 timerLoop(){this.timerInt=setInterval(()=>{if(!this.running||A.state.paused)return;this.timer--;const m=Math.floor(this.timer/60).toString().padStart(2,"0"),s=(this.timer%60).toString().padStart(2,"0");$("timer").textContent=m+":"+s;if(this.timer<=0){clearInterval(this.timerInt);this.stop();A.show("lobby")}},1000)},
 update(dt){
  if(A.state.paused)return;let f=(this.keys.KeyW||this.keys.ArrowUp?-1:0)+(this.keys.KeyS||this.keys.ArrowDown?1:0)+this.input.y;let str=(this.keys.KeyA||this.keys.ArrowLeft?-1:0)+(this.keys.KeyD||this.keys.ArrowRight?1:0)+this.input.x;
  const len=Math.hypot(f,str);if(len>1){f/=len;str/=len}const speed=5.7;const ang=this.yaw;const dx=(str*Math.cos(ang)-f*Math.sin(ang))*speed*dt,dz=(str*Math.sin(ang)+f*Math.cos(ang))*speed*dt;this.player.position.x+=dx;this.player.position.z+=dz;
  if(len>.12){this.player.rotation.y=Math.atan2(dx,dz);const t=performance.now()*.014;this.limbs[0].rotation.x=Math.sin(t)*.62;this.limbs[1].rotation.x=-Math.sin(t)*.62;this.limbs[2].rotation.x=-Math.sin(t)*.62;this.limbs[3].rotation.x=Math.sin(t)*.62;if(performance.now()-this.lastStep>430){A.tone("foot");this.lastStep=performance.now()}}
  else this.limbs.forEach(x=>x.rotation.x*=.8);
  this.velY-=18*dt;this.player.position.y+=this.velY*dt;if(this.player.position.y<=0){this.player.position.y=0;this.velY=0;this.onGround=true}
  const toP=new THREE.Vector3().subVectors(this.player.position,this.watcher.position);const d=toP.length();const chase=d<24?1:.25;toP.y=0;if(d>2.5){toP.normalize();this.watcher.position.addScaledVector(toP,(1.0+chase)*dt);this.watcher.rotation.y=Math.atan2(toP.x,toP.z)}
  const danger=Math.max(0,Math.min(1,(18-d)/15));$("threatFill").style.width=(danger*100)+"%";if(danger>.75&&this.warning<danger){A.tone("danger");this.flash();this.warning=danger}if(danger<.55)this.warning=danger;
  const target=new THREE.Vector3(this.player.position.x,this.player.position.y+2.0,this.player.position.z);const camTarget=new THREE.Vector3(this.player.position.x-Math.sin(this.yaw)*this.camDist,this.player.position.y+this.camHeight+Math.sin(this.pitch)*2,this.player.position.z-Math.cos(this.yaw)*this.camDist);this.camera.position.lerp(camTarget,.12);this.camera.lookAt(target)
 },
 flash(){$("damage").classList.add("hit");setTimeout(()=>$("damage").classList.remove("hit"),160)},
 animate(){if(!this.running)return;this.raf=requestAnimationFrame(()=>this.animate());const dt=Math.min(this.clock.getDelta(),.05);this.update(dt);this.renderer.render(this.scene,this.camera)},
 resize(){if(!this.renderer)return;this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight)},
 setShadows(){if(this.renderer)this.renderer.shadowMap.enabled=A.state.shadows}
};
