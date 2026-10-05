/* ============================================
   APEEX MS — Автоквесты Орск
   Интерактив: тема, параллакс, reveal, счётчики
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Прелоадер ----- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('is-hidden'), 400);
    });
    // Подстраховка: если load уже прошёл
    setTimeout(() => preloader.classList.add('is-hidden'), 2500);
  }

  /* ----- Тема (тёмная / светлая) ----- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('.theme-toggle__icon');

  // По умолчанию — тёмная. Светлая включается по сохранённому выбору.
  const savedTheme = localStorage.getItem('apeex-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    if (themeIcon) themeIcon.textContent = '☀';
  } else if (themeIcon) {
    themeIcon.textContent = '☾';
  }

  themeToggle?.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    if (themeIcon) themeIcon.textContent = isLight ? '☀' : '☾';
    localStorage.setItem('apeex-theme', isLight ? 'light' : 'dark');
  });

  /* ----- Reveal при скролле ----- */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -80px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ----- Счётчики ----- */
  const stats = document.querySelectorAll('.stat__num[data-count]');

  if (stats.length && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1600;
        const startTime = performance.now();

        const tick = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        statObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    stats.forEach(el => statObserver.observe(el));
  }

  /* ----- Параллакс на Hero ----- */
  const hero = document.querySelector('.hero');
  const heroVisual = document.querySelector('.hero__visual');

  if (hero && heroVisual && window.matchMedia('(pointer: fine)').matches) {
    let raf = null;
    hero.addEventListener('mousemove', (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroVisual.style.transform = `translate(${x * 18}px, ${y * 18}px)`;
      });
    });

    hero.addEventListener('mouseleave', () => {
      heroVisual.style.transform = 'translate(0, 0)';
    });
  }

  /* ----- Кнопка «наверх» ----- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    const onScroll = () => {
      toTop.classList.toggle('is-visible', window.scrollY > 700);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  /* ----- Бургер-меню ----- */
  const burger = document.getElementById('burger');
  const sideMenu = document.getElementById('sideMenu');

  const openMenu = () => {
    sideMenu?.classList.add('is-open');
    sideMenu?.setAttribute('aria-hidden', 'false');
    burger?.classList.add('is-active');
    burger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    sideMenu?.classList.remove('is-open');
    sideMenu?.setAttribute('aria-hidden', 'true');
    burger?.classList.remove('is-active');
    burger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burger?.addEventListener('click', () => {
    sideMenu?.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  document.querySelectorAll('[data-close-menu]').forEach(el => {
    el.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu?.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* ----- Раскрывающийся список квестов в меню ----- */
  const questsItem = document.getElementById('questsItem');
  const questsArrow = document.getElementById('questsArrow');

  questsArrow?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = questsItem?.classList.toggle('is-open');
    questsArrow.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  /* ----- Плавный скролл по якорям ----- */
  const headerHeight = document.querySelector('.header')?.offsetHeight || 0;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  
});