(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsapReady = Boolean(window.gsap && window.ScrollTrigger);
  const body = document.body;
  const menu = document.querySelector(".site-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const cursor = document.querySelector(".custom-cursor");

  document.querySelectorAll(".preloader-line").forEach((line) => {
    const letters = Array.from(line.dataset.text, (character) => {
      const letter = document.createElement("span");
      letter.className = "preloader-letter";
      letter.textContent = character === " " ? "\u00a0" : character;
      return letter;
    });
    line.replaceChildren(...letters);
  });

  function showSite() {
    if (reduceMotion) {
      body.classList.add("is-loaded");
      document.querySelectorAll(".reveal").forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
      return;
    }

    if (gsapReady) {
      body.classList.add("js-motion", "has-preloader");
      const progress = { value: 0 };
      const counter = document.querySelector(".preloader-count");
      const bar = document.querySelector(".preloader-track span");
      const preloader = gsap.timeline({
        onComplete: () => {
          body.classList.remove("has-preloader");
          body.classList.add("is-loaded");
          gsap.fromTo(
            ".hero-kicker, .hero-copy, .round-link, .scroll-cue",
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power4.out" }
          );
          gsap.fromTo(".hero-line > span", {
            clipPath: "inset(100% 0% 0% 0%)"
          }, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.9,
            stagger: 0.13,
            ease: "power4.out",
            clearProps: "clipPath"
          });
          initScrollAnimations();
        }
      });

      preloader.to(progress, {
        value: 100,
        duration: 1.65,
        ease: "power2.inOut",
        onUpdate: () => {
          counter.textContent = String(Math.round(progress.value)).padStart(3, "0");
          bar.style.width = `${progress.value}%`;
        }
      });
      preloader.fromTo(".preloader-letter", {
        opacity: 0,
        y: 18
      }, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.035,
        ease: "power4.out"
      }, 0);
      preloader.to(".preloader-name", {
        opacity: 0,
        y: -20,
        duration: 0.35,
        ease: "power2.in"
      }, "-=0.12");
      preloader.to(".preloader", {
        yPercent: -100,
        duration: 0.85,
        ease: "power4.inOut"
      });
      return;
    }

    body.classList.add("has-preloader");
    const counter = document.querySelector(".preloader-count");
    const bar = document.querySelector(".preloader-track span");
    const started = performance.now();
    const duration = 1300;
    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const value = Math.round(progress * 100);
      counter.textContent = String(value).padStart(3, "0");
      bar.style.width = `${value}%`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        document.querySelector(".preloader").style.transition = "transform 700ms cubic-bezier(0.76, 0, 0.24, 1)";
        document.querySelector(".preloader").style.transform = "translateY(-100%)";
        window.setTimeout(() => {
          body.classList.remove("has-preloader");
          body.classList.add("is-loaded");
        }, 720);
      }
    };
    requestAnimationFrame(tick);
  }

  function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".reveal").forEach((element) => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power4.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          once: true
        }
      });
    });

    gsap.to(".portrait-frame img", {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: ".portrait-wrap",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }

  function openMenu() {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    body.classList.add("menu-open");
    menu.querySelector("a").focus();

    if (gsapReady && !reduceMotion) {
      gsap.fromTo(menu.querySelectorAll(".menu-links a"), {
        opacity: 0,
        y: 22
      }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power4.out"
      });
    }
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    if (menuToggle.getAttribute("aria-expanded") === "true") closeMenu();
    else openMenu();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });

  const projectInfo = {
    northstar: {
      title: "Northstar",
      type: "Brand platform · Identity / Digital experience",
      description: "A confident new compass for a fictional outdoor brand. An expressive identity and digital home designed to make the next adventure feel a little closer."
    },
    formandfield: {
      title: "Form & Field",
      type: "Digital flagship · E-commerce / Art direction",
      description: "A warm, tactile storefront for a fictional homeware studio — bringing thoughtful objects, natural materials, and an unhurried shopping experience together."
    },
    solace: {
      title: "Solace",
      type: "Wellness, reimagined · Product design / Development",
      description: "A calmer kind of wellness companion. A gentle visual language and considered interface make space for small daily rituals and meaningful progress."
    },
    stilllife: {
      title: "Still Life",
      type: "Culture journal · Editorial / Web design",
      description: "A digital journal for the curious, celebrating the people, places, and ideas that make everyday life feel extraordinary."
    }
  };

  const projectDialog = document.querySelector(".project-dialog");
  const closeDialog = () => {
    if (projectDialog.open) projectDialog.close();
  };

  document.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("click", (event) => {
      event.preventDefault();
      const project = projectInfo[card.dataset.project];
      if (!project) return;
      document.querySelector(".dialog-kicker span").textContent = card.dataset.project;
      document.querySelector(".dialog-panel h2").textContent = project.title;
      document.querySelector(".dialog-type").textContent = project.type;
      document.querySelector(".dialog-description").textContent = project.description;
      projectDialog.showModal();
      body.classList.add("dialog-open");
      projectDialog.querySelector(".dialog-close").focus();
    });
  });

  projectDialog.querySelector(".dialog-close").addEventListener("click", closeDialog);
  projectDialog.querySelector(".dialog-backdrop").addEventListener("click", closeDialog);
  projectDialog.addEventListener("close", () => body.classList.remove("dialog-open"));

  document.querySelector(".back-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  });

  const updateLocalTime = () => {
    document.querySelector("#local-time").textContent = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      hour: "numeric",
      minute: "2-digit"
    }).format(new Date());
  };
  updateLocalTime();
  window.setInterval(updateLocalTime, 60_000);
  document.querySelector("#current-year").textContent = String(new Date().getFullYear());

  if (window.matchMedia("(pointer: fine)").matches) {
    let cursorX = 0;
    let cursorY = 0;
    document.addEventListener("pointermove", (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      cursor.classList.add("is-visible");
    });

    document.querySelectorAll("a, button, summary, [data-cursor]").forEach((element) => {
      element.addEventListener("pointerenter", () => {
        const label = element.matches("[data-project]") ? "View" : element.dataset.cursor || "↗";
        cursor.querySelector("span").textContent = label;
        cursor.classList.add("is-active");
      });
      element.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
    });

    document.querySelectorAll(".project-card").forEach((card) => {
      const image = card.querySelector("img");
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        image.style.setProperty("--image-x", `${x * -16}px`);
        image.style.setProperty("--image-y", `${y * -16}px`);
      });
      card.addEventListener("pointerleave", () => {
        image.style.removeProperty("--image-x");
        image.style.removeProperty("--image-y");
      });
    });

    if (gsapReady && !reduceMotion) {
      document.querySelectorAll(".magnetic").forEach((element) => {
        element.addEventListener("pointermove", (event) => {
          const bounds = element.getBoundingClientRect();
          const x = (event.clientX - bounds.left - bounds.width / 2) * 0.16;
          const y = (event.clientY - bounds.top - bounds.height / 2) * 0.16;
          gsap.to(element, { x, y, duration: 0.35, ease: "power3.out" });
        });
        element.addEventListener("pointerleave", () => {
          gsap.to(element, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
        });
      });
    }
  }

  showSite();
})();
