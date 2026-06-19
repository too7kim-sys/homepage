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

  /* ---------- Theme (dark mode) toggle ---------- */
  const themeToggle = $("#theme-toggle");
  const THEME_KEY = "cusoft-theme";
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (metaTheme) metaTheme.setAttribute("content", theme === "dark" ? "#0b1220" : "#1e53a3");
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", theme === "dark" ? "라이트 모드 전환" : "다크 모드 전환");
      themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }

  // 초기 테마는 <head> 인라인 스크립트가 이미 설정 → 메타/라벨만 동기화
  applyTheme(document.documentElement.getAttribute("data-theme") || "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next =
        document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  // OS 테마 변경 시(사용자가 직접 고르지 않은 경우에만) 따라가기
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      let saved = null;
      try { saved = localStorage.getItem(THEME_KEY); } catch (_) {}
      if (!saved) applyTheme(e.matches ? "dark" : "light");
    });
  }

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

    const submitBtn = form.querySelector('button[type="submit"]');
    const CONTACT_EMAIL = "contact@cusoft.co.kr";
    // Formspree 엔드포인트가 설정되면 실제 전송, 아니면 mailto 폴백.
    const action = form.getAttribute("action") || "";
    const useFormspree = /formspree\.io\/f\/(?!your_form_id)/.test(action);

    function mailtoFallback(name, email, company, message) {
      const subject = encodeURIComponent("[홈페이지 문의] " + name);
      const body = encodeURIComponent(
        "이름: " + name + "\n" +
          "이메일: " + email + "\n" +
          "회사/소속: " + company + "\n\n" +
          message
      );
      window.location.href =
        "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
    }

    form.addEventListener("submit", async (e) => {
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

      const name = fields.name.value.trim();
      const email = fields.email.value.trim();
      const company = ($("#company") && $("#company").value.trim()) || "-";
      const message = fields.message.value.trim();

      // Formspree 미설정 시: 메일 앱으로 폴백.
      if (!useFormspree) {
        if (note) {
          note.textContent = "메일 앱이 열리면 전송을 완료해 주세요.";
          note.className = "form__note is-success";
        }
        mailtoFallback(name, email, company, message);
        return;
      }

      // 실제 전송 (Formspree).
      const original = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "전송 중…"; }
      if (note) { note.textContent = ""; note.className = "form__note"; }

      try {
        const res = await fetch(action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (res.ok) {
          if (note) {
            note.textContent = "문의가 정상적으로 접수되었습니다. 빠르게 연락드리겠습니다.";
            note.className = "form__note is-success";
          }
          form.reset();
        } else {
          throw new Error("submit failed");
        }
      } catch (err) {
        if (note) {
          note.textContent = "전송에 실패했습니다. 메일 앱으로 다시 시도합니다.";
          note.className = "form__note is-error";
        }
        mailtoFallback(name, email, company, message);
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = original; }
      }
    });
  }
})();
