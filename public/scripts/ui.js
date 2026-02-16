// UI helpers: ripple, toast, icon enhancement
document.addEventListener('DOMContentLoaded', ()=>{
  // Add ripple to buttons
  document.querySelectorAll('.button, .btn, .btn-primary, .nav-btn, .action-btn').forEach(btn=>{
    btn.style.position = 'relative';
    btn.addEventListener('click', e=>{
      const ripple = document.createElement('span');
      ripple.style.position='absolute';
      ripple.style.borderRadius='50%';
      ripple.style.transform='translate(-50%,-50%)';
      ripple.style.pointerEvents='none';
      ripple.style.left = e.offsetX + 'px';
      ripple.style.top = e.offsetY + 'px';
      ripple.style.width='8px'; ripple.style.height='8px'; ripple.style.opacity='0.6';
      ripple.style.background='rgba(255,255,255,0.6)';
      ripple.style.boxShadow='0 6px 18px rgba(0,0,0,0.08)';
      ripple.style.transition='all 600ms cubic-bezier(.2,.8,.2,1)';
      btn.appendChild(ripple);
      requestAnimationFrame(()=>{ripple.style.width='120px';ripple.style.height='120px';ripple.style.opacity='0';});
      setTimeout(()=>ripple.remove(),650);
    });
  });

  // Small helper to show toast
  window.showToast = (msg, duration=3000)=>{
    let t = document.querySelector('.toast');
    if(!t){ t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), duration);
  }

  // Inject icons for nav buttons if missing (fontawesome should be loaded)
  try{
    const mapping = {
      'Dashboard':'fas fa-chart-pie',
      'Livros':'fas fa-book',
      'Usuários':'fas fa-user',
      'Empréstimos':'fas fa-exchange-alt',
      'Reservas':'fas fa-star',
      'Relatórios':'fas fa-chart-line'
    };
    document.querySelectorAll('.nav-btn').forEach(btn=>{
      const text = btn.textContent.trim();
      for(const key in mapping){ if(text.includes(key)){
        const i = document.createElement('i'); i.className = mapping[key] + ' fa-fw'; i.style.marginRight='8px';
        btn.prepend(i); break;
      }}
    });
  }catch(e){/* ignore */}
});