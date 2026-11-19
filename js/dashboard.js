/* ============================================================
   KHALED — CONTACT INBOX
   ------------------------------------------------------------
   Reads submissions from the local preview inbox that the contact
   form writes to localStorage. No build step, no dependencies.

   On a Netlify deploy, real visitor briefs live in Netlify Forms —
   this page can only show what was submitted in this browser.
   ============================================================ */

(() => {
  "use strict";

  const SITE = window.SITE || {};
  const contact = SITE.contact || {};
  const storageKey = contact.storageKey || "portfolio-inbox";
  const endpoint = String(contact.endpoint || "").trim();
  const projectTypes = Array.isArray(contact.projectTypes) ? contact.projectTypes : [];
  const isLocalPreview =
    location.protocol === "file:" ||
    /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  const $ = (selector, root = document) => root.querySelector(selector);

  const els = {
    total: $("#stat-total"),
    week: $("#stat-week"),
    latest: $("#stat-latest"),
    badge: $("#dash-badge"),
    search: $("#dash-search"),
    filter: $("#dash-filter"),
    export: $("#dash-export"),
    clear: $("#dash-clear"),
    banner: $("#dash-banner"),
    formsRow: $("#dash-forms-row"),
    formsLink: $("#dash-forms-link"),
    footNote: $("#dash-foot-note"),
    list: $("#dash-list"),
    empty: $("#dash-empty"),
  };

  let entries = [];
  let query = "";
  let activeProject = "";
  let baseBanner = "";
  let bannerTimer = null;

  const el = (tag, className) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  };

  /* ---------------------------------------------------------
     Data
     --------------------------------------------------------- */
  const timeOf = (entry) => {
    const stamp = Date.parse(entry.createdAt || entry.created_at || "");
    return Number.isFinite(stamp) ? stamp : 0;
  };

  const readInbox = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(
          (entry) =>
            entry &&
            typeof entry === "object" &&
            (entry.name || entry.email || entry.message)
        )
        .sort((a, b) => timeOf(b) - timeOf(a));
    } catch (err) {
      return [];
    }
  };

  const writeInbox = (list) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(list));
      return true;
    } catch (err) {
      setBanner("This browser blocked local storage, so changes couldn't be saved.", "warn", {
        timeout: 6000,
      });
      return false;
    }
  };

  /* ---------------------------------------------------------
     Banner
     --------------------------------------------------------- */
  function setBanner(text, tone = "", options = {}) {
    if (!els.banner) return;
    const { sticky = false, timeout = 5200 } = options;
    if (sticky) baseBanner = text;

    els.banner.textContent = text;
    els.banner.className = "dash-banner" + (tone ? ` is-${tone}` : "");
    els.banner.hidden = !text;

    clearTimeout(bannerTimer);
    if (!sticky && timeout) {
      bannerTimer = setTimeout(() => {
        if (baseBanner) {
          els.banner.textContent = baseBanner;
          els.banner.className = "dash-banner";
          els.banner.hidden = false;
        } else {
          els.banner.textContent = "";
          els.banner.hidden = true;
        }
      }, timeout);
    }
  }

  function initBadge() {
    if (!els.badge) return;
    if (endpoint) {
      els.badge.textContent = "Endpoint connected";
      els.badge.classList.add("is-live");
      if (els.footNote) {
        els.footNote.textContent = "Preview inbox · production briefs are delivered to your endpoint";
      }
      return;
    }
    if (isLocalPreview) {
      els.badge.textContent = "Local preview";
      els.badge.classList.add("is-local");
      return;
    }
    els.badge.textContent = "Netlify Forms";
    els.badge.classList.add("is-live");
    if (contact.inboxUrl && els.formsRow && els.formsLink) {
      els.formsLink.href = contact.inboxUrl;
      els.formsRow.hidden = false;
    }
    if (els.footNote) {
      els.footNote.textContent = "Preview inbox · production briefs live in Netlify Forms";
    }
    setBanner(
      "This deploy delivers briefs to Netlify Forms. Open the Netlify Forms inbox for real submissions — this list only shows briefs sent from this browser.",
      "warn",
      { sticky: true }
    );
  }

  /* ---------------------------------------------------------
     Formatting
     --------------------------------------------------------- */
  const pad = (value) => String(value).padStart(2, "0");

  function relativeTime(stamp) {
    if (!stamp) return "—";
    const diff = Date.now() - stamp;
    if (diff < 60 * 1000) return "Just now";
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    const date = new Date(stamp);
    const sameYear = date.getFullYear() === new Date().getFullYear();
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      ...(sameYear ? {} : { year: "numeric" }),
    });
  }

  const fullDate = (stamp) =>
    stamp
      ? new Date(stamp).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Unknown date";

  function initials(name) {
    const parts = String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return "?";
    const first = parts[0].charAt(0);
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
    return (first + last).toUpperCase() || "?";
  }

  function whatsappLink(phone, name) {
    const digits = String(phone || "").replace(/\D/g, "");
    // wa.me expects country code + number, 8–15 digits including the code.
    if (digits.length < 8 || digits.length > 15) return "";
    const first = String(name || "").trim().split(/\s+/)[0] || "there";
    const text = `Hi ${first} — thanks for the project brief. Happy to talk it through.`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }

  /* ---------------------------------------------------------
     Stats + filter options
     --------------------------------------------------------- */
  function renderStats() {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const total = entries.length;
    const week = entries.filter((entry) => timeOf(entry) >= weekAgo).length;

    if (els.total) els.total.textContent = pad(total);
    if (els.week) els.week.textContent = pad(week);
    if (els.latest) {
      els.latest.textContent = total ? relativeTime(timeOf(entries[0])) : "—";
      els.latest.title = total ? fullDate(timeOf(entries[0])) : "";
    }
    document.title = total ? `(${total}) Inbox — Khaled` : "Inbox — Khaled";
  }

  function renderProjectFilter() {
    if (!els.filter) return;

    const seen = new Set();
    const values = [];
    [...projectTypes, ...entries.map((entry) => entry.project)].forEach((raw) => {
      const value = String(raw || "").trim();
      if (!value || seen.has(value)) return;
      seen.add(value);
      values.push(value);
    });

    const previous = els.filter.value;
    els.filter.innerHTML = "";

    const all = document.createElement("option");
    all.value = "";
    all.textContent = "All types";
    els.filter.appendChild(all);

    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      els.filter.appendChild(option);
    });

    els.filter.value = values.includes(previous) ? previous : "";
    activeProject = els.filter.value;
  }

  /* ---------------------------------------------------------
     Rendering
     --------------------------------------------------------- */
  function filteredEntries() {
    const needle = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (activeProject && String(entry.project || "") !== activeProject) return false;
      if (!needle) return true;
      return [entry.name, entry.email, entry.phone, entry.project, entry.budget, entry.message].some(
        (value) => String(value || "").toLowerCase().includes(needle)
      );
    });
  }

  function makeMini(label, className = "") {
    const button = el("button", `mini${className ? ` ${className}` : ""}`);
    button.type = "button";
    button.textContent = label;
    return button;
  }

  function copyEmail(button, email) {
    if (!email) return;
    const done = () => {
      button.textContent = "Copied ✓";
      button.classList.add("is-done");
      setTimeout(() => {
        button.textContent = "Copy email";
        button.classList.remove("is-done");
      }, 1700);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(done).catch(() => fallbackCopy(email, done));
    } else {
      fallbackCopy(email, done);
    }
  }

  function fallbackCopy(text, done) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
      done();
    } catch (err) {
      setBanner("Couldn't copy that email. Select it manually instead.", "warn");
    }
    area.remove();
  }

  function deleteButton(entry) {
    const button = makeMini("Delete", "mini--danger");
    const owner = entry.name || entry.email || "this brief";
    button.setAttribute("aria-label", `Delete brief from ${owner}`);
    let armed = false;
    let timer = null;

    const disarm = () => {
      armed = false;
      button.textContent = "Delete";
      button.classList.remove("is-armed");
      clearTimeout(timer);
    };

    button.addEventListener("click", () => {
      if (!armed) {
        armed = true;
        button.textContent = "Confirm?";
        button.classList.add("is-armed");
        clearTimeout(timer);
        timer = setTimeout(disarm, 2800);
        return;
      }

      const index = entries.indexOf(entry);
      const next = entries.filter((item) => item !== entry);
      if (!writeInbox(next)) return;
      entries = next;
      renderStats();
      renderProjectFilter();
      renderList();
      setBanner("Brief deleted.", "", { timeout: 3000 });

      const buttons = els.list ? els.list.querySelectorAll(".mini--danger") : [];
      const focusTarget =
        buttons[Math.min(Math.max(index, 0), buttons.length - 1)] || els.search;
      if (focusTarget) focusTarget.focus();
    });

    return button;
  }

  function briefElement(entry) {
    const stamp = timeOf(entry);
    const article = el("article", "brief");
    article.dataset.id = String(entry.id || stamp || "");

    /* Head */
    const top = el("div", "brief-top");
    const avatar = el("span", "brief-avatar");
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = initials(entry.name);

    const identity = el("div", "brief-id");
    const name = document.createElement("h3");
    name.textContent = entry.name || "Unnamed brief";
    identity.appendChild(name);

    if (entry.email) {
      const mail = document.createElement("a");
      mail.href = `mailto:${encodeURIComponent(entry.email)}?subject=${encodeURIComponent(
        "Re: your project brief"
      )}`;
      mail.textContent = entry.email;
      identity.appendChild(mail);
    }

    const meta = el("div", "brief-meta");
    if (entry.project) {
      const chip = el("span", "dash-chip");
      chip.textContent = entry.project;
      meta.appendChild(chip);
    }
    if (entry.budget) {
      const chip = el("span", "dash-chip dash-chip--money");
      chip.textContent = entry.budget;
      meta.appendChild(chip);
    }
    const when = document.createElement("time");
    when.className = "brief-when";
    when.dateTime = entry.createdAt || "";
    when.title = fullDate(stamp);
    when.textContent = relativeTime(stamp);
    meta.appendChild(when);

    top.append(avatar, identity, meta);

    /* Message */
    const message = el("p", "brief-message is-clamped");
    message.textContent = entry.message || "No message provided.";

    /* Actions */
    const foot = el("div", "brief-foot");

    if (entry.phone) {
      const phone = el("span", "brief-phone");
      phone.textContent = entry.phone;
      foot.appendChild(phone);
    }

    const actions = el("div", "brief-actions");

    if (entry.email) {
      const reply = document.createElement("a");
      reply.className = "mini";
      reply.href = `mailto:${encodeURIComponent(entry.email)}?subject=${encodeURIComponent(
        "Re: your project brief"
      )}`;
      reply.textContent = "Reply";
      reply.setAttribute("aria-label", `Reply to ${entry.name || entry.email} by email`);
      actions.appendChild(reply);

      const copy = makeMini("Copy email");
      copy.setAttribute("aria-label", `Copy email address for ${entry.name || "this visitor"}`);
      copy.addEventListener("click", () => copyEmail(copy, entry.email));
      actions.appendChild(copy);
    }

    const waHref = whatsappLink(entry.phone, entry.name);
    if (waHref) {
      const wa = document.createElement("a");
      wa.className = "mini mini--wa";
      wa.href = waHref;
      wa.target = "_blank";
      wa.rel = "noopener";
      wa.textContent = "WhatsApp";
      wa.setAttribute("aria-label", `Message ${entry.name || entry.phone} on WhatsApp`);
      actions.appendChild(wa);
    }

    actions.appendChild(deleteButton(entry));
    foot.appendChild(actions);

    article.append(top, message, foot);
    return article;
  }

  function addReadMore() {
    if (!els.list) return;
    els.list.querySelectorAll(".brief-message.is-clamped").forEach((message) => {
      const next = message.nextElementSibling;
      if (next && next.classList.contains("brief-more")) return;
      if (message.scrollHeight <= message.clientHeight + 8) return;

      const toggle = el("button", "brief-more");
      toggle.type = "button";
      toggle.textContent = "Read full brief";
      toggle.setAttribute("aria-expanded", "false");

      toggle.addEventListener("click", () => {
        const clamped = message.classList.toggle("is-clamped");
        toggle.textContent = clamped ? "Read full brief" : "Show less";
        toggle.setAttribute("aria-expanded", String(!clamped));
        if (clamped) {
          message.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      });

      message.after(toggle);
    });
  }

  function renderList() {
    if (!els.list || !els.empty) return;

    const rows = filteredEntries();
    els.list.innerHTML = "";

    if (!entries.length) {
      els.list.hidden = true;
      els.empty.hidden = false;
      return;
    }

    els.empty.hidden = true;
    els.list.hidden = false;

    if (!rows.length) {
      const none = el("div", "dash-noresults");
      none.textContent = "No briefs match that search or filter.";
      els.list.appendChild(none);
      return;
    }

    const fragment = document.createDocumentFragment();
    rows.forEach((entry) => fragment.appendChild(briefElement(entry)));
    els.list.appendChild(fragment);

    requestAnimationFrame(addReadMore);
  }

  function refresh() {
    entries = readInbox();
    renderStats();
    renderProjectFilter();
    renderList();
  }

  /* ---------------------------------------------------------
     Export + clear
     --------------------------------------------------------- */
  function csvCell(value) {
    let text = String(value == null ? "" : value);
    // Prevent spreadsheet formula injection from visitor-supplied text.
    if (/^[=+\-@]/.test(text)) text = `'${text}`;
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  function exportCsv() {
    if (!entries.length) {
      setBanner("Nothing to export yet.", "warn", { timeout: 3200 });
      return;
    }

    const headers = [
      "Received",
      "Name",
      "Email",
      "WhatsApp",
      "Project",
      "Budget",
      "Message",
      "Source",
      "ID",
    ];
    const rows = entries.map((entry) => [
      entry.createdAt || "",
      entry.name || "",
      entry.email || "",
      entry.phone || "",
      entry.project || "",
      entry.budget || "",
      entry.message || "",
      entry.source || "",
      entry.id || "",
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `briefs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);

    setBanner(
      `Exported ${entries.length} brief${entries.length === 1 ? "" : "s"}.`,
      "ok",
      { timeout: 3200 }
    );
  }

  function clearInbox() {
    if (!entries.length) {
      setBanner("Inbox is already empty.", "", { timeout: 3000 });
      return;
    }

    const ok = window.confirm(
      `Delete all ${entries.length} brief${entries.length === 1 ? "" : "s"} from this browser? This can't be undone.`
    );
    if (!ok) return;

    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      setBanner("This browser blocked local storage, so the inbox couldn't be cleared.", "warn", {
        timeout: 6000,
      });
      return;
    }

    query = "";
    if (els.search) els.search.value = "";
    if (els.filter) els.filter.value = "";
    activeProject = "";
    refresh();
    setBanner("Inbox cleared.", "", { timeout: 3200 });
  }

  /* ---------------------------------------------------------
     Wire up
     --------------------------------------------------------- */
  refresh();
  initBadge();

  if (els.export) els.export.addEventListener("click", exportCsv);
  if (els.clear) els.clear.addEventListener("click", clearInbox);

  if (els.search) {
    els.search.addEventListener("input", () => {
      query = els.search.value;
      renderList();
    });
    els.search.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && els.search.value) {
        els.search.value = "";
        query = "";
        renderList();
      }
    });
  }

  if (els.filter) {
    els.filter.addEventListener("change", () => {
      activeProject = els.filter.value;
      renderList();
    });
  }

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey) refresh();
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) refresh();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
    const tag = document.activeElement ? document.activeElement.tagName : "";
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
    if (!els.search) return;
    event.preventDefault();
    els.search.focus();
  });
})();
