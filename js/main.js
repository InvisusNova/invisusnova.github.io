/* Main JS — Navigation, Scroll Animations, Typing Effect, Utilities */
document.addEventListener('DOMContentLoaded', () => {

  /* --- Single scroll handler via requestAnimationFrame --- */
  const scrollProgress = document.querySelector('.scroll-progress');
  const navbar = document.querySelector('.navbar');
  let ticking = false;

  function onScroll() {
    const scrollTop = window.scrollY;

    // Scroll Progress Bar
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      scrollProgress.style.transform = `scaleX(${progress})`;
    }

    // Navbar scroll effect
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollTop > 50);
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  /* --- Mobile Navigation --- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Scroll Reveal Animation --- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* --- Typing Effect --- */
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    const texts = JSON.parse(typingElement.dataset.texts || '[]');
    let textIndex = 0, charIndex = 0, isDeleting = false;
    function type() {
      const current = texts[textIndex] || '';
      if (isDeleting) {
        typingElement.textContent = current.substring(0, charIndex--);
        if (charIndex < 0) { isDeleting = false; textIndex = (textIndex + 1) % texts.length; setTimeout(type, 400); return; }
        setTimeout(type, 30);
      } else {
        typingElement.textContent = current.substring(0, charIndex++);
        if (charIndex > current.length) { isDeleting = true; setTimeout(type, 2000); return; }
        setTimeout(type, 60);
      }
    }
    setTimeout(type, 500);
  }

  /* --- Animated Counters --- */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          const target = parseInt(entry.target.dataset.target);
          const suffix = entry.target.dataset.suffix || '';
          let current = 0;
          const increment = target / 60;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) { current = target; clearInterval(timer); }
            entry.target.textContent = Math.floor(current) + suffix;
          }, 16);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* --- Accordion --- */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isActive = item.classList.contains('active');
      // Close all
      item.parentElement.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.accordion-body').style.maxHeight = '0';
      });
      // Open clicked
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* --- Particles (reduced count for performance) --- */
  const particlesContainer = document.querySelector('.particles');
  if (particlesContainer) {
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.width = (Math.random() * 3 + 1) + 'px';
      particle.style.height = particle.style.width;
      particlesContainer.appendChild(particle);
    }
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* --- Toast notifications --- */
  window.showToast = function(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 4000);
  };

  /* --- Active nav link highlight --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});
