/** AFTER HOURS — iamtaw. Browser-native UI + a procedural Three.js world. */
const $ = s => document.querySelector(s);
const chapters = [
  {hash:'desk', kicker:'A WINDOW INTO MY HEAD', title:['AFTER','HOURS'], description:'The world goes quiet.<br>My mind does the opposite.', action:'Step inside', note:'An interactive trip<br>through a restless mind.', tag:'THE DESK / A PLACE TO BEGIN', hint:'Move to look around · drag to orbit'},
  {hash:'architecture', kicker:'01 / THINK IN STRUCTURES', title:['CODE IS','A PLACE.'], description:'A thought becomes a line.<br>A line becomes somewhere you can go.', action:'Break the architecture', note:'Nothing here is<br>set in stone.', tag:'ARCHITECTURE / ORDER FROM CHAOS', hint:'Click a building to rearrange the architecture'},
  {hash:'language', kicker:'02 / SOME THOUGHTS HAVE WEIGHT', title:['WORDS','WANDER.'], description:'Sometimes you have to make a mess<br>to find what you mean.', action:'Scatter the sentence', note:'Go on.<br>Make a little mess.', tag:'LANGUAGE / BEAUTIFULLY UNFINISHED', hint:'Click a word to set the sentence in motion'},
  {hash:'machine', kicker:'03 / GIVE THE IDEA A PULSE', title:['MAKE IT','ALIVE.'], description:'An idea. A connection. A little intention.<br>Wake up the machine.', action:'Connect input · 1/3', note:'Three connections.<br>One living system.', tag:'AUTOMATION / WAITING FOR A SPARK', hint:'Tap the three floating nodes to connect the circuit'},
  {hash:'reveal', kicker:'04 / IT WAS ALWAYS IN THE DETAILS', title:['A SMALL','UNIVERSE.'], description:'All that, inside a single thought.<br>The diamond above the i.', action:'Explore my work', note:'Made of code.<br>Full of possibility.', tag:'IAMTAW / THE WORLD INSIDE THE DIAMOND', hint:'Drag to turn the diamond · stay a little longer'}
];
let current = 0, ready = false, fallback = false, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let engine = null, soundOn = false, audio = null, soundNodes = [], soundGain, transitionToken = 0, lastWheel = 0, statusTimer;
const motionInput = $('#motion'); motionInput.checked = reduced;
function status(message) { $('#scene-status').textContent=message; $('#scene-status').classList.add('show'); clearTimeout(statusTimer); statusTimer=setTimeout(()=>$('#scene-status').classList.remove('show'),3200); }
function setChapter(index, updateHash=true) {
  index = Math.max(0,Math.min(4,index));
  if(index===current && ready) return;
  const prev=current; current=index; const c=chapters[index];
  document.querySelectorAll('[data-scene]').forEach(b=>{const active=Number(b.dataset.scene)===index;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  $('#current-number').textContent=String(index+1).padStart(2,'0'); $('#progress').style.width=`${(index+1)*20}%`; $('#next-label').textContent=index===4?'BACK TO THE DESK':'KEEP EXPLORING';
  const token=++transitionToken; $('.story').classList.add('changing');
  setTimeout(()=>{if(token!==transitionToken)return;$('#chapter-kicker').textContent=c.kicker;$('#title').innerHTML=`<span>${c.title[0]}</span><span class="outline">${c.title[1]}${index===0?'<span class="title-star">✳</span>':''}</span>`;$('#description').innerHTML=c.description.replaceAll('<br>','<br> ');$('#action-label').textContent=c.action;$('#action-note').innerHTML=c.note;$('#scene-tag-text').textContent=c.tag;$('#hint-text').textContent=fallback?'3D unavailable here · all chapters remain accessible':c.hint;engine?.syncAction();$('.story').classList.remove('changing');},reduced?0:170);
  if(updateHash)history.replaceState(null,'',`#${c.hash}`);
  engine?.go(index,prev); if(soundOn)chime(130.81*Math.pow(2,index/5));
}
document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>setChapter(Number(b.dataset.scene))));
$('.brand').addEventListener('click',e=>{e.preventDefault();setChapter(0)});
$('#next').addEventListener('click',()=>setChapter(current===4?0:current+1));
$('#action').addEventListener('click',()=>{if(current===0)setChapter(1);else if(current===4)$('#work-dialog').showModal();else if(fallback)status('Open this experience in a browser with WebGL 2 to manipulate the scene.');else engine?.interact();});
$('#help').addEventListener('click',()=>$('#help-dialog').showModal());
$('#work-button').addEventListener('click',()=>$('#work-dialog').showModal());
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
window.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||['INPUT','BUTTON','A'].includes(document.activeElement.tagName))return;if(['ArrowRight','ArrowDown','PageDown'].includes(e.key)){e.preventDefault();setChapter(current+1)}if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();setChapter(current-1)}if(e.key==='Home'){e.preventDefault();setChapter(0)}if(e.key==='End'){e.preventDefault();setChapter(4)}});
window.addEventListener('wheel',e=>{if(document.querySelector('dialog[open]')||Math.abs(e.deltaY)<12)return;const now=performance.now();if(now-lastWheel<1100)return;lastWheel=now;setChapter(current+(e.deltaY>0?1:-1));},{passive:true});
motionInput.addEventListener('change',()=>{reduced=motionInput.checked;document.body.classList.toggle('reduced',reduced);engine?.setReduced();});
$('#performance').addEventListener('change',()=>engine?.resize());
window.addEventListener('hashchange',()=>{const i=chapters.findIndex(c=>`#${c.hash}`===location.hash);if(i>=0)setChapter(i,false)});
function chime(freq=261.63){if(!audio||!soundOn)return;const osc=audio.createOscillator(),g=audio.createGain();osc.type='sine';osc.frequency.value=freq;g.gain.setValueAtTime(0,audio.currentTime);g.gain.linearRampToValueAtTime(.055,audio.currentTime+.025);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+1.3);osc.connect(g);g.connect(soundGain);osc.start();osc.stop(audio.currentTime+1.4);}
$('#sound').addEventListener('click',async()=>{try{if(!audio){audio=new (window.AudioContext||window.webkitAudioContext)();soundGain=audio.createGain();soundGain.gain.value=0;soundGain.connect(audio.destination);[65.406,98,130.812].forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=f;o.detune.value=i*3;g.gain.value=.07;o.connect(g);g.connect(soundGain);o.start();soundNodes.push(o);});}await audio.resume();soundOn=!soundOn;soundGain.gain.cancelScheduledValues(audio.currentTime);soundGain.gain.setTargetAtTime(soundOn?.45:0,audio.currentTime,.4);$('#sound').setAttribute('aria-pressed',String(soundOn));$('#sound').setAttribute('aria-label',`Turn ambient sound ${soundOn?'off':'on'}`);$('.sound-label').textContent=`SOUND ${soundOn?'ON':'OFF'}`;if(soundOn)chime();}catch{status('Sound is unavailable in this browser.');}});
document.addEventListener('visibilitychange',()=>{if(audio){if(document.hidden)audio.suspend();else if(soundOn)audio.resume().catch(()=>{});}});
function startFallback(reason){fallback=true;ready=true;document.body.classList.add('fallback');$('#loading').remove();$('#action').disabled=false;$('#action-label').textContent=chapters[current].action;$('#hint-text').textContent='3D unavailable here · all chapters remain accessible';const art=document.createElement('div');art.className='fallback-art';art.setAttribute('aria-hidden','true');document.body.append(art);console.warn('AFTER HOURS: 3D fallback',reason);}
async function createWorld(){
const T=await import('./vendor/three.module.js');
const canvas=$('#world'), mobile=()=>innerWidth<=760;
let renderer,software=false;
// Probe on a separate canvas so a failed WebGL context cannot lock the real canvas.
const probe=document.createElement('canvas');const gl=probe.getContext('webgl2');
if(gl){gl.getExtension('WEBGL_lose_context')?.loseContext();renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});}
else{const {SoftwareRenderer}=await import('./software-renderer.js');renderer=new SoftwareRenderer({canvas});software=true;document.body.classList.add('software');$('.edition').textContent='EXPERIMENT 001 / COMPATIBILITY MODE';}
renderer.setClearColor(0x141019);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.45;
const scene=new T.Scene();scene.fog=new T.FogExp2(0x141019,.025);
const camera=new T.PerspectiveCamera(38,innerWidth/innerHeight,.1,230);
scene.add(new T.AmbientLight(0xe9c4db,1.3));const hemi=new T.HemisphereLight(0xc1b6ff,0x211b29,2.6);scene.add(hemi);
const key=new T.DirectionalLight(0xffe8d7,4.0);key.position.set(4,8,5);scene.add(key);
const fill=new T.DirectionalLight(0xff79ad,3);fill.position.set(-5,3,-3);scene.add(fill);
const rim=new T.DirectionalLight(0xd7f45b,2);rim.position.set(3,5,-5);scene.add(rim);
const COLORS={pink:0xff79ad,lime:0xd7f45b,paper:0xfff6e8,plum:0x211b29,mulberry:0x641c34};
const mat=(color,metalness=.25,roughness=.35)=>new T.MeshStandardMaterial({color,metalness,roughness});
const plum=mat(COLORS.plum,.5,.28), pink=mat(COLORS.pink,.4,.26), mulberry=mat(COLORS.mulberry,.5,.3), cream=mat(COLORS.paper,.2,.36), dark=mat(0x18141f,.45,.24);
const glowMat=(color,intensity=1)=>new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:intensity,metalness:.1,roughness:.35});
const limeGlow=glowMat(COLORS.lime,1.5),pinkGlow=glowMat(COLORS.pink,.8);
// Soft light sprites add halation without a heavy post-processing pipeline.
const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;const gc=glowCanvas.getContext('2d');const gradient=gc.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'rgba(255,255,255,.45)');gradient.addColorStop(.2,'rgba(255,255,255,.12)');gradient.addColorStop(1,'rgba(255,255,255,0)');gc.fillStyle=gradient;gc.fillRect(0,0,128,128);const glowTexture=new T.CanvasTexture(glowCanvas);
function halo(parent,x,y,z,color,size=4){const s=new T.Sprite(new T.SpriteMaterial({map:glowTexture,color,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.45}));s.position.set(x,y,z);s.scale.set(size,size,1);parent.add(s);return s;}
function box(parent,w,h,d,material,x=0,y=0,z=0,r=.05){const shape=new T.Shape();const a=-w/2,b=-h/2,rr=Math.min(r,w/3,h/3);shape.moveTo(a+rr,b);shape.lineTo(a+w-rr,b);shape.quadraticCurveTo(a+w,b,a+w,b+rr);shape.lineTo(a+w,b+h-rr);shape.quadraticCurveTo(a+w,b+h,a+w-rr,b+h);shape.lineTo(a+rr,b+h);shape.quadraticCurveTo(a,b+h,a,b+h-rr);shape.lineTo(a,b+rr);shape.quadraticCurveTo(a,b,a+rr,b);const geo=new T.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:rr*.3,bevelThickness:rr*.3,curveSegments:3});geo.translate(0,0,-d/2);const mesh=new T.Mesh(geo,material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
function tube(parent,points,color,r=.018){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const m=new T.Mesh(new T.TubeGeometry(curve,36,r,6,false),glowMat(color,.65));parent.add(m);return {mesh:m,curve};}
function ring(parent,radius,thickness,material,x,y,z){const m=new T.Mesh(new T.TorusGeometry(radius,thickness,10,72),material);m.position.set(x,y,z);parent.add(m);return m;}
function texturePanel(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');draw(ctx,w,h);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return tex;}
function plane(parent,w,h,texture,x,y,z){const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:texture,transparent:true,side:T.DoubleSide,depthWrite:false}));m.position.set(x,y,z);parent.add(m);return m;}
function labelTexture(text,color='#fff6e8',size=80){return texturePanel(1024,160,(c,w,h)=>{c.fillStyle=color;c.font=`800 ${size}px Manrope,Arial`;c.textAlign='center';c.textBaseline='middle';c.fillText(text,w/2,h/2)});}
const worlds=[],hitObjects=[],floaters=[],buildings=[],wordMeshes=[],machineNodes=[],pulses=[];let scatter=false,broken=false;const connected=new Set();
function world(index){const g=new T.Group();g.position.x=index*34;scene.add(g);worlds.push(g);const grid=new T.GridHelper(16,32,0x784358,0x342735);grid.position.y=-1.9;grid.material.transparent=true;grid.material.opacity=.10;g.add(grid);const base=new T.Mesh(new T.CylinderGeometry(4.5,4.65,.16,80),dark);base.position.y=-1.91;g.add(base);const r=ring(g,4.52,.012,pinkGlow,0,-1.81,0);r.rotation.x=-Math.PI/2;halo(g,0,-1.8,0,COLORS.mulberry,13);return g;}
function hit(mesh,kind,value){mesh.userData={...mesh.userData,kind,value};hitObjects.push(mesh);}
// 00 — A handmade nocturnal workstation, not an external model download.
const desk=world(0);desk.rotation.y=-.25;
const deskSurface=box(desk,7.1,.22,3.7,plum,0,-.87,0,.12);
box(desk,6.8,.035,.035,pinkGlow,0,-.72,1.8,.01);
for(const x of [-2.8,2.8])box(desk,.13,1.0,2.9,mulberry,x,-1.4,0);
box(desk,1.5,.09,.8,dark,0,-.69,-.65);box(desk,.18,.85,.2,mulberry,0,-.25,-.9);
const monitor=box(desk,4.3,2.65,.21,mulberry,0,1,-.8,.11);
box(desk,4.04,2.38,.03,dark,0,1,-.675,.03);
const screenTexture=texturePanel(1200,700,(c,w,h)=>{c.fillStyle='#211b29';c.fillRect(0,0,w,h);const g=c.createRadialGradient(650,330,0,650,330,530);g.addColorStop(0,'#641c34');g.addColorStop(1,'#211b29');c.fillStyle=g;c.fillRect(0,0,w,h);c.fillStyle='#ff79ad';c.font='16px monospace';c.fillText('IAMTAW://AFTER-HOURS',50,50);c.fillStyle='#fff6e8';c.font='800 155px Manrope,Arial';c.fillText('what if_',60,290);c.strokeStyle='#fff6e8';c.lineWidth=1;c.strokeText('we went in?',60,450);c.fillStyle='#d7f45b';c.fillRect(65,530,310,58);c.fillStyle='#211b29';c.font='bold 23px monospace';c.fillText('ENTER THE WORLD ↗',84,568);c.fillStyle='#aaa1ad';c.font='17px monospace';c.fillText('02:17 AM                       EVERYTHING IS POSSIBLE',60,650);});
const screen=plane(desk,3.98,2.32,screenTexture,0,1,-.65);hit(screen,'enter');
const screenLamp=new T.PointLight(COLORS.pink,8,7,2);screenLamp.position.set(0,1,1);desk.add(screenLamp);halo(desk,0,1,-.6,COLORS.pink,5);
const keyboard=box(desk,2.8,.12,.88,dark,-.35,-.65,.9,.08);keyboard.rotation.y=.04;
const keyGeo=new T.BoxGeometry(.16,.055,.13);for(let row=0;row<4;row++)for(let col=0;col<14;col++){const k=new T.Mesh(keyGeo,(row===3&&col>3&&col<9)?pink:plum);k.position.set(-1.55+col*.184,-.54,.58+row*.18);desk.add(k);}
const mouse=box(desk,.38,.16,.56,cream,1.7,-.59,1,.15);hit(mouse,'enter');
const mug=new T.Mesh(new T.CylinderGeometry(.27,.24,.52,32),mulberry);mug.position.set(-2.55,-.48,.8);desk.add(mug);const coffee=new T.Mesh(new T.CircleGeometry(.23,32),mat(0x160d15));coffee.rotation.x=-Math.PI/2;coffee.position.set(-2.55,-.21,.8);desk.add(coffee);ring(desk,.2,.065,pink,-2.25,-.45,.8).rotation.y=Math.PI/2;
for(let j=0;j<3;j++){const line=ring(desk,.1,.009,new T.MeshBasicMaterial({color:COLORS.paper,transparent:true,opacity:.1}),-2.55,.1+j*.2,.8);line.rotation.x=Math.PI/2;floaters.push({obj:line,y:line.position.y,phase:j,rate:.5,amp:.06});}
const deskOrb=new T.Mesh(new T.IcosahedronGeometry(.32,0),limeGlow);deskOrb.position.set(2.6,.15,-.5);desk.add(deskOrb);floaters.push({obj:deskOrb,y:.15,phase:0,rate:.7,amp:.2,spin:true});
function codeTexture(title){return texturePanel(700,430,(c,w,h)=>{c.fillStyle='#211b29';c.fillRect(0,0,w,h);c.strokeStyle='#ff79ad55';c.strokeRect(1,1,w-2,h-2);['#ff79ad','#d7f45b','#fff6e8'].forEach((v,i)=>{c.fillStyle=v;c.beginPath();c.arc(25+i*20,25,4,0,7);c.fill()});c.fillStyle='#aaa1ad';c.font='15px monospace';c.fillText(title,110,30);const lines=['const idea = await dream();','','function makeSomething() {','  const world = new Possibility();','  world.add(curiosity);','  world.connect(you);','','  return world.comeAlive();','}'];lines.forEach((s,i)=>{c.fillStyle=i%3===0?'#ff79ad':i%3===1?'#fff6e8':'#d7f45b';c.font='19px monospace';c.fillText(s,35,83+i*34)});});}
for(let j=0;j<2;j++){const panel=plane(desk,1.7,1.05,codeTexture(j?'curiosity.js':'one-more-idea.js'),j?2.9:-2.9,j?1.9:1.6,j?-.2:.1);panel.rotation.y=j?-.3:.3;floaters.push({obj:panel,y:panel.position.y,phase:j*3,rate:.45,amp:.13});}
// 01 — Architecture with reversible, target-based geometry changes.
const architecture=world(1);
for(let i=0;i<11;i++){const angle=i*2.399;const radius=i<3?1:2.0+(i%3)*.5;const h=1.1+((i*7)%8)*.38;const x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;const b=box(architecture,.65+(i%3)*.2,h,.7,i%3===0?mulberry:plum,x,-1.8+h/2,z,.05);const edges=new T.LineSegments(new T.EdgesGeometry(b.geometry,30),new T.LineBasicMaterial({color:i%2?COLORS.pink:COLORS.lime,transparent:true,opacity:.42}));b.add(edges);for(let y=.25;y<h-.1;y+=.33){const windowBar=box(b,.35,.025,.012,i%2?pinkGlow:limeGlow,0,y-h/2,.37,.005);}b.userData.home=b.position.clone();b.userData.away=new T.Vector3(x*1.5,-1.1+Math.sin(i)*1.5,z*1.5);buildings.push(b);hit(b,'architecture');}
const codePane=plane(architecture,3.3,2.0,codeTexture('a-place-for-an-idea.js'),0,1.3,1.4);codePane.rotation.y=-.12;floaters.push({obj:codePane,y:1.3,phase:2,rate:.4,amp:.1});
const archRing=ring(architecture,3.0,.025,pinkGlow,0,.2,0);archRing.rotation.x=Math.PI/2.8;archRing.rotation.y=.2;
// 02 — Canvas-generated typography becomes tactile, scatterable geometry.
const language=world(2);const sentence=[['MAKE',-1.5,1.55,1.8],['ROOM',1.5,1.55,1.8],['FOR',-1.9,.3,1.25],['THE',-.1,.3,1.25],['STRANGE.',.3,-.95,3.7]];
sentence.forEach(([text,x,y,w],i)=>{const tex=labelTexture(text,i===4?'#ff79ad':i===2?'#d7f45b':'#fff6e8',100);const p=plane(language,w,w*.15625,tex,x,y,.6+i*.05);p.userData.home=p.position.clone();p.userData.away=new T.Vector3((i-2)*1.1,Math.sin(i*2)*2,Math.cos(i)*2);wordMeshes.push(p);hit(p,'language');});
const punctuation=ring(language,1.45,.045,pink,0,.4,-.8);punctuation.rotation.set(.3,.8,.1);floaters.push({obj:punctuation,y:.4,phase:0,amp:.1,rate:.3,spin:true});
for(let i=0;i<12;i++){const g=new T.Mesh(i%2?new T.OctahedronGeometry(.06):new T.BoxGeometry(.07,.07,.07),i%2?pinkGlow:limeGlow);const a=i/12*Math.PI*2;g.position.set(Math.cos(a)*3.3,Math.sin(a)*2,.4);language.add(g);floaters.push({obj:g,y:g.position.y,phase:i,amp:.14,rate:.6});}
// 03 — Real state: independently connect all three nodes and power the machine.
const machine=world(3);const core=new T.Group();machine.add(core);core.position.y=.3;
const coreShape=new T.Mesh(new T.IcosahedronGeometry(.78,1),mulberry);core.add(coreShape);
const cage=new T.LineSegments(new T.EdgesGeometry(new T.IcosahedronGeometry(.82,1)),new T.LineBasicMaterial({color:COLORS.pink,transparent:true,opacity:.6}));core.add(cage);
const machineRings=[];for(let i=0;i<3;i++){const r=ring(machine,1.35+i*.32,.035,i===1?pink:cream,0,.3,0);r.rotation.set(.4+i*.8,.3+i*.6,.2);machineRings.push(r);}
const machineLight=new T.PointLight(COLORS.pink,3,10);machineLight.position.set(0,.3,0);machine.add(machineLight);const coreHalo=halo(machine,0,.3,0,COLORS.pink,6);
const nodePositions=[[-2.8,.5,.5],[.1,2.7,-.3],[2.75,-.2,.6]];
nodePositions.forEach((p,i)=>{const node=box(machine,.75,.75,.6,mulberry,...p,.1);node.rotation.z=Math.PI/4;hit(node,'node',i);machineNodes.push(node);const label=plane(machine,1.5,.23,labelTexture(['01 / INPUT','02 / THINK','03 / CREATE'][i],'#fff6e8',50),p[0],p[1]-.8,p[2]);const path=tube(machine,[p,[p[0]*.6,p[1]+.3,p[2]-.3],[p[0]*.3,.3,0],[0,.3,0]],COLORS.mulberry,.025);const pulse=new T.Mesh(new T.SphereGeometry(.065,12,8),limeGlow);pulse.visible=false;machine.add(pulse);pulses.push({path:path.curve,mesh:pulse,wire:path.mesh,index:i});});
// 04 — The signature reveal: a miniature of every room inside the diamond tittle.
const reveal=world(4);reveal.children.slice().forEach(c=>{if(c.isGridHelper)c.visible=false;});
const signature=new T.Group();reveal.add(signature);signature.position.y=-.4;
box(signature,.72,2.0,.7,cream,0,-.35,0,.18);box(signature,1.35,.25,.9,cream,.13,-1.38,0,.1);
const diamond=new T.Mesh(new T.OctahedronGeometry(1.6,0),new T.MeshPhysicalMaterial({color:COLORS.pink,metalness:.15,roughness:.1,transparent:true,opacity:.12,side:T.DoubleSide,depthWrite:false}));diamond.position.y=2.25;signature.add(diamond);
const diamondEdges=new T.LineSegments(new T.EdgesGeometry(diamond.geometry),new T.LineBasicMaterial({color:COLORS.pink,transparent:true,opacity:.9}));diamondEdges.position.copy(diamond.position);signature.add(diamondEdges);
const miniature=new T.Group();miniature.position.y=2.25;miniature.scale.setScalar(.16);signature.add(miniature);
const miniDesk=desk.clone(true);miniDesk.position.set(0,0,0);miniDesk.rotation.set(0,.2,0);miniature.add(miniDesk);miniDesk.traverse(o=>{if(o.isLight)o.visible=false;});
for(let i=0;i<4;i++){const b=box(miniature,.6,1.5+i*.5,.6,i%2?pink:plum,-2.5+i*1.6,1.6+i*.15,-1.4);}
ring(miniature,3.6,.06,limeGlow,0,1,0).rotation.x=Math.PI/2.5;
halo(signature,0,2.25,0,COLORS.pink,5);const revealText=plane(reveal,3.7,.58,labelTexture('iamtaw','#fff6e8',105),0,-1.5,1);revealText.visible=false;
// A restrained star field ties the rooms together in the same spatial world.
const pointGeo=new T.BufferGeometry();const count=mobile()?260:600;const positions=new Float32Array(count*3);for(let i=0;i<count;i++){positions[i*3]=Math.random()*166-14;positions[i*3+1]=Math.random()*20-6;positions[i*3+2]=Math.random()*38-22;}pointGeo.setAttribute('position',new T.BufferAttribute(positions,3));const stars=new T.Points(pointGeo,new T.PointsMaterial({color:0xc0a7b8,size:.025,transparent:true,opacity:.6,sizeAttenuation:true}));scene.add(stars);
let pointer=new T.Vector2(),smoothPointer=new T.Vector2(),raycaster=new T.Raycaster(),targetLook=new T.Vector3(),look=new T.Vector3(),targetCamera=new T.Vector3(),elapsed=0,last=performance.now(),orbit=0,targetOrbit=0,pointerDown=null,hovered=null,transition=1,lastIndex=0,entryFlight=0;
const cameraPositions=[[8.4,5.2,11.2],[7,5.2,10.5],[2.5,3.0,12.8],[5.4,4.2,11.5],[5.2,3.8,12.3]];
const mobileCameraPositions=[[8,5.5,15.5],[6,5.5,16.5],[1,3.5,15.5],[4,5,17],[4.5,4.5,16.5]];
function targets(index){const p=(mobile()?mobileCameraPositions:cameraPositions)[index];const center=index*34;targetCamera.set(center+p[0],p[1],p[2]);targetLook.set(center+(mobile()?0:-2.7),mobile()?2.8:.25,0);}
function resize(){const low=$('#performance').checked;renderer.setPixelRatio(low?1:Math.min(devicePixelRatio,mobile()?1.4:1.7));renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();targets(current);}
function syncAction(){if(current===1)$('#action-label').textContent=broken?'Rebuild the architecture':'Break the architecture';if(current===2)$('#action-label').textContent=scatter?'Find the sentence':'Scatter the sentence';if(current===3)$('#action-label').textContent=connected.size===3?'Reset the machine':`Connect ${['input','thinking','creation'][connected.size]} · ${connected.size+1}/3`;}
function toggleBuildings(){broken=!broken;status(broken?'STRUCTURE RELEASED / POSSIBILITY REMAINS':'A NEW PLACE FOR AN IDEA');syncAction();chime(broken?196:261.63);}
function toggleWords(){scatter=!scatter;status(scatter?'A LITTLE CHAOS IS PART OF THE PROCESS':'MAKE ROOM FOR THE STRANGE.');syncAction();chime(scatter?293.66:220);}
function connectNode(index){if(connected.has(index))return;connected.add(index);machineNodes[index].material=limeGlow;pulses[index].wire.material=glowMat(COLORS.lime,1);pulses[index].mesh.visible=true;status(connected.size===3?'SYSTEM ALIVE / IDEAS → POSSIBILITIES':`CONNECTION ${connected.size}/3 / ${['INPUT RECEIVED','THINKING CONNECTED','CREATION CONNECTED'][index]}`);syncAction();chime(261.63+index*65.4);}
function interact(){if(current===1)toggleBuildings();if(current===2)toggleWords();if(current===3){if(connected.size===3){connected.clear();machineNodes.forEach(n=>n.material=mulberry);pulses.forEach(p=>{p.mesh.visible=false;p.wire.material=glowMat(COLORS.mulberry,.65)});status('CIRCUIT RESET / READY FOR THE NEXT IDEA');syncAction();}else connectNode([0,1,2].find(i=>!connected.has(i)));}}
function activate(obj){if(!obj)return;const {kind,value}=obj.userData;if(kind==='enter')setChapter(1);if(kind==='architecture')toggleBuildings();if(kind==='language')toggleWords();if(kind==='node')connectNode(value);}
function intersect(e){const r=canvas.getBoundingClientRect();raycaster.setFromCamera(new T.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1),camera);const list=hitObjects.filter(o=>{let p=o;while(p.parent&&p.parent!==scene)p=p.parent;return p===worlds[current]});return raycaster.intersectObjects(list,false)[0]?.object;}
canvas.addEventListener('pointerdown',e=>{pointerDown={x:e.clientX,y:e.clientY,orbit:targetOrbit};canvas.setPointerCapture(e.pointerId);document.body.classList.add('dragging');});
canvas.addEventListener('pointermove',e=>{pointer.set((e.clientX/innerWidth-.5)*2,(e.clientY/innerHeight-.5)*2);if(pointerDown){targetOrbit=pointerDown.orbit+(e.clientX-pointerDown.x)*.006;}else{hovered=intersect(e);document.body.classList.toggle('hovering',!!hovered);}});
canvas.addEventListener('pointerup',e=>{if(!pointerDown)return;const dx=e.clientX-pointerDown.x,dy=e.clientY-pointerDown.y;if(Math.abs(dy)>65&&Math.abs(dy)>Math.abs(dx)*1.3){setChapter(current+(dy<0?1:-1));}else if(Math.hypot(dx,dy)<9){activate(intersect(e));}pointerDown=null;document.body.classList.remove('dragging');});
canvas.addEventListener('pointercancel',()=>{pointerDown=null;document.body.classList.remove('dragging');});
canvas.addEventListener('pointerleave',()=>{if(!pointerDown){pointer.set(0,0);hovered=null;document.body.classList.remove('hovering');}});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.setAnimationLoop(null);status('The graphics context paused. Reload to return to the world.');});
window.addEventListener('resize',resize);
function go(index,previous){targetOrbit=0;transition=0;lastIndex=index;entryFlight=index===1&&previous===0&&!reduced?1:0;targets(index);if(entryFlight){targetCamera.set(.5,1.3,2.2);targetLook.set(0,1,-.7);}if(reduced){camera.position.copy(targetCamera);look.copy(targetLook);}}
function render(now){const dt=Math.min((now-last)/1000,software?.5:.05);last=now;if(document.hidden)return;if(entryFlight>0){entryFlight-=dt;if(entryFlight<=0)targets(current);}const a=1-Math.exp(-dt*3.8);elapsed+=reduced?0:dt;transition=Math.min(1,transition+dt*.7);smoothPointer.lerp(pointer,a);orbit=T.MathUtils.lerp(orbit,targetOrbit,a);camera.position.lerp(targetCamera,reduced?1:a);look.lerp(targetLook,reduced?1:a);const hoverOffset=reduced?0:.22;camera.position.x+=smoothPointer.x*hoverOffset*dt;camera.position.y-=smoothPointer.y*hoverOffset*dt;camera.lookAt(look);
worlds.forEach((g,i)=>{g.visible=Math.abs(g.position.x-camera.position.x)<18;const base=i===0?-.25:0;g.rotation.y=T.MathUtils.lerp(g.rotation.y,base+(i===current?orbit:0),a);});
floaters.forEach(f=>{f.obj.position.y=f.y+Math.sin(elapsed*f.rate+f.phase)*f.amp;if(f.spin&&!reduced){f.obj.rotation.y+=dt*.22;f.obj.rotation.z+=dt*.12;}});
buildings.forEach((b,i)=>{const target=broken?b.userData.away:b.userData.home;b.position.lerp(target,reduced?1:a);b.rotation.z=T.MathUtils.lerp(b.rotation.z,broken?Math.sin(i)*.5:0,reduced?1:a);});
wordMeshes.forEach((w,i)=>{w.position.lerp(scatter?w.userData.away:w.userData.home,reduced?1:a);w.rotation.z=T.MathUtils.lerp(w.rotation.z,scatter?Math.sin(i+elapsed*.3)*.6:0,reduced?1:a);w.rotation.y=T.MathUtils.lerp(w.rotation.y,scatter?Math.cos(i+elapsed*.2)*.7:0,reduced?1:a);});
if(!reduced){const speed=connected.size===3?.85:.13;core.rotation.y+=dt*speed;core.rotation.x+=dt*speed*.3;machineRings.forEach((r,i)=>{r.rotation.y+=dt*speed*(i%2?-1:1);r.rotation.z+=dt*speed*.3;});diamond.rotation.y=diamondEdges.rotation.y=elapsed*.12;miniature.rotation.y=-elapsed*.1;signature.position.y=-.4+Math.sin(elapsed*.6)*.08;}
pulses.forEach(p=>{if(p.mesh.visible)p.mesh.position.copy(p.path.getPointAt(reduced?.5:(elapsed*.27+p.index*.3)%1));});const powered=connected.size===3;coreShape.material=powered?limeGlow:mulberry;machineLight.color.setHex(powered?COLORS.lime:COLORS.pink);machineLight.intensity=powered?8:3;coreHalo.material.color.setHex(powered?COLORS.lime:COLORS.pink);
renderer.render(scene,camera);
}
resize();targets(current);camera.position.copy(targetCamera);look.copy(targetLook);camera.lookAt(look);renderer.render(scene,camera);renderer.setAnimationLoop(render);
return {go,interact,syncAction,resize,setReduced:()=>{targets(current);if(reduced){camera.position.copy(targetCamera);look.copy(targetLook)}},getDiagnostics:()=>({chapter:current,connected:[...connected],scattered:scatter,broken,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,webgl:!software,software})};
}
(async()=>{try{await document.fonts.ready;engine=await createWorld();ready=true;$('#loading').remove();$('#action').disabled=false;$('#action-label').textContent='Step inside';document.body.classList.toggle('reduced',reduced);const initial=chapters.findIndex(c=>`#${c.hash}`===location.hash);if(initial>0)setChapter(initial,false);window.afterHours={diagnostics:()=>engine.getDiagnostics()};}catch(e){startFallback(e);const initial=chapters.findIndex(c=>`#${c.hash}`===location.hash);if(initial>0)setChapter(initial,false);}})();
