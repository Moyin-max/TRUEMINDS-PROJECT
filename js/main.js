/* =====================================
   Moyin Kitchen - Dynamic Cart JS
===================================== */

const CART_KEY = "moyin_cart_v2";

/* ---------- Storage Helpers ---------- */
function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

/* ---------- Formatting Helpers ---------- */
function nairaToNumber(text) {
    return Number(String(text).replace(/[₦,\s]/g, "")) || 0;
}

function formatNaira(amount) {
    const n = Number(amount) || 0;
    return `₦${n.toLocaleString("en-NG")}`;
}

function createIdFromName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/* ---------- Cart Operations ---------- */
function addToCart(item) {
    const cart = getCart();
    const existing = cart.find((x) => x.id === item.id);

    if (existing) existing.qty += 1;
    else cart.push({ ...item, qty: 1 });

    saveCart(cart);
    renderCart(); // update UI if cart section exists
}

function changeQty(id, delta) {
    const cart = getCart();
    const item = cart.find((x) => x.id === id);
    if (!item) return;

    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
    renderCart();
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter((x) => x.id !== id);
    saveCart(cart);
    renderCart();
}

/* ---------- UI: Cart Count ---------- */
function updateCartCount() {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
    document.querySelectorAll(".cartCount").forEach((el) => (el.textContent = totalQty));
}

/* ---------- UI: Render Cart ---------- */
function renderCart() {
    const cartList = document.querySelector(".cartList");
    const cartTotalEl = document.querySelector(".cartTotal");

    // If cart section isn't on the page, skip.
    if (!cartList && !cartTotalEl) return;

    const cart = getCart();

    if (cartList) {
        if (cart.length === 0) {
            cartList.innerHTML = `<p class="emptyCart">Your cart is empty. Add meals from the Explore page.</p>`;
        } else {
            cartList.innerHTML = cart
                .map(
                    (item) => `
          <article class="cartItem cartItem--dynamic">
            <img class="cartItem__img" src="${item.img}" alt="${item.name}" />

            <div class="cartItem__info">
              <h3>${item.name}</h3>
              <p>${formatNaira(item.price)} each</p>
            </div>

            <div class="cartItem__qty">
              <button class="qtyBtn" type="button" data-action="minus" data-id="${item.id}">−</button>
              <span class="qtyValue">${item.qty}</span>
              <button class="qtyBtn" type="button" data-action="plus" data-id="${item.id}">+</button>
            </div>

            <div class="cartItem__price">${formatNaira(item.price * item.qty)}</div>

            <button class="removeBtn" type="button" data-remove="${item.id}" aria-label="Remove item">×</button>
          </article>
        `
                )
                .join("");
        }
    }

    if (cartTotalEl) {
        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        cartTotalEl.textContent = formatNaira(total);
    }
}

/* =====================================
   Mobile nav toggle
===================================== */
const toggleBtn = document.querySelector(".navToggle");
const mobileNav = document.querySelector(".mobileNav");

if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener("click", () => {
        const open = mobileNav.classList.toggle("show");
        toggleBtn.setAttribute("aria-expanded", String(open));
        mobileNav.setAttribute("aria-hidden", String(!open));
    });

    mobileNav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
            mobileNav.classList.remove("show");
            toggleBtn.setAttribute("aria-expanded", "false");
            mobileNav.setAttribute("aria-hidden", "true");
        });
    });
}

/* =====================================
   Show/Hide password
===================================== */
const eyeBtn = document.querySelector(".eyeBtn");
const password = document.querySelector("#password");

if (eyeBtn && password) {
    eyeBtn.addEventListener("click", () => {
        password.type = password.type === "password" ? "text" : "password";
    });
}

/* =====================================
   Click handlers (Add to cart + Cart controls)
===================================== */
document.addEventListener("click", (e) => {
    /* 1) Menu Listing "+" button (.addBtn) */
    const menuPlus = e.target.closest(".addBtn");
    if (menuPlus) {
        const card = menuPlus.closest(".foodCard");
        if (!card) return;

        const name = card.querySelector("h3")?.textContent?.trim() || "Item";
        const priceText = card.querySelector(".price")?.textContent || "₦0";
        const price = nairaToNumber(priceText);
        const img = card.querySelector("img")?.getAttribute("src") || "";
        const id = createIdFromName(name);

        addToCart({ id, name, price, img });

        // quick feedback
        menuPlus.textContent = "✓";
        setTimeout(() => (menuPlus.textContent = "+"), 600);
        return;
    }

    /* 2) Chef Specials "Add to cart" button */
    const specialsAdd = e.target.closest(".mealCard .btn--orange");
    if (specialsAdd && specialsAdd.textContent.toLowerCase().includes("add")) {
        const card = specialsAdd.closest(".mealCard");
        if (!card) return;

        const name = card.querySelector("h3")?.textContent?.trim() || "Item";
        const priceText = card.querySelector(".price")?.textContent || "₦0";
        const price = nairaToNumber(priceText);
        const img = card.querySelector("img")?.getAttribute("src") || "";
        const id = createIdFromName(name);

        addToCart({ id, name, price, img });

        specialsAdd.textContent = "Added ✓";
        setTimeout(() => (specialsAdd.textContent = "Add to cart"), 800);
        return;
    }

    /* 3) Dynamic Cart plus/minus */
    const qtyBtn = e.target.closest(".qtyBtn[data-action]");
    if (qtyBtn) {
        const id = qtyBtn.dataset.id;
        const action = qtyBtn.dataset.action;

        if (action === "plus") changeQty(id, +1);
        if (action === "minus") changeQty(id, -1);
        return;
    }

    /* 4) Remove item */
    const removeBtn = e.target.closest(".removeBtn[data-remove]");
    if (removeBtn) {
        removeFromCart(removeBtn.dataset.remove);
        return;
    }
});

/* =====================================
   Back to top
===================================== */
const toTop = document.querySelector(".toTop");
if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* =====================================
   Init
===================================== */
updateCartCount();
renderCart();
