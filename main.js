const siteHeader = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = document.querySelectorAll(".nav-link");
const scrollProgress = document.getElementById("scrollProgress");
const loader = document.getElementById("loader");
const typingText = document.getElementById("typingText");
const revealNodes = document.querySelectorAll(".reveal");
const skillFills = document.querySelectorAll(".skill-fill");
const skillsSection = document.getElementById("skills");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const backToTop = document.getElementById("backToTop");
const yearNode = document.getElementById("year");
const tiltNodes = document.querySelectorAll(".tilt-3d");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

const typingRoles = [
  "Data Analyst | Software Developer | Python | SQL | Machine Learning",
  "Python | SQL | Machine Learning",
  "EDA | Dashboard Development",
  "Data-Driven Application Builder",
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;
let skillsAnimated = false;

function updateProgressBar() {
  if (!scrollProgress) return;
  const top = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (top / height) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

function updateHeaderState() {
  siteHeader?.classList.toggle("scrolled", window.scrollY > 14);
}

function updateBackTopState() {
  if (!backToTop) return;
  backToTop.classList.toggle("show", window.scrollY > 420);
}

function closeMobileNav() {
  siteNav?.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
}

function setActiveNavLink() {
  const sections = document.querySelectorAll("main section[id]");
  let activeId = "home";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom >= 140) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("active", isActive);
  });
}

function runTypingEffect() {
  if (!typingText) return;
  if (reducedMotion) {
    typingText.textContent = typingRoles[0];
    return;
  }

  const currentRole = typingRoles[roleIndex];
  typingText.textContent = currentRole.slice(0, charIndex);

  if (!deleting && charIndex < currentRole.length) {
    charIndex += 1;
    setTimeout(runTypingEffect, 72);
    return;
  }

  if (!deleting && charIndex === currentRole.length) {
    deleting = true;
    setTimeout(runTypingEffect, 1300);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(runTypingEffect, 40);
    return;
  }

  deleting = false;
  roleIndex = (roleIndex + 1) % typingRoles.length;
  setTimeout(runTypingEffect, 300);
}

