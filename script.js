// Ícones
lucide.createIcons();

/* ---------- Barra de progresso de leitura ---------- */
const progress = document.getElementById('progress');
addEventListener('scroll', () => {
  const h = document.documentElement;
  const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
  progress.style.width = (p * 100) + '%';
});

/* ---------- Nav: fundo ao rolar + link ativo ---------- */
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));

const navLinks = document.querySelectorAll('.nav-links a');
const secObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id], header[id]').forEach(s => secObserver.observe(s));

/* ---------- Reveal ao rolar (com stagger nos grids) ---------- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      if (e.target.classList.contains('stagger')) {
        [...e.target.children].forEach((c, i) => c.style.transitionDelay = (i * 70) + 'ms');
      }
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


/* ---------- Crachá 3D: tilt acompanha o mouse ---------- */
const hero = document.querySelector('.hero');
const badge = document.getElementById('badge');
if (matchMedia('(hover:hover)').matches) {
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    badge.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 9}deg)`;
  });
  hero.addEventListener('mouseleave', () => badge.style.transform = 'rotateY(0) rotateX(0)');
}

/* ---------- Flip cards (clique + teclado) ---------- */
document.querySelectorAll('.flip').forEach(card => {
  const toggle = () => card.classList.toggle('flipped');
  card.addEventListener('click', toggle);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});

/* ---------- Simulador do Recrutador ---------- */
const toggles  = document.querySelectorAll('.sim-toggle');
const scoreNum = document.getElementById('scoreNum');
const simFill  = document.getElementById('simFill');
const stamp    = document.getElementById('stamp');
const report   = document.getElementById('reportText');

const reports = {
  good: 'Comportamento que dispensa apresentação. Quem age assim em espaços compartilhados tende a ager assim em qualquer equipe. O recrutador anotaria: <strong>"levar para casa"</strong>.',
  mid:  'Há base, mas há ruído. No dia a dia de uma empresa, <strong>pequenos deslizes no coletivo chamam mais atenção do que acertos individuais</strong>. Ajuste o volume, o lixo e os combinados — e o laudo muda de cor.',
  bad:  'Se o dia de hoje fosse uma entrevista, a resposta teria sido <strong>"aguardamos o próximo processo"</strong>. A boa notícia: postura se treina. E treina-se exatamente aqui, agora.'
};

function updateSim() {
  let sum = 0;
  toggles.forEach(t => { if (t.classList.contains('on')) sum += +t.dataset.value; });
  const score = Math.max(0, Math.min(100, 50 + sum * 15));
  scoreNum.textContent = score;
  simFill.style.width = score + '%';

  let cls, label, color;
  if (score >= 75)      { cls = 'good'; label = 'CONTRATÁVEL';       color = 'var(--cyan)'; simFill.style.background = 'var(--cyan)'; }
  else if (score >= 45) { cls = 'mid';  label = 'EM OBSERVAÇÃO';     color = 'var(--warn)'; simFill.style.background = 'var(--warn)'; }
  else                  { cls = 'bad';  label = 'PRECISA EVOLUIR';   color = 'var(--bad)';  simFill.style.background = 'var(--bad)'; }

  stamp.textContent = label;
  stamp.style.color = color;
  report.innerHTML = reports[cls];

  // re-anima o carimbo a cada atualização
  stamp.classList.remove('pop');
  void stamp.offsetWidth;
  stamp.classList.add('pop');
}
toggles.forEach(t => t.addEventListener('click', () => { t.classList.toggle('on'); updateSim(); }));
document.getElementById('simReset').addEventListener('click', () => {
  toggles.forEach(t => t.classList.remove('on'));
  updateSim();
});

/* ---------- Código de Boas Práticas ---------- */
const items     = document.querySelectorAll('.code-item');
const codeCount = document.getElementById('codeCount');
const codeFill  = document.getElementById('codeFill');
const codeDone  = document.getElementById('codeDone');

function updateCode() {
  const total = items.length;
  const checked = document.querySelectorAll('.code-item.on').length;
  codeCount.textContent = checked;
  codeFill.style.width = (checked / total * 100) + '%';
  codeDone.classList.toggle('show', checked === total);
}
items.forEach(item => {
  const toggle = () => { item.classList.toggle('on'); updateCode(); };
  item.addEventListener('click', toggle);
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});