// index.js
// Fade-up + scramble that replays on re-entry, without initial "jerk".
// Fixes:
// 1) Locks width/height during animation to prevent layout shift.
// 2) Hides .scramble until JS is ready (pair with small CSS rule below).

(function () {
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};:,.<>?/\\|";

  // Enable CSS guard to hide .scramble before JS runs
  try { document.documentElement.classList.add("js-enabled"); } catch (e) {}

  function randomString(len) {
    let out = "";
    for (let i = 0; i < len; i++) out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    return out;
  }

  // weird AI code that does nothing
  // function lockBox(el, textForMeasure) {
  //   // Measure with the final text, then lock width/height to avoid layout shift.
  //   const prev = el.textContent;
  //   el.textContent = textForMeasure;

  //   const prevDisplay = el.style.display;
  //   if (getComputedStyle(el).display === "inline") el.style.display = "inline-block";

  //   const rect = el.getBoundingClientRect();
  //   el.style.width = rect.width + "px";
  //   el.style.height = rect.height + "px";

  //   el.textContent = prev;
  //   return () => {
  //     el.style.width = "";
  //     el.style.height = "";
  //     if (prevDisplay) el.style.display = prevDisplay;
  //   };
  // }

  function runScramble(el, options = {}) {
    const target = (el.getAttribute("data-text") || el.textContent || "").toString();
    const length = target.length;

    const delay = options.delay || 0;               // ms before starting
    const randomPhase = options.randomPhase || 250; // ms of full-random characters
    const perChar = options.perChar || 40;          // ms per character to lock in
    const fadeMs = options.fadeMs || 800;           // CSS fade/slide duration
    const startColorTo =
      getComputedStyle(document.documentElement).getPropertyValue("--text-color") || "#fff";

    // Lock size until the effect finishes
    // const unlock = lockBox(el, target);

    // Reset & apply the fadeUp animation cleanly
    el.style.animation = "none";
    void el.offsetWidth; // force reflow
    el.style.animation = `fadeUp ${fadeMs}ms ease-out both`;
    if (options.stagger) el.style.animationDelay = `${options.stagger}ms`;
    el.style.willChange = "transform, opacity, color";

    // Start from black for the fade
    el.style.color = "#000";

    // Show the final text to match the locked size exactly, then scramble
    el.textContent = target;

    const startAt = performance.now() + delay;
    el.dataset.animating = "1";

    function frame(now) {
      if (now < startAt) return requestAnimationFrame(frame);

      const t = now - startAt;

      // Phase 1: full random block
      if (t < randomPhase) {
        el.textContent = randomString(length);
        return requestAnimationFrame(frame);
      }

      // Phase 2: reveal correct characters one-by-one
      const revealed = Math.min(length, Math.floor((t - randomPhase) / perChar) + 1);
      let out = "";
      for (let i = 0; i < length; i++) {
        out += i < revealed ? target[i] : ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
      el.textContent = out;

      if (revealed < length) {
        requestAnimationFrame(frame);
      } else {
        // Final snap to correct string
        el.textContent = target;
        el.style.color = startColorTo.trim() || "";
        el.dataset.animating = "0";
        el.dataset.ready = "0"; // won’t re-run until it leaves the viewport

        // Release size lock now that we’ve settled
        // unlock();
      }
    }

    requestAnimationFrame(frame);
  }

  function prepareElement(el, index) {
    const text = (el.getAttribute("data-text") || el.textContent || "").toString();
    el.setAttribute("data-text", text);
    // el.dataset.stagger = String(index * 60); // staggers in order
    el.dataset.stagger = String(Math.random() * 300); // staggers at random
    el.dataset.animating = "0";
    el.dataset.ready = "1"; // ready to run initially
  }

  function onEnter(el) {
    if (el.dataset.animating === "1") return;
    if (el.dataset.ready !== "1") return;

    runScramble(el, {
      delay: 0 + Number(el.dataset.stagger || 0),
      stagger: Number(el.dataset.stagger || 0),
      randomPhase: 250,
      perChar: 40,
      fadeMs: 800
    });
  }

  function onExit(el) {
    // Mark as ready to re-run next time it enters
    el.dataset.ready = "1";
  }

  function init() {
    const items = Array.from(document.querySelectorAll(".scramble"));
    items.forEach((el, i) => prepareElement(el, i));

    if ("IntersectionObserver" in window) {
      const threshold = 0.25;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            onEnter(el);
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.01) {
            onExit(el);
          }
        });
      }, { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "0px 0px -5% 0px" });

      items.forEach((el) => io.observe(el));

      // Kick off immediately if already on screen
      items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) onEnter(el);
      });
    } else {
      // Fallback: run once on load
      items.forEach((el) => onEnter(el));
    }
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

// Per-section carousel with image + header controls
(function () {
  function initCarousel(root) {
    const items = Array.from(root.querySelectorAll(".carousel-item"));
    if (!items.length) return;

    let index = items.findIndex((el) => el.classList.contains("is-active"));
    if (index === -1) index = 0;

    const total = items.length;

    // right-side image element for this section
    const imageEl =
      root.closest(".sec-page-inner")?.querySelector(".sec-page-image") || null;

    // header controls & counter
    const controls =
      root.closest(".sec-page-text")?.querySelector("[data-carousel-controls]") ||
      null;

    const prevBtn = controls?.querySelector('[data-dir="prev"]') || null;
    const nextBtn = controls?.querySelector('[data-dir="next"]') || null;
    const currentEl = controls?.querySelector("[data-current]") || null;
    const totalEl = controls?.querySelector("[data-total]") || null;

    if (totalEl) totalEl.textContent = String(total);

    function setBackgroundFromItem(item) {
      if (!imageEl) return;
      const bg = item.dataset.bg;
      if (!bg) return;

      // allow either "assets/img.jpg" or "url('assets/img.jpg')"
      const value = bg.trim().startsWith("url(") ? bg : `url('${bg}')`;
      imageEl.style.setProperty("--sec-bg-url", value);
    }

    function show(i) {
      index = (i + items.length) % items.length; // wrap around
      items.forEach((el, idx) => {
        el.classList.toggle("is-active", idx === index);
      });

      const activeItem = items[index];
      setBackgroundFromItem(activeItem);

      if (currentEl) currentEl.textContent = String(index + 1);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => show(index - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => show(index + 1));
    }

    // init state (image + counter)
    show(index);
  }

  function initAllCarousels() {
    const carousels = document.querySelectorAll("[data-carousel]");
    carousels.forEach(initCarousel);
  }

  if (document.readyState !== "loading") initAllCarousels();
  else document.addEventListener("DOMContentLoaded", initAllCarousels);
})();
