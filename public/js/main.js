(() => {
  const { bio, facts, services, skills, projects } = window.SITE;
  const $ = (id) => document.getElementById(id);

  // Small DOM helper: el('li', {class:'x'}, child, 'text')
  function el(tag, attrs = {}, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === false || v == null) continue;
      if (k === 'text') n.textContent = v;
      else n.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach((c) => n.append(c));
    return n;
  }

  $('year').textContent = new Date().getFullYear();
  $('bioText').textContent = bio;
  facts.forEach(([k, v]) => $('facts').append(el('div', {}, el('dt', { text: k }), el('dd', { text: v }))));

  /* ---------- Navigation ---------- */
  const menuBtn = $('menuBtn'), navLinks = $('navLinks');
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a')) { navLinks.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  });
  const links = [...navLinks.querySelectorAll('a')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => {
          const on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('active', on);
          on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach((s) => io.observe(s));
  }

  /* ---------- Services Cards ---------- */
  const grid = $('svcGrid');
  grid.replaceChildren(...services.map((s) => {
    const card = el('article', { class: 'glass svc-card' });
    card.append(
      el('div', { class: 'svc-card-top' },
        el('span', { class: 'svc-icon', text: s.icon }),
        el('span', { class: 'svc-type badge ok', text: s.type })
      ),
      el('h3', { class: 'svc-title', text: s.title }),
      el('p', { class: 'svc-summary', text: s.summary }),
      el('ul', { class: 'svc-bullets' }, s.bullets.map((b) => el('li', { text: b }))),
      el('div', { class: 'svc-footer' },
        el('span', { class: 'svc-meta' }, el('strong', { text: `Turnaround: ${s.turnaround}` })),
        el('a', { class: 'btn btn-primary svc-cta', href: '#contact', text: 'Get a quote' })
      )
    );
    return card;
  }));

  /* ---------- Skills ---------- */
  let skillCat = 'All';
  const cats = ['All', ...new Set(skills.map((s) => s.category))];
  function renderSkills() {
    $('skillTabs').replaceChildren(...cats.map((c) =>
      el('button', { type: 'button', class: 'chip', 'aria-pressed': String(c === skillCat), 'data-cat': c, text: c })));
    $('skillGrid').replaceChildren(...skills.filter((s) => skillCat === 'All' || s.category === skillCat)
      .map((s) => el('li', { class: 'glass skill' }, el('strong', { text: s.name }), el('span', { text: s.category }))));
  }
  $('skillTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    skillCat = b.dataset.cat; renderSkills();
    $('skillTabs').querySelector(`[data-cat="${skillCat}"]`).focus();
  });
  renderSkills();

  /* ---------- Projects ---------- */
  const dlg = $('projectDialog');
  const tags = (p) => el('ul', { class: 'tags' }, p.technologies.map((t) => el('li', { text: t })));
  $('projectGrid').replaceChildren(...projects.map((p) => {
    const card = el('article', { class: 'glass project' });
    const cardTop = el('div', { class: 'project-card-top' },
      el('span', { class: 'badge open', text: p.status }),
      p.type ? el('span', { class: 'badge proj-type', text: p.type }) : ''
    );
    card.append(
      cardTop,
      el('h3', { text: p.title }),
      el('p', { text: p.description }),
      tags(p)
    );
    const actions = el('div', { class: 'project-actions' });
    if (p.liveUrl) actions.append(el('a', { class: 'btn btn-primary proj-btn', href: p.liveUrl, target: '_blank', rel: 'noopener', text: 'View Live' }));
    actions.append(el('button', { type: 'button', class: 'btn btn-ghost proj-btn', 'data-project': p.id, text: 'Details' }));
    card.append(actions);
    return card;
  }));

  let lastTrigger = null, mvLoaded = false;
  function loadModelViewer() {
    if (mvLoaded) return; mvLoaded = true;
    const s = el('script', { type: 'module', src: 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js' });
    document.head.append(s);
  }
  $('projectGrid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-project]'); if (!b) return;
    const p = projects.find((x) => x.id === b.dataset.project); if (!p) return;
    lastTrigger = b;
    const body = $('dlgBody');
    body.replaceChildren(
      el('h3', { id: 'dlgTitle', text: p.title }),
      el('p', { text: p.longDescription }),
      el('ul', { class: 'bullets' }, p.keyFeatures.map((f) => el('li', { text: f }))),
      tags(p));
    if (p.modelUrl) {
      loadModelViewer();
      const mv = document.createElement('model-viewer');
      mv.setAttribute('src', p.modelUrl);
      mv.setAttribute('alt', `3D model of ${p.title}`);
      mv.setAttribute('camera-controls', '');
      mv.setAttribute('ar', '');
      mv.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
      mv.className = 'viewer';
      body.append(mv);
    }
    const actions = el('div', { class: 'hero-actions' });
    if (p.liveUrl) actions.append(el('a', { class: 'btn btn-primary', href: p.liveUrl, target: '_blank', rel: 'noopener', text: 'Open live site' }));
    if (p.githubUrl) actions.append(el('a', { class: 'btn btn-ghost', href: p.githubUrl, target: '_blank', rel: 'noopener', text: 'View code' }));
    if (actions.children.length) body.append(actions);
    dlg.showModal();
  });
  $('dlgClose').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { $('dlgBody').replaceChildren(); if (lastTrigger) lastTrigger.focus(); });

  /* ---------- Contact form ---------- */
  const form = $('contactForm'), status = $('formStatus');
  const CONTACT_EMAIL = 'mavizm233@gmail.com';
  const mailtoFallback = (data) => {
    const subject = encodeURIComponent(`[Portfolio Contact] ${data.subject}`);
    const body = encodeURIComponent(`From: ${data.name} (${data.email})\n\n${data.message}`);
    const link = el('a', { href: `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, text: 'email me directly' });
    status.replaceChildren(document.createTextNode('Delivery failed. Please '), link, document.createTextNode(' instead.'));
  };
  const sendViaBrowserRelay = async (data) => {
    const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        _replyto: data.email,
        _subject: `[Portfolio Contact] ${data.subject}`,
        _template: 'table',
        _captcha: 'false'
      })
    });
    const out = await response.json().catch(() => ({}));
    return { ok: response.ok && (out.success || out.message), pending: /activat|confirm/i.test(`${out.message || ''} ${out.success || ''}`) };
  };
  const shakeForm = () => {
    form.classList.remove('shake');
    void form.offsetWidth;
    form.classList.add('shake');
  };
  const showPending = (data) => {
    status.className = 'pending';
    status.replaceChildren(document.createTextNode('Almost there: please also '), (() => {
      const subject = encodeURIComponent(`[Portfolio Contact] ${data.subject}`);
      const body = encodeURIComponent(`From: ${data.name} (${data.email})\n\n${data.message}`);
      return el('a', { href: `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, text: 'email me directly' });
    })(), document.createTextNode(' so I get your message right away.'));
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const bad = !data.name.trim() ? 'cName' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) ? 'cEmail'
      : !data.subject.trim() ? 'cSubject' : data.message.trim().length < 10 ? 'cMessage' : null;
    if (bad) {
      status.className = 'err';
      status.textContent = { cName: 'Enter your name.', cEmail: 'Enter a valid email address.', cSubject: 'Enter a subject.', cMessage: 'Write a message of at least 10 characters.' }[bad];
      $(bad).focus(); shakeForm(); return;
    }
    $('cSubmit').disabled = true; status.className = 'sending'; status.textContent = 'Sending…';
    let delivered = false;
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const out = await res.json();
      if (out.success && !out.pending) {
        status.className = 'ok'; status.textContent = out.message || 'Message sent.';
        form.reset(); delivered = true;
      } else if (out.pending) {
        showPending(data); delivered = true;
      }
    } catch { /* try the browser relay below */ }

    if (!delivered) {
      try {
        status.className = 'sending'; status.textContent = 'Trying backup delivery…';
        const relay = await sendViaBrowserRelay(data);
        if (relay.ok) {
          if (relay.pending) showPending(data);
          else { status.className = 'ok'; status.textContent = 'Your message has been sent to the email.'; form.reset(); }
          delivered = true;
        }
      } catch { /* fall through to mailto */ }
    }

    if (!delivered) {
      status.className = 'err'; status.textContent = '';
      mailtoFallback(data); shakeForm();
    }
    $('cSubmit').disabled = false;
  });

  /* ---------- Scroll reveal ---------- */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const targets = [...document.querySelectorAll('.hero > *, .section > h2, .section > .lead, .panel, .svc-card, .skill, .project')];
    targets.forEach((n) => n.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in-view');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((n) => io.observe(n));
  }
})();
