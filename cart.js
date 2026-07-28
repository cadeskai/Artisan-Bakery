/* ==========================================================================
   AURA ARTISAN BAKERY — Cart & Wishlist Engine
   Persists to localStorage so the cart survives across pages and reloads.
   ========================================================================== */

const CART_KEY = "aura_bakery_cart";
const WISHLIST_KEY = "aura_bakery_wishlist";
const DELIVERY_FEE = 60;
const FREE_DELIVERY_THRESHOLD = 1200;
const PROMO_CODES = { "AURA10": 0.10, "WELCOME15": 0.15, "SWEET20": 0.20 };

/* ---------- Storage helpers ---------- */
function getCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
function getWishlist(){
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; }
  catch(e){ return []; }
}
function saveWishlist(list){
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

/* ---------- Cart operations ---------- */
function addToCart(productId, qty){
  qty = qty || 1;
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if(existing){ existing.qty += qty; }
  else { cart.push({ id: productId, qty: qty }); }
  saveCart(cart);
  const product = typeof getProductById === "function" ? getProductById(productId) : null;
  showToast(`${product ? product.name : "Item"} added to cart`);
}

function removeFromCart(productId){
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  renderCartPage();
  showToast("Item removed from cart");
}

function updateCartQty(productId, delta){
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
  renderCartPage();
}

function clearCart(){
  saveCart([]);
  renderCartPage();
  showToast("Cart cleared");
}

function cartCount(){
  return getCart().reduce((sum,i) => sum + i.qty, 0);
}

function cartSubtotal(){
  const cart = getCart();
  let subtotal = 0;
  cart.forEach(i => {
    const p = getProductById(i.id);
    if(p) subtotal += p.price * i.qty;
  });
  return subtotal;
}

function updateCartBadge(){
  document.querySelectorAll(".cart-count").forEach(el => {
    const c = cartCount();
    el.textContent = c;
    el.style.display = c > 0 ? "flex" : "none";
  });
}

/* ---------- Wishlist operations ---------- */
function toggleWishlist(productId, btnEl){
  let list = getWishlist();
  const idx = list.indexOf(productId);
  if(idx > -1){ list.splice(idx,1); if(btnEl) btnEl.classList.remove("active"); showToast("Removed from wishlist"); }
  else { list.push(productId); if(btnEl) btnEl.classList.add("active"); showToast("Added to wishlist"); }
  saveWishlist(list);
}
function isWishlisted(productId){
  return getWishlist().includes(productId);
}

/* ---------- Promo code ---------- */
function getAppliedPromo(){
  try { return JSON.parse(sessionStorage.getItem("aura_promo")) || null; }
  catch(e){ return null; }
}
function applyPromoCode(code){
  code = (code||"").trim().toUpperCase();
  if(PROMO_CODES[code]){
    sessionStorage.setItem("aura_promo", JSON.stringify({ code, rate: PROMO_CODES[code] }));
    showToast(`Promo "${code}" applied — ${PROMO_CODES[code]*100}% off!`);
  } else {
    showToast("Invalid promo code", true);
  }
  renderCartPage();
}

/* ---------- Cart Page Rendering ---------- */
function renderCartPage(){
  const listEl = document.getElementById("cart-item-list");
  if(!listEl) return; // not on cart page

  const cart = getCart();
  const emptyEl = document.getElementById("empty-cart");
  const summaryEl = document.getElementById("cart-summary-wrap");

  if(cart.length === 0){
    listEl.innerHTML = "";
    if(emptyEl) emptyEl.style.display = "block";
    if(summaryEl) summaryEl.style.display = "none";
    return;
  }
  if(emptyEl) emptyEl.style.display = "none";
  if(summaryEl) summaryEl.style.display = "block";

  listEl.innerHTML = cart.map(item => {
    const p = getProductById(item.id);
    if(!p) return "";
    return `
    <div class="cart-item">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div>
        <span class="cat">${p.category}</span>
        <h4>${p.name}</h4>
        <div class="qty-selector">
          <button aria-label="Decrease quantity" onclick="updateCartQty('${p.id}',-1)">−</button>
          <span>${item.qty}</span>
          <button aria-label="Increase quantity" onclick="updateCartQty('${p.id}',1)">+</button>
        </div>
      </div>
      <div class="item-price">${formatINR(p.price * item.qty)}</div>
      <button class="remove-btn" onclick="removeFromCart('${p.id}')">Remove</button>
    </div>`;
  }).join("");

  renderTotals();
}

function renderTotals(){
  const subtotal = cartSubtotal();
  const promo = getAppliedPromo();
  const discount = promo ? Math.round(subtotal * promo.rate) : 0;
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const grandTotal = Math.max(subtotal - discount + delivery, 0);

  const map = {
    "sum-subtotal": formatINR(subtotal),
    "sum-discount": "− " + formatINR(discount),
    "sum-delivery": delivery === 0 ? "Free" : formatINR(delivery),
    "sum-total": formatINR(grandTotal),
  };
  Object.keys(map).forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = map[id];
  });

  const promoLabel = document.getElementById("promo-label");
  if(promoLabel) promoLabel.textContent = promo ? `Promo (${promo.code})` : "Discount";

  return { subtotal, discount, delivery, grandTotal };
}

