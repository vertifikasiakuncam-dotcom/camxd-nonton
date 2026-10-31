const cover=document.getElementById('cover');
const invitation=document.getElementById('invitation');
const openingVideo=document.getElementById('openingVideo');
const guest=new URLSearchParams(location.search).get('to');
if(guest)document.getElementById('guestName').textContent=guest;
let invitationOpened=false;
function openInvitation(){
 if(invitationOpened)return;
 invitationOpened=true;
 cover.classList.add('finished');
 window.setTimeout(()=>{
  cover.style.display='none';
  invitation.classList.remove('is-hidden');
  window.scrollTo({top:0,behavior:'instant'});
  document.querySelectorAll('.section').forEach(el=>el.classList.add('reveal'));
  observeSections();
 },900);
}
if(openingVideo){
 const fallback=window.setTimeout(openInvitation,14000);
 openingVideo.addEventListener('ended',()=>{window.clearTimeout(fallback);openInvitation();},{once:true});
 openingVideo.addEventListener('error',()=>{window.clearTimeout(fallback);openInvitation();},{once:true});
 const playAttempt=openingVideo.play();
 if(playAttempt&&typeof playAttempt.catch==='function')playAttempt.catch(()=>{window.clearTimeout(fallback);openInvitation();});
}
const weddingDate=new Date('2027-01-07T08:00:00+08:00');
function updateCountdown(){
 const left=Math.max(0,weddingDate.getTime()-Date.now());
 const values=[Math.floor(left/86400000),Math.floor(left/3600000)%24,Math.floor(left/60000)%60,Math.floor(left/1000)%60];
 ['days','hours','minutes','seconds'].forEach((id,i)=>{
  const node=document.getElementById(id);
  if(node)node.textContent=String(values[i]).padStart(i===0?3:2,'0');
 });
}
updateCountdown();setInterval(updateCountdown,1000);
function observeSections(){
 const items=document.querySelectorAll('.section');
 if(!('IntersectionObserver'in window)){items.forEach(el=>el.classList.add('visible'));return;}
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
 }),{threshold:.12});
 items.forEach(el=>observer.observe(el));
}
document.getElementById('rsvpForm').addEventListener('submit',event=>{
 event.preventDefault();
 const name=document.getElementById('rsvpName').value.trim();
 const attendance=document.getElementById('attendance').value;
 const count=document.getElementById('guestCount').value;
 const message=document.getElementById('message').value.trim();
 const text='Konfirmasi kehadiran Arfan & Muzjriah\nNama: '+name+'\nKehadiran: '+attendance+'\nJumlah tamu: '+count+'\nUcapan: '+message;
 window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener');
});

