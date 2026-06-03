/**
 * Om Bute Portfolio - Interactive Scripting (Professional Edition)
 * Handles Canvas Aurora Waves, Accent Selector, Card Glows, Typewriter, and Contact Form.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Custom Cursor Elements
  const cursorRing = document.getElementById('cursor-ring');
  const cursorDot = document.getElementById('cursor-dot');
  
  // Update cursor position on mouse move
  document.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;
    if (cursorRing) {
      cursorRing.style.transform = `translate(${x}px, ${y}px)`;
    }
    if (cursorDot) {
      cursorDot.style.transform = `translate(${x}px, ${y}px)`;
    }
  });

  // Optional: Scale cursor on interactive elements hover
  const hoverTargets = document.querySelectorAll('a, button, .nav-link, .hero-tag');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorRing) cursorRing.style.transform += ' scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      if (cursorRing) cursorRing.style.transform = cursorRing.style.transform.replace(' scale(1.5)', '');
    });
  });

  // The rest of the existing initialization code follows below.

  
  // ==========================================================================
  // 1. GLOBAL STATE & CONFIG
  // ==========================================================================
  const state = {
    accentColor: 'blue',
    waveSpeed: 0.003 // Extremely slow, professional background waves
  };

  // Accent RGB values for Canvas waves matching style.css themes
  const colorThemes = {
    blue: { r: 0, g: 240, b: 255 },
    green: { r: 0, g: 245, b: 160 },
    purple: { r: 217, g: 70, b: 239 },
    orange: { r: 255, g: 126, b: 95 }
  };

  // ==========================================================================
  // 2. CANVAS AURORA BACKGROUND
  // ==========================================================================
  const canvas = document.getElementById('aurora-canvas');
  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Resize canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Wave Class
  class Wave {
    constructor(y, length, amplitude, speed) {
      this.y = y;
      this.length = length;
      this.amplitude = amplitude;
      this.speed = speed;
      this.offset = Math.random() * 100;
    }

    draw(themeRgb) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      
      for (let i = 0; i < canvas.width; i++) {
        const waveEquation = Math.sin(i * this.length + this.offset);
        // Reduced wave amplitude slightly to make waves flatter and subtler
        const yCoord = this.y + waveEquation * this.amplitude;
        ctx.lineTo(i, yCoord);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, this.y - this.amplitude, 0, canvas.height);
      gradient.addColorStop(0, `rgba(${themeRgb.r}, ${themeRgb.g}, ${themeRgb.b}, 0.08)`);
      gradient.addColorStop(0.5, `rgba(${themeRgb.r}, ${themeRgb.g}, ${themeRgb.b}, 0.02)`);
      gradient.addColorStop(1, 'rgba(6, 4, 15, 0)');

      ctx.fillStyle = gradient;
      ctx.fill();

      this.offset += this.speed * state.waveSpeed * 10;
    }
  }

  // Generate 3 subtle overlapping waves
  let waves = [];
  function initWaves() {
    // Moved waves further down and reduced height variations for a cleaner aesthetic
    waves = [
      new Wave(canvas.height * 0.78, 0.0015, 60, 0.015),
      new Wave(canvas.height * 0.83, 0.002, 40, -0.01),
      new Wave(canvas.height * 0.72, 0.001, 80, 0.008)
    ];
  }
  initWaves();
  window.addEventListener('resize', initWaves);

  // Background Loop
  function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Space dark gradient backdrop
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, '#060410'); 
    bgGradient.addColorStop(0.6, '#080614');
    bgGradient.addColorStop(1, '#0c0a1c');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw active waves
    const activeTheme = colorThemes[state.accentColor];
    waves.forEach(wave => wave.draw(activeTheme));

    animationFrameId = requestAnimationFrame(animateBackground);
  }
  animateBackground();

  // ==========================================================================
  // 3. NAVIGATION SCROLL EFFECT & ACTIVE STATE
  // ==========================================================================
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }

    // Active Section Link Tracker
    let currentSectionId = 'home';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 120;
      const sectionHeight = sec.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSectionId) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Overlay Toggle
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  mobileToggleBtn.addEventListener('click', () => {
    mobileToggleBtn.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggleBtn.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  // ==========================================================================
  // 4. INTEGRATED NAVBAR ACCENT CUSTOMIZER
  // ==========================================================================
  const colorPresetBtns = document.querySelectorAll('.nav-color-dot');

  // Handle Preset Colors Click
  colorPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const themeName = btn.getAttribute('data-color');
      
      // Update active styling on dots
      colorPresetBtns.forEach(b => {
        b.classList.remove('active');
        if (b.getAttribute('data-color') === themeName) {
          b.classList.add('active');
        }
      });
      
      state.accentColor = themeName;
      
      // Update data attribute on root HTML
      document.documentElement.setAttribute('data-theme', themeName);
      
      // Update theme CSS styling variables
      const r = colorThemes[themeName].r;
      const g = colorThemes[themeName].g;
      const b = colorThemes[themeName].b;
      document.documentElement.style.setProperty('--accent', `rgb(${r}, ${g}, ${b})`);
      document.documentElement.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
      document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.12)`);
      document.documentElement.style.setProperty('--accent-glow-strong', `rgba(${r}, ${g}, ${b}, 0.3)`);
    });
  });

  // ==========================================================================
  // 5. CARD RADIAL GLOW TRACKING EFFECT
  // ==========================================================================
  const glassCards = document.querySelectorAll('.glass-card');
  
  glassCards.forEach(card => {
    const glow = card.querySelector('.glass-card-glow');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (glow) {
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
      }
    });
  });

  // ==========================================================================
  // 6. HERO TYPEWRITER EFFECT
  // ==========================================================================
  const typewriterTarget = document.getElementById('typewriter-text');
  const phrases = [
    "interactive web interfaces.",
    "creative video edits.",
    "engaging digital content.",
    "smart IoT systems."
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    const currentPhrase = phrases[phraseIdx];
    
    if (isDeleting) {
      typewriterTarget.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40; 
    } else {
      typewriterTarget.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 80; 
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 2000; 
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400; 
    }

    setTimeout(typeEffect, typingSpeed);
  }

  if (typewriterTarget) {
    typeEffect();
  }

  // ==========================================================================
  // 7. INTERSECTION OBSERVER FOR SCROLL REVEALS
  // ==========================================================================
  const scrollReveals = document.querySelectorAll('.scroll-reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  scrollReveals.forEach(el => revealObserver.observe(el));

  // ==========================================================================
  // 8. CONTACT FORM VALIDATION & DYNAMICS
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const successOverlay = document.getElementById('form-success-overlay');
  const successCloseBtn = document.getElementById('success-close-btn');

  const formName = document.getElementById('form-name');
  const formEmail = document.getElementById('form-email');
  const formMessage = document.getElementById('form-message');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validateInput(input, condition) {
    const parentGroup = input.parentElement;
    if (condition) {
      parentGroup.classList.remove('error');
      return true;
    } else {
      parentGroup.classList.add('error');
      return false;
    }
  }

  [formName, formEmail, formMessage].forEach(input => {
    input.addEventListener('input', () => {
      input.parentElement.classList.remove('error');
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isNameValid = validateInput(formName, formName.value.trim() !== '');
    const isEmailValid = validateInput(formEmail, validateEmail(formEmail.value.trim()));
    const isMsgValid = validateInput(formMessage, formMessage.value.trim() !== '');

    if (isNameValid && isEmailValid && isMsgValid) {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const submitBtnSpan = submitBtn.querySelector('span');
      const submitBtnIcon = submitBtn.querySelector('i');
      
      submitBtn.disabled = true;
      submitBtnSpan.textContent = 'Sending...';
      submitBtnIcon.className = 'fa-solid fa-spinner fa-spin';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtnSpan.textContent = 'Send Message';
        submitBtnIcon.className = 'fa-solid fa-paper-plane';
        successOverlay.classList.add('active');
      }, 1200);
    }
  });

  successCloseBtn.addEventListener('click', () => {
    contactForm.reset();
    successOverlay.classList.remove('active');
  });

  // Back to top button visibility
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'auto';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
    }
  });

});