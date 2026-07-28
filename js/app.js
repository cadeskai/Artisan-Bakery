/* ==========================================================================
   AURA ARTISAN BAKERY — Product Grid, Filters, Quick View, Gallery
   ========================================================================== */

/* ---------- Product card template (shared by home + menu) ---------- */
function renderProductCard(p){
  const wished = isWishlisted(p.id) ? "active" : "";
  return `
  <article class="card product-card reveal" data-id="${p.id}" data-category="${p.category}" data-price="${p.price}" data-name="${p.name.toLowerCase()}">
    <div class="product-media">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      ${p.bestSeller ? '<span class="badge">Best Seller</span>' : ""}
      <button class="wishlist-btn ${wished}" aria-label="Toggle wishlist" onclick="event.stopPropagation(); toggleWishlist('${p.id}', this)">
        <svg viewBox="0 0 24 24"><path d="M12 21s-6.7-4.35-9.3-8.2C1 10 1.6 6.4 4.7 4.9c2.4-1.15 4.9-.2 6.3 1.7C12.4 4.7 15 3.75 17.3 4.9c3.1 1.5 3.7 5.1 2 7.9C18.7 16.65 12 21 12 21z"/></svg>
      </button>
      <button class="quickview-btn" onclick="openQuickView('${p.id}')">Quick View</button>
    </div>
    <div class="product-body">
      <span class="product-cat">${p.category}</span>
      <h3>${p.name}</h3>
      <p class="product-desc">${p.desc}</p>
      ${starRow(p.rating)}
      <div class="price-row">
        <span class="price">${formatINR(p.price)}${p.oldPrice ? `<small>${formatINR(p.oldPrice)}</small>` : ""}</span>
        <div class="qty-selector" data-qty="1">
          <button aria-label="Decrease" onclick="stepQty(this,-1)">−</button>
          <span>1</span>
          <button aria-label="Increase" onclick="stepQty(this,1)">+</button>
        </div>
      </div>
      <div class="product-actions">
        <button class="add-cart-btn" onclick="addFromCard(this,'${p.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Add to Cart
        </button>
      </div>
    </div>
  </article>`;
}

function stepQty(btn, delta){
  const selector = btn.closest(".qty-selector");
  const span = selector.querySelector("span");
  let val = parseInt(span.textContent, 10) + delta;
  if(val < 1) val = 1;
  span.textContent = val;
}

function addFromCard(btn, productId){
  const selector = btn.closest(".product-body").querySelector(".qty-selector");
  const qty = selector ? parseInt(selector.querySelector("span").textContent, 10) : 1;
  addToCart(productId, qty);
}

/* ---------- Home page: best sellers ---------- */
function renderHomeBestSellers(){
  const wrap = document.getElementById("bestseller-grid");
  if(!wrap) return;
  const items = PRODUCTS.filter(p => p.bestSeller).slice(0,8);
  wrap.innerHTML = items.map(renderProductCard).join("");
  initReveal();
}

function renderHomeCategories(){
  const wrap = document.getElementById("category-grid");
  if(!wrap) return;
  wrap.innerHTML = CATEGORIES.map((cat,i) => `
    <a href="menu.html?category=${encodeURIComponent(cat)}" class="category-tile reveal">
      <img src="${bakeryImg(cat.toLowerCase(),100+i)}" alt="${cat}" loading="lazy">
      <div class="tile-overlay">${cat}</div>
    </a>`).join("");
  initReveal();
}

/* ---------- Menu page: filters, search, sort ---------- */
let menuState = { category:"All", search:"", sort:"default" };

