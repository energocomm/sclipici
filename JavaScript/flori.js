/* ========================================================
   PARALLAX EFFECT
   ======================================================== */
const sections = document.querySelectorAll(".hero, .parallax");

function updateParallax() {
  const scrollY = window.scrollY;

  sections.forEach((sec) => {
    const speed = 0.3;
    const offset = sec.offsetTop;
    const y = (scrollY - offset) * speed;
    sec.style.backgroundPosition = `center ${y}px`;
  });
}

window.addEventListener("scroll", updateParallax, { passive: true });
updateParallax();

/* ========================================================
   FADE-IN ON SCROLL
   ======================================================== */
const fades = document.querySelectorAll(".fade");

function revealOnScroll() {
  const trigger = window.innerHeight * 0.85;

  fades.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) el.classList.add("show");
  });
}

window.addEventListener("scroll", revealOnScroll, { passive: true });
revealOnScroll();

/* ========================================================
   SHOW FIXED HEADER
   Dispare sus de tot, apare după ce începi să dai scroll
   ======================================================== */
const header = document.getElementById("siteHeader");

function setupHeaderVisibility() {
  if (!header) return;

  if (window.scrollY > 10) {
    header.classList.add("show");
  } else {
    header.classList.remove("show");
  }
}

window.addEventListener("scroll", setupHeaderVisibility, { passive: true });
window.addEventListener("resize", setupHeaderVisibility);
setupHeaderVisibility();

/* ========================================================
   HIDE SMALL FIXED FOOTER WHEN BIG CONTACT FOOTER APPEARS
   ======================================================== */
const fixedFooter = document.querySelector(".site-footer");
const bigfooter = document.getElementById("bigfooter");

if (fixedFooter && bigfooter) {
  const footerObserver = new IntersectionObserver(
    ([entry]) => {
      fixedFooter.classList.toggle("hide", entry.isIntersecting);
    },
    { threshold: 0.15 }
  );

  footerObserver.observe(bigfooter);
}

/* ========================================================
   BACK TO TOP BUTTON
   ======================================================== */
const mybutton = document.getElementById("myBtn");

