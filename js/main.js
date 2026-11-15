/* =========================================================
   Interaksi website portofolio
   1. Header berubah saat di-scroll + progress bar
   2. Animasi muncul saat di-scroll
   3. Menu aktif otomatis sesuai bagian yang sedang dilihat
   4. Angka berjalan (count-up)
   5. Filter proyek
   6. Teks peran berganti otomatis
   7. Lightbox galeri (klik gambar untuk memperbesar)
   8. Tahun otomatis di footer
   Website tetap tampil normal walaupun file ini gagal dimuat.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* 1. Header & progress bar */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".scroll-progress span");

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 12);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 2. Animasi muncul */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (!hasIO || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  }

  /* 3. Menu aktif (navbar, dock HP, daftar isi detail proyek) */
  var spyLinks = document.querySelectorAll("[data-spy]");
  if (spyLinks.length && hasIO) {
    var ids = [];
    spyLinks.forEach(function (a) {
      if (ids.indexOf(a.dataset.spy) === -1) ids.push(a.dataset.spy);
    });
    var setActive = function (id) {
      spyLinks.forEach(function (a) {
        var active = a.dataset.spy === id;
        a.classList.toggle("is-active", active);
        if (active) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    };
    var spyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ids.forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spyIO.observe(section);
    });
  }

  /* 4. Angka berjalan */
  var counters = document.querySelectorAll("[data-count]");
  var fmt = new Intl.NumberFormat("id-ID");

  function runCount(el) {
    var target = parseFloat(el.dataset.count);
    var prefix = el.dataset.prefix || "";
    var suffix = el.dataset.suffix || "";
    var duration = 1400;
    var start = null;
    function tick(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + fmt.format(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (counters.length && hasIO && !reduceMotion) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCount(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countIO.observe(el); });
  }

  /* 5. Filter proyek */
  var filterBtns = document.querySelectorAll("[data-filter]");
  var projectCards = document.querySelectorAll(".project-card[data-category]");
  var projectGrid = document.querySelector(".project-grid");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.dataset.filter;
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      projectCards.forEach(function (card) {
        var cats = card.dataset.category.split(" ");
        var show = filter === "semua" || cats.indexOf(filter) !== -1;
        card.hidden = !show;
        card.classList.add("is-visible");
        if (show && !reduceMotion) {
          card.classList.remove("pop");
          void card.offsetWidth; // restart animasi
          card.classList.add("pop");
        }
      });
      if (projectGrid) projectGrid.scrollTo({ left: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* 6. Teks peran berganti */
  var roleEl = document.querySelector("[data-roles]");
  if (roleEl && !reduceMotion) {
    var roles = roleEl.dataset.roles.split("|");
    var roleIndex = 0;
    setInterval(function () {
      roleEl.classList.add("is-out");
      setTimeout(function () {
        roleIndex = (roleIndex + 1) % roles.length;
        roleEl.textContent = roles[roleIndex];
        roleEl.classList.remove("is-out");
      }, 350);
    }, 2800);
  }

  /* 7. Lightbox galeri */
  var lbItems = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (lbItems.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Pratinjau gambar");
    box.innerHTML =
      '<button class="lb-btn lb-close" type="button" aria-label="Tutup"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
      '<button class="lb-btn lb-prev" type="button" aria-label="Gambar sebelumnya"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>' +
      '<figure class="lb-figure"><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lb-btn lb-next" type="button" aria-label="Gambar berikutnya"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>';
    document.body.appendChild(box);

    var lbImg = box.querySelector("img");
    var lbCap = box.querySelector("figcaption");
    var current = 0;
    var lastFocus = null;

    var show = function (index) {
      current = (index + lbItems.length) % lbItems.length;
      var item = lbItems[current];
      var thumb = item.querySelector("img");
      lbImg.src = item.dataset.lightbox;
      lbImg.alt = thumb ? thumb.alt : "";
      lbCap.textContent = item.dataset.caption || "";
    };
    var open = function (index) {
      lastFocus = document.activeElement;
      show(index);
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
      box.querySelector(".lb-close").focus();
    };
    var close = function () {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    lbItems.forEach(function (item, i) {
      item.addEventListener("click", function () { open(i); });
    });
    box.querySelector(".lb-close").addEventListener("click", close);
    box.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    box.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });

    // Geser (swipe) di HP
    var touchX = null;
    box.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      touchX = null;
    });
  }

  /* 8. Tahun otomatis */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
