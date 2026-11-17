// ---------- Year ----------
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Nav scroll state ----------
const nav = document.getElementById("nav");
if (nav) {
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ---------- Mobile menu ----------
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
if (toggle && links) {
  const setMenu = (open) => {
    toggle.classList.toggle("open", open);
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && links.classList.contains("open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (links.classList.contains("open") && !links.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });
}

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll(
  ".section-head, .page-hero, .about-grid, .founder-grid, .svc-card, .svc-preview a, .step, .vision-inner, .regions span, .contact-info, .contact-form, .cta-inner"
);
revealEls.forEach((el) => el.classList.add("reveal"));
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = `${(i % 4) * 80}ms`;
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

// ---------- Count-up stats ----------
// The markup holds the final values, so the numbers are right even without JavaScript.
const counters = document.querySelectorAll(".hero-stats b[data-count]");
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      const dur = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease) + (p === 1 ? suffix : "");
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  counters.forEach((c) => countObserver.observe(c));
}

// ---------- Contact form ----------
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");
const submitBtn = form ? form.querySelector("button[type=submit]") : null;
const CALL_US =
  'Please call us on <a href="tel:+917348821565">+91 73488 21565</a> (India) or <a href="tel:+14109883075">+1 (410) 988 3075</a> (USA).';

if (form) form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const agree = form.agree.checked;
  note.className = "form-note";

  if (!name || !email || !message) {
    note.textContent = "Please fill in your name, email and message.";
    note.classList.add("err");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    note.textContent = "Please enter a valid email address.";
    note.classList.add("err");
    return;
  }
  if (!agree) {
    note.textContent = "Please tick the box so we can contact you about your request.";
    note.classList.add("err");
    return;
  }

  const action = form.getAttribute("action") || "";
  const configured = action.includes("formspree.io") && !action.includes("YOUR_FORM_ID");

  // Until a form endpoint is connected, say so plainly rather than pretending the message was sent.
  if (!configured) {
    note.innerHTML = "Our online form isn't connected yet. " + CALL_US;
    note.classList.add("err");
    return;
  }

  // Submit to Formspree via fetch so the visitor stays on the page.
  const original = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = "Sending…";
  try {
    const res = await fetch(action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });
    if (!res.ok) throw new Error("Bad response");
    note.textContent = `Thank you, ${name}! Your message has been sent — we'll be in touch shortly.`;
    note.classList.add("ok");
    form.reset();
  } catch (err) {
    note.innerHTML = "Sorry, your message couldn't be sent. " + CALL_US;
    note.classList.add("err");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = original;
  }
});

// ---------- Particle canvas ----------
(() => {
  const canvas = document.getElementById("particles");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles, raf;
  const COLORS = ["#4be3a6", "#5cc3f2", "#f1cf8e"];
  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(44, Math.floor(w / 30));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.4,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = 0.45;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = p.c;
          ctx.globalAlpha = (1 - dist / 130) * 0.1;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  };
  resize();
  draw();
  window.addEventListener("resize", () => { cancelAnimationFrame(raf); resize(); draw(); });
})();
