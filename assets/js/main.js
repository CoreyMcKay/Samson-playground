/* PLAYER ONE — interactions */
(function () {
  'use strict';

  /* ── Theme toggle (Player 2 mode) ── */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  try {
    const saved = localStorage.getItem('player-one-theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (e) { /* private mode etc. */ }
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('player-one-theme', next); } catch (e) {}
    toast(next === 'dark' ? 'PLAYER 2 HAS ENTERED THE GAME' : 'BACK TO PLAYER 1');
  });

  /* ── Mobile menu ── */
  const hamburger = document.getElementById('hamburger');
  const menuLinks = document.querySelector('.menu-links');
  hamburger.addEventListener('click', () => menuLinks.classList.toggle('open'));
  menuLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => menuLinks.classList.remove('open'))
  );

  /* ── Toast ── */
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  /* ── GSAP reveals ── */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.gsap && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);
    // Hero entrance
    gsap.from('.hero-inner .reveal', {
      y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(1.6)', delay: 0.15,
      onComplete: () => document.querySelectorAll('.hero-inner .reveal').forEach(el => el.style.opacity = 1)
    });
    // Section reveals
    document.querySelectorAll('main .reveal, footer .reveal').forEach(el => {
      gsap.fromTo(el, { y: 44, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
  } else {
    // No animation: just show everything
    document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; });
  }

  /* ── Stat bars fill on scroll ── */
  const statBars = document.querySelectorAll('.stat .bar i');
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = getComputedStyle(e.target).getPropertyValue('--v');
        barObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  statBars.forEach(b => barObserver.observe(b));

  /* ── Cartridge 3D tilt ── */
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ── Fake terminal ── */
  const screen = document.getElementById('termScreen');
  const input = document.getElementById('termInput');

  function print(html, cls) {
    const div = document.createElement('div');
    if (cls) div.className = cls;
    div.innerHTML = html;
    screen.appendChild(div);
    screen.scrollTop = screen.scrollHeight;
  }

  const COMMANDS = {
    help: () =>
      'available commands:\n' +
      '  <span class="cmd">whoami</span>      who is this guy\n' +
      '  <span class="cmd">projects</span>    list the cartridges\n' +
      '  <span class="cmd">skills</span>      character stats\n' +
      '  <span class="cmd">contact</span>     how to reach player one\n' +
      '  <span class="cmd">konami</span>      ???\n' +
      '  <span class="cmd">clear</span>       wipe the screen',
    whoami: () =>
      'corey mckay — cybersecurity pro, navy veteran.\n' +
      '9+ years: soc ops → detection engineering → solution architecture.\n' +
      'solution architect for cortex @ palo alto networks.\n' +
      'bs cybersecurity technologies (umgc); ms cs in progress.',
    projects: () =>
      'cartridges inserted:\n' +
      '  <span class="cmd">hound</span>       verified sports models\n' +
      '  <span class="cmd">orcaatlas</span>   global orca tracking (on the shelf)\n' +
      '  <span class="cmd">detections</span>  snort/suricata, detection-as-code\n' +
      '  <span class="cmd">soar</span>        splunk soar playbooks',
    skills: () =>
      'splunk/soar ██████████  threat hunting ████████░░\n' +
      'snort/suricata █████████░  python/bash ████████░░\n' +
      'xsiam/xdr █████████░  cloud security ███████░░░',
    contact: () =>
      'best reached via github:\n  <span class="cmd">https://github.com/CoreyMcKay</span>',
    konami: () =>
      '<span class="warn">press these keys in order, anywhere on the page (not as a typed command):</span>\n' +
      '<span class="cmd">↑ ↑ ↓ ↓ ← → ← → B A</span>',
    sudo: () => '<span class="warn">nice try.</span>',
  };

  print('player-one shell v1.0 — type <span class="cmd">help</span> to begin', 'dim');

  function run(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    print('<span class="cmd">▸ ' + cmdRaw.replace(/</g, '&lt;') + '</span>');
    if (!cmd) return;
    if (cmd === 'clear') { screen.innerHTML = ''; return; }
    const fn = COMMANDS[cmd];
    print(fn ? fn().replace(/\n/g, '<br>') : `<span class="warn">command not found: ${cmd.replace(/</g, '&lt;')} — try help</span>`);
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
  });
  // Clicking the terminal focuses the input
  document.querySelector('.terminal').addEventListener('click', () => input.focus());

  /* ── Konami code easter egg ── */
  const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let progress = 0;
  let unlocked = false;

  function confetti() {
    for (let i = 0; i < 60; i++) {
      const c = document.createElement('div');
      const colors = ['#e60012', '#ffd23f', '#37d67a', '#6ab4ff', '#b388ff'];
      c.style.cssText = `position:fixed;z-index:300;top:-20px;left:${Math.random() * 100}vw;` +
        `width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;border-radius:${Math.random() > 0.5 ? '50%' : '2px'};` +
        `background:${colors[i % colors.length]};pointer-events:none;`;
      document.body.appendChild(c);
      const fall = c.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${innerHeight + 60}px) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0.6 }
      ], { duration: 2200 + Math.random() * 1800, easing: 'cubic-bezier(.2,.6,.4,1)' });
      fall.onfinish = () => c.remove();
    }
  }

  document.addEventListener('keydown', e => {
    // Don't hijack typing in the terminal input (except it's fine — keys still count, that's fun)
    const key = e.key.toLowerCase();
    if (key === KONAMI[progress]) {
      progress++;
      if (progress === KONAMI.length) {
        progress = 0;
        if (!unlocked) {
          unlocked = true;
          confetti();
          toast('CHEAT ACTIVATED: +30 LIVES ★');
          print('konami accepted. <span class="cmd">+30 lives.</span> use them wisely.', 'warn');
        } else {
          toast('ALREADY AT MAX LIVES ★');
        }
      }
    } else {
      progress = key === KONAMI[0] ? 1 : 0;
    }
  });

  /* ── Now status clock (footer flavor) ── */
  // (reserved for future widget)
})();
