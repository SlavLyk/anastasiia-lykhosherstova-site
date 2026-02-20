// shared.js — inject nav and footer into every page
(function() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navLinks = [
    { href: 'index.html',    label: 'Home' },
    { href: 'about.html',    label: 'About' },
    { href: 'services.html', label: 'Services' },
    { href: 'gallery.html',  label: 'Gallery' },
    { href: 'events.html',   label: 'Events' },
    { href: 'contact.html',  label: 'Contact' },
  ];

  const nav = document.createElement('nav');
  nav.innerHTML = `
    <a href="index.html" class="nav-logo">Anastasiia <span>Lykhosherstova</span></a>
    <ul class="nav-links">
      ${navLinks.map(l => `
        <li><a href="${l.href}" class="${currentPage === l.href ? 'active' : ''}">${l.label}</a></li>
      `).join('')}
    </ul>
  `;
  document.body.prepend(nav);

  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="footer-logo">Anastasiia <span>Lykhosherstova</span></div>
    <ul class="footer-links">
      ${navLinks.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
    </ul>
    <div class="footer-copy">© 2025 Anastasiia Lykhosherstova</div>
  `;
  document.body.append(footer);

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  reveals.forEach(el => obs.observe(el));
})();
