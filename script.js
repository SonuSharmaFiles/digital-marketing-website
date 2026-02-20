/* ============================================
   APEX GROWTH — INTERACTIVE SCRIPTS
   Scroll Animations | Counters | Nav | Form Validation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll-triggered reveal animations ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — keeps animation state
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });


  // ── Animated number counters ──
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.animated) return;
        el.dataset.animated = 'true';

        const target = parseInt(el.dataset.count);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);

          el.textContent = prefix + current.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = prefix + target.toLocaleString() + suffix;
          }
        };

        requestAnimationFrame(animate);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });


  // ── Navigation scroll effect ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }


  // ── Mobile nav toggle ──
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  // ── Active nav link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });


  // ── FAQ Accordion ──
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all FAQ items
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });


  // ── Form validation (booking page) ──
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      bookingForm.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });

      // Validate required fields
      const requiredFields = bookingForm.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        const group = field.closest('.form-group');
        if (!field.value.trim()) {
          group.classList.add('error');
          isValid = false;
        }
      });

      // Validate email
      const emailField = bookingForm.querySelector('[type="email"]');
      if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          emailField.closest('.form-group').classList.add('error');
          isValid = false;
        }
      }

      // Validate URL
      const urlField = bookingForm.querySelector('[type="url"]');
      if (urlField && urlField.value) {
        try {
          new URL(urlField.value);
        } catch {
          urlField.closest('.form-group').classList.add('error');
          isValid = false;
        }
      }

      if (isValid) {
        // Show success state
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '✓ Request Sent Successfully';
        submitBtn.style.background = 'linear-gradient(135deg, #34D399, #059669)';
        submitBtn.disabled = true;

        // Reset after 3 seconds (in production, this would redirect)
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          bookingForm.reset();
        }, 3000);
      }
    });
  }


  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ── Plan selection modal ──
  const planModal = document.getElementById('planModal');
  const planModalClose = document.getElementById('planModalClose');
  const planModalName = document.getElementById('planModalName');
  const planModalPrice = document.getElementById('planModalPrice');
  const planEmail = document.getElementById('planEmail');
  const planSubmitBtn = document.getElementById('planSubmitBtn');

  if (planModal) {
    // Open modal when Choose Plan is clicked
    document.querySelectorAll('.choose-plan-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const planName = btn.dataset.plan;
        const planPrice = btn.dataset.price;
        planModalName.textContent = planName;
        planModalPrice.textContent = 'Starting at ' + planPrice;
        planModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Reset form state
        if (planEmail) planEmail.value = '';
        if (planSubmitBtn) {
          planSubmitBtn.innerHTML = 'Confirm & Get Started <span class="btn__arrow">→</span>';
          planSubmitBtn.style.background = '';
          planSubmitBtn.disabled = false;
        }
      });
    });

    // Close modal
    const closeModal = () => {
      planModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    planModalClose.addEventListener('click', closeModal);
    planModal.addEventListener('click', (e) => {
      if (e.target === planModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && planModal.classList.contains('active')) closeModal();
    });

    // Submit handler
    if (planSubmitBtn) {
      planSubmitBtn.addEventListener('click', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!planEmail.value || !emailRegex.test(planEmail.value)) {
          planEmail.style.borderColor = 'var(--clr-error)';
          planEmail.focus();
          setTimeout(() => { planEmail.style.borderColor = ''; }, 2000);
          return;
        }

        planSubmitBtn.innerHTML = "✓ Confirmed — We'll Be In Touch!";
        planSubmitBtn.style.background = 'linear-gradient(135deg, #34D399, #059669)';
        planSubmitBtn.disabled = true;

        setTimeout(closeModal, 2500);
      });
    }
  }

});