function initMenuPage(){
  const grid = document.getElementById("menu-grid");
  if(!grid) return;

  const params = new URLSearchParams(location.search);
  const preselect = params.get("category");
  if(preselect) menuState.category = preselect;

  // Build category chips
  const chipsWrap = document.getElementById("category-chips");
  const allCats = ["All", ...CATEGORIES];
  chipsWrap.innerHTML = allCats.map(cat => `<button class="chip ${cat===menuState.category?"active":""}" data-cat="${cat}">${cat}</button>`).join("");
  chipsWrap.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      menuState.category = chip.dataset.cat;
      chipsWrap.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      renderMenuGrid();
    });
  });

  const searchInput = document.getElementById("menu-search");
  searchInput.addEventListener("input", () => {
    menuState.search = searchInput.value.toLowerCase();
    renderMenuGrid();
  });

  const sortSelect = document.getElementById("menu-sort");
  sortSelect.addEventListener("change", () => {
    menuState.sort = sortSelect.value;
    renderMenuGrid();
  });

  renderMenuGrid();
}

function renderMenuGrid(){
  const grid = document.getElementById("menu-grid");
  const noResults = document.getElementById("menu-no-results");
  let items = PRODUCTS.filter(p => {
    const matchesCat = menuState.category === "All" || p.category === menuState.category;
    const matchesSearch = p.name.toLowerCase().includes(menuState.search) || p.desc.toLowerCase().includes(menuState.search);
    return matchesCat && matchesSearch;
  });

  if(menuState.sort === "price-asc") items.sort((a,b) => a.price - b.price);
  else if(menuState.sort === "price-desc") items.sort((a,b) => b.price - a.price);
  else if(menuState.sort === "rating") items.sort((a,b) => b.rating - a.rating);
  else if(menuState.sort === "name") items.sort((a,b) => a.name.localeCompare(b.name));

  if(items.length === 0){
    grid.innerHTML = "";
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
    grid.innerHTML = items.map(renderProductCard).join("");
  }
  initReveal();
}

/* ---------- Quick view modal ---------- */
function openQuickView(productId){
  const p = getProductById(productId);
  if(!p) return;
  const overlay = document.getElementById("quickview-overlay");
  const body = document.getElementById("quickview-body");
  body.innerHTML = `
    <img src="${p.img}" alt="${p.name}">
    <div class="modal-info">
      <span class="product-cat">${p.category}</span>
      <h2>${p.name}</h2>
      ${starRow(p.rating)}
      <p style="color:var(--espresso-70); margin:1rem 0;">${p.desc}</p>
      <div class="price-row">
        <span class="price">${formatINR(p.price)}${p.oldPrice ? `<small>${formatINR(p.oldPrice)}</small>` : ""}</span>
        <div class="qty-selector" data-qty="1">
          <button aria-label="Decrease" onclick="stepQty(this,-1)">−</button>
          <span>1</span>
          <button aria-label="Increase" onclick="stepQty(this,1)">+</button>
        </div>
      </div>
      <button class="btn btn-gold btn-block mt-2" onclick="addFromCard(this,'${p.id}')" style="margin-top:1.4rem;">Add to Cart</button>
    </div>`;
  overlay.classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeQuickView(){
  document.getElementById("quickview-overlay").classList.remove("show");
  document.body.style.overflow = "";
}

/* ---------- Gallery lightbox ---------- */
function initGallery(){
  const items = document.querySelectorAll(".g-item img");
  if(!items.length) return;
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  let current = 0;
  const sources = Array.from(items).map(img => img.src);
  const alts = Array.from(items).map(img => img.alt);

  function show(i){
    current = (i + sources.length) % sources.length;
    lightboxImg.src = sources[current];
    lightboxImg.alt = alts[current];
  }
  items.forEach((img,i) => img.closest(".g-item").addEventListener("click", () => {
    show(i);
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
  }));
  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", () => show(current-1));
  document.getElementById("lightbox-next").addEventListener("click", () => show(current+1));
  lightbox.addEventListener("click", (e) => { if(e.target === lightbox) closeLightbox(); });

  function closeLightbox(){
    lightbox.classList.remove("show");
    document.body.style.overflow = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderHomeBestSellers();
  renderHomeCategories();
  initMenuPage();
  initGallery();

  const qvClose = document.getElementById("quickview-close");
  if(qvClose) qvClose.addEventListener("click", closeQuickView);
  const qvOverlay = document.getElementById("quickview-overlay");
  if(qvOverlay) qvOverlay.addEventListener("click", (e) => { if(e.target === qvOverlay) closeQuickView(); });
});
