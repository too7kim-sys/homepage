/* =========================================================
   씨유소프트 (CU Soft) — main.js
   Mobile nav · header scroll · stat counters · reveal ·
   portfolio filter · contact form validation · to-top
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Current year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  const navToggle = $("#nav-toggle");
  const nav = $("#primary-nav");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "메뉴 열기");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
    // Close after choosing a menu item
    $$(".nav a", nav).forEach((a) => a.addEventListener("click", closeNav));
    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- Header scroll state + to-top ---------- */
  const header = $("#site-header");
  const toTop = $("#to-top");

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (toTop) toTop.classList.toggle("is-visible", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Animated stat counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Reveal on scroll + counter trigger ---------- */
  const revealEls = $$(
    ".value-card, .service-card, .process-step, .work-card, .why-card, " +
      ".member-card, .review-card, .faq-item, " +
      ".timeline, .section__head, .contact__form, .contact__info"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  const statsWrap = $("#stats");
  let statsDone = false;

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));

    if (statsWrap) {
      const statObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !statsDone) {
              statsDone = true;
              $$("strong[data-count]", statsWrap).forEach(animateCount);
              obs.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      statObserver.observe(statsWrap);
    }
  } else {
    // Fallback: show everything, set final numbers
    revealEls.forEach((el) => el.classList.add("is-in"));
    if (statsWrap)
      $$("strong[data-count]", statsWrap).forEach((el) => {
        el.textContent = (el.dataset.count || "") + (el.dataset.suffix || "");
      });
  }

  /* ---------- Portfolio filter ---------- */
  const filterBtns = $$(".filter-btn");
  const workCards = $$(".work-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;
      workCards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ---------- Contact form validation ---------- */
  const form = $("#contact-form");
  const note = $("#form-note");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, message) {
    const wrap = field.closest(".field");
    const errEl = $('[data-error-for="' + field.id + '"]', wrap);
    if (message) {
      wrap.classList.add("is-invalid");
      field.setAttribute("aria-invalid", "true");
      if (errEl) errEl.textContent = message;
    } else {
      wrap.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
      if (errEl) errEl.textContent = "";
    }
  }

  if (form) {
    const fields = {
      name: $("#name"),
      email: $("#email"),
      message: $("#message"),
    };

    // Clear error as the user fixes input
    Object.values(fields).forEach((f) =>
      f.addEventListener("input", () => setError(f, ""))
    );

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let firstInvalid = null;

      if (!fields.name.value.trim()) {
        setError(fields.name, "이름을 입력해 주세요.");
        firstInvalid = firstInvalid || fields.name;
      }
      if (!fields.email.value.trim()) {
        setError(fields.email, "이메일을 입력해 주세요.");
        firstInvalid = firstInvalid || fields.email;
      } else if (!emailRe.test(fields.email.value.trim())) {
        setError(fields.email, "올바른 이메일 형식이 아닙니다.");
        firstInvalid = firstInvalid || fields.email;
      }
      if (!fields.message.value.trim()) {
        setError(fields.message, "문의 내용을 입력해 주세요.");
        firstInvalid = firstInvalid || fields.message;
      }

      if (firstInvalid) {
        if (note) {
          note.textContent = "입력 내용을 확인해 주세요.";
          note.className = "form__note is-error";
        }
        firstInvalid.focus();
        return;
      }

      // No backend: compose a mailto draft as a graceful fallback.
      const name = fields.name.value.trim();
      const email = fields.email.value.trim();
      const company = ($("#company") && $("#company").value.trim()) || "-";
      const message = fields.message.value.trim();

      const subject = encodeURIComponent("[홈페이지 문의] " + name);
      const body = encodeURIComponent(
        "이름: " + name + "\n" +
          "이메일: " + email + "\n" +
          "회사/소속: " + company + "\n\n" +
          message
      );

      if (note) {
        note.textContent = "문의가 접수되었습니다. 메일 앱이 열리면 전송을 완료해 주세요.";
        note.className = "form__note is-success";
      }
      form.reset();
      window.location.href =
        "mailto:contact@cusoft.co.kr?subject=" + subject + "&body=" + body;
    });
  }
})();
