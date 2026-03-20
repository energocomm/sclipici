document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================
     SHOW HEADER ON SCROLL
     ======================================================== */
  const header = document.getElementById("siteHeader");
  if (header) {
    const onScroll = () => header.classList.toggle("show", window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ========================================================
     HAMBURGER MENU
     ======================================================== */
  const ham = document.getElementById("ham");
  const nav = document.getElementById("nav");

  if (ham && nav) {
    ham.addEventListener("click", () => {
      nav.classList.toggle("open");
      ham.classList.toggle("open");
      ham.setAttribute("aria-expanded", nav.classList.contains("open"));
    });

    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        ham.classList.remove("open");
        ham.setAttribute("aria-expanded", "false");
      }
    });
  }
});