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
     MINI CART SYSTEM
     ======================================================== */
  const CART_KEY = "everflowers_buchete_cart";

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
      if (cartHint) cartHint.textContent = "Adaugă produse în coș pentru a continua.";
      return;
    }

    const html = cart.map((item, index) => `
      <div class="cart-item">
        <strong>${item.name}</strong><br>
        Preț: ${lei(item.price)}<br>
        Subtotal: ${lei(item.price * item.qty)}

        <div class="cart-item-controls">
          <button type="button" class="cart-minus" data-index="${index}">−</button>
          <span>${item.qty}</span>
          <button type="button" class="cart-plus" data-index="${index}">+</button>
          <button type="button" class="buy-btn cart-remove" data-index="${index}">Șterge</button>
        </div>
      </div>
    `).join("");

    cartItemsEl.innerHTML = html;

    if (cartTotalEl) cartTotalEl.textContent = lei(getCartTotal(cart));
    if (cartCountEl) cartCountEl.textContent = String(getCartCount(cart));
    if (cartCheckoutBtn) cartCheckoutBtn.disabled = false;
    if (cartHint) cartHint.textContent = "Apasă Checkout pentru a continua.";
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

  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name || "Produs";
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

  cartToggle?.addEventListener("click", () => {
    if (cartPanel?.hidden) openCart();
    else closeCart();
  });

  cartClose?.addEventListener("click", closeCart);

  document.addEventListener("click", (e) => {
    if (!cartPanel || cartPanel.hidden) return;
    if (cartPanel.contains(e.target) || cartToggle?.contains(e.target)) return;
    closeCart();
  });

  /* ========================================================
     SIMULATED CARD CHECKOUT
     ======================================================== */
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutOverlay = document.getElementById("checkoutOverlay");
  const checkoutClose = document.getElementById("checkoutClose");
  const checkoutSummary = document.getElementById("checkoutSummary");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutMessage = document.getElementById("checkoutMessage");

  function openCheckoutModal() {
    if (checkoutModal) checkoutModal.hidden = false;
  }

  function closeCheckoutModal() {
    if (checkoutModal) checkoutModal.hidden = true;
    if (checkoutForm) checkoutForm.reset();
    if (checkoutMessage) checkoutMessage.textContent = "";
  }

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

  checkoutClose?.addEventListener("click", closeCheckoutModal);
  checkoutOverlay?.addEventListener("click", closeCheckoutModal);

  const cardNumberInput = document.getElementById("cardNumber");
  const cardExpiryInput = document.getElementById("cardExpiry");

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
    }, 1800);
  });

  renderCart();
  closeCart();

  /* ========================================================
     HEART RAIN EFFECT + TOGGLE
     ======================================================== */
  let heartsEnabled = true;
  let rainInterval = null;

  const rainLayer = document.createElement("div");
  rainLayer.className = "heart-rain";
  document.body.appendChild(rainLayer);

  const toggleBtn = document.getElementById("heartsToggle");
  const hearts = ["❤️", "🤍"];

  function spawnHeart() {
    if (!heartsEnabled) return;

    const h = document.createElement("div");
    h.className = "heart";
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    h.style.left = `${Math.random() * 100}vw`;
    h.style.fontSize = `${12 + Math.random() * 18}px`;
    h.style.animationDuration = `${3 + Math.random() * 3.5}s`;
    h.style.setProperty("--drift", `${Math.random() * 60 - 30}px`);

    rainLayer.appendChild(h);
    setTimeout(() => h.remove(), 6000);
  }

  function startRain() {
    if (rainInterval) return;
    rainInterval = setInterval(spawnHeart, 220);
  }

  function stopRain() {
    clearInterval(rainInterval);
    rainInterval = null;
    rainLayer.innerHTML = "";
  }

  function updateToggle() {
    if (!toggleBtn) return;
    toggleBtn.textContent = heartsEnabled ? "💖 Inimi: Pornit" : "🖤 Inimi: Oprit";
    toggleBtn.classList.toggle("off", !heartsEnabled);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      heartsEnabled = !heartsEnabled;
      if (heartsEnabled) startRain();
      else stopRain();
      updateToggle();
    });
  }

  startRain();
  updateToggle();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopRain();
    else if (heartsEnabled) startRain();
  });
});