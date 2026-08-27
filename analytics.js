// Replace this value with your GA4 Measurement ID, for example G-XXXXXXXXXX.
const GA4_MEASUREMENT_ID = "G-REPLACE_ME";

// Optional: replace with a GTM container ID, for example GTM-XXXXXXX.
const GTM_CONTAINER_ID = "";

window.dataLayer = window.dataLayer || [];

function gtag() {
  window.dataLayer.push(arguments);
}

function loadScript(src) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function initAnalytics() {
  if (GTM_CONTAINER_ID) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`);
    return;
  }

  if (GA4_MEASUREMENT_ID && GA4_MEASUREMENT_ID !== "G-REPLACE_ME") {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`);
    gtag("js", new Date());
    gtag("config", GA4_MEASUREMENT_ID, { debug_mode: true });
  }
}

function sendEvent(name, params = {}) {
  window.dataLayer.push({ event: name, ...params });

  if (GA4_MEASUREMENT_ID && GA4_MEASUREMENT_ID !== "G-REPLACE_ME" && !GTM_CONTAINER_ID) {
    gtag("event", name, { ...params, debug_mode: true });
  }

  console.log(`[GA4 TEST] ${name}`, params);
}

function getCart() {
  return JSON.parse(localStorage.getItem("ga4-test-cart") || "[]");
}

function setCart(cart) {
  localStorage.setItem("ga4-test-cart", JSON.stringify(cart));
}

function itemFromCard(card) {
  return {
    item_id: card.dataset.itemId,
    item_name: card.dataset.itemName,
    price: Number(card.dataset.price),
    quantity: 1
  };
}

function cartValue(items) {
  return Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
}

function setupHome() {
  const leadButton = document.getElementById("leadButton");
  leadButton?.addEventListener("click", () => {
    sendEvent("generate_lead", {
      currency: "EUR",
      value: 25,
      lead_source: "homepage_test_button"
    });
    leadButton.textContent = "Lead event sent ✓";
  });
}

function setupProducts() {
  document.querySelectorAll(".product").forEach((card) => {
    card.querySelector(".view-item")?.addEventListener("click", () => {
      const item = itemFromCard(card);
      sendEvent("view_item", {
        currency: "EUR",
        value: item.price,
        items: [item]
      });
    });

    card.querySelector(".add-cart")?.addEventListener("click", () => {
      const item = itemFromCard(card);
      const cart = getCart();
      const existing = cart.find((x) => x.item_id === item.item_id);

      if (existing) existing.quantity += 1;
      else cart.push(item);

      setCart(cart);
      sendEvent("add_to_cart", {
        currency: "EUR",
        value: item.price,
        items: [item]
      });
    });
  });
}

function setupCheckout() {
  const cart = getCart();
  const summary = document.getElementById("cartSummary");
  const form = document.getElementById("checkoutForm");
  const message = document.getElementById("purchaseMessage");

  if (summary) {
    summary.innerHTML = cart.length
      ? `<h2>Cart</h2><ul>${cart.map((item) => `<li>${item.item_name} × ${item.quantity} — €${(item.price * item.quantity).toFixed(2)}</li>`).join("")}</ul><strong>Total: €${cartValue(cart).toFixed(2)}</strong>`
      : `<h2>Cart</h2><p>Your cart is empty. Add products first.</p>`;
  }

  if (cart.length) {
    sendEvent("begin_checkout", {
      currency: "EUR",
      value: cartValue(cart),
      items: cart
    });
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!cart.length) return;

    const transactionId = `TEST-${Date.now()}`;
    sendEvent("purchase", {
      transaction_id: transactionId,
      currency: "EUR",
      value: cartValue(cart),
      tax: 0,
      shipping: 0,
      items: cart
    });

    setCart([]);
    if (message) message.hidden = false;
  });
}

function setupPromotionTracking() {
  document.querySelectorAll("[data-track='select_promotion']").forEach((element) => {
    element.addEventListener("click", () => {
      sendEvent("select_promotion", {
        promotion_id: "homepage_products_cta",
        promotion_name: "Browse products CTA"
      });
    });
  });
}

initAnalytics();

document.addEventListener("DOMContentLoaded", () => {
  setupPromotionTracking();

  switch (document.body.dataset.page) {
    case "home":
      setupHome();
      break;
    case "products":
      setupProducts();
      break;
    case "checkout":
      setupCheckout();
      break;
  }
});