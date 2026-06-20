// Header: фон при скролле
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 30);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Мобильное меню
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const overlay = document.getElementById("nav-overlay");

const setNavOpen = (open) => {
  document.body.classList.toggle("nav-open", open);
  overlay?.classList.toggle("is-visible", open);
  overlay?.setAttribute("aria-hidden", String(!open));
};

burger.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
  setNavOpen(open);
});

nav.querySelectorAll(".nav__link").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    setNavOpen(false);
  })
);

overlay?.addEventListener("click", () => {
  nav.classList.remove("is-open");
  burger.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  setNavOpen(false);
});

// Появление блоков при скролле (кроме элементов внутри reveal-group)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => {
  if (!el.closest(".reveal-group")) observer.observe(el);
});