function initRevealAnimation() {
  revealNodes.forEach((node, index) => {
    const delay = (index % 10) * 42;
    node.style.transitionDelay = `${delay}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    {
      threshold: 0.16,
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function initAOS() {
  if (!window.AOS || reducedMotion) return;

  revealNodes.forEach((node, index) => {
    if (!node.hasAttribute("data-aos")) {
      node.setAttribute("data-aos", index % 2 === 0 ? "fade-up" : "fade-right");
      node.setAttribute("data-aos-delay", String((index % 8) * 40));
      node.setAttribute("data-aos-duration", "820");
      node.setAttribute("data-aos-once", "true");
    }
  });

  window.AOS.init({
    duration: 820,
    easing: "ease-out-cubic",
    once: true,
    mirror: false,
    offset: 72,
  });
}

function animateSkillBars() {
  if (skillsAnimated) return;
  skillsAnimated = true;

  skillFills.forEach((fill) => {
    const level = Number(fill.getAttribute("data-level") || "0");
    fill.style.width = `${Math.max(0, Math.min(level, 100))}%`;
  });
}

function initSkillsObserver() {
  if (!skillsSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkillBars();
          observer.disconnect();
        }
      });
    },
    {
      threshold: 0.35,
    }
  );

  observer.observe(skillsSection);
}

function setFormStatus(message, status = "") {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.remove("success", "error");
  if (status) formStatus.classList.add(status);
}

function setSubmitState(submitting) {
  const button = contactForm?.querySelector('button[type="submit"]');
  if (!button) return;
  button.disabled = submitting;
  button.innerHTML = submitting
    ? '<i class="fa-solid fa-spinner fa-spin"></i> Sending...'
    : '<i class="fa-solid fa-paper-plane"></i> Send Message';
}

function setFieldError(fieldName, message) {
  const node = contactForm?.querySelector(`[data-error-for="${fieldName}"]`);
  if (!node) return;
  node.textContent = message;
}

function clearFieldErrors() {
  ["name", "email", "message"].forEach((key) => setFieldError(key, ""));
}

function validateContactForm() {
  if (!contactForm) return false;
  clearFieldErrors();

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  let valid = true;

  if (name.length < 2) {
    setFieldError("name", "Please enter your name.");
    valid = false;
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    setFieldError("email", "Please enter a valid email address.");
    valid = false;
  }

  if (message.length < 10) {
    setFieldError("message", "Please enter at least 10 characters.");
    valid = false;
  }

  if (valid) {
    contactForm.name.value = name;
    contactForm.email.value = email;
    contactForm.message.value = message;
  }

  return valid;
}

function initContactForm() {
  if (!contactForm) return;

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateContactForm()) {
      setFormStatus("Please fix the highlighted fields.", "error");
      return;
    }

    setSubmitState(true);
    setFormStatus("Submitting your message...", "");
    const formData = new FormData(contactForm);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch("https://formsubmit.co/ajax/chetnasikarwar703@gmail.com", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json().catch(() => ({}));
      const delivered =
        result.success === true ||
        result.success === "true" ||
        (typeof result.message === "string" && /sent|success/i.test(result.message));

      if (!delivered) {
        throw new Error(result.message || "Unable to confirm delivery.");
      }

      contactForm.reset();
      clearFieldErrors();
      setFormStatus("Message sent successfully. Check inbox/spam for confirmation.", "success");
    } catch (error) {
      if (error.name === "AbortError") {
        setFormStatus("Submission timed out. Please check internet and try again.", "error");
      } else {
        setFormStatus(
          "Message was not sent. If this is first use of FormSubmit, activate it from the verification email, then try again.",
          "error"
        );
      }
    } finally {
      clearTimeout(timeoutId);
      setSubmitState(false);
    }
  });
}

function initSmoothScrolling() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      closeMobileNav();
    });
  });
}

function initNav() {
  navToggle?.addEventListener("click", () => {
    const isOpen = siteNav?.classList.toggle("open") ?? false;
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeMobileNav();
  });
}

function initBackTop() {
  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function initTilt3D() {
  if (reducedMotion || coarsePointer || !tiltNodes.length) return;

  tiltNodes.forEach((node) => {
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width;
      const offsetY = (event.clientY - rect.top) / rect.height;
      const rotateY = (offsetX - 0.5) * 10;
      const rotateX = (0.5 - offsetY) * 10;

      node.style.setProperty("--rotateX", `${rotateX.toFixed(2)}deg`);
      node.style.setProperty("--rotateY", `${rotateY.toFixed(2)}deg`);
    });

    node.addEventListener("pointerleave", () => {
      node.style.setProperty("--rotateX", "0deg");
      node.style.setProperty("--rotateY", "0deg");
    });
  });
}

function initParticles() {
  if (reducedMotion) return;

  const canvas = document.getElementById("particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const points = [];
  const maxPoints = Math.min(65, Math.max(20, Math.floor(window.innerWidth / 24)));

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makePoint() {
    const velocity = Math.random() * 0.45 + 0.2;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * velocity,
      vy: (Math.random() - 0.5) * velocity,
      r: Math.random() * 2 + 0.6,
      a: Math.random() * 0.5 + 0.12,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
      if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 189, 255, ${p.a})`;
      ctx.fill();

      for (let j = i + 1; j < points.length; j += 1) {
        const q = points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 130) {
          const opacity = (1 - dist / 130) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(127, 191, 255, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  resize();
  for (let i = 0; i < maxPoints; i += 1) points.push(makePoint());
  draw();

  window.addEventListener("resize", resize);
}

window.addEventListener("scroll", () => {
  updateProgressBar();
  updateHeaderState();
  updateBackTopState();
  setActiveNavLink();
});

window.addEventListener("load", () => {
  setTimeout(() => loader?.classList.add("hidden"), 650);
  updateProgressBar();
  updateHeaderState();
  updateBackTopState();
  setActiveNavLink();

  runTypingEffect();
  initAOS();
  initRevealAnimation();
  initSkillsObserver();
  initSmoothScrolling();
  initNav();
  initBackTop();
  initTilt3D();
  initContactForm();
  initParticles();

  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
});


