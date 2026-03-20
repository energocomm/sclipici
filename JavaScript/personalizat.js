document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown-item");

  dropdowns.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        dropdowns.forEach((other) => {
          if (other !== item) {
            other.removeAttribute("open");
          }
        });
      }
    });
  });

  const ham = document.getElementById("ham");
  const nav = document.getElementById("nav");

  if (ham && nav) {
    ham.addEventListener("click", () => {
      const isOpen = ham.classList.toggle("open");
      nav.classList.toggle("open");
      ham.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        ham.classList.remove("open");
        nav.classList.remove("open");
        ham.setAttribute("aria-expanded", "false");
      });
    });
  }

  const prices = {
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
    lights: 15
  };

  const labels = {
    rose_closed: "Trandafir (închis)",
    rose_open: "Trandafir (înflorit)",
    dahlia: "Dalie",
    plumeria: "Plumeria",
    lily: "Crin",
    daisy: "Romaniță",
    tulip: "Lalea",
    waterlily_lights: "Nufăr cu luminițe",
    butterflies: "Fluturi / coronițe",
    bow: "Fundă",
    lights: "Luminițe"
  };

  const qtyInputs = document.querySelectorAll(".qty");
  const pearlsCheckbox = document.getElementById("accPearls");
  const glitterCheckbox = document.getElementById("accGlitter");
  const totalEl = document.getElementById("persTotal");
  const breakEl = document.getElementById("persBreak");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutHint = document.getElementById("checkoutHint");

  const mailModal = document.getElementById("mailPlatformModal");
  const mailOverlay = document.getElementById("mailPlatformOverlay");
  const mailClose = document.getElementById("mailPlatformClose");
  const mailOptions = document.querySelectorAll(".mail-option");

  const colorChoices = document.querySelectorAll('input[name="colorChoice"]');
  const shapeChoices = document.querySelectorAll('input[name="shapeChoice"]');
  const bouquetCards = document.querySelectorAll(".suggest-card");
  const resultsHint = document.getElementById("resultsHint");
  const resetChoicesBtn = document.getElementById("resetChoicesBtn");

  function getQtyMap() {
    const map = {};
    qtyInputs.forEach((input) => {
      map[input.dataset.item] = Math.max(0, Number(input.value) || 0);
    });
    return map;
  }

  function getFlowerCount(qtyMap) {
    return (
      qtyMap.rose_closed +
      qtyMap.rose_open +
      qtyMap.dahlia +
      qtyMap.plumeria +
      qtyMap.lily +
      qtyMap.daisy +
      qtyMap.tulip +
      qtyMap.waterlily_lights
    );
  }

  function updateCalculator() {
    const qtyMap = getQtyMap();
    const flowerCount = getFlowerCount(qtyMap);

    let total = 0;
    const lines = [];

    Object.keys(prices).forEach((key) => {
      const qty = qtyMap[key];
      if (qty > 0) {
        const sum = qty * prices[key];
        total += sum;
        lines.push(`${labels[key]} × ${qty} = ${sum} lei`);
      }
    });

    if (pearlsCheckbox.checked && flowerCount > 0) {
      const pearlsCost = flowerCount;
      total += pearlsCost;
      lines.push(`Perle × ${flowerCount} = ${pearlsCost} lei`);
    }

    if (glitterCheckbox.checked && flowerCount > 0) {
      const glitterCost = flowerCount * 3;
      total += glitterCost;
      lines.push(`Sclipici × ${flowerCount} = ${glitterCost} lei`);
    }

    totalEl.textContent = `${total} lei`;

    if (lines.length === 0) {
      breakEl.textContent = "• Alege cantități ca să vezi calculul.";
      checkoutBtn.disabled = true;
      checkoutHint.textContent = "";
    } else {
      breakEl.innerHTML = lines.join("<br>");
      checkoutBtn.disabled = false;
      checkoutHint.textContent = "Apasă pe „Trimite comanda” pentru a alege platforma de email.";
    }
  }

  function buildOrderText() {
    const qtyMap = getQtyMap();
    const flowerCount = getFlowerCount(qtyMap);
    let total = 0;
    const lines = [];

    const selectedColor = document.querySelector('input[name="colorChoice"]:checked');
    const selectedShape = document.querySelector('input[name="shapeChoice"]:checked');

    lines.push("Bună ziua!");
    lines.push("");
    lines.push("Aș dori să plasez următoarea comandă personalizată:");
    lines.push("");

    if (selectedColor) {
      lines.push(`- Culoare preferată: ${selectedColor.value}`);
    }

    if (selectedShape) {
      lines.push(`- Formă preferată: ${selectedShape.value}`);
    }

    if (selectedColor || selectedShape) {
      lines.push("");
    }

    Object.keys(prices).forEach((key) => {
      const qty = qtyMap[key];
      if (qty > 0) {
        const sum = qty * prices[key];
        total += sum;
        lines.push(`- ${labels[key]}: ${qty} buc. (${sum} lei)`);
      }
    });

    if (pearlsCheckbox.checked && flowerCount > 0) {
      const pearlsCost = flowerCount;
      total += pearlsCost;
      lines.push(`- Perle: da (${flowerCount} flori / ${pearlsCost} lei)`);
    }

    if (glitterCheckbox.checked && flowerCount > 0) {
      const glitterCost = flowerCount * 3;
      total += glitterCost;
      lines.push(`- Sclipici: da (${flowerCount} flori / ${glitterCost} lei)`);
    }

    lines.push("");
    lines.push(`Total estimativ: ${total} lei`);
    lines.push("");
    lines.push("Mulțumesc!");

    return lines.join("\n");
  }

  function openMailModal() {
    if (checkoutBtn.disabled) return;
    mailModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeMailModal() {
    mailModal.hidden = true;
    document.body.style.overflow = "";
  }

  function openMailPlatform(type) {
    const subject = encodeURIComponent("Comandă personalizată Ever Flowers");
    const body = encodeURIComponent(buildOrderText());
    const to = "everflowers.md@gmail.com";
    let url = "";

    if (type === "gmail") {
      url = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
      window.open(url, "_blank");
    } else if (type === "outlook") {
      url = `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${subject}&body=${body}`;
      window.open(url, "_blank");
    } else if (type === "yahoo") {
      url = `https://compose.mail.yahoo.com/?to=${to}&subject=${subject}&body=${body}`;
      window.open(url, "_blank");
    } else {
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    }

    closeMailModal();
  }

  function updateBouquetMatches() {
    const selectedColor = document.querySelector('input[name="colorChoice"]:checked')?.value || "";
    const selectedShape = document.querySelector('input[name="shapeChoice"]:checked')?.value || "";

    let visibleCount = 0;

    bouquetCards.forEach((card) => {
      const colors = card.dataset.colors.split(" ");
      const shapes = card.dataset.shapes.split(" ");

      const colorMatch = !selectedColor || colors.includes(selectedColor);
      const shapeMatch = !selectedShape || shapes.includes(selectedShape);

      if ((selectedColor || selectedShape) && colorMatch && shapeMatch) {
        card.classList.add("show");
        visibleCount += 1;
      } else {
        card.classList.remove("show");
      }
    });

    if (!selectedColor && !selectedShape) {
      resultsHint.textContent = "Alege o culoare sau o formă ca să vezi sugestiile.";
    } else if (visibleCount === 0) {
      resultsHint.textContent = "Nu există încă un buchet exact pe această combinație.";
    } else {
      resultsHint.textContent = `Au fost găsite ${visibleCount} sugestii potrivite.`;
    }
  }

  function resetChoices() {
    colorChoices.forEach((input) => {
      input.checked = false;
    });

    shapeChoices.forEach((input) => {
      input.checked = false;
    });

    updateBouquetMatches();
  }

  qtyInputs.forEach((input) => {
    input.addEventListener("input", updateCalculator);
  });

  pearlsCheckbox.addEventListener("change", updateCalculator);
  glitterCheckbox.addEventListener("change", updateCalculator);

  checkoutBtn.addEventListener("click", openMailModal);
  mailOverlay.addEventListener("click", closeMailModal);
  mailClose.addEventListener("click", closeMailModal);

  mailOptions.forEach((button) => {
    button.addEventListener("click", () => {
      openMailPlatform(button.dataset.mail);
    });
  });

  colorChoices.forEach((input) => {
    input.addEventListener("change", updateBouquetMatches);
  });

  shapeChoices.forEach((input) => {
    input.addEventListener("change", updateBouquetMatches);
  });

  resetChoicesBtn.addEventListener("click", resetChoices);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mailModal.hidden) {
      closeMailModal();
    }
  });

  updateCalculator();
  updateBouquetMatches();
});