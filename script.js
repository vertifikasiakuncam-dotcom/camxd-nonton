const cover=document.getElementById('cover');
const openButton=document.getElementById('openInvite');
const invitation=document.getElementById('invitation');
const guest=new URLSearchParams(location.search).get('to');
if(guest)document.getElementById('guestName').textContent=guest;
openButton.addEventListener('click',()=>{
 if(openButton.disabled)return;
 openButton.disabled=true;
 openButton.innerHTML='MEMBUKA UNDANGAN <span>✦</span>';
 cover.classList.add('opened');
 window.setTimeout(()=>{
  cover.style.transition='opacity 1s ease';
  cover.style.opacity='0';
  window.setTimeout(()=>{
   cover.style.display='none';
   invitation.classList.remove('is-hidden');
   window.scrollTo({top:0,behavior:'instant'});
   document.querySelectorAll('.section').forEach(el=>el.classList.add('reveal'));
   observeSections();
  },950);
 },2100);
});
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
document.getElementById('musicToggle').addEventListener('click',()=>alert('Musik latar akan ditambahkan setelah file lagu pilihan tersedia.'));
