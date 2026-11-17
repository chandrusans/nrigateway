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
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    links.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      toggle.classList.remove("open");
      links.classList.remove("open");
    })
  );
}

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll(
  ".section-head, .page-hero, .about-grid, .founder-grid, .svc-card, .svc-preview a, .step, .vision-inner, .regions span, .reviews-grid blockquote, .contact-info, .contact-form, .cta-inner"
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
const counters = document.querySelectorAll(".hero-stats b[data-count]");
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease) + (p === 1 && target >= 100 ? "+" : "");
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
counters.forEach((c) => countObserver.observe(c));

// ---------- Contact form ----------
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");
const submitBtn = form ? form.querySelector("button[type=submit]") : null;

// Fallback inbox used when the Formspree endpoint hasn't been configured yet.
const FALLBACK_EMAIL = "info@nrigateway.in";

if (form) form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const service = form.service.value;
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
    note.textContent = "Please agree to the privacy policy to continue.";
    note.classList.add("err");
    return;
  }

  const action = form.getAttribute("action") || "";
  const configured = action.includes("formspree.io") && !action.includes("YOUR_FORM_ID");

  // If Formspree isn't set up yet, fall back to opening the user's email client.
  if (!configured) {
    const subject = encodeURIComponent(`NRI Gateway enquiry — ${service || "General"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\nService: ${service || "-"}\n\n${message}`
    );
    window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
    note.textContent = "Opening your email app to send the message…";
    note.classList.add("ok");
    return;
  }

  // Submit to Formspree via fetch (AJAX) so the visitor stays on the page.
  const original = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = "Sending…";
  try {
    const res = await fetch(action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });
    if (res.ok) {
      note.textContent = `Thank you, ${name}! Your message has been sent — we'll be in touch shortly.`;
      note.classList.add("ok");
      form.reset();
    } else {
      throw new Error("Bad response");
    }
  } catch (err) {
    note.textContent = "Sorry, something went wrong. Please call us or email info@nrigateway.in.";
    note.classList.add("err");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = original;
  }
});

// ---------- Card tilt ----------
document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener("mouseleave", () => (card.style.transform = ""));
});

// ---------- Particle canvas ----------
(() => {
  const canvas = document.getElementById("particles");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles, raf;
  const COLORS = ["#38f9d7", "#7b6cff", "#ff5bb4"];
  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(70, Math.floor(w / 22));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.4,
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
      ctx.globalAlpha = 0.6;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = p.c;
          ctx.globalAlpha = (1 - dist / 130) * 0.15;
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
