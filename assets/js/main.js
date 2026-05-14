/* ==========================================================================
   MAISON 360 — Main JS
   Animations, micro-interactions et orchestration premium
   ========================================================================== */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------- 1. Loader ---------- */
  function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('is-done'), 2000);
      setTimeout(() => loader.remove(), 3200);
    });
  }

  /* ---------- 2. Smooth scroll (Lenis) ---------- */
  let lenis = null;
  function initLenis() {
    if (prefersReducedMotion || typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    if (typeof gsap !== 'undefined' && gsap.ticker) {
      lenis.on('scroll', () => { if (gsap.plugins && gsap.plugins.ScrollTrigger) ScrollTrigger.update(); });
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------- 3. Cursor custom ---------- */
  function initCursor() {
    if (isTouch || prefersReducedMotion) return;
    const aura = document.createElement('div'); aura.className = 'cursor-aura';
    const dot = document.createElement('div'); dot.className = 'cursor-dot';
    document.body.append(aura, dot);

    let mx = 0, my = 0, ax = 0, ay = 0;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`; });
    const animate = () => {
      ax += (mx - ax) * 0.15;
      ay += (my - ay) * 0.15;
      aura.style.transform = `translate(${ax}px, ${ay}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };
    animate();

    document.querySelectorAll('a, button, [data-hover], .pillar, .work-card, .formula, .gallery-item, .discipline-card, .option-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    document.querySelectorAll('input, textarea, [contenteditable]').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
    });
  }

  /* ---------- 4. Navigation condense au scroll ---------- */
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('is-condensed', y > 40);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const burger = document.querySelector('.nav__burger');
    const menu = document.querySelector('.mobile-menu');
    if (burger && menu) {
      burger.addEventListener('click', () => {
        menu.classList.toggle('is-open');
        document.body.style.overflow = menu.classList.contains('is-open') ? 'hidden' : '';
      });
      menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        menu.classList.remove('is-open');
        document.body.style.overflow = '';
      }));
    }
  }

  /* ---------- 5. Reveal on scroll ---------- */
  function initReveals() {
    const els = document.querySelectorAll('[data-reveal], [data-reveal-mask]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('is-visible'), parseInt(delay, 10));
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '-10% 0% -10% 0%', threshold: 0.1 });
    els.forEach(el => io.observe(el));
  }

  /* ---------- 6. Magnetic buttons ---------- */
  function initMagnetic() {
    if (isTouch) return;
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- 7. Counter ---------- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const ease = 1 - Math.pow(1 - t, 3);
          const value = target * ease;
          el.textContent = (target % 1 === 0 ? Math.floor(value) : value.toFixed(1)) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
  }

  /* ---------- 8. Parallax simple ---------- */
  function initParallax() {
    if (prefersReducedMotion) return;
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    const onScroll = () => {
      els.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const offset = (window.innerHeight / 2 - center) * speed;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 9. Hero canvas (subtle particles) ---------- */
  function initHeroCanvas() {
    if (prefersReducedMotion) return;
    const canvas = document.querySelector('#hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w, h;
    const resize = () => {
      w = canvas.width = canvas.offsetWidth * DPR;
      h = canvas.height = canvas.offsetHeight * DPR;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.2,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      a: Math.random() * 0.4 + 0.15,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * DPR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 97, ${p.a})`;
        ctx.fill();
      });
      // Connect close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120 * DPR) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 169, 97, ${(1 - d / (120 * DPR)) * 0.08})`;
            ctx.lineWidth = 0.5 * DPR;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* ---------- 10. Gallery filter ---------- */
  function initGalleryFilter() {
    const filters = document.querySelectorAll('.gallery-filter');
    const items = document.querySelectorAll('.gallery-item');
    if (!filters.length) return;
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.dataset.filter;
        items.forEach(item => {
          const show = cat === 'all' || item.dataset.cat === cat;
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.display = show ? '' : 'none';
            requestAnimationFrame(() => { item.style.opacity = '1'; });
          }, 200);
        });
      });
    });
  }

  /* ---------- 11. FAQ open one ---------- */
  function initFaq() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) items.forEach(i => { if (i !== item) i.removeAttribute('open'); });
      });
    });
  }

  /* ---------- 12. Booking wizard ---------- */
  function initWizard() {
    const wizard = document.querySelector('.wizard');
    if (!wizard) return;

    const state = {
      step: 1,
      discipline: null,
      space: null,
      date: null,
      slots: [],
      options: {},
      hourlyRate: 0,
    };

    const stepDots = wizard.querySelectorAll('.wizard__step-dot');
    const panels = wizard.querySelectorAll('.wizard__panel');
    const stepLabel = wizard.querySelector('#wizardStepLabel');
    const stepNum = wizard.querySelector('#wizardStepNum');

    const setStep = (n) => {
      state.step = n;
      stepDots.forEach((d, i) => d.classList.toggle('is-active', i < n));
      panels.forEach((p, i) => p.classList.toggle('is-active', i === n - 1));
      const labels = ['Discipline', 'Espace & créneau', 'Options', 'Identité & acompte', 'Confirmation'];
      if (stepLabel) stepLabel.textContent = labels[n - 1];
      if (stepNum) stepNum.textContent = `0${n} / 05`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Discipline cards
    const disciplineCards = wizard.querySelectorAll('.discipline-card');
    disciplineCards.forEach(card => {
      card.addEventListener('click', () => {
        disciplineCards.forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        state.discipline = card.dataset.discipline;
        state.hourlyRate = parseInt(card.dataset.rate, 10);
        renderRecap();
        setTimeout(() => setStep(2), 400);
      });
    });

    // Calendar (simple)
    const calendar = wizard.querySelector('#calendar');
    if (calendar) {
      const today = new Date();
      const month = today.getMonth();
      const year = today.getFullYear();
      renderCalendar(calendar, year, month);
      calendar.addEventListener('click', (e) => {
        const day = e.target.closest('.cal-day');
        if (!day || day.classList.contains('is-disabled')) return;
        calendar.querySelectorAll('.cal-day').forEach(d => d.classList.remove('is-selected'));
        day.classList.add('is-selected');
        state.date = day.dataset.date;
        renderSlots(wizard);
      });
    }

    // Options
    const optionCards = wizard.querySelectorAll('.option-card');
    optionCards.forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('is-selected');
        const key = card.dataset.key;
        const price = parseInt(card.dataset.price, 10);
        if (card.classList.contains('is-selected')) state.options[key] = { label: card.dataset.label, price };
        else delete state.options[key];
        renderRecap();
      });
    });

    // Buttons next/prev
    wizard.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => setStep(state.step + 1)));
    wizard.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => setStep(state.step - 1)));

    // Final
    const finalBtn = wizard.querySelector('#finalSubmit');
    if (finalBtn) {
      finalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        wizard.querySelector('.wizard__steps').innerHTML = `
          <div style="text-align:center; padding: 120px 0;" data-reveal-mask>
            <div>
              <p class="eyebrow" style="justify-content:center; margin: 0 auto 32px;">Confirmation</p>
              <h2 class="display text-display-md">Votre session est <em>réservée</em></h2>
              <p class="lede" style="margin-top: 24px;">Un email avec votre ticket digital vient d'être envoyé. Rendez-vous à Villabé.</p>
              <a href="index.html" class="btn" style="margin-top: 48px;">Retour à l'accueil</a>
            </div>
          </div>
        `;
        wizard.querySelector('.wizard__steps').querySelectorAll('[data-reveal-mask]').forEach(el => el.classList.add('is-visible'));
      });
    }

    function renderRecap() {
      const recap = wizard.querySelector('#recap');
      if (!recap) return;
      const optionsTotal = Object.values(state.options).reduce((s, o) => s + o.price, 0);
      const sessionHours = state.slots.length || 2;
      const subtotal = state.hourlyRate * sessionHours + optionsTotal;
      const deposit = Math.round(subtotal * 0.3);

      recap.innerHTML = `
        <p class="recap__title">Récapitulatif</p>
        <div class="recap__line"><span>Discipline</span><span>${state.discipline || '—'}</span></div>
        <div class="recap__line"><span>Date</span><span>${state.date || '—'}</span></div>
        <div class="recap__line"><span>Durée</span><span>${sessionHours}h</span></div>
        <div class="recap__line"><span>Tarif horaire</span><span>${state.hourlyRate ? state.hourlyRate + ' €' : '—'}</span></div>
        ${Object.values(state.options).map(o => `<div class="recap__line"><span>${o.label}</span><span>+ ${o.price} €</span></div>`).join('')}
        <div class="recap__total"><span>Total</span><span>${subtotal} €</span></div>
        <div class="recap__deposit">Acompte 30 % aujourd'hui — ${deposit} €<br/>Solde prélevé J-2.</div>
      `;
    }

    function renderCalendar(el, year, month) {
      const monthsFR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
      let html = `<div class="cal-head"><span>${monthsFR[month]} ${year}</span></div>`;
      html += '<div class="cal-grid">';
      ['L','M','M','J','V','S','D'].forEach(d => html += `<div class="cal-dow">${d}</div>`);
      for (let i = 0; i < firstDay; i++) html += '<div></div>';
      const todayN = new Date(); todayN.setHours(0,0,0,0);
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const isPast = date < todayN;
        const isWeekend = date.getDay() === 0;
        const status = isPast || isWeekend ? 'is-disabled' : Math.random() > 0.5 ? '' : 'is-partial';
        const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        html += `<button class="cal-day ${status}" data-date="${iso}">${d}<span class="cal-dot"></span></button>`;
      }
      html += '</div>';
      html += `<div class="cal-legend">
        <span><i class="dot dot--g"></i> Disponible</span>
        <span><i class="dot dot--p"></i> Partiel</span>
        <span><i class="dot dot--d"></i> Complet</span>
      </div>`;
      el.innerHTML = html;
    }

    function renderSlots(wizard) {
      const slotsEl = wizard.querySelector('#slots');
      if (!slotsEl) return;
      const hours = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];
      slotsEl.innerHTML = hours.map(h => {
        const avail = Math.random() > 0.4;
        return `<button class="slot ${avail ? '' : 'is-disabled'}" data-time="${h}">${h}</button>`;
      }).join('');
      slotsEl.querySelectorAll('.slot').forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.classList.contains('is-disabled')) return;
          btn.classList.toggle('is-selected');
          const selected = Array.from(slotsEl.querySelectorAll('.slot.is-selected')).map(s => s.dataset.time);
          state.slots = selected;
          renderRecap();
        });
      });
    }

    setStep(1);
    renderRecap();
  }

  /* ---------- 13. SplitText reveal (lightweight) ---------- */
  function initSplitReveal() {
    if (prefersReducedMotion) return;
    const els = document.querySelectorAll('[data-split]');
    els.forEach(el => {
      const text = el.textContent;
      el.innerHTML = '';
      text.split(' ').forEach((word, i) => {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.overflow = 'hidden';
        span.style.verticalAlign = 'top';
        const inner = document.createElement('span');
        inner.style.display = 'inline-block';
        inner.style.transform = 'translateY(110%)';
        inner.style.transition = `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`;
        inner.textContent = word + (i < text.split(' ').length - 1 ? ' ' : '');
        span.appendChild(inner);
        el.appendChild(span);
      });
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            el.querySelectorAll('span span').forEach(s => s.style.transform = 'translateY(0)');
            io.unobserve(el);
          }
        });
      }, { threshold: 0.1 });
      io.observe(el);
    });
  }

  /* ---------- Bootstrap ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initLenis();
    initCursor();
    initNav();
    initReveals();
    initMagnetic();
    initCounters();
    initParallax();
    initHeroCanvas();
    initGalleryFilter();
    initFaq();
    initWizard();
    initSplitReveal();
  });
})();