function scrollFunction() {
  if (!mybutton) return;

  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

window.addEventListener("scroll", scrollFunction, { passive: true });
scrollFunction();

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

window.topFunction = topFunction;

/* ========================================================
   SIMPLE PRICE SLIDER
   ======================================================== */
let priceIndex = 0;

function updatePriceSlider() {
  const track = document.getElementById("priceTrack");
  if (!track) return;

  const slides = track.children.length;

  if (priceIndex < 0) priceIndex = slides - 1;
  if (priceIndex >= slides) priceIndex = 0;

  track.style.transform = `translateX(-${priceIndex * 100}%)`;
}

function priceNext() {
  priceIndex += 1;
  updatePriceSlider();
}

function pricePrev() {
  priceIndex -= 1;
  updatePriceSlider();
}

window.priceNext = priceNext;
window.pricePrev = pricePrev;

/* ========================================================
   PERSONALIZED BOUQUET CALCULATOR
   Sends order through selected email platform
   ======================================================== */
(function () {
  const personalizatSection = document.getElementById("personalizat");
  if (!personalizatSection) return;

  const PRICES = {
    rose_closed: 17,
    rose_open: 15,
    dahlia: 25,
    plumeria: 12,
    lily: 30,
    daisy: 7,
    tulip: 35,
    waterlily_lights: 150,
    butterflies: 5,
    bow: 7,
    lights: 15,
    pearls_per_flower: 1,
    glitter_per_flower: 3,
  };

  const LABELS = {
    rose_closed: "Trandafir (închis)",
    rose_open: "Trandafir (înflorit)",
    dahlia: "Dalie",
    plumeria: "Plumeria",
    lily: "Crin",
    daisy: "Romaniță",
    tulip: "Lalea",
    waterlily_lights: "Nufăr (cu luminițe...)",
    butterflies: "Fluturi / coronițe",
    bow: "Fundă",
    lights: "Luminițe",
  };

  const qtyInputs = personalizatSection.querySelectorAll(".qty");
  const totalEl = document.getElementById("persTotal");
  const breakEl = document.getElementById("persBreak");
  const accPearls = document.getElementById("accPearls");
  const accGlitter = document.getElementById("accGlitter");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutHint = document.getElementById("checkoutHint");

  const mailPlatformModal = document.getElementById("mailPlatformModal");
  const mailPlatformOverlay = document.getElementById("mailPlatformOverlay");
  const mailPlatformClose = document.getElementById("mailPlatformClose");
  const mailOptions = document.querySelectorAll(".mail-option");

  let pendingMailData = null;

  function lei(n) {
    return `${Math.round(n)} lei`;
  }

  function getQty(input) {
    const v = Number(input.value);
    return Number.isFinite(v) && v > 0 ? v : 0;
  }

  function setCheckoutState(total) {
    if (!checkoutBtn) return;

    const disabled = total === 0;
    checkoutBtn.disabled = disabled;
    checkoutBtn.style.opacity = disabled ? "0.6" : "1";
    checkoutBtn.style.pointerEvents = disabled ? "none" : "auto";

    if (checkoutHint) {
      checkoutHint.textContent = disabled
        ? "Adaugă cantități ca să poți trimite comanda."
        : "Apasă butonul pentru a alege platforma de email.";
    }
  }

  function calc() {
    let total = 0;
    let flowersCount = 0;
    const lines = [];

    qtyInputs.forEach((inp) => {
      const key = inp.dataset.item;
      const q = getQty(inp);
      if (!key || q === 0) return;

      const unit = PRICES[key] ?? 0;
      const sub = unit * q;
      total += sub;

      const isAccessory = ["butterflies", "bow", "lights"].includes(key);
      if (!isAccessory) flowersCount += q;

      const name = LABELS[key] || key;
      lines.push(`${name}: ${q} × ${unit} = ${lei(sub)}`);
    });

    if (accPearls?.checked && flowersCount > 0) {
      const sub = flowersCount * PRICES.pearls_per_flower;
      total += sub;
      lines.push(`Perle: ${flowersCount} × ${PRICES.pearls_per_flower} = ${lei(sub)}`);
    }

    if (accGlitter?.checked && flowersCount > 0) {
      const sub = flowersCount * PRICES.glitter_per_flower;
      total += sub;
      lines.push(`Sclipici: ${flowersCount} × ${PRICES.glitter_per_flower} = ${lei(sub)}`);
    }

    if (totalEl) totalEl.textContent = lei(total);

    if (breakEl) {
      breakEl.innerHTML = lines.length
        ? lines.map((line) => `• ${line}`).join("<br>")
        : "• Alege cantități ca să vezi calculul.";
    }

    setCheckoutState(total);
  }

  function openMailPlatformModal() {
    if (mailPlatformModal) {
      mailPlatformModal.hidden = false;
    }
  }

  function closeMailPlatformModal() {
    if (mailPlatformModal) {
      mailPlatformModal.hidden = true;
    }
  }

  function buildMailLink(platform, to, subject, body) {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const encodedTo = encodeURIComponent(to);

    if (platform === "gmail") {
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
    }

    if (platform === "outlook") {
      return `https://outlook.office.com/mail/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;
    }

    if (platform === "yahoo") {
      return `https://compose.mail.yahoo.com/?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;
    }

    return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
  }

  qtyInputs.forEach((inp) => inp.addEventListener("input", calc));
  accPearls?.addEventListener("change", calc);
  accGlitter?.addEventListener("change", calc);

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const summary = breakEl ? breakEl.innerText.replaceAll("• ", "").trim() : "";
      const totalText = totalEl ? totalEl.textContent : "0 lei";

      pendingMailData = {
        to: "everflowers.md@gmail.com",
        subject: "Comandă personalizată Ever Flowers",
        body:
          `Bună! Vreau să fac o comandă personalizată:\n\n` +
          `${summary}\n\n` +
          `Total: ${totalText}\n\n` +
          `Nume: \n` +
          `Oraș: Ialoveni\n` +
          `Data livrării/ridicării: `,
      };

      openMailPlatformModal();
    });
  }

  mailOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!pendingMailData) return;

      const platform = btn.dataset.mail;
      const link = buildMailLink(
        platform,
        pendingMailData.to,
        pendingMailData.subject,
        pendingMailData.body
      );

      closeMailPlatformModal();

      if (platform === "default") {
        window.location.href = link;
      } else {
        window.open(link, "_blank", "noopener");
      }
    });
  });

  mailPlatformClose?.addEventListener("click", closeMailPlatformModal);
  mailPlatformOverlay?.addEventListener("click", closeMailPlatformModal);

  calc();
})();

