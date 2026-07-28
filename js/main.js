/* ==========================================================================
   AURA ARTISAN BAKERY — Shared Site Behaviors
   ========================================================================== */

/* ---------- Loading screen ---------- */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if(loader){
    setTimeout(() => loader.classList.add("hide"), 500);
  }
});

/* ---------- Dark mode ---------- */
function initTheme(){
  const saved = localStorage.getItem("aura_theme");
  if(saved === "dark") document.documentElement.setAttribute("data-theme","dark");
  document.querySelectorAll(".theme-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if(isDark){
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("aura_theme","light");
      } else {
        document.documentElement.setAttribute("data-theme","dark");
        localStorage.setItem("aura_theme","dark");
      }
    });
  });
}

/* ---------- Mobile nav ---------- */
function initNav(){
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if(hamburger && navLinks){
    hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));
  }
}

/* ---------- Scroll progress bar + back to top ---------- */
function initScrollUI(){
  const bar = document.getElementById("scroll-progress");
  const backTop = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop/docHeight)*100 : 0;
    if(bar) bar.style.width = pct + "%";
    if(backTop) backTop.classList.toggle("show", scrollTop > 500);
  });
  if(backTop){
    backTop.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));
  }
}

/* ---------- Reveal on scroll ---------- */
function initReveal(){
  const els = document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){
    els.forEach(el => el.classList.add("in"));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("in");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold:.15 });
  els.forEach(el => obs.observe(el));
}

/* ---------- Animated counters ---------- */
function initCounters(){
  const counters = document.querySelectorAll("[data-count]");
  if(!counters.length) return;
  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now-start)/duration, 1);
      const eased = 1 - Math.pow(1-progress, 3);
      el.textContent = Math.round(eased*target) + suffix;
      if(progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  if("IntersectionObserver" in window){
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting){ animate(e.target); obs.unobserve(e.target); } });
    }, { threshold:.4 });
    counters.forEach(c => obs.observe(c));
  } else {
    counters.forEach(animate);
  }
}

/* ---------- FAQ accordion ---------- */
function initFAQ(){
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    if(!q) return;
    q.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
      if(!wasOpen) item.classList.add("open");
    });
  });
}

/* ---------- Testimonials slider ---------- */
function initTestimonialSlider(){
  const slides = document.querySelectorAll(".testimonial-slide");
  const dotsWrap = document.querySelector(".slider-dots");
  if(!slides.length || !dotsWrap) return;
  let current = 0;
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    if(i === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Show testimonial ${i+1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  function goTo(i){
    slides[current].classList.remove("active");
    dotsWrap.children[current].classList.remove("active");
    current = i;
    slides[current].classList.add("active");
    dotsWrap.children[current].classList.add("active");
  }
  setInterval(() => goTo((current+1) % slides.length), 5000);
}

/* ---------- Toast notifications ---------- */
function showToast(message, isError){
  let stack = document.querySelector(".toast-stack");
  if(!stack){
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  const toast = document.createElement("div");
  toast.className = "toast" + (isError ? " error" : "");
  toast.textContent = message;
  stack.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ---------- Newsletter form ---------- */
function initNewsletter(){
  document.querySelectorAll(".newsletter-form").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type=email]");
      if(input && input.value){
        showToast("Thanks for subscribing! Check your inbox for a welcome treat 🍰");
        form.reset();
      }
    });
  });
}

/* ---------- Contact form ---------- */
function initContactForm(){
  const form = document.getElementById("contact-form");
  if(!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Message sent! We'll get back to you within 24 hours.");
    form.reset();
  });
}

/* ---------- Set active nav link ---------- */
function markActiveNav(){
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href");
    if(href === path || (path === "" && href === "index.html")){
      a.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNav();
  initScrollUI();
  initReveal();
  initCounters();
  initFAQ();
  initTestimonialSlider();
  initNewsletter();
  initContactForm();
  markActiveNav();
});
