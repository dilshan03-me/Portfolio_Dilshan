/* ==========================================================
   P J DILSHAN SAMEERA — PORTFOLIO SCRIPT
   Features:
     1. Dark / Light theme toggle (persisted in localStorage)
     2. Mobile hamburger menu
     3. Navbar scroll shadow
     4. Active nav link on scroll (IntersectionObserver)
     5. Back-to-top button
     6. Scroll-reveal animations
     7. Contact form validation & feedback
     8. Footer copyright year
   ========================================================== */

'use strict';

/* ----------------------------------------------------------
   1. THEME TOGGLE
   ---------------------------------------------------------- */
const themeToggle = document.getElementById('themeToggle');
const html        = document.documentElement;

// Load saved preference (default: dark)
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});


/* ----------------------------------------------------------
   2. MOBILE HAMBURGER MENU
   ---------------------------------------------------------- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  hamburger.classList.toggle('active', isOpen);
});

// Close menu when any nav link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Close menu on outside click
document.addEventListener('click', e => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  }
});


/* ----------------------------------------------------------
   3. NAVBAR SCROLL SHADOW
   ---------------------------------------------------------- */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });


/* ----------------------------------------------------------
   4. ACTIVE NAV LINK ON SCROLL
   ---------------------------------------------------------- */
const sections  = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, {
  rootMargin: '-50% 0px -50% 0px', // trigger when section is in the middle viewport
  threshold: 0
});

sections.forEach(sec => sectionObserver.observe(sec));


/* ----------------------------------------------------------
   5. BACK-TO-TOP BUTTON
   ---------------------------------------------------------- */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ----------------------------------------------------------
   6. SCROLL-REVEAL ANIMATIONS
   ---------------------------------------------------------- */

// Add .reveal class to elements we want to animate in
const revealSelectors = [
  '.about-text',
  '.about-skills',
  '.project-card',
  '.project-featured',
  '.contact-info',
  '.contact-form',
  '.section-label',
  '.section-title',
  '.skill-category',
];

revealSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.classList.add('reveal');
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target); // animate once
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ----------------------------------------------------------
   7. CONTACT FORM VALIDATION & FEEDBACK
   ---------------------------------------------------------- */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name    = contactForm.querySelector('#fname').value.trim();
    const email   = contactForm.querySelector('#femail').value.trim();
    const message = contactForm.querySelector('#fmessage').value.trim();

    // Basic validation
    if (!name) {
      showFormNote('Please enter your name.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormNote('Please enter a valid email address.', 'error');
      return;
    }

    if (!message) {
      showFormNote('Please write a message before sending.', 'error');
      return;
    }

    // Simulate submission (replace with real fetch/API call as needed)
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      showFormNote('✓ Message sent! I\'ll get back to you soon.', 'success');
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Send Message
      `;
    }, 1200);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormNote(msg, type) {
  formNote.textContent = msg;
  formNote.style.color = type === 'error'
    ? 'var(--text-secondary)'
    : 'var(--green)';

  // Clear after 5 seconds
  clearTimeout(formNote._timer);
  formNote._timer = setTimeout(() => {
    formNote.textContent = '';
  }, 5000);
}


/* ----------------------------------------------------------
   8. FOOTER COPYRIGHT YEAR
   ---------------------------------------------------------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
