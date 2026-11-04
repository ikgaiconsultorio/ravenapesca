const c=document.getElementById('game'),ctx=c.getContext('2d'),mini=document.getElementById('mini'),mctx=mini.getContext('2d');let DPR=Math.min(devicePixelRatio||1,2),W,H;
function resize(){W=innerWidth;H=innerHeight;c.width=W*DPR;c.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0)}addEventListener('resize',resize);resize();
const world={w:2300,h:1700,lake:{x:440,y:230,w:1320,h:1040},pier:{x:1030,y:1170,w:155,h:240},shop:{x:1900,y:350,w:195,h:160},market:{x:1880,y:1020,w:225,h:175},board:{x:170,y:400,w:145,h:110}};
const player={x:1110,y:1450,r:17,speed:220,dir:0};let cam={x:0,y:0},last=performance.now(),near=null,coins=1635,bait=7,inventory=[];
const fish=[['Carpa Lunar','Comum',1,4,45],['Tilápia Sombria','Comum',.5,2.8,35],['Dourado de Azarath','Raro',3,11,160],['Bagre Fantasma','Épico',5,18,320],['Leviatã Jovem','Lendário',12,28,900]];
const keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='e')interact()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
function rr(x,y,w,h,r=10){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function glow(x,y,r,col){let g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function lantern(x,y){x-=cam.x;y-=cam.y;glow(x,y,48,'#ffb24a55');ctx.fillStyle='#24170e';ctx.fillRect(x-2,y-20,4,22);ctx.fillStyle='#ffd27a';ctx.fillRect(x-5,y-17,10,12);ctx.strokeStyle='#8d5b2e';ctx.strokeRect(x-5,y-17,10,12)}
function flower(x,y,i){x-=cam.x;y-=cam.y;ctx.fillStyle=i%3?'#b7438b':'#e45475';for(let a=0;a<5;a++){let q=a*Math.PI*2/5;ctx.beginPath();ctx.arc(x+Math.cos(q)*4,y+Math.sin(q)*4,3,0,Math.PI*2);ctx.fill()}ctx.fillStyle='#f5d8a1';ctx.fillRect(x-1,y-1,2,2)}
function npc(x,y,name){x-=cam.x;y-=cam.y;ctx.fillStyle='#0007';ctx.beginPath();ctx.ellipse(x,y+12,14,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3a2b23';ctx.beginPath();ctx.arc(x,y-5,9,0,Math.PI*2);ctx.fill();ctx.fillStyle='#6f3e4f';ctx.fillRect(x-9,y+2,18,18);ctx.fillStyle='#eee2cf';ctx.font='9px system-ui';ctx.textAlign='center';ctx.fillText(name,x,y-20)}
function drawMini(){let w=mini.width,h=mini.height;mctx.clearRect(0,0,w,h);mctx.fillStyle='#111a22';mctx.fillRect(0,0,w,h);let sx=w/world.w,sy=h/world.h,L=world.lake;mctx.fillStyle='#0b3447';mctx.beginPath();mctx.ellipse((L.x+L.w/2)*sx,(L.y+L.h/2)*sy,L.w/2*sx,L.h/2*sy,0,0,Math.PI*2);mctx.fill();mctx.fillStyle='#b15a7d';for(const b of [world.shop,world.market,world.board])mctx.fillRect(b.x*sx,b.y*sy,Math.max(4,b.w*sx),Math.max(4,b.h*sy));mctx.fillStyle='#e8c263';mctx.fillRect(world.pier.x*sx,world.pier.y*sy,world.pier.w*sx,world.pier.h*sy);mctx.fillStyle='#df67ff';mctx.beginPath();mctx.arc(player.x*sx,player.y*sy,4,0,Math.PI*2);mctx.fill()}
function drawStatue(t){
 const L=world.lake,x=L.x+L.w/2-cam.x,y=L.y+L.h/2-cam.y;
 // island, glowing rune and lake reflections
 glow(x,y+36,220,'#9c48e033');ctx.fillStyle='#0b2430';ctx.beginPath();ctx.ellipse(x,y+64,155,55,0,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#74559b';ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(x,y+62,143,45,0,0,Math.PI*2);ctx.stroke();
 ctx.fillStyle='#312d43';ctx.beginPath();ctx.ellipse(x,y+38,90,35,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#444057';ctx.fillRect(x-65,y-2,130,53);ctx.fillStyle='#756c89';ctx.fillRect(x-74,y+35,148,17);
 // cloak and flowing hair silhouette
 ctx.fillStyle='#1b172e';ctx.beginPath();ctx.moveTo(x-33,y-110);ctx.lineTo(x-84,y+24);ctx.quadraticCurveTo(x,y+55,x+85,y+24);ctx.lineTo(x+31,y-110);ctx.closePath();ctx.fill();
 ctx.fillStyle='#625b7c';ctx.beginPath();ctx.moveTo(x-29,y-100);ctx.lineTo(x-42,y+17);ctx.lineTo(x+40,y+17);ctx.lineTo(x+30,y-100);ctx.closePath();ctx.fill();
 ctx.fillStyle='#201a32';ctx.beginPath();ctx.ellipse(x,y-137,37,49,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#9288a4';ctx.beginPath();ctx.ellipse(x,y-139,23,33,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#181427';ctx.beginPath();ctx.moveTo(x-39,y-174);ctx.quadraticCurveTo(x-3,y-220,x+38,y-171);ctx.lineTo(x+24,y-151);ctx.lineTo(x+12,y-183);ctx.lineTo(x-24,y-156);ctx.closePath();ctx.fill();
 // wings and staff
 ctx.fillStyle='#272139';for(let sign of [-1,1]){ctx.beginPath();ctx.moveTo(x+sign*24,y-94);ctx.quadraticCurveTo(x+sign*145,y-194,x+sign*143,y-32);ctx.quadraticCurveTo(x+sign*82,y-84,x+sign*39,y-10);ctx.closePath();ctx.fill()}
 ctx.strokeStyle='#a98ac9';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x+51,y-121);ctx.lineTo(x+82,y+36);ctx.stroke();
 glow(x,y-139,70,'#ae4fff77');ctx.fillStyle='#d3a2ff';ctx.fillRect(x-13,y-143,8,4);ctx.fillRect(x+6,y-143,8,4);
 glow(x+81,y-122,26,'#f077b077');ctx.fillStyle='#d4548d';ctx.font='30px serif';ctx.textAlign='center';ctx.fillText('✦',x+81,y-115);
 ctx.fillStyle='#e7d5ff';ctx.font='bold 17px system-ui';ctx.textAlign='center';ctx.shadowColor='#a44dff';ctx.shadowBlur=12;ctx.fillText('R A V E N A',x,y+102);ctx.shadowBlur=0;
 for(let i=0;i<18;i++){let a=i*2.399+t*.00025,rad=70+i*6;ctx.fillStyle=i%2?'#da6aaf':'#a85bd2';ctx.beginPath();ctx.ellipse(x+Math.cos(a)*rad,y+Math.sin(a)*rad*.35+58+Math.sin(t*.001+i)*7,4,2,a,0,Math.PI*2);ctx.fill()}
}
function ground(){const t=performance.now();ctx.fillStyle='#0c1720';ctx.fillRect(0,0,W,H);
 let sx=Math.floor(cam.x/42)*42,sy=Math.floor(cam.y/42)*42;for(let x=sx;x<cam.x+W+42;x+=42)for(let y=sy;y<cam.y+H+42;y+=42){let n=Math.abs((x*13+y*7)%101);ctx.fillStyle=n<30?'#17252b':'#14232a';ctx.fillRect(x-cam.x,y-cam.y,41,41)}
 // walking trail around the lake
 const L=world.lake,cx=L.x+L.w/2-cam.x,cy=L.y+L.h/2-cam.y;
 ctx.strokeStyle='#3d3434';ctx.lineWidth=74;ctx.beginPath();ctx.ellipse(cx,cy,L.w/2+80,L.h/2+74,0,0,Math.PI*2);ctx.stroke();
 ctx.strokeStyle='#625047';ctx.lineWidth=3;ctx.setLineDash([10,25]);ctx.beginPath();ctx.ellipse(cx,cy,L.w/2+80,L.h/2+74,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
 ctx.fillStyle='#091c2b';ctx.beginPath();ctx.ellipse(cx,cy,L.w/2,L.h/2,0,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#557e86';ctx.lineWidth=10;ctx.stroke();ctx.strokeStyle='#2b5567';ctx.lineWidth=2;
 for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(cx,cy,L.w/2-i*27,L.h/2-i*23,0,0,Math.PI*2);ctx.stroke()}
 for(let i=0;i<40;i++){let x=L.x+120+(i*191)%1070,y=L.y+80+(i*103)%800;if(!inLake(x,y))continue;let drift=Math.sin(t*.0007+i)*12;ctx.fillStyle=i%3?'#40637b66':'#a47edb55';ctx.fillRect(x-cam.x+drift,y-cam.y,24+(i%4)*13,2)}
 // island statue is the focal point
 drawStatue(t);
 // dock, wood grain and posts
 const P=world.pier;ctx.fillStyle='#372b26';ctx.fillRect(P.x-12-cam.x,P.y-10-cam.y,P.w+24,P.h+20);ctx.fillStyle='#7b5943';ctx.fillRect(P.x-cam.x,P.y-cam.y,P.w,P.h);
 for(let y=P.y;y<P.y+P.h;y+=23){ctx.strokeStyle='#b48a65';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(P.x-cam.x,y-cam.y);ctx.lineTo(P.x+P.w-cam.x,y-cam.y);ctx.stroke()}
 for(let y of [P.y+14,P.y+P.h-18])for(let x of [P.x+10,P.x+P.w-10]){ctx.fillStyle='#34251e';ctx.fillRect(x-6-cam.x,y-6-cam.y,12,16)}
 // redesigned trading buildings
 building(world.shop,'LOJA DO PESCADOR','🎣','#55446d');building(world.market,'MERCADO NOTURNO','🌹','#6e334f');building(world.board,'RANKING','🏆','#31485c');
 // woodland and cherry blossom groves
 for(let i=0;i<140;i++){let x=(i*311)%2240+30,y=(i*479)%1640+30;if(inLake(x,y)||lakeEdgeFactor(x,y)<1.16||inside(x,y,world.pier,90)||inside(x,y,world.shop,80)||inside(x,y,world.market,85)||inside(x,y,world.board,65))continue;let X=x-cam.x,Y=y-cam.y;if(X<-50||X>W+50||Y<-50||Y>H+50)continue;ctx.fillStyle='#0b141b';ctx.beginPath();ctx.ellipse(X,Y+15,31,12,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=i%5===0?'#75365f':i%4===0?'#3f365d':'#234138';ctx.beginPath();ctx.arc(X,Y-11,24+(i%3)*5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffffff0c';ctx.beginPath();ctx.arc(X-7,Y-19,13,0,Math.PI*2);ctx.fill()}
 for(let i=0;i<65;i++){let a=i*2.399,rx=L.w/2+125,ry=L.h/2+118,x=L.x+L.w/2+Math.cos(a)*rx,y=L.y+L.h/2+Math.sin(a)*ry;if(i%4===0)lantern(x,y);else flower(x,y,i)}
 npc(980,1400,'Pescador');npc(1810,990,'Nyx');npc(1840,530,'Mercadora');
 // distant skyline and moon
 ctx.fillStyle='#d9d1ff';ctx.beginPath();ctx.arc(2160-cam.x,95-cam.y,39,0,Math.PI*2);ctx.fill();glow(2160-cam.x,95-cam.y,110,'#a785ff33');
 drawMini()}
function building(b,label,icon,col){let x=b.x-cam.x,y=b.y-cam.y,w=b.w,h=b.h;if(x>W+80||x+w<-80||y>H+80||y+h<-80)return;
 ctx.fillStyle='#0007';rr(x-18,y+16,w+36,h+17,12);ctx.fillStyle='#352b36';rr(x,y,w,h,7);
 // textured wooden facade
 for(let i=0;i<Math.floor(w/19);i++){ctx.fillStyle=i%2?'#61465b':'#4b3848';ctx.fillRect(x+i*19,y+22,18,h-24)}
 ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x-24,y+28);ctx.lineTo(x+w/2,y-68);ctx.lineTo(x+w+24,y+28);ctx.closePath();ctx.fill();ctx.strokeStyle='#a980a4';ctx.lineWidth=5;ctx.stroke();
 ctx.fillStyle='#1c1625';ctx.fillRect(x+w/2-27,y+h-68,54,68);ctx.fillStyle='#f5c784';ctx.fillRect(x+20,y+55,27,32);ctx.fillRect(x+w-47,y+55,27,32);glow(x+34,y+68,58,'#ffc06644');glow(x+w-34,y+68,58,'#ffc06644');
 ctx.fillStyle='#201a2b';rr(x+12,y-5,w-24,36,7);ctx.strokeStyle='#b07b9e';ctx.lineWidth=2;ctx.strokeRect(x+12,y-5,w-24,36);ctx.fillStyle='#f9e3d7';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText(icon+' '+label,x+w/2,y+17);
 for(let i=0;i<3;i++){ctx.fillStyle='#6b4c36';ctx.fillRect(x-26+i*18,y+h-22,15,22)}
 for(let i=0;i<4;i++){let px=x+20+i*43;ctx.fillStyle='#bf618a';ctx.beginPath();ctx.arc(px,y+43,4,0,Math.PI*2);ctx.fill()}
}
function inLake(x,y){let L=world.lake,dx=(x-(L.x+L.w/2))/(L.w/2),dy=(y-(L.y+L.h/2))/(L.h/2);return dx*dx+dy*dy<1}
function inside(x,y,b,p=0){return x>b.x-p&&x<b.x+b.w+p&&y>b.y-p&&y<b.y+b.h+p}
function collides(x,y){if(x<25||y<25||x>world.w-25||y>world.h-25)return true;if(inLake(x,y)&&!inside(x,y,world.pier,4))return true;for(const b of [world.shop,world.market,world.board])if(inside(x,y,b,8))return true;return false}
function playerDraw(){let x=player.x-cam.x,y=player.y-cam.y;ctx.fillStyle='#0008';ctx.beginPath();ctx.ellipse(x,y+15,19,8,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#151421';ctx.beginPath();ctx.arc(x,y-8,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2b1f3b';ctx.beginPath();ctx.moveTo(x-15,y+20);ctx.lineTo(x,y-3);ctx.lineTo(x+15,y+20);ctx.fill();ctx.strokeStyle='#b48b69';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+10,y+4);ctx.lineTo(x+22,y-13);ctx.stroke();ctx.fillStyle='#dcd4e7';ctx.font='10px system-ui';ctx.textAlign='center';ctx.fillText('Marley',x,y-27)}
function update(dt){let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joyX,dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+joyY;if(dx||dy){let m=Math.hypot(dx,dy)||1,step=player.speed*dt;dx/=m;dy/=m;let nx=player.x+dx*step,ny=player.y+dy*step;if(!collides(nx,player.y))player.x=nx;if(!collides(player.x,ny))player.y=ny}cam.x=Math.max(0,Math.min(world.w-W,player.x-W/2));cam.y=Math.max(0,Math.min(world.h-H,player.y-H/2));detectNear()}
function lakeEdgeFactor(x,y){let L=world.lake,dx=(x-(L.x+L.w/2))/(L.w/2),dy=(y-(L.y+L.h/2))/(L.h/2);return Math.sqrt(dx*dx+dy*dy)}
function detectNear(){let opts=[['shop',{x:world.shop.x+world.shop.w/2,y:world.shop.y+world.shop.h+30},130,'🏮','Loja','Entrar'],['market',{x:world.market.x+world.market.w/2,y:world.market.y+world.market.h+30},140,'🌹','Mercado','Entrar'],['ranking',{x:world.board.x+world.board.w/2,y:world.board.y+world.board.h+30},120,'🏆','Ranking','Ver']];near=null;for(const o of opts)if(Math.hypot(player.x-o[1].x,player.y-o[1].y)<o[2]){near=o;break}
// A pesca funciona em toda a margem do lago, não apenas no píer. Isso deixa vários jogadores pescarem ao mesmo tempo no futuro.
if(!near){let edge=lakeEdgeFactor(player.x,player.y),onPier=inside(player.x,player.y,world.pier,18);if((edge>=.94&&edge<=1.18)||onPier)near=['fishing',{x:player.x,y:player.y},0,'🎣',onPier?'Píer':'Margem do Lago','Pescar']}
let h=document.getElementById('hint');if(near){h.classList.remove('hidden');h.innerHTML=`${near[3]} <b>${near[4]}</b><span>Pressione E ou toque para ${near[5].toLowerCase()}</span>`}else h.classList.add('hidden')}
function interact(){if(!near)return;if(near[0]==='fishing')goFish();else transition(near[4],()=>openPanel(near[0]))}
function goFish(){if(bait<=0)return toast('Você ficou sem iscas. Visite a Loja.');bait--;let roll=Math.random(),idx=roll>.985?4:roll>.91?3:roll>.68?2:roll>.32?1:0,f=fish[idx],weight=(f[2]+Math.random()*(f[3]-f[2])).toFixed(2);inventory.push({id:Date.now(),name:f[0],rarity:f[1],weight:+weight,value:Math.round(f[4]*weight/f[2])});updateHud();toast(`🎣 Você pescou <b>${f[0]}</b> • ${weight} kg • ${f[1]}!`);save()}
function openPanel(type){let b=document.getElementById('panelBody');if(type==='shop')b.innerHTML=`<div class="eyebrow">Mercadora da Lua</div><h2>🏮 Loja de Pesca</h2><p>Suprimentos para continuar explorando as águas de Azarath.</p><div class="cards"><div class="card"><h3>🪱 Pacote de Iscas</h3><small>+5 iscas</small><div class="row"><b class="price">🪙 120</b><button class="btn" onclick="buyBait()">Comprar</button></div></div><div class="card"><h3>🕸️ Rede Sombria</h3><small>Protótipo de equipamento futuro.</small><div class="row"><b class="price">🪙 750</b><button class="btn" onclick="toast('Em breve no backend Java 🌹')">Ver</button></div></div></div>`;else if(type==='market')renderMarket(b);else if(type==='ranking')b.innerHTML=`<div class="eyebrow">Temporada da Lua</div><h2>🏆 Ranking do Lago</h2><div class="cards"><div class="card"><h3>🥇 Marley</h3><small>24,8 kg • Leviatã Jovem</small></div><div class="card"><h3>🥈 Pescador Sombrio</h3><small>22,1 kg • Bagre Fantasma</small></div><div class="card"><h3>🥉 Raven</h3><small>19,6 kg • Dourado de Azarath</small></div></div>`;else renderInventory(b);document.getElementById('panel').classList.add('show')}
function renderInventory(b=document.getElementById('panelBody')){b.innerHTML=`<div class="eyebrow">Mochila do pescador</div><h2>🎒 Inventário</h2><p>${inventory.length?'Suas capturas atuais.':'Você ainda não pescou nada nesta sessão.'}</p><div class="cards">${inventory.map(f=>`<div class="card"><h3>🐟 ${f.name}</h3><small>${f.rarity} • ${f.weight} kg</small><div class="row"><span class="price">≈ 🪙 ${f.value}</span><button class="btn" onclick="sellFish(${f.id})">Vender</button></div></div>`).join('')||'<div class="card">Vá até o píer e lance sua linha.</div>'}</div>`}
function renderMarket(b){let listings=[['Dourado de Azarath',8.4,'Nyx',620],['Bagre Fantasma',13.2,'Raven',1180],['Carpa Lunar',3.1,'Luna',95]];b.innerHTML=`<div class="eyebrow">Jogador ↔ Jogador</div><h2>🌹 Mercado Noturno</h2><p>Preview da futura negociação ligada à sua API Java.</p><div class="cards">${listings.map(x=>`<div class="card"><h3>🐟 ${x[0]}</h3><small>${x[1]} kg • vendedor: ${x[2]}</small><div class="row"><b class="price">🪙 ${x[3]}</b><button class="btn" onclick="demoBuy(${x[3]},'${x[0]}')">Comprar</button></div></div>`).join('')}</div>`}
function buyBait(){if(coins<120)return toast('Saldo insuficiente.');coins-=120;bait+=5;updateHud();save();toast('🪱 +5 iscas adicionadas.')}function sellFish(id){let i=inventory.findIndex(x=>x.id===id);if(i<0)return;let f=inventory[i];coins+=f.value;inventory.splice(i,1);updateHud();save();renderInventory();toast(`🪙 ${f.value} moedas pela venda.`)}function demoBuy(p,n){if(coins<p)return toast('Saldo insuficiente.');coins-=p;updateHud();save();toast(`🌹 Compra simulada: ${n}.`)}
function transition(name,cb){let el=document.getElementById('roseTransition');document.getElementById('roseText').textContent='Entrando em '+name+'...';el.classList.add('show');setTimeout(()=>{cb();setTimeout(()=>el.classList.remove('show'),180)},520)}
function toast(s){let t=document.getElementById('toast');t.innerHTML=s;t.classList.add('show');clearTimeout(t._to);t._to=setTimeout(()=>t.classList.remove('show'),2400)}
function updateHud(){document.getElementById('coins').textContent=coins;document.getElementById('bait').textContent=bait;document.getElementById('bag').textContent=inventory.reduce((a,b)=>a+b.weight,0).toFixed(1)}
function save(){localStorage.setItem('ravenaRpgDemo',JSON.stringify({coins,bait,inventory}))}try{let s=JSON.parse(localStorage.getItem('ravenaRpgDemo'));if(s){coins=s.coins??coins;bait=s.bait??bait;inventory=s.inventory||[]}}catch{}updateHud();
function bindTap(el,fn){let fired=0;el.addEventListener('pointerup',e=>{e.preventDefault();e.stopPropagation();fired=Date.now();fn(e)});el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(Date.now()-fired>450)fn(e)})}
bindTap(document.getElementById('closePanel'),()=>document.getElementById('panel').classList.remove('show'));document.getElementById('panel').addEventListener('pointerup',e=>{if(e.target.id==='panel')e.currentTarget.classList.remove('show')});bindTap(document.getElementById('bagBtn'),()=>openPanel('inventory'));bindTap(document.getElementById('action'),interact);
// Botões criados dentro dos painéis usam delegação para responder melhor a toque no celular.
// Botões internos usam click nativo, evitando disparos duplicados no toque.
let joyX=0,joyY=0,joy=document.getElementById('joy'),stick=document.getElementById('stick'),jid=null;function joyMove(e){let t=[...e.changedTouches].find(x=>x.identifier===jid);if(!t)return;let r=joy.getBoundingClientRect(),dx=t.clientX-(r.left+r.width/2),dy=t.clientY-(r.top+r.height/2),m=Math.hypot(dx,dy),max=35;if(m>max){dx=dx/m*max;dy=dy/m*max}joyX=dx/max;joyY=dy/max;stick.style.transform=`translate(${dx}px,${dy}px)`}joy.addEventListener('touchstart',e=>{jid=e.changedTouches[0].identifier;joyMove(e)},{passive:false});joy.addEventListener('touchmove',e=>{e.preventDefault();joyMove(e)},{passive:false});joy.addEventListener('touchend',e=>{if([...e.changedTouches].some(x=>x.identifier===jid)){jid=null;joyX=joyY=0;stick.style.transform=''}},{passive:false});
function loop(now){let dt=Math.min((now-last)/1000,.033);last=now;update(dt);ground();playerDraw();requestAnimationFrame(loop)}requestAnimationFrame(loop);
