/* ============================================================
   KHALED — PORTFOLIO APP
   Classic script (no build step). Three.js is imported
   dynamically from a CDN so the site also works via file://.
   ============================================================ */

(() => {
  "use strict";

  const SITE = window.SITE;
  const root = document.documentElement;
  const body = document.body;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  // Motion is opt-out (footer toggle / ?motion=off), not driven by the OS
  // setting. The head script sets .motion-off before first paint.
  const reducedMotion = root.classList.contains("motion-off");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  const hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== "undefined";
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------
     Fail-safe: never leave the loader stuck
     --------------------------------------------------------- */
  function failSafe(message) {
    console.warn("[portfolio]", message);
    const loader = $("#loader");
    if (loader) loader.remove();
    body.classList.remove("is-locked");
    root.classList.add("no-webgl");
    root.classList.remove("js");
  }

  if (!SITE) {
    failSafe("Content file (js/content.js) did not load.");
    return;
  }

  /* ---------------------------------------------------------
     Content rendering
     --------------------------------------------------------- */
  const setText = (selector, value) => {
    const node = $(selector);
    if (node && value) node.textContent = value;
  };

  const socialMarkup = (socials, withHandle) =>
    socials
      .map(
        (s) =>
          `<a href="${s.href}" target="_blank" rel="noopener noreferrer">` +
          `<span class="social-label">${s.label}</span>` +
          (withHandle ? `<span class="social-handle">${s.handle}</span>` : "") +
          `</a>`
      )
      .join("");

  function renderContent() {
    const { person, hero, about, stats, projects, capabilities, services, stack } = SITE;

    document.title = `${person.name} — ${person.role}`;
    setText("#hero-eyebrow", hero.eyebrow);
    setText("#hero-lead", hero.lead);
    setText("#about-body", about.body);
    setText("#statement", about.statement);

    // Status + availability
    $$("[data-status] span").forEach((n) => (n.textContent = person.availability));

    // Email links
    const mailLink = $("#mail-link");
    const mailText = $("#mail-text");
    const menuMail = $("#menu-mail");
    if (mailLink) mailLink.href = `mailto:${person.email}`;
    if (mailText) mailText.textContent = person.email;
    if (menuMail) {
      menuMail.href = `mailto:${person.email}`;
      menuMail.textContent = person.email;
    }

    // Socials
    const socials = SITE.socials || [];
    const socialsNode = $("#socials");
    if (socialsNode) socialsNode.innerHTML = socialMarkup(socials, true);
    const footerSocials = $("#footer-socials");
    if (footerSocials) footerSocials.innerHTML = socialMarkup(socials, false);
    const menuSocials = $("#menu-socials");
    if (menuSocials) menuSocials.innerHTML = socialMarkup(socials, false);

    const github = socials.find((s) => s.label.toLowerCase().includes("github"));
    const workGithub = $("#work-github");
    if (workGithub && github) workGithub.href = github.href;

    // Hero ticker
    const ticker = $("#hero-ticker");
    if (ticker) {
      const star =
        '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0l1.3 4.7L12 6l-4.7 1.3L6 12 4.7 7.3 0 6l4.7-1.3z" fill="currentColor"/></svg>';
      const group = hero.marquee.map((t) => `<span class="ticker-item">${t}${star}</span>`).join("");
      ticker.innerHTML = `<div class="ticker-group">${group}</div><div class="ticker-group" aria-hidden="true">${group}</div>`;
    }

    // Stats / focus areas
    const statsNode = $("#stats");
    if (statsNode) {
      statsNode.innerHTML = stats
        .map((s) => {
          const numeric = typeof s.value === "number";
          const value = numeric
            ? `<span class="stat-num" data-target="${s.value}">0</span><span>${s.suffix || ""}</span>`
            : s.value;
          return `<div class="stat${numeric ? "" : " stat--text"}">
            <span class="stat-value${numeric ? "" : " stat-value--text"}">${value}</span>
            <span class="stat-label">${s.label}</span>
          </div>`;
        })
        .join("");
    }

    // Projects
    const list = $("#project-list");
    if (list) {
      list.innerHTML = projects
        .map(
          (p) => `<li class="project" style="--accent:${p.accent}">
            <button class="project-row" type="button" data-project="${p.id}" data-cursor="Open case" aria-haspopup="dialog">
              <span class="project-num">${p.index}</span>
              <span class="project-title">${p.title}<i class="title-dot" aria-hidden="true"></i></span>
              <span class="project-sub">${p.subtitle}</span>
              <span class="project-stack">${p.stack.slice(0, 3).map((s) => `<span>${s}</span>`).join("")}</span>
              <span class="project-year">${p.type || ""}</span>
              <span class="project-cta" aria-hidden="true">
                <svg viewBox="0 0 16 16"><path d="M4 12L12 4M12 4H5M12 4V11"/></svg>
              </span>
            </button>
          </li>`
        )
        .join("");
    }

    // Capabilities
    const capGrid = $("#cap-grid");
    const icons = {
      code: '<path d="M5 4L1.5 8 5 12M11 4l3.5 4L11 12M9.5 2.5l-3 11"/>',
      server:
        '<rect x="2" y="2.5" width="12" height="5" rx="1"/><rect x="2" y="8.5" width="12" height="5" rx="1"/><path d="M4.5 5h.01M4.5 11h.01M7 5h2M7 11h2"/>',
      spark:
        '<path d="M8 1.5l1.5 4.4L14 7.5l-4.5 1.6L8 13.5 6.5 9.1 2 7.5l4.5-1.6z"/><path d="M12.5 11.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"/>',
      compass:
        '<circle cx="8" cy="8" r="6"/><path d="M10.6 5.4L9 9l-3.6 1.6L7 7z"/>',
    };
    if (capGrid) {
      capGrid.innerHTML = capabilities
        .map(
          (c, i) => `<article class="cap-card reveal">
            <div class="cap-top">
              <span class="cap-icon" aria-hidden="true"><svg viewBox="0 0 16 16">${icons[c.icon] || icons.code}</svg></span>
              <span class="cap-index">0${i + 1}</span>
            </div>
            <h3 class="cap-title">${c.title}</h3>
            <p class="cap-body">${c.body}</p>
            <div class="cap-tags">${c.tags.map((t) => `<span>${t}</span>`).join("")}</div>
          </article>`
        )
        .join("");
    }

    // Services
    const expNode = $("#exp-list");
    if (expNode) {
      expNode.innerHTML = services
        .map(
          (e) => `<article class="exp-row">
            <span class="exp-period">${e.period}</span>
            <div>
              <h3 class="exp-role">${e.role}</h3>
              <p class="exp-company">${[e.company, e.location].filter(Boolean).join(" — ")}</p>
            </div>
            <p class="exp-copy">${e.summary}</p>
            <div class="exp-tags">${e.tags.map((t) => `<span>${t}</span>`).join("")}</div>
          </article>`
        )
        .join("");
    }

    // Stack marquees
    const renderStack = (node, items) => {
      if (!node) return;
      const pills = items.map((s) => `<span class="stack-pill">${s}</span>`).join("");
      node.innerHTML = `<div class="ticker-group">${pills}</div><div class="ticker-group" aria-hidden="true">${pills}</div>`;
    };
    renderStack($("#stack-track-1"), stack);
    const shifted = stack.slice(Math.floor(stack.length / 2)).concat(stack.slice(0, Math.floor(stack.length / 2)));
    renderStack($("#stack-track-2"), shifted);

    // Footer
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
    const zone = $("#clock-zone");
    if (zone) {
      const tz = person.timezone || "UTC";
      zone.textContent = tz.split("/").pop().replace(/_/g, " ");
    }
    const note = $(".contact-note");
    if (note) note.textContent = `${person.location} · Usually replies within a day`;
    const footerBrand = $(".footer-brand p");
    if (footerBrand) footerBrand.textContent = `${person.role} — React, Node.js, WordPress & WooCommerce.`;

    // Now list
    const nowList = $("#now-list");
    if (nowList) nowList.innerHTML = about.now.map((n) => `<li>${n}</li>`).join("");
  }

  renderContent();

  /* ---------------------------------------------------------
     Clock
     --------------------------------------------------------- */
  function initClock() {
    const clock = $("#clock");
    if (!clock) return;
    const tz = SITE.person.timezone || "UTC";
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: tz,
    });
    const tick = () => {
      clock.textContent = formatter.format(new Date());
    };
    tick();
    setInterval(tick, 1000);
  }
  initClock();

  /* ---------------------------------------------------------
     Smooth scroll
     --------------------------------------------------------- */
  let lenis = null;

  function initSmoothScroll() {
    if (reducedMotion || !window.Lenis) return;
    lenis = new Lenis({
      // 0.09 felt floaty and reads as input lag; 0.13 stays smooth but tracks
      // the wheel much more directly.
      lerp: 0.13,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      smoothWheel: true,
    });
    if (hasGSAP) {
      lenis.on("scroll", () => {
        if (hasScrollTrigger) ScrollTrigger.update();
      });
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const loop = (time) => {
        lenis.raf(time);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  function scrollToTarget(target) {
    if (!target) return;
    const offset = -30;
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.25 });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    }
  }

  /* ---------------------------------------------------------
     Navigation / header / progress
     --------------------------------------------------------- */
  function initNavigation() {
    const header = $("#header");
    const progress = $("#scroll-progress-bar");
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      if (header) {
        header.classList.toggle("is-scrolled", y > 30);
        if (!body.classList.contains("is-locked")) {
          if (y > 220 && y > lastY + 4) header.classList.add("is-hidden");
          else if (y < lastY - 4 || y < 120) header.classList.remove("is-hidden");
        }
      }
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
      }
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Anchor navigation
    $$("a[data-nav]").forEach((link) => {
      link.addEventListener("click", (e) => {
        const hash = link.getAttribute("href");
        if (!hash || !hash.startsWith("#")) return;
        const target = hash === "#top" ? document.body : $(hash);
        if (!target) return;
        e.preventDefault();
        closeMenu();
        scrollToTarget(hash === "#top" ? document.documentElement : target);
      });
    });

    // Active section
    const ids = ["work", "about", "expertise", "contact"];
    const navLinks = $$(".nav-desktop a");
    if ("IntersectionObserver" in window && navLinks.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navLinks.forEach((a) => {
              if (a.getAttribute("href") === `#${id}`) a.setAttribute("aria-current", "page");
              else a.removeAttribute("aria-current");
            });
          });
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
      );
      ids.forEach((id) => {
        const section = document.getElementById(id);
        if (section) io.observe(section);
      });
    }
  }

  /* ---------------------------------------------------------
     Mobile menu
     --------------------------------------------------------- */
  let menuOpen = false;
  function initMenu() {
    const toggle = $("#menu-toggle");
    const menu = $("#menu");
    if (!toggle || !menu) return;

    const setMenu = (open) => {
      menuOpen = open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", String(!open));
      body.classList.toggle("is-locked", open);
      if (open) lenis?.stop();
      else lenis?.start();
    };

    toggle.addEventListener("click", () => setMenu(!menuOpen));
    $$(".menu-nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuOpen) setMenu(false);
    });
    window.__closeMenu = () => setMenu(false);
  }

  function closeMenu() {
    if (menuOpen && window.__closeMenu) window.__closeMenu();
  }

  /* ---------------------------------------------------------
     Custom cursor
     --------------------------------------------------------- */
  function initCursor() {
    const cursor = $("#cursor");
    const label = $("#cursor-label");
    if (!cursor || !finePointer || reducedMotion) return;

    root.classList.add("has-cursor");
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;

    window.addEventListener(
      "pointermove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      },
      { passive: true }
    );

    const loop = () => {
      // Snappy follow: the old 0.2 lerp put ~90ms between the physical
      // pointer and the dot, which felt like lag on top of the 3D scene.
      x = lerp(x, mouseX, 0.5);
      y = lerp(y, mouseY, 0.5);
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    document.addEventListener("pointerover", (e) => {
      const target = e.target.closest("a, button, [data-cursor]");
      if (!target) return;
      cursor.classList.add("is-hover");
      const custom = target.getAttribute("data-cursor");
      if (label) label.textContent = custom || "View";
    });

    document.addEventListener("pointerout", (e) => {
      const target = e.target.closest("a, button, [data-cursor]");
      if (!target) return;
      const next = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest("a, button, [data-cursor]");
      if (!next) {
        cursor.classList.remove("is-hover");
        if (label) label.textContent = "";
      }
    });

    window.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
    window.addEventListener("pointerup", () => cursor.classList.remove("is-down"));
  }

  /* ---------------------------------------------------------
     Magnetic buttons
     --------------------------------------------------------- */
  function initMagnetic() {
    if (!hasGSAP || !finePointer || reducedMotion) return;
    $$("[data-magnetic]").forEach((item) => {
      const xTo = gsap.quickTo(item, "x", { duration: 0.3, ease: "power3.out" });
      const yTo = gsap.quickTo(item, "y", { duration: 0.3, ease: "power3.out" });
      item.addEventListener("pointermove", (e) => {
        const rect = item.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) * 0.28;
        const dy = (e.clientY - rect.top - rect.height / 2) * 0.32;
        xTo(clamp(dx, -10, 10));
        yTo(clamp(dy, -8, 8));
      });
      item.addEventListener("pointerleave", () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  /* ---------------------------------------------------------
     Project art + hover preview
     --------------------------------------------------------- */
  function artMarkup(project) {
    const shapes = {
      1: '<span class="art-orb"></span><span class="art-ring"></span>',
      2: '<span class="art-blob"></span><span class="art-ring"></span>',
      3: '<span class="art-contours"></span><span class="art-grid"></span><span class="art-pin"></span>',
      4: '<span class="art-shape"></span><span class="art-shape"></span>',
    };
    const tag = `<span class="art-tag">${project.artTag || "PROJECT"}</span>`;
    return `<div class="art art-${project.art}">${shapes[project.art] || shapes[1]}${tag}</div>`;
  }

  function initProjectPreview() {
    if (!hasGSAP || !finePointer || reducedMotion) return;
    const rows = $$(".project-row");
    if (!rows.length) return;

    const preview = document.createElement("div");
    preview.className = "cursor-preview";
    body.appendChild(preview);

    const xTo = gsap.quickTo(preview, "x", { duration: 0.42, ease: "power3.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.42, ease: "power3.out" });
    let active = false;
    let currentId = null;

    const move = (e) => {
      if (!active) return;
      const offset = e.clientX > window.innerWidth - 430 ? -215 : 215;
      xTo(e.clientX + offset);
      yTo(e.clientY);
    };

    rows.forEach((row) => {
      const project = SITE.projects.find((p) => p.id === row.dataset.project);
      if (!project) return;
      row.addEventListener("pointerenter", () => {
        if (currentId !== project.id) {
          preview.innerHTML = artMarkup(project);
          currentId = project.id;
        }
        active = true;
        gsap.to(preview, { opacity: 1, scale: 1, rotate: -2, duration: 0.5, ease: "power3.out" });
      });
      row.addEventListener("pointermove", move);
      row.addEventListener("pointerleave", () => {
        active = false;
        gsap.to(preview, { opacity: 0, scale: 0.86, rotate: -4, duration: 0.35, ease: "power2.out" });
      });
    });

    window.addEventListener("scroll", () => {
      if (!active) return;
      active = false;
      gsap.to(preview, { opacity: 0, duration: 0.25 });
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     Case study dialog
     --------------------------------------------------------- */
  function initCaseDialog() {
    const dialog = $("#case-dialog");
    if (!dialog) return;
    let lastTrigger = null;
    let isOpen = false;

    const fill = (p) => {
      setText("#case-index", `Case study ${p.index}`);
      setText("#case-year", p.type);
      setText("#case-title", p.title);
      setText("#case-subtitle", p.subtitle);
      setText("#case-role", p.role);
      setText("#case-stack", p.stack.join(" · "));
      setText("#case-outcome", p.scope);
      setText("#case-challenge", p.challenge);
      setText("#case-approach", p.approach);
      setText("#case-result", p.context);
      const art = $("#case-art");
      if (art) art.innerHTML = artMarkup(p);
      const mail = $("#case-mail");
      if (mail) {
        mail.href = `mailto:${SITE.person.email}?subject=${encodeURIComponent(`Case study — ${p.title}`)}`;
      }
    };

    const open = (id) => {
      const p = SITE.projects.find((x) => x.id === id);
      if (!p) return;
      lastTrigger = document.activeElement;
      fill(p);
      dialog.showModal();
      isOpen = true;
      body.classList.add("is-locked");
      lenis?.stop();
      const scroll = $("#case-scroll");
      if (scroll) scroll.scrollTop = 0;
      if (hasGSAP && !reducedMotion) {
        gsap.fromTo(
          ".case-panel",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: "expo.out" }
        );
        gsap.fromTo(
          "#case-title, #case-subtitle, .case-top",
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, delay: 0.12, stagger: 0.06, ease: "power3.out" }
        );
      }
      const closeBtn = $("#case-close");
      if (closeBtn) closeBtn.focus({ preventScroll: true });
    };

    const close = () => {
      if (!isOpen) return;
      isOpen = false;
      const finish = () => {
        dialog.close();
        body.classList.remove("is-locked");
        lenis?.start();
        if (lastTrigger && lastTrigger.focus) lastTrigger.focus({ preventScroll: true });
      };
      if (hasGSAP && !reducedMotion) {
        gsap.to(".case-panel", {
          y: 30,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
          onComplete: finish,
        });
      } else {
        finish();
      }
    };

    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-project]");
      if (trigger) {
        open(trigger.dataset.project);
        return;
      }
      if (e.target.closest("#case-close")) close();
    });

    dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      close();
    });
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) close();
    });
  }

  /* ---------------------------------------------------------
     Motion toggle (footer)
     --------------------------------------------------------- */
  function initMotionToggle() {
    const btn = $("#motion-toggle");
    if (!btn) return;
    const label = $(".motion-label", btn);
    const on = !reducedMotion;
    btn.setAttribute("aria-pressed", String(on));
    btn.title = on ? "Pause background motion" : "Enable background motion";
    if (label) label.textContent = on ? "Motion on" : "Motion off";

    btn.addEventListener("click", () => {
      const next = reducedMotion ? "on" : "off";
      try {
        localStorage.setItem("portfolio-motion", next);
      } catch (e) {}
      try {
        const url = new URL(location.href);
        url.searchParams.delete("motion");
        history.replaceState(null, "", url.pathname + url.search + url.hash);
      } catch (e) {}
      location.reload();
    });
  }

  /* ---------------------------------------------------------
     Copy email
     --------------------------------------------------------- */
  function initCopy() {
    const btn = $("#copy-btn");
    if (!btn) return;
    const email = SITE.person.email;
    let resetTimer = null;

    const show = (text) => {
      btn.classList.add("is-copied");
      const span = btn.querySelector("span");
      if (span) span.textContent = text;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        btn.classList.remove("is-copied");
        if (span) span.textContent = "Copy address";
      }, 2000);
    };

    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
        show("Copied ✓");
      } catch (err) {
        const ta = document.createElement("textarea");
        ta.value = email;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          show("Copied ✓");
        } catch (e) {
          show("Copy failed");
        }
        ta.remove();
      }
    });
  }

  /* ---------------------------------------------------------
     Local inbox link (development only)
     --------------------------------------------------------- */
  function initLocalInbox() {
    const link = $("#local-inbox-link");
    if (!link) return;
    const isLocal =
      location.protocol === "file:" ||
      /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    link.hidden = !isLocal;
  }

  /* ---------------------------------------------------------
     Contact form + local inbox
     --------------------------------------------------------- */
  function initContactForm() {
    const form = $("#contact-form");
    if (!form) return;

    const feedback = $("#form-feedback");
    const submit = $("#form-submit");
    const success = $("#form-success");
    const successCopy = $("#form-success-copy");
    const successTitle = $("#form-success-title");
    const reset = $("#form-reset");
    const waForm = $("#form-whatsapp");
    const waDirect = $("#contact-whatsapp");
    const waSuccess = $("#success-whatsapp");
    const inboxSuccess = $("#success-inbox");
    const config = SITE.contact || {};
    const storageKey = config.storageKey || "portfolio-inbox";
    const endpoint = (config.endpoint || "").trim();
    const owner = (SITE.person && SITE.person.name) || "there";
    const email = (SITE.person && SITE.person.email) || "";
    const number = String((SITE.person && SITE.person.whatsapp) || "").replace(/[^\d]/g, "");

    const addOptions = (selector, values) => {
      const select = $(selector);
      if (!select) return;
      values.forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
    };
    addOptions("#cf-project", config.projectTypes || []);
    addOptions("#cf-budget", config.budgets || []);

    const waHref = (text) =>
      number ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : "";

    if (number) {
      const intro = `Hi ${owner} — I found your portfolio and would like to talk about a project.`;
      if (waDirect) {
        waDirect.href = waHref(intro);
        waDirect.hidden = false;
      }
      if (waForm) waForm.hidden = false;
    }

    const setFeedback = (message, isError = false) => {
      if (!feedback) return;
      feedback.textContent = message;
      feedback.classList.toggle("is-error", isError);
    };

    const setSending = (sending) => {
      if (!submit) return;
      const label = $("span", submit);
      submit.disabled = sending;
      if (label) label.textContent = sending ? "Sending..." : "Send brief";
    };

    const collect = () => {
      const data = new FormData(form);
      return {
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        project: String(data.get("project") || "").trim(),
        budget: String(data.get("budget") || "").trim(),
        message: String(data.get("message") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        consent: data.get("consent") === "yes",
      };
    };

    const saveLocal = (entry) => {
      try {
        const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const list = Array.isArray(stored) ? stored : [];
        list.unshift(entry);
        localStorage.setItem(storageKey, JSON.stringify(list.slice(0, 200)));
      } catch (err) {
        // Private mode / storage disabled: sending can still succeed.
      }
    };

    const isLocalPreview =
      location.protocol === "file:" ||
      /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

    const deliver = async (entry) => {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(entry),
        });
        if (!res.ok) throw new Error(`Endpoint responded ${res.status}`);
        return "remote";
      }

      if (!isLocalPreview) {
        // Netlify Forms: the HTML form is registered at deploy time. AJAX
        // needs a URL-encoded body plus the hidden form-name field.
        const body = new URLSearchParams();
        body.set("form-name", "contact");
        body.set("bot-field", "");
        body.set("name", entry.name);
        body.set("email", entry.email);
        body.set("project", entry.project);
        body.set("budget", entry.budget);
        body.set("phone", entry.phone);
        body.set("message", entry.message);
        body.set("consent", entry.consent ? "yes" : "no");
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
        if (!res.ok) throw new Error(`Form post responded ${res.status}`);
        return "remote";
      }

      return "local";
    };

    const showSuccess = (entry, mode) => {
      form.classList.add("is-sent");
      if (success) success.hidden = false;
      if (successCopy) {
        successCopy.textContent =
          mode === "local"
            ? "Saved to the local preview inbox. Deploy to Netlify or set a form endpoint to receive submissions remotely."
            : "Thanks — I'll get back to you within a day.";
      }
      if (number && waSuccess) {
        waSuccess.href = waHref(
          `Hi ${owner} — I just sent a project brief.\n\nName: ${entry.name}\nProject: ${
            entry.project || "—"
          }\n\nLooking forward to talking.`
        );
        waSuccess.hidden = false;
      }
      if (inboxSuccess) inboxSuccess.hidden = mode !== "local";
      form.reset();
      setSending(false);
      setFeedback("");
      if (successTitle) successTitle.focus({ preventScroll: false });
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (submit && submit.disabled) return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const entry = collect();
      const record = {
        id:
          (window.crypto && typeof crypto.randomUUID === "function" && crypto.randomUUID()) ||
          String(Date.now()),
        createdAt: new Date().toISOString(),
        ...entry,
        source: location.pathname,
      };

      saveLocal(record);
      setSending(true);
      setFeedback("Sending...");

      try {
        const mode = await deliver(record);
        showSuccess(record, mode);
      } catch (err) {
        setSending(false);
        const fallback = number ? "email or WhatsApp" : email ? `email ${email}` : "email me";
        setFeedback(`Couldn't send that just now. Please ${fallback} instead.`, true);
        console.warn("[contact]", err && err.message ? err.message : err);
      }
    });

    if (reset) {
      reset.addEventListener("click", () => {
        form.classList.remove("is-sent");
        if (success) success.hidden = true;
        if (waSuccess) waSuccess.hidden = true;
        if (inboxSuccess) inboxSuccess.hidden = true;
        setFeedback("");
        const name = $("#cf-name");
        if (name) name.focus();
      });
    }

    if (waForm) {
      waForm.addEventListener("click", () => {
        if (!number) return;
        const entry = collect();
        const lines = [`Hi ${owner} — I'd like to talk about a project.`];
        if (entry.name) lines.push(`Name: ${entry.name}`);
        if (entry.email) lines.push(`Email: ${entry.email}`);
        if (entry.project) lines.push(`Project: ${entry.project}`);
        if (entry.budget) lines.push(`Budget: ${entry.budget}`);
        if (entry.message) lines.push("", entry.message);
        window.open(waHref(lines.join("\n")), "_blank", "noopener");
      });
    }
  }

  /* ---------------------------------------------------------
     Text splitting
     --------------------------------------------------------- */
  function maskLines(el) {
    if (!el || el.dataset.masked === "true") return [];
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts
      .map((part) => `<span class="line-mask"><span class="line-body">${part}</span></span>`)
      .join("");
    el.dataset.masked = "true";
    return $$(".line-body", el);
  }

  function splitWords(el) {
    if (!el || el.dataset.split === "true") return [];
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
    el.dataset.split = "true";
    return $$(".w", el);
  }

  /* ---------------------------------------------------------
     Animations
     --------------------------------------------------------- */
  let heroPlayed = false;

  function showHeroStatic() {
    $$("[data-hero-line]").forEach((n) => (n.style.transform = "none"));
    $$("[data-hero-fade]").forEach((n) => {
      n.style.opacity = "1";
      n.style.transform = "none";
    });
    const header = $(".site-header");
    if (header) {
      header.style.transform = "none";
      header.style.opacity = "1";
    }
    const ticker = $(".hero-ticker");
    if (ticker) ticker.style.transform = "none";
  }

  function playHero() {
    if (heroPlayed) return;
    heroPlayed = true;
    if (!hasGSAP || reducedMotion) {
      showHeroStatic();
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to("[data-hero-line]", { yPercent: 0, duration: 1.35, stagger: 0.09 }, 0)
      .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.25)
      // `fromTo` (not `from`): the header has a CSS transform transition for
      // the scroll hide/show, which makes `.from()` capture a mid-transition
      // end value. clearProps hands the transform back to CSS afterwards.
      .fromTo(
        ".site-header",
        { yPercent: -120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, clearProps: "transform,opacity" },
        0.5
      )
      .from(".hero-ticker", { yPercent: 100, duration: 1 }, 0.65);
  }

  function initAnimations() {
    if (!hasGSAP || !hasScrollTrigger) {
      $$(".reveal").forEach((n) => (n.style.opacity = "1"));
      return;
    }

    if (reducedMotion) {
      $$("[data-hero-line]").forEach((n) => (n.style.transform = "none"));
      $$(".reveal").forEach((n) => (n.style.opacity = "1"));
      // Counters would otherwise never run without a scroll trigger.
      $$(".stat-num").forEach((n) => (n.textContent = n.dataset.target || "0"));
      // Statement words stay at full opacity (CSS handles it)
      return;
    }

    // Initial hero state
    gsap.set("[data-hero-line]", { yPercent: 115 });
    gsap.set("[data-hero-fade]", { opacity: 0, y: 18 });

    // Section reveals
    $$(".reveal").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    });

    // Section rules
    $$(".section-rule").forEach((rule) => {
      gsap.fromTo(
        rule,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: rule.parentElement, start: "top 85%", once: true },
        }
      );
    });

    // Big display headings
    $$(".split-lines").forEach((heading) => {
      const lines = maskLines(heading);
      if (!lines.length) return;
      gsap.set(lines, { yPercent: 112 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: heading, start: "top 86%", once: true },
      });
    });

    // About statement — word-by-word illumination
    const statement = $("#statement");
    if (statement) {
      const words = splitWords(statement);
      gsap.to(words, {
        opacity: 1,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: statement,
          start: "top 78%",
          end: "bottom 55%",
          scrub: 0.4,
        },
      });
    }

    // Project rows
    if ($$(".project").length) {
      gsap.set(".project", { opacity: 0, y: 18 });
      ScrollTrigger.batch(".project", {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }),
      });
    }

    // Stats counters
    $$(".stat-num").forEach((node) => {
      const target = Number(node.dataset.target) || 0;
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: node,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              node.textContent = Math.round(obj.v);
            },
          });
        },
      });
    });

    // Contact headline
    $$("[data-contact-line]").forEach((line, i) => {
      gsap.fromTo(
        line,
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: 1.3,
          delay: i * 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: ".contact-title", start: "top 82%", once: true },
        }
      );
    });

    // Footer wordmark parallax
    gsap.fromTo(
      ".footer-wordmark",
      { yPercent: 30 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: ".site-footer", start: "top bottom", end: "bottom bottom", scrub: true },
      }
    );

    // Hero parallax on scroll
    gsap.to(".hero-title", {
      y: -70,
      opacity: 0.25,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero-vignette", {
      opacity: 0.6,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  }

  /* ---------------------------------------------------------
     Loader
     --------------------------------------------------------- */
  function runLoader(scenePromise) {
    const loader = $("#loader");
    const bar = $("#loader-bar");
    const counter = $("#loader-count");

    if (!loader || reducedMotion || !hasGSAP) {
      loader?.remove();
      body.classList.remove("is-locked");
      root.classList.add("is-ready");
      playHero();
      return Promise.resolve();
    }

    body.classList.add("is-locked");

    const countTo = (value) => {
      if (counter) counter.textContent = String(Math.round(value)).padStart(2, "0");
      if (bar) bar.style.transform = `scaleX(${value / 100})`;
    };

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      loader.remove();
      body.classList.remove("is-locked");
      root.classList.add("is-ready");
    };

    // Hard fallback: rAF can be throttled in background tabs or embedded
    // webviews, which must never leave the loader on screen.
    const guard = setTimeout(() => {
      countTo(100);
      finish();
      playHero();
      // If rAF is throttled, GSAP cannot finish the entrance — show it now.
      showHeroStatic();
    }, 7000);

    return new Promise((resolve) => {
      const duration = 1500;
      const start = performance.now();

      const step = (now) => {
        const p = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        countTo(eased * 92);
        if (p < 1) requestAnimationFrame(step);
        else {
          Promise.race([
            Promise.allSettled([scenePromise, document.fonts ? document.fonts.ready : Promise.resolve()]),
            new Promise((r) => setTimeout(r, 2600)),
          ]).then(() => {
            countTo(100);
            setTimeout(() => {
              const tl = gsap.timeline({
                onComplete: () => {
                  clearTimeout(guard);
                  finish();
                  resolve();
                },
              });
              tl.to(loader, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, 0)
                .add(playHero, 0.3)
                .from(".scroll-progress", { opacity: 0, duration: 0.6 }, 0.6);
            }, 260);
          });
        }
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------------------------------------------------------
     Three.js scene — liquid chrome core
     --------------------------------------------------------- */
  let scenePromise = null;

  function markNoWebGL(reason) {
    if (reason) console.warn("[scene]", reason);
    root.classList.add("no-webgl");
  }

  function initScene() {
    if (scenePromise) return scenePromise;

    scenePromise = (async () => {
      const canvas = $("#scene");
      if (!canvas) return;

      // Performance tiers. `?quality=low` forces the cheap path,
      // `?quality=high` pins full quality (and disables auto-degrade).
      const params = new URLSearchParams(location.search);
      const qualityParam = (params.get("quality") || "").toLowerCase();
      const perf = {
        low: qualityParam === "low",
        auto: qualityParam !== "high",
        measured: false,
        start: 0,
        frames: 0,
      };
      if (perf.low) root.dataset.quality = "low";

      let THREE, EffectComposer, RenderPass, UnrealBloomPass, OutputPass;
      try {
        THREE = await import("three");
        // Low quality renders straight to the canvas, so the composer and
        // bloom modules are never needed.
        if (!perf.low) {
          ({ EffectComposer } = await import("three/addons/postprocessing/EffectComposer.js"));
          ({ RenderPass } = await import("three/addons/postprocessing/RenderPass.js"));
          ({ UnrealBloomPass } = await import("three/addons/postprocessing/UnrealBloomPass.js"));
          ({ OutputPass } = await import("three/addons/postprocessing/OutputPass.js"));
        }
      } catch (err) {
        markNoWebGL(`Three.js failed to load: ${err.message}`);
        return;
      }

      const isMobile = window.innerWidth < 900;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          // The composer renders offscreen, so canvas MSAA buys nothing.
          antialias: false,
          alpha: false,
          stencil: false,
          powerPreference: "high-performance",
        });
      } catch (err) {
        markNoWebGL(`WebGL unavailable: ${err.message}`);
        return;
      }

      // Software WebGL (SwiftShader, llvmpipe, remote desktop) cannot carry
      // the displacement shader + bloom. Show the painted fallback instead
      // of a 3 fps page.
      let glName = "";
      try {
        const gl = renderer.getContext();
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        glName = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "";
      } catch (e) {}
      if (params.get("webgl") === "off") {
        renderer.dispose();
        markNoWebGL("webgl=off");
        return;
      }
      if (/swiftshader|software|llvmpipe|basic render/i.test(glName)) {
        renderer.dispose();
        markNoWebGL(`software renderer: ${glName}`);
        return;
      }

      renderer.setClearColor(0x050506, 1);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050506);

      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      const world = new THREE.Group();
      scene.add(world);

      /* ---------- Shaders ---------- */
      const NOISE = `
        vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
        vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
        float snoise(vec3 v){
          const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
      `;

      const blobUniforms = {
        uTime: { value: 0 },
        uDistort: { value: 0.25 },
        uHover: { value: 0 },
      };

      // Geometry is the biggest vertex cost: the displacement shader runs
      // 6 snoise() calls per vertex. 168x116 still reads as a perfectly
      // smooth sphere at hero scale and cuts vertex work by ~43%.
      const blobSegments = () => {
        if (isMobile) return perf.low ? [80, 60] : [112, 80];
        return perf.low ? [112, 78] : [168, 116];
      };
      const makeBlobGeometry = () => {
        const [w, h] = blobSegments();
        return new THREE.SphereGeometry(1.85, w, h);
      };
      const blobGeometry = makeBlobGeometry();

      // Iridescence adds a whole extra physical BRDF layer. Drop it on the
      // cheap tier; the acid fresnel rim still sells the chrome.
      const blobMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf4f4ef,
        metalness: 1.0,
        roughness: 0.045,
        envMapIntensity: 1.18,
        clearcoat: perf.low ? 0.2 : 0.35,
        clearcoatRoughness: 0.08,
        ...(perf.low
          ? {}
          : {
              iridescence: 0.16,
              iridescenceIOR: 1.45,
              iridescenceThicknessRange: [160, 380],
            }),
      });

      blobMaterial.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = blobUniforms.uTime;
        shader.uniforms.uDistort = blobUniforms.uDistort;
        shader.uniforms.uHover = blobUniforms.uHover;

        shader.vertexShader = shader.vertexShader
          .replace(
            "#include <common>",
            `#include <common>

            uniform float uTime;
            uniform float uDistort;
            uniform float uHover;

            ${NOISE}

            vec3 gBlobPosition;
            vec3 gBlobNormal;

            float blobNoise(vec3 p){
              float t = uTime * 0.16;
              float n1 = snoise(p * 1.05 + vec3(0.0, 0.0, t));
              float n2 = snoise(p * 2.35 - vec3(t * 0.75, 0.0, 0.0));
              return (n1 * 0.095 + n2 * 0.016) * (0.8 + uDistort + uHover * 0.2);
            }

            void deformBlob(vec3 basePos, vec3 baseNormal){
              vec3 n = normalize(baseNormal);
              vec3 axis = vec3(0.0, 1.0, 0.0);
              if (abs(dot(n, axis)) > 0.999) axis = vec3(1.0, 0.0, 0.0);
              vec3 t1 = normalize(cross(n, axis));
              vec3 t2 = normalize(cross(n, t1));
              float eps = 0.045;

              vec3 p0 = basePos + n * blobNoise(basePos);
              vec3 p1 = basePos + t1 * eps;
              p1 += n * blobNoise(p1);
              vec3 p2 = basePos + t2 * eps;
              p2 += n * blobNoise(p2);

              vec3 newNormal = normalize(cross(p1 - p0, p2 - p0));
              if (dot(newNormal, n) < 0.0) newNormal = -newNormal;
              // keep reflections coherent: only partially bend the normal
              newNormal = normalize(mix(n, newNormal, 0.22));

              gBlobPosition = p0;
              gBlobNormal = newNormal;
            }`
          )
          .replace(
            "#include <beginnormal_vertex>",
            `#include <beginnormal_vertex>
            deformBlob(position, normal);
            objectNormal = gBlobNormal;`
          )
          .replace("#include <begin_vertex>", "vec3 transformed = gBlobPosition;");

        // Acid fresnel rim — defines the silhouette against the dark page.
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
          {
            float rimFacing = clamp(dot(normalize(vNormal), normalize(vViewPosition)), 0.0, 1.0);
            float rim = pow(1.0 - rimFacing, 3.2);
            vec3 rimTint = mix(vec3(0.78, 0.95, 0.42), vec3(0.74, 0.80, 1.0), smoothstep(0.4, 1.0, rimFacing));
            totalEmissiveRadiance += rimTint * rim * 0.22;
          }`
        );
      };

      const blob = new THREE.Mesh(blobGeometry, blobMaterial);
      world.add(blob);

      /* ---------- Custom dark studio environment (chrome reflections) ---------- */
      const pmrem = new THREE.PMREMGenerator(renderer);

      // A painted equirectangular studio: dark room, tall window lights,
      // acid horizon. Painted at 2K so reflections stay crisp.
      function buildStudioTexture() {
        const W = 2048;
        const H = 1024;
        const cv = document.createElement("canvas");
        cv.width = W;
        cv.height = H;
        const g = cv.getContext("2d");

        const sky = g.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0.0, "#04060a");
        sky.addColorStop(0.28, "#070a10");
        sky.addColorStop(0.46, "#1a2130");
        sky.addColorStop(0.5, "#39434f");
        sky.addColorStop(0.55, "#141a23");
        sky.addColorStop(0.74, "#06090d");
        sky.addColorStop(1.0, "#020304");
        g.fillStyle = sky;
        g.fillRect(0, 0, W, H);

        // soft haze around the horizon
        const haze = g.createRadialGradient(W * 0.5, H * 0.5, 20, W * 0.5, H * 0.5, W * 0.42);
        haze.addColorStop(0, "rgba(126,146,176,0.22)");
        haze.addColorStop(0.55, "rgba(70,84,104,0.08)");
        haze.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = haze;
        g.fillRect(0, 0, W, H);

        // tall window lights (drawn wrapped so the seam is invisible)
        const windowLight = (x, w, y0, y1, edge, core) => {
          for (const dx of [-W, 0, W]) {
            const grd = g.createLinearGradient(x + dx - w / 2, 0, x + dx + w / 2, 0);
            grd.addColorStop(0, "rgba(0,0,0,0)");
            grd.addColorStop(0.32, edge);
            grd.addColorStop(0.5, core);
            grd.addColorStop(0.68, edge);
            grd.addColorStop(1, "rgba(0,0,0,0)");
            g.fillStyle = grd;
            g.fillRect(x + dx - w / 2, y0, w, y1 - y0);
          }
        };

        windowLight(742, 168, 130, 910, "rgba(178,196,220,0.30)", "rgba(255,255,255,0.92)");
        windowLight(1218, 96, 210, 872, "rgba(186,202,228,0.22)", "rgba(240,246,255,0.62)");
        windowLight(232, 124, 190, 900, "rgba(170,186,212,0.18)", "rgba(232,240,255,0.5)");
        windowLight(1738, 64, 280, 840, "rgba(180,196,220,0.14)", "rgba(240,246,255,0.4)");
        windowLight(1548, 38, 330, 790, "rgba(170,186,212,0.10)", "rgba(240,246,255,0.3)");

        // overhead softbox (top of the sphere)
        const top = g.createLinearGradient(0, 40, 0, 250);
        top.addColorStop(0, "rgba(255,255,255,0)");
        top.addColorStop(0.45, "rgba(226,236,255,0.30)");
        top.addColorStop(0.62, "rgba(255,255,255,0.46)");
        top.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = top;
        g.fillRect(0, 40, W, 210);

        // acid horizon sliver (wrapped)
        const limeBand = (x0, x1, y, h, alpha) => {
          const grd = g.createLinearGradient(x0, 0, x1, 0);
          grd.addColorStop(0, "rgba(198,255,61,0)");
          grd.addColorStop(0.18, `rgba(198,255,61,${alpha})`);
          grd.addColorStop(0.5, `rgba(232,255,150,${Math.min(1, alpha + 0.25)})`);
          grd.addColorStop(0.82, `rgba(198,255,61,${alpha})`);
          grd.addColorStop(1, "rgba(198,255,61,0)");
          g.fillStyle = grd;
          g.fillRect(x0, y, x1 - x0, h);
        };
        g.save();
        g.shadowColor = "rgba(198,255,61,0.9)";
        g.shadowBlur = 26;
        limeBand(60, 980, 600, 7, 0.85);
        limeBand(1160, 1980, 622, 5, 0.7);
        g.restore();

        // violet wash, upper left
        const violet = g.createRadialGradient(1660, 300, 10, 1660, 300, 300);
        violet.addColorStop(0, "rgba(112,94,255,0.30)");
        violet.addColorStop(1, "rgba(112,94,255,0)");
        g.fillStyle = violet;
        g.fillRect(1300, 0, 748, 640);

        return cv;
      }

      const studioTex = new THREE.CanvasTexture(buildStudioTexture());
      studioTex.mapping = THREE.EquirectangularReflectionMapping;
      studioTex.colorSpace = THREE.SRGBColorSpace;
      const envRT = pmrem.fromEquirectangular(studioTex);
      scene.environment = envRT.texture;
      scene.environmentIntensity = 1.0;
      studioTex.dispose();
      pmrem.dispose();

      /* ---------- Accent lights ---------- */
      const limeLight = new THREE.PointLight(0xc6ff3d, 0.8, 18, 2);
      limeLight.position.set(4.2, 0.6, 3.2);
      scene.add(limeLight);

      /* ---------- Orbital rings ---------- */
      const rings = [];
      const ringSpecs = [
        { r: 2.55, color: 0xf0f4e8, opacity: 0.32, tilt: [1.25, 0.3, 0.2], speed: 0.18 },
        { r: 3.15, color: 0xc6ff3d, opacity: 0.2, tilt: [1.05, -0.5, -0.3], speed: -0.13 },
        { r: 3.8, color: 0x8b7bff, opacity: 0.12, tilt: [1.5, 0.1, 0.6], speed: 0.08 },
      ];
      ringSpecs.forEach((spec) => {
        const geo = new THREE.TorusGeometry(spec.r, 0.0045, 4, 220);
        const mat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(spec.color).multiplyScalar(1.15),
          transparent: true,
          opacity: spec.opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.set(...spec.tilt);
        mesh.userData.speed = spec.speed;
        world.add(mesh);
        rings.push(mesh);
      });

      /* ---------- Particle field ---------- */
      const LOW_PARTICLES = isMobile ? 700 : 900;
      const COUNT = perf.low ? LOW_PARTICLES : isMobile ? 1200 : 1800;
      const positions = new Float32Array(COUNT * 3);
      const colors = new Float32Array(COUNT * 3);
      const sizes = new Float32Array(COUNT);
      const seeds = new Float32Array(COUNT);
      const palette = [
        new THREE.Color(0xf2f4ec),
        new THREE.Color(0xc6ff3d),
        new THREE.Color(0x8b7bff),
        new THREE.Color(0x9aa196),
      ];

      for (let i = 0; i < COUNT; i++) {
        const radius = 2.7 + Math.pow(Math.random(), 0.55) * 6.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const spread = 0.35;
        positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
        positions[i * 3 + 1] = Math.cos(phi) * radius * spread + (Math.random() - 0.5) * 1.4;
        positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;

        const c = palette[Math.random() < 0.62 ? 0 : Math.random() < 0.72 ? 1 : Math.random() < 0.85 ? 2 : 3];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;

        sizes[i] = 0.8 + Math.random() * 1.9;
        seeds[i] = Math.random();
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
      particleGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      particleGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

      const particleUniforms = {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      };

      const particleMat = new THREE.ShaderMaterial({
        uniforms: particleUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          uniform float uTime;
          uniform float uPixelRatio;
          attribute vec3 aColor;
          attribute float aSize;
          attribute float aSeed;
          varying vec3 vColor;
          varying float vAlpha;
          varying float vTwinkle;

          void main(){
            vColor = aColor;
            vec3 p = position;
            p.y += sin(uTime * 0.22 + aSeed * 6.2831) * 0.22;
            p.x += cos(uTime * 0.18 + aSeed * 6.2831) * 0.16;
            p.z += sin(uTime * 0.14 + aSeed * 9.0) * 0.14;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            float dist = -mv.z;
            gl_PointSize = clamp(aSize * uPixelRatio * (9.5 / dist), 0.6, 4.2);
            gl_Position = projectionMatrix * mv;

            vAlpha = smoothstep(14.0, 3.5, dist) * (0.35 + 0.65 * abs(sin(uTime * 0.5 + aSeed * 12.0)));
            vTwinkle = 0.6 + 0.4 * sin(uTime * 0.7 + aSeed * 20.0);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          varying float vTwinkle;
          void main(){
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(vColor * (0.8 + vTwinkle * 0.6), alpha * vAlpha * 0.85);
          }
        `,
      });

      const particles = new THREE.Points(particleGeo, particleMat);
      world.add(particles);

      /* ---------- Atmospheric glow ---------- */
      const glowUniforms = {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(0x5f7d20) },
        uColorB: { value: new THREE.Color(0x090b12) },
      };
      const glowMat = new THREE.ShaderMaterial({
        uniforms: glowUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying vec2 vUv;
          void main(){
            float d = length((vUv - 0.5) * 2.0);
            float glow = pow(smoothstep(1.0, 0.0, d), 2.4);
            float pulse = 0.85 + 0.15 * sin(uTime * 0.6);
            vec3 col = mix(uColorB, uColorA, glow);
            gl_FragColor = vec4(col * pulse, glow * 0.2);
          }
        `,
      });
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), glowMat);
      glow.position.z = -3;
      world.add(glow);

      /* ---------- Post processing (optional) ---------- */
      // Bloom is several fullscreen passes at DPR resolution. The low tier
      // renders straight to the canvas instead, which is also what auto-
      // degrade switches to at runtime.
      let usePost = !perf.low;
      let composer = null;
      let bloom = null;
      if (usePost) {
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        bloom = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          isMobile ? 0.22 : 0.36,
          0.55,
          0.88
        );
        composer.addPass(bloom);
        composer.addPass(new OutputPass());
      }

      /* ---------- Layout ---------- */
      let width = window.innerWidth;
      let height = window.innerHeight;
      let baseX = 2.45;
      let baseScale = 1.0;
      let baseZ = 8.0;

      // Pixel budget: cap the number of shaded pixels regardless of DPR.
      // A 4K screen at DPR 1 would otherwise shade 8.3M pixels + bloom.
      const dpr = () => {
        const budget = perf.low ? 1.2e6 : isMobile ? 1.6e6 : 2.4e6;
        const cap = perf.low ? 1.15 : isMobile ? 1.5 : 1.75;
        const device = Math.min(window.devicePixelRatio || 1, cap);
        const fit = Math.sqrt(budget / Math.max(width * height, 1));
        return clamp(Math.min(device, fit), 0.65, cap);
      };

      function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        const phone = width < 640;
        const tablet = width >= 640 && width < 1024;
        baseX = phone ? 0.25 : tablet ? 0.75 : 2.45;
        baseScale = phone ? 0.8 : tablet ? 0.9 : 1.0;
        baseZ = phone ? 10.4 : tablet ? 9.0 : 8.0;

        const ratio = dpr();
        renderer.setPixelRatio(ratio);
        renderer.setSize(width, height, false);
        if (composer) {
          composer.setPixelRatio(ratio);
          composer.setSize(width, height);
        }
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        particleUniforms.uPixelRatio.value = ratio;
      }
      resize();
      window.addEventListener("resize", () => {
        resize();
        draw();
      });

      // First paint so the canvas can fade in immediately (no rAF dependency).
      camera.position.set(0, 0, baseZ);
      camera.lookAt(0, 0, 0);
      world.position.set(baseX, 0.05, 0);
      world.scale.setScalar(baseScale * (reducedMotion ? 1 : 0.72));
      world.rotation.set(-0.08, 0.5, 0);
      draw();
      root.classList.add("webgl-ready");

      /* ---------- Pointer ---------- */
      const target = { x: 0, y: 0 };
      const pointer = { x: 0, y: 0 };
      if (finePointer) {
        window.addEventListener(
          "pointermove",
          (e) => {
            target.x = (e.clientX / window.innerWidth) * 2 - 1;
            target.y = (e.clientY / window.innerHeight) * 2 - 1;
          },
          { passive: true }
        );
      }

      /* ---------- Animation ---------- */
      let elapsed = 0;
      let intro = reducedMotion ? 1 : 0;
      let raf = 0;
      let last = performance.now();
      let sampleStart = 0;
      let sampleFrames = 0;

      // The canvas is fixed behind the page, but every section between hero
      // and contact is opaque. Only submit GPU work while one of them is on
      // screen (plus a small margin so the scene is ready before it shows).
      const hero = $("#top");
      const contact = $("#contact");
      const caseDialog = $("#case-dialog");
      let heroVisible = true;
      let contactVisible = false;

      const visibilityObserver =
        "IntersectionObserver" in window
          ? new IntersectionObserver(
              (entries) => {
                for (const entry of entries) {
                  if (entry.target === hero) heroVisible = entry.isIntersecting;
                  if (entry.target === contact) contactVisible = entry.isIntersecting;
                }
              },
              { rootMargin: "0px 0px 12% 0px" }
            )
          : null;
      if (visibilityObserver) {
        if (hero) visibilityObserver.observe(hero);
        if (contact) visibilityObserver.observe(contact);
      } else {
        heroVisible = true;
        contactVisible = true;
      }

      function draw() {
        if (usePost && composer) composer.render();
        else renderer.render(scene, camera);
      }

      // One-way quality drop. Called once when the post-intro FPS sample is
      // poor; everything expensive is swapped or disabled in place.
      function applyLowQuality(reason) {
        if (perf.low) return;
        perf.low = true;
        root.dataset.quality = "low";
        console.info(`[scene] switching to low quality — ${reason}`);

        const lighter = makeBlobGeometry();
        blob.geometry.dispose();
        blob.geometry = lighter;
        blobMaterial.iridescence = 0;
        blobMaterial.clearcoat = 0.2;
        blobMaterial.needsUpdate = true;

        // Keep the existing buffers, just draw fewer points.
        particleGeo.setDrawRange(0, Math.min(COUNT, LOW_PARTICLES));

        // Bloom is the heaviest fullscreen work; render straight to canvas.
        usePost = false;
        if (composer) {
          if (bloom) bloom.dispose();
          composer.dispose();
          composer = null;
          bloom = null;
        }

        resize();
      }

      function frame(now) {
        raf = requestAnimationFrame(frame);
        if (document.hidden) return;

        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        elapsed += dt;
        intro = Math.min(1, intro + dt / 1.7);
        const introEase = 1 - Math.pow(1 - intro, 4);

        const active =
          (heroVisible || contactVisible) && !(caseDialog && caseDialog.open);
        if (!active) {
          // Mid-page or a case study is open: keep time advancing so motion
          // resumes seamlessly, but skip every transform and GPU submit.
          sampleStart = 0;
          sampleFrames = 0;
          return;
        }

        // One-shot FPS sample after the loader + intro settle. Below ~48fps
        // the scene starts competing with Lenis and the cursor, so drop a
        // tier instead of letting the whole page feel heavy.
        if (perf.auto && !perf.low && !perf.measured && intro >= 1 && root.classList.contains("is-ready")) {
          if (!sampleStart) {
            sampleStart = now;
            sampleFrames = 0;
          }
          sampleFrames++;
          const span = now - sampleStart;
          if (span >= 1400 && sampleFrames >= 20) {
            perf.measured = true;
            const fps = (sampleFrames * 1000) / span;
            if (fps < 48) applyLowQuality(`measured ${fps.toFixed(0)}fps`);
          }
        }

        pointer.x = lerp(pointer.x, target.x, 1 - Math.pow(0.0015, dt));
        pointer.y = lerp(pointer.y, target.y, 1 - Math.pow(0.0015, dt));

        const scrollY = window.scrollY;
        const heroP = clamp(scrollY / Math.max(height, 1), 0, 1);

        let contactP = 0;
        if (contact) {
          const rect = contact.getBoundingClientRect();
          contactP = clamp(1 - rect.top / height, 0, 1);
          contactP = contactP * contactP * (3 - 2 * contactP);
        }

        blobUniforms.uTime.value = elapsed;
        blobUniforms.uDistort.value = 0.18 + (1 - introEase) * 0.8 + contactP * 0.18;
        blobUniforms.uHover.value = lerp(blobUniforms.uHover.value, Math.abs(pointer.x) * 0.4, 0.04);
        particleUniforms.uTime.value = elapsed;
        glowUniforms.uTime.value = elapsed;

        const drift = reducedMotion ? 0 : elapsed * 0.09;
        world.position.x = lerp(baseX, 0, contactP) + pointer.x * 0.28;
        world.position.y =
          lerp(0.05, 0.15, contactP) -
          heroP * 0.35 +
          pointer.y * -0.16 +
          (reducedMotion ? 0 : Math.sin(elapsed * 0.5) * 0.055);
        world.scale.setScalar(lerp(baseScale, 1.05, contactP) * (0.72 + introEase * 0.28));
        world.rotation.y = drift + pointer.x * 0.22 + heroP * 0.55 + contactP * 0.6;
        world.rotation.x = -0.08 + pointer.y * 0.18 + Math.sin(elapsed * 0.18) * 0.04;
        blob.rotation.z = reducedMotion ? 0 : elapsed * 0.05;
        particles.rotation.y = reducedMotion ? 0 : -elapsed * 0.028;
        glow.rotation.z = reducedMotion ? 0 : elapsed * 0.01;

        rings.forEach((ring) => {
          ring.rotation.z += reducedMotion ? 0 : ring.userData.speed * dt;
          ring.rotation.x += reducedMotion ? 0 : ring.userData.speed * dt * 0.4;
        });

        camera.position.x = pointer.x * 0.32;
        camera.position.y = -pointer.y * 0.22;
        camera.position.z = lerp(baseZ, baseZ - 1.1, contactP);
        camera.lookAt(0, 0, 0);

        if (bloom) {
          bloom.strength = (isMobile ? 0.22 : 0.36) + contactP * 0.12 - (1 - introEase) * 0.14;
        }

        draw();
      }

      const loop = (now) => {
        frame(now);
      };

      if (reducedMotion) {
        // Render one static frame; still responds to resize.
        blobUniforms.uTime.value = 1.2;
        world.position.set(baseX, 0.05, 0);
        world.scale.setScalar(baseScale);
        world.rotation.set(-0.08, 0.5, 0);
        camera.position.set(0, 0, baseZ);
        camera.lookAt(0, 0, 0);
        draw();
      } else {
        requestAnimationFrame((now) => {
          last = now;
          loop(now);
        });
      }

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          cancelAnimationFrame(raf);
        } else if (!reducedMotion) {
          last = performance.now();
          sampleStart = 0;
          sampleFrames = 0;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(loop);
        }
      });

      return true;
    })();

    return scenePromise;
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  function boot() {
    try {
      initSmoothScroll();
      initNavigation();
      initMenu();
      initCursor();
      initMagnetic();
      initProjectPreview();
      initCaseDialog();
      initCopy();
      initLocalInbox();
      initContactForm();
      initMotionToggle();
      initAnimations();

      const sceneReady = initScene();
      runLoader(sceneReady);

      // Refresh trigger positions once fonts settle / images arrive
      if (hasScrollTrigger) {
        window.addEventListener("load", () => ScrollTrigger.refresh());
        if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
        setTimeout(() => ScrollTrigger.refresh(), 1200);
      }
    } catch (err) {
      failSafe(err && err.message ? err.message : "Boot failed");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