/* ========================================================
   MINI CART SYSTEM
   Fixed bouquets with simulated card checkout
   ======================================================== */
(function () {
  const CART_KEY = "everflowers_cart";

  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartCountEl = document.getElementById("cartCount");
  const cartCheckoutBtn = document.getElementById("cartCheckoutBtn");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const cartHint = document.getElementById("cartHint");
  const cartToggle = document.getElementById("cartToggle");
  const cartPanel = document.getElementById("cartPanel");
  const cartClose = document.getElementById("cartClose");
  const addButtons = document.querySelectorAll(".add-to-cart");

  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutOverlay = document.getElementById("checkoutOverlay");
  const checkoutClose = document.getElementById("checkoutClose");
  const checkoutSummary = document.getElementById("checkoutSummary");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutMessage = document.getElementById("checkoutMessage");

  const cardNumberInput = document.getElementById("cardNumber");
  const cardExpiryInput = document.getElementById("cardExpiry");

  function lei(n) {
    return `${Math.round(n)} lei`;
  }

  function getCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function getCartTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function getCartCount(cart) {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function openCart() {
    if (!cartPanel || !cartToggle) return;
    cartPanel.hidden = false;
    cartToggle.setAttribute("aria-expanded", "true");
  }

  function closeCart() {
    if (!cartPanel || !cartToggle) return;
    cartPanel.hidden = true;
    cartToggle.setAttribute("aria-expanded", "false");
  }

  function renderCart() {
    if (!cartItemsEl) return;

    const cart = getCart();

    if (!cart.length) {
      cartItemsEl.innerHTML = "Coșul este gol.";
      if (cartTotalEl) cartTotalEl.textContent = "0 lei";
      if (cartCountEl) cartCountEl.textContent = "0";
      if (cartCheckoutBtn) cartCheckoutBtn.disabled = true;
      if (cartHint) cartHint.textContent = "Adaugă buchete în coș pentru a continua.";
      return;
    }

    const html = cart
      .map(
        (item, index) => `
      <div class="cart-item">
        <strong>${item.name}</strong><br>
        Preț: ${lei(item.price)}<br>
        Subtotal: ${lei(item.price * item.qty)}

        <div class="cart-item-controls">
          <button type="button" class="cart-minus" data-index="${index}">−</button>
          <span>${item.qty}</span>
          <button type="button" class="cart-plus" data-index="${index}">+</button>
          <button type="button" class="more-btn cart-remove" data-index="${index}">Șterge</button>
        </div>
      </div>
    `
      )
      .join("");

    cartItemsEl.innerHTML = html;

    if (cartTotalEl) cartTotalEl.textContent = lei(getCartTotal(cart));
    if (cartCountEl) cartCountEl.textContent = String(getCartCount(cart));
    if (cartCheckoutBtn) cartCheckoutBtn.disabled = false;
    if (cartHint) cartHint.textContent = "Apasă Checkout pentru plata simulativă.";
  }

  function addToCart(product) {
    const cart = getCart();
    const existing = cart.find((item) => item.name === product.name);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        name: product.name,
        price: product.price,
        qty: 1,
      });
    }

    saveCart(cart);
    renderCart();
    openCart();
  }

  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
  }

  function changeQty(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;

    cart[index].qty += delta;

    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
  }

  function openCheckoutModal() {
    if (checkoutModal) checkoutModal.hidden = false;
  }

  function closeCheckoutModal() {
    if (checkoutModal) checkoutModal.hidden = true;
    if (checkoutForm) checkoutForm.reset();
    if (checkoutMessage) checkoutMessage.textContent = "";
  }

  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name || "Buchet";
      const price = Number(btn.dataset.price || 0);

      if (!price || price <= 0) return;

      addToCart({ name, price });
    });
  });

  cartItemsEl?.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".cart-remove");
    const plusBtn = e.target.closest(".cart-plus");
    const minusBtn = e.target.closest(".cart-minus");

    if (removeBtn) {
      removeFromCart(Number(removeBtn.dataset.index));
      return;
    }

    if (plusBtn) {
      changeQty(Number(plusBtn.dataset.index), 1);
      return;
    }

    if (minusBtn) {
      changeQty(Number(minusBtn.dataset.index), -1);
    }
  });

  clearCartBtn?.addEventListener("click", () => {
    localStorage.removeItem(CART_KEY);
    renderCart();
  });

  cartCheckoutBtn?.addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) return;

    let summaryHtml = "";
    let total = 0;

    cart.forEach((item) => {
      const sub = item.price * item.qty;
      total += sub;
      summaryHtml += `<div>${item.name} — ${item.qty} × ${item.price} = ${sub} lei</div>`;
    });

    if (checkoutSummary) checkoutSummary.innerHTML = summaryHtml;
    if (checkoutTotal) checkoutTotal.textContent = `${total} lei`;

    openCheckoutModal();
  });

  cartToggle?.addEventListener("click", () => {
    if (cartPanel?.hidden) {
      openCart();
    } else {
      closeCart();
    }
  });

  cartClose?.addEventListener("click", closeCart);

  document.addEventListener("click", (e) => {
    if (!cartPanel || cartPanel.hidden) return;
    if (cartPanel.contains(e.target) || cartToggle?.contains(e.target)) return;
    closeCart();
  });

  checkoutClose?.addEventListener("click", closeCheckoutModal);
  checkoutOverlay?.addEventListener("click", closeCheckoutModal);

  cardNumberInput?.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 16);
    value = value.replace(/(.{4})/g, "$1 ").trim();
    e.target.value = value;
  });

  cardExpiryInput?.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);

    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    e.target.value = value;
  });

  checkoutForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const cardName = document.getElementById("cardName")?.value.trim();
    const cardNumber = document.getElementById("cardNumber")?.value.replace(/\s/g, "");
    const cardExpiry = document.getElementById("cardExpiry")?.value.trim();
    const cardCvv = document.getElementById("cardCvv")?.value.trim();

    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
      if (checkoutMessage) checkoutMessage.textContent = "Completează toate câmpurile.";
      return;
    }

    if (cardNumber.length < 12) {
      if (checkoutMessage) checkoutMessage.textContent = "Numărul cardului este prea scurt.";
      return;
    }

    if (checkoutMessage) {
      checkoutMessage.textContent = "Plata a fost simulată cu succes.";
    }

    localStorage.removeItem(CART_KEY);
    renderCart();

    setTimeout(() => {
      closeCheckoutModal();
      closeCart();
    }, 1600);
  });

  renderCart();
  closeCart();
})();

/* ========================================================
   MOBILE HAMBURGER MENU
   ======================================================== */
const ham = document.getElementById("ham");
const nav = document.getElementById("nav");

if (ham && nav) {
  ham.addEventListener("click", () => {
    nav.classList.toggle("open");
    ham.classList.toggle("open");
    ham.setAttribute("aria-expanded", String(nav.classList.contains("open")));
  });

  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      ham.classList.remove("open");
      ham.setAttribute("aria-expanded", "false");
    }
  });
}

/* ========================================================
   HEADER / FOOTER SPARKLES
   ======================================================== */
function createLuxurySparkles(layerId, count) {
  const layer = document.getElementById(layerId);
  if (!layer) return;

  layer.innerHTML = "";

  for (let i = 0; i < count; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";

    const size = 5 + Math.random() * 8;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 3 + Math.random() * 4;

    sparkle.style.left = `${left}%`;
    sparkle.style.top = `${top}%`;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.animationDelay = `${delay}s`;
    sparkle.style.animationDuration = `${duration}s`;

    layer.appendChild(sparkle);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  createLuxurySparkles("headerSparkles", 15);
  createLuxurySparkles("footerSparkles", 10);
});