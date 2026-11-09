(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  $('#yr').textContent = new Date().getFullYear();

  /* 헤더: 스크롤 시 배경 진하게, 현재 섹션 표시 */
  const hd = $('.hd');
  const links = $$('.nav a[href^="#"]');
  const setOn = (id) => links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + id));
  const onScroll = () => {
    hd.classList.toggle('sc', scrollY > 8);
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) setOn('contact');
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setOn(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'work', 'archive', 'contact'].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    const hero = $('.hero');
    new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(''); }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
  }

  /* Archive 접기/펼치기 */
  const more = $('.arc-more');
  if (more) more.addEventListener('click', () => {
    const open = $('.arc').classList.toggle('open');
    more.setAttribute('aria-expanded', open);
    more.textContent = open ? '접기' : '연습작 4개 더 보기';
  });

  /* 포스터 크게 보기 */
  const pt = $('.poster-thumb');
  const lb = $('.lb');
  if (pt && lb && lb.showModal) {
    pt.addEventListener('click', (e) => {
      e.preventDefault();
      $('img', lb).src = pt.getAttribute('href');
      lb.showModal();
    });
    lb.addEventListener('click', (e) => { if (e.target === lb || e.target.tagName === 'IMG') lb.close(); });
  }

  /* 이메일 복사 */
  const cp = $('.copy');
  if (cp) cp.addEventListener('click', async () => {
    const text = cp.dataset.copy;
    try { await navigator.clipboard.writeText(text); }
    catch (_) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (__) {}
      ta.remove();
    }
    cp.textContent = '복사했어요';
    setTimeout(() => { cp.textContent = '이메일 복사'; }, 1800);
  });

  /* 히어로: 첫 진입 연출 한 번, 보석은 천천히 떠 있고 마우스에 살짝 기울어짐 (JS 실패해도 내용은 보임) */
  const g = window.gsap;
  if (!g || reduce) return;
  g.from('.hero [data-in]', { y: 14, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 });
  g.from('.gem-tilt', { scale: 0.88, autoAlpha: 0, duration: 1.2, ease: 'power3.out', delay: 0.25 });
  g.to('.gem', { y: -10, duration: 3.4, ease: 'sine.inOut', repeat: -1, yoyo: true });

  if (fine) {
    g.set('.gem-tilt', { transformPerspective: 900 });
    const ry = g.quickTo('.gem-tilt', 'rotationY', { duration: 0.9, ease: 'power3' });
    const rx = g.quickTo('.gem-tilt', 'rotationX', { duration: 0.9, ease: 'power3' });
    addEventListener('mousemove', (e) => {
      ry((e.clientX / innerWidth - 0.5) * 24);
      rx(-(e.clientY / innerHeight - 0.5) * 18);
    });
  }
})();
