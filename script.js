document.addEventListener('DOMContentLoaded', () => {

  /* ----- Плавный скролл по якорям ----- */
  const headerHeight = document.querySelector('.header')?.offsetHeight || 0;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});