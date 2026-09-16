const A={
 state:{screen:"menu",volume:+localStorage.getItem("avol")||.72,sfx:localStorage.getItem("asfx")!=="false",shadows:localStorage.getItem("ashadow")!=="false",sensitivity:+localStorage.getItem("asen")||1,name:localStorage.getItem("aname")||"ANONYMOUS",body:+localStorage.getItem("abody")||1,head:+localStorage.getItem("ahead")||1,paused:false},
 audio:null,gain:null,drone:null,droneGain:null,
 $:id=>document.getElementById(id),
 save(){const s=this.state;localStorage.setItem("avol",s.volume);localStorage.setItem("asfx",s.sfx);localStorage.setItem("ashadow",s.shadows);localStorage.setItem("asen",s.sensitivity);localStorage.setItem("aname",s.name);localStorage.setItem("abody",s.body);localStorage.setItem("ahead",s.head)},
 show(name){["menu","settings","player","game","lobby"].forEach(x=>this.$(x).classList.toggle("active",x===name));this.state.screen=name},
 audioStart(){
   if(!this.audio){this.audio=new (window.AudioContext||window.webkitAudioContext)();this.gain=this.audio.createGain();this.gain.connect(this.audio.destination);this.drone=this.audio.createOscillator();this.droneGain=this.audio.createGain();this.drone.type="sine";this.drone.frequency.value=34;this.droneGain.gain.value=.025;this.drone.connect(this.droneGain).connect(this.gain);this.drone.start()}
   if(this.audio.state==="suspended")this.audio.resume();this.gain.gain.value=this.state.volume*.45
 },
 tone(kind){
   if(!this.state.sfx)return;this.audioStart();const t=this.audio.currentTime,o=this.audio.createOscillator(),g=this.audio.createGain();
   if(kind==="click"){o.type="square";o.frequency.setValueAtTime(420,t);o.frequency.exponentialRampToValueAtTime(180,t+.07);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.07,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+.09)}
   if(kind==="jump"){o.type="triangle";o.frequency.setValueAtTime(100,t);o.frequency.exponentialRampToValueAtTime(280,t+.15);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.09,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+.22)}
   if(kind==="foot"){o.type="sine";o.frequency.value=55;g.gain.setValueAtTime(.045,t);g.gain.exponentialRampToValueAtTime(.0001,t+.09)}
   if(kind==="danger"){o.type="sawtooth";o.frequency.setValueAtTime(90,t);o.frequency.exponentialRampToValueAtTime(40,t+.5);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.11,t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+.55)}
   o.connect(g).connect(this.gain);o.start(t);o.stop(t+.6)
 },
 sync(){
   const s=this.state;$("volume").value=s.volume;$("sfx").checked=s.sfx;$("shadows").checked=s.shadows;$("sensitivity").value=s.sensitivity;$("playerName").value=s.name;$("bodyScale").value=s.body;$("headScale").value=s.head;$("nameHud").textContent=s.name
 }
};
document.querySelectorAll("button[data-sound]").forEach(b=>b.addEventListener("pointerdown",()=>A.tone(b.dataset.sound)));
$("play").onclick=()=>{A.audioStart();A.show("game");Game.start()};
$("settingsBtn").onclick=()=>{A.show("settings");A.sync()};
$("playerBtn").onclick=()=>{A.show("player");A.sync()};
$("settingsBack").onclick=()=>A.show("menu");
$("playerBack").onclick=()=>A.show("menu");
$("playerSave").onclick=()=>{A.state.name=$("playerName").value.trim()||"ANONYMOUS";A.state.body=+$("bodyScale").value;A.state.head=+$("headScale").value;A.save();A.sync();A.show("menu")};
$("volume").oninput=e=>{A.state.volume=+e.target.value;A.save();if(A.gain)A.gain.gain.value=A.state.volume*.45};
$("sfx").onchange=e=>{A.state.sfx=e.target.checked;A.save()};
$("shadows").onchange=e=>{A.state.shadows=e.target.checked;A.save();Game.setShadows()};
$("sensitivity").oninput=e=>{A.state.sensitivity=+e.target.value;A.save()};
$("pause").onclick=()=>{A.state.paused=!A.state.paused;$("pause").textContent=A.state.paused?"▶":"II"};
$("jump").onclick=()=>Game.jump();
$("menuBack").onclick=()=>{Game.stop();A.show("menu")};
A.sync();
