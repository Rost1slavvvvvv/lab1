(() => {
  const root = document.documentElement;
  root.classList.add('js');

  const header = document.querySelector('.site-header');
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('menu');
  const themeBtn = document.querySelector('.theme-toggle');
  const themeText = document.querySelector('.theme-toggle__text');
  const cart = document.querySelector('.cart');

  const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    header.classList.toggle('is-solid', open || window.scrollY > 40);
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  const paintTheme = () => {
    const dark = root.dataset.theme === 'dark';
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeText.textContent = dark ? 'Light theme' : 'Dark theme';
  };
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* storage unavailable */ }
    paintTheme();
  });
  paintTheme();

  let count = 0;
  document.querySelector('.products__grid').addEventListener('click', (e) => {
    if (!e.target.closest('.card__add')) return;
    count += 1;
    cart.dataset.count = count;
    cart.querySelector('.cart__count').textContent = count;
    cart.setAttribute('aria-label', `Cart, ${count} item${count > 1 ? 's' : ''}`);
    cart.classList.remove('bump');
    void cart.offsetWidth;
    cart.classList.add('bump');
  });

  const form = document.querySelector('.cta__form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelector('.cta__status').textContent = 'Thank you! Your 15% code is on its way.';
    form.reset();
  });

  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); reveal.unobserve(en.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

    const links = [...document.querySelectorAll('.nav__link')];
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${en.target.id}`));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    links.forEach((l) => { const s = document.querySelector(l.getAttribute('href')); if (s) spy.observe(s); });
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }
  const P = { A: '1718939045285-b67f9e9f9f8b', B: '1658867839109-bf3e2af75cc2', C: '1652517209166-f17a2742a5fe', D: '1572780789900-43ef70568a0f', E: '1664983674780-ae1fc27e7fac' };
  const url = (k, w) => `https://images.unsplash.com/photo-${P[k]}?auto=format&fit=crop&q=75&w=${w}`;

  const grid = document.querySelector('.products__grid');
  [['Oak Wardrobe Duo', 260, 275, 'A'], ['Cube Wall Shelf', 38, 45, 'D'], ['Slim Shelf Tower', 92, 110, 'C'], ['Display Rack Pro', 140, 160, 'E'],
   ['Cabinet Classic', 185, 200, 'B'], ['Hallway Wardrobe', 210, 230, 'A'], ['Mini Wall Shelf', 29, 35, 'D'], ['Shelf Unit Light', 64, 72, 'C']]
    .forEach(([n, p, o, k]) => grid.insertAdjacentHTML('beforeend',
      `<article class="card"><div class="card__media"><img src="${url(k, 600)}" alt="${n}" width="290" height="300" loading="lazy"><button class="card__add" type="button" data-name="${n}" aria-label="Add ${n} to cart">+</button></div><h3 class="card__title">${n}</h3><p class="card__price">$${p}.00 <s>$${o}.00</s></p></article>`));
  const cards = [...grid.children];
  const pager = document.querySelector('.pager');
  const [prev, next] = pager.querySelectorAll('.round-btn');
  const dots = pager.querySelector('.pager__dots');
  dots.removeAttribute('aria-hidden');
  let page = 0;
  const perPage = () => { const c = getComputedStyle(grid).gridTemplateColumns.split(' ').length; return c * (c === 2 ? 4 : 2); };
  const renderPage = (animate) => {
    const pp = perPage(), pages = Math.ceil(cards.length / pp);
    page = Math.min(page, pages - 1);
    cards.forEach((c, i) => {
      const show = i >= page * pp && i < (page + 1) * pp;
      c.hidden = !show;
      c.classList.remove('is-entering');
      if (show && animate) { void c.offsetWidth; c.classList.add('is-entering'); }
    });
    dots.innerHTML = Array.from({ length: pages }, (_, i) => `<button type="button" class="${i === page ? 'is-active' : ''}" aria-label="Page ${i + 1}"${i === page ? ' aria-current="true"' : ''}></button>`).join('');
    prev.disabled = page === 0;
    next.disabled = page === pages - 1;
  };
  const goPage = (n) => { page = n; renderPage(true); };
  prev.addEventListener('click', () => goPage(page - 1));
  next.addEventListener('click', () => goPage(page + 1));
  dots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) goPage([...dots.children].indexOf(b)); });
  let lastPP = perPage();
  window.addEventListener('resize', () => { if (perPage() !== lastPP) { lastPP = perPage(); renderPage(false); } });
  renderPage(false);

  const reviews = [
    { n: 'Josh Smith', r: 'Interior designer at Nordic Loft', q: '“Their modular shelves fit my narrow hallway perfectly. Easy to assemble, solid quality and the planning help was a real bonus.”', k: 'D', a: 'Wall-mounted shelf with a potted plant' },
    { n: 'Anna Moroz', r: 'Home organiser', q: '“The wardrobe system saved my small bedroom. Delivery was fast and the online planner matched the result exactly.”', k: 'A', a: 'Wooden wardrobe with hangers and shelves' },
    { n: 'Martin Keller', r: 'Architect', q: '“Solid materials, clean design and a ten-year warranty. I now recommend FurniShop to all my clients.”', k: 'E', a: 'Grey open shelf with decor' }
  ];
  const tBox = document.querySelector('.testimonial');
  const tImg = tBox.querySelector('.testimonial__img');
  const [tPrev, tNext] = tBox.querySelectorAll('.testimonial__nav .round-btn');
  let ri = 0;
  const showReview = (n) => {
    ri = (n + reviews.length) % reviews.length;
    const r = reviews[ri];
    tBox.classList.add('is-swapping');
    setTimeout(() => {
      tBox.querySelector('.testimonial__person strong').textContent = r.n;
      tBox.querySelector('.testimonial__person span').textContent = r.r;
      tBox.querySelector('.testimonial__quote p').textContent = r.q;
      tImg.alt = r.a;
      tImg.src = url(r.k, 1100);
      tBox.classList.remove('is-swapping');
    }, 280);
  };
  tPrev.addEventListener('click', () => showReview(ri - 1));
  tNext.addEventListener('click', () => showReview(ri + 1));
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const statsBar = document.querySelector('.stats');
  if (!still && 'IntersectionObserver' in window) {
    const nums = [...document.querySelectorAll('.stats__num')].map((el) => { const m = el.textContent.match(/^(\d+)(.*)$/); return { el, to: +m[1], tail: m[2] }; });
    nums.forEach(({ el, tail }) => { el.textContent = '0' + tail; });
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / 1400, 1), e = 1 - Math.pow(1 - p, 3);
        nums.forEach(({ el, to, tail }) => { el.textContent = Math.round(to * e) + tail; });
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(statsBar);
  }
})();
