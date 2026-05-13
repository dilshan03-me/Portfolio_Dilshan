/* ==========================================================
   P J DILSHAN SAMEERA — PORTFOLIO SCRIPT
   ES6+ | No dependencies | Zero console errors
   ========================================================== */

'use strict';

/* ----------------------------------------------------------
   UTILITY: Query helpers
   ---------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ==========================================================
   1. DARK / LIGHT MODE TOGGLE
   Fixes the two-tone background issue by always setting
   data-theme on <html> and persisting the preference.
   ========================================================== */
(() => {
  const html        = document.documentElement;
  const themeToggle = $('#themeToggle');
  if (!themeToggle) return;

  // Restore saved preference (default: dark)
  const saved = localStorage.getItem('ds-theme') ?? 'dark';
  html.setAttribute('data-theme', saved);

  const applyTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    // Ensure body background syncs instantly (fixes two-tone flash)
    document.body.style.backgroundColor = '';
    localStorage.setItem('ds-theme', theme);
  };

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
})();


/* ==========================================================
   2. NAVBAR — scroll shadow + active link highlight
   ========================================================== */
(() => {
  const navbar    = $('#navbar');
  const navLinks  = $$('.nav-link');
  const sections  = $$('section[id]');
  if (!navbar) return;

  // Add/remove .scrolled class for nav shadow
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Highlight the nav link whose section is in view
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ==========================================================
   3. MOBILE HAMBURGER MENU
   ========================================================== */
(() => {
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ==========================================================
   4. LOGIN MODAL
   Show on #loginBtn click, hide on #modalClose or overlay click.
   ========================================================== */
(() => {
  const loginBtn   = $('#loginBtn');
  const loginModal = $('#loginModal');
  const modalClose = $('#modalClose');
  const loginForm  = $('#loginForm');
  const loginNote  = $('#loginNote');
  if (!loginBtn || !loginModal) return;

  const openModal = () => {
    loginModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Focus first input for accessibility
    setTimeout(() => $('#loginEmail', loginModal)?.focus(), 50);
  };

  const closeModal = () => {
    loginModal.classList.remove('open');
    document.body.style.overflow = '';
    if (loginNote) loginNote.textContent = '';
  };

  loginBtn.addEventListener('click', openModal);
  modalClose?.addEventListener('click', closeModal);

  // Close on backdrop click (but not on the modal box itself)
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal.classList.contains('open')) closeModal();
  });

  // Basic form demo handler (swap with real auth as needed)
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email    = $('#loginEmail')?.value.trim();
    const password = $('#loginPassword')?.value;

    if (!email || !password) {
      loginNote.textContent = 'Please fill in all fields.';
      loginNote.style.color = 'var(--text-muted)';
      return;
    }

    loginNote.textContent = 'Signing you in…';
    loginNote.style.color = 'var(--green)';

    // Simulate async login — replace with real fetch() call
    setTimeout(() => {
      loginNote.textContent = '✓ Logged in successfully!';
      setTimeout(closeModal, 800);
    }, 1200);
  });
})();


/* ==========================================================
   5. SEARCH — keyword search + smooth scroll to section
   ========================================================== */
(() => {
  const searchToggle = $('#searchToggle');
  const searchWrap   = $('#searchWrap');
  const searchPanel  = $('#searchPanel');
  const searchInput  = $('#searchInput');
  const searchResults= $('#searchResults');
  if (!searchToggle || !searchInput) return;

  // Searchable targets: sections with an id + heading text
  const buildIndex = () => {
    return $$('section[id]').map(sec => {
      const heading = $('h1,h2,h3', sec)?.textContent.trim() ?? '';
      const label   = sec.getAttribute('id');
      return { id: label, heading: heading || label, el: sec };
    });
  };

  const index = buildIndex();

  // Toggle search panel
  searchToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = searchWrap.classList.toggle('active');
    if (isOpen) {
      searchInput.focus();
    } else {
      searchInput.value = '';
      searchResults.innerHTML = '';
    }
  });

  // Close panel when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (!searchWrap.contains(e.target)) {
      searchWrap.classList.remove('active');
      searchInput.value = '';
      searchResults.innerHTML = '';
    }
  });

  // Live search as user types
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';

    if (!query) return;

    const matches = index.filter(item =>
      item.heading.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      searchResults.innerHTML = `<div class="search-no-result">No results found.</div>`;
      return;
    }

    matches.forEach(item => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.textContent = item.heading;
      div.setAttribute('role', 'button');
      div.setAttribute('tabindex', '0');

      const goTo = () => {
        // Close the panel
        searchWrap.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';

        // Smooth scroll to section (offset for fixed nav)
        const navHeight = $('#navbar')?.offsetHeight ?? 64;
        const top = item.el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });

        // Brief highlight flash
        item.el.style.outline = '2px solid var(--accent)';
        item.el.style.outlineOffset = '4px';
        setTimeout(() => {
          item.el.style.outline = '';
          item.el.style.outlineOffset = '';
        }, 1500);
      };

      div.addEventListener('click', goTo);
      div.addEventListener('keydown', (e) => { if (e.key === 'Enter') goTo(); });
      searchResults.appendChild(div);
    });
  });

  // Allow Enter on the input to jump to the first result
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const first = $('.search-result-item', searchResults);
      first?.click();
    }
    if (e.key === 'Escape') {
      searchWrap.classList.remove('active');
      searchInput.value = '';
      searchResults.innerHTML = '';
    }
  });
})();