/* ---------- Checkout Page Rendering ---------- */
function renderCheckoutSummary(){
  const wrap = document.getElementById("checkout-order-lines");
  if(!wrap) return;
  const cart = getCart();
  if(cart.length === 0){
    wrap.innerHTML = `<p style="color:var(--espresso-70)">Your cart is empty. <a href="menu.html" style="color:var(--gold-deep)">Browse the menu →</a></p>`;
  } else {
    wrap.innerHTML = cart.map(item => {
      const p = getProductById(item.id);
      if(!p) return "";
      return `<div class="order-line"><span>${p.name} × ${item.qty}</span><span>${formatINR(p.price*item.qty)}</span></div>`;
    }).join("");
  }
  const totals = renderTotals();
  return totals;
}

/* ---------- WhatsApp Order Generation ---------- */
function buildWhatsAppOrderText(customer){
  const cart = getCart();
  const totals = renderTotals();
  let lines = [];
  lines.push("🍞 *New Bakery Order*");
  lines.push("");
  lines.push("👤 *Customer*");
  lines.push(`Name: ${customer.name}`);
  lines.push(`Phone: ${customer.phone}`);
  lines.push("");
  lines.push("📍 *Address*");
  lines.push(`Address: ${customer.address}`);
  lines.push(`Landmark: ${customer.landmark || "-"}`);
  lines.push(`City: ${customer.city}`);
  lines.push(`Pincode: ${customer.pincode}`);
  lines.push("");
  lines.push("🛒 *Order*");
  cart.forEach(item => {
    const p = getProductById(item.id);
    if(!p) return;
    lines.push(`${p.name} x${item.qty} — ${formatINR(p.price*item.qty)}`);
  });
  lines.push(`Subtotal: ${formatINR(totals.subtotal)}`);
  if(totals.discount > 0) lines.push(`Discount: − ${formatINR(totals.discount)}`);
  lines.push(`Delivery Fee: ${totals.delivery === 0 ? "Free" : formatINR(totals.delivery)}`);
  lines.push(`Grand Total: ${formatINR(totals.grandTotal)}`);
  lines.push("");
  if(customer.notes) { lines.push(`📝 Notes: ${customer.notes}`); lines.push(""); }
  lines.push("Please confirm my order. ✅");
  return lines.join("\n");
}

function sendWhatsAppOrder(customer){
  const text = buildWhatsAppOrderText(customer);
  const url = `https://wa.me/919167305507?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCartPage();
  renderCheckoutSummary();
});
