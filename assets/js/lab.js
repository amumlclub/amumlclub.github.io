(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initSidebar() {
    const sidebar = document.querySelector("#header-side");
    const overlay = document.querySelector("#overlay");
    if (!sidebar || !overlay) return;

    window.OpenSidebar = function () {
      sidebar.classList.add("show");
      overlay.classList.add("show");
      document.body.classList.add("nav-open");
    };

    window.CloseSidebar = function () {
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
      document.body.classList.remove("nav-open");
    };

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") window.CloseSidebar();
    });

    sidebar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => window.CloseSidebar());
    });
  }

  function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    if (!faqItems.length) return;

    faqItems.forEach((item, index) => {
      const button = item.querySelector(".faq-question");
      const icon = item.querySelector(".faq-icon");
      const answer = item.querySelector(".faq-answer");
      if (!button || !answer) return;
      button.dataset.faqBound = "true";

      const answerId = `faq-answer-${index + 1}`;
      answer.id = answerId;
      button.type = "button";
      button.setAttribute("aria-controls", answerId);
      button.setAttribute("aria-expanded", item.classList.contains("active") ? "true" : "false");
      if (icon && item.classList.contains("active")) icon.textContent = "-";

      button.addEventListener("click", () => {
        const willOpen = !item.classList.contains("active");
        faqItems.forEach((entry) => {
          entry.classList.remove("active");
          const entryButton = entry.querySelector(".faq-question");
          const entryIcon = entry.querySelector(".faq-icon");
          if (entryButton) entryButton.setAttribute("aria-expanded", "false");
          if (entryIcon) entryIcon.textContent = "+";
        });

        if (willOpen) {
          item.classList.add("active");
          button.setAttribute("aria-expanded", "true");
          if (icon) icon.textContent = "-";
        }
      });
    });
  }

  function initNetwork() {
    const heroes = document.querySelectorAll(".hero-section, .team-hero, .projects-hero, .events-hero, .membership-hero, .contact-hero");
    if (!heroes.length || reduceMotion) return;

    heroes.forEach((hero) => {
      if (hero.querySelector(".ml-network")) return;

      const canvas = document.createElement("canvas");
      canvas.className = "ml-network";
      canvas.setAttribute("aria-hidden", "true");
      hero.prepend(canvas);

      const ctx = canvas.getContext("2d");
      let width = 0;
      let height = 0;
      let points = [];
      let pointer = { x: 0.72, y: 0.34 };

      function resize() {
        const rect = hero.getBoundingClientRect();
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = Math.max(1, Math.floor(rect.width));
        height = Math.max(1, Math.floor(rect.height));
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        const count = width < 600 ? 22 : width < 1000 ? 34 : 48;
        points = Array.from({ length: count }, (_, index) => ({
          x: ((index * 157) % width) + Math.random() * 28,
          y: ((index * 83) % height) + Math.random() * 28,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 1.4 + Math.random() * 1.7
        }));
      }

      function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 1;

        points.forEach((point) => {
          const attractX = pointer.x * width;
          const attractY = pointer.y * height;
          point.x += point.vx + (attractX - point.x) * 0.0007;
          point.y += point.vy + (attractY - point.y) * 0.0007;

          if (point.x < -30) point.x = width + 30;
          if (point.x > width + 30) point.x = -30;
          if (point.y < -30) point.y = height + 30;
          if (point.y > height + 30) point.y = -30;
        });

        for (let i = 0; i < points.length; i += 1) {
          for (let j = i + 1; j < points.length; j += 1) {
            const a = points[i];
            const b = points[j];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);
            if (distance < 155) {
              ctx.strokeStyle = `rgba(78, 205, 196, ${0.18 * (1 - distance / 155)})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }

        points.forEach((point, index) => {
          ctx.fillStyle = index % 5 === 0 ? "rgba(215, 166, 65, 0.82)" : "rgba(244, 247, 251, 0.56)";
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
          ctx.fill();
        });

        requestAnimationFrame(draw);
      }

      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        pointer = {
          x: (event.clientX - rect.left) / rect.width,
          y: (event.clientY - rect.top) / rect.height
        };
      });

      resize();
      window.addEventListener("resize", resize, { passive: true });
      draw();
    });
  }

  function initGsap() {
    if (reduceMotion || !window.gsap) return;

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    gsap.from(".header", {
      y: -24,
      opacity: 0,
      duration: 0.75,
      ease: "power3.out"
    });

    gsap.utils.toArray(".hero-kicker, .hero-title, .hero-copy, .hero-panel, .team-hero h5, .team-hero h1, .team-hero p, .projects-hero h5, .projects-hero h1, .projects-hero p, .events-hero h5, .events-hero h1, .events-hero p, .membership-hero h5, .membership-hero h1, .membership-hero p, .contact-hero h5, .contact-hero h1, .contact-hero p").forEach((element, index) => {
      gsap.from(element, {
        y: 28,
        opacity: 0,
        duration: 0.8,
        delay: Math.min(index * 0.06, 0.28),
        ease: "power3.out"
      });
    });

    if (!window.ScrollTrigger) return;

    gsap.utils.toArray(".lab-section, .project-card, .member, .service-item, .benefit-card, .info-item, .faq-item, .loop-step, .discipline-node").forEach((element) => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: "top 86%"
        },
        y: 36,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out"
      });
    });

    gsap.utils.toArray(".lab-media img, .lab-media video, .project-img").forEach((media) => {
      gsap.to(media, {
        scrollTrigger: {
          trigger: media,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        },
        yPercent: -8,
        ease: "none"
      });
    });
  }

  function initMagneticButtons() {
    if (reduceMotion) return;

    document.querySelectorAll(".btn-lab, .cta-button, .btn-join, .readmore, .php-email-form button").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
        button.style.transform = `translate(${x}px, ${y}px)`;
      });

      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });
    });
  }

  function initContactFormFallback() {
    document.querySelectorAll('form.php-email-form[action="forms/contact.php"]').forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const subject = String(formData.get("subject") || "MLC contact").trim();
        const message = String(formData.get("message") || "").trim();

        if (!name || !email || !subject || !message) {
          form.reportValidity();
          return;
        }

        const body = [
          `Name: ${name}`,
          `Email: ${email}`,
          "",
          message
        ].join("\n");

        window.location.href = `mailto:amumlc@zhcet.ac.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSidebar();
    initFAQ();
    initNetwork();
    initGsap();
    initMagneticButtons();
    initContactFormFallback();
  });
})();