/* ==========================================================
   6. AI CHATBOT TOGGLE
   Opens / closes the chat window via the floating FAB.
   ========================================================== */
(() => {
  const chatFab     = $('#chatFab');
  const chatWindow  = $('#chatWindow');
  const chatClose   = $('#chatClose');
  const chatInput   = $('#chatInput');
  const chatSend    = $('#chatSend');
  const chatMessages= $('#chatMessages');
  if (!chatFab || !chatWindow) return;

  // --- Open / Close ---
  const openChat = () => {
    chatWindow.classList.add('open');
    chatFab.setAttribute('aria-expanded', 'true');
    setTimeout(() => chatInput?.focus(), 100);
  };

  const closeChat = () => {
    chatWindow.classList.remove('open');
    chatFab.setAttribute('aria-expanded', 'false');
  };

  chatFab.addEventListener('click', () => {
    chatWindow.classList.contains('open') ? closeChat() : openChat();
  });

  chatClose?.addEventListener('click', closeChat);

  // Close on Escape when focused inside the chat
  chatWindow.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeChat();
  });

  // --- Message helpers ---
  const scrollToBottom = () => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const appendMessage = (text, type = 'bot') => {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'chat-msg-avatar';
    avatar.textContent = type === 'bot' ? '🤖' : '👤';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;

    msg.append(avatar, bubble);
    chatMessages.appendChild(msg);
    scrollToBottom();
  };

  const showTyping = () => {
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot';
    typing.id = 'typingIndicator';
    typing.innerHTML = `
      <div class="chat-msg-avatar">🤖</div>
      <div class="chat-typing">
        <span></span><span></span><span></span>
      </div>`;
    chatMessages.appendChild(typing);
    scrollToBottom();
  };

  const removeTyping = () => {
    $('#typingIndicator', chatMessages)?.remove();
  };

  // --- Simple keyword-based bot replies ---
  const botReply = (input) => {
    const q = input.toLowerCase();
    if (q.match(/skill|tech|stack|language|tool/))
      return "Dilshan specialises in Cyber Security, Full-Stack Web Development (HTML/CSS/JS, Python), and Graphic Design. He's also skilled in network security and UI/UX.";
    if (q.match(/project|work|portfolio/))
      return "Check out his featured projects in the Projects section above — including festivalcards.online. More exciting projects are on the way!";
    if (q.match(/contact|email|hire|freelanc/))
      return "You can reach Dilshan via the Contact section of this page, or drop a WhatsApp message using the green button on the bottom-left.";
    if (q.match(/about|who|background|study/))
      return "Dilshan is a Cyber Security undergraduate at ICBT Campus, Colombo, Sri Lanka. He's also a Full-Stack Developer and Graphic Designer with 1.5+ years of experience.";
    if (q.match(/hello|hi|hey|greet/))
      return "Hey there! 👋 I'm DS Assistant. Ask me anything about Dilshan's skills, projects, or how to get in touch!";
    if (q.match(/price|cost|rate|charge/))
      return "Pricing depends on the project scope. Head to the Contact section and Dilshan will be happy to discuss rates with you!";
    return "Great question! For detailed answers, feel free to use the Contact section or WhatsApp. Dilshan typically replies within 24 hours. 😊";
  };

  // --- Send message ---
  const sendMessage = () => {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';
    chatSend.disabled = true;

    showTyping();
    // Simulate bot thinking delay
    setTimeout(() => {
      removeTyping();
      appendMessage(botReply(text), 'bot');
      chatSend.disabled = false;
    }, 900 + Math.random() * 400);
  };

  chatSend?.addEventListener('click', sendMessage);
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();


/* ==========================================================
   7. BACK TO TOP BUTTON
   ========================================================== */
(() => {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ==========================================================
   8. FOOTER — dynamic copyright year
   ========================================================== */
(() => {
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


/* ==========================================================
   9. FOOTER MAP — lazy-load iframe on viewport entry
   Ensures the Google Maps embed loads cleanly without
   blocking page render.
   ========================================================== */
(() => {
  const mapFrame = $('.footer-map-frame iframe');
  if (!mapFrame) return;

  // Store the real src and defer it until the map is near the viewport
  const realSrc = mapFrame.getAttribute('src');
  mapFrame.removeAttribute('src');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        mapFrame.setAttribute('src', realSrc);
        observer.disconnect();
      }
    });
  }, { rootMargin: '200px' });

  observer.observe(mapFrame);
})();


/* ==========================================================
   10. CONTACT FORM — basic validation + UX feedback
   ========================================================== */
(() => {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = $('[type="submit"]', form);
    const original  = submitBtn?.textContent;

    if (submitBtn) {
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
    }

    // Replace the timeout below with a real fetch() to your backend / Formspree
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.textContent = '✓ Message Sent!';
        setTimeout(() => {
          submitBtn.textContent = original;
          submitBtn.disabled = false;
          form.reset();
        }, 2500);
      }
    }, 1500);
  });
})();


/* ==========================================================
   11. SCROLL REVEAL — subtle fade-in for section cards
   Uses IntersectionObserver; no library needed.
   ========================================================== */
(() => {
  const targets = $$('.project-card, .about-grid, .contact-card, .stat');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
})();
