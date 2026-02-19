/* =====================================
   Moyin Kitchen - Main JS File
===================================== */

/* =========================
   CART STORAGE
========================= */
const CART_KEY = "moyin_cart_v1";

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function nairaToNumber(text) {
    return Number(String(text).replace(/[₦,\s]/g, "")) || 0;
}

function createIdFromName(name) {
    return name.toLowerCase().replace(/\s+/g, "-");
}

function addToCart(item) {
    const cart = getCart();
    const existing = cart.find((x) => x.id === item.id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    saveCart(cart);
}

/* =========================
   MOBILE NAV TOGGLE
========================= */
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

/* =========================
   SHOW / HIDE PASSWORD
========================= */
const eyeBtn = document.querySelector(".eyeBtn");
const password = document.querySelector("#password");

if (eyeBtn && password) {
    eyeBtn.addEventListener("click", () => {
        password.type = password.type === "password" ? "text" : "password";
    });
}

/* =========================
   HANDLE BUTTON CLICKS
========================= */
document.addEventListener("click", (e) => {

    /* =====================
       MENU "+" BUTTONS
    ====================== */
    const plusBtn = e.target.closest(".addBtn");
    if (plusBtn) {
        const card = plusBtn.closest(".foodCard");
        if (!card) return;

        const name = card.querySelector("h3")?.textContent?.trim() || "Item";
        const priceText = card.querySelector(".price")?.textContent || "₦0";
        const price = nairaToNumber(priceText);
        const img = card.querySelector("img")?.getAttribute("src") || "";
        const id = createIdFromName(name);

        addToCart({ id, name, price, img });

        // Small visual feedback
        plusBtn.textContent = "✓";
        setTimeout(() => (plusBtn.textContent = "+"), 600);

        return;
    }

    /* =====================
       CHEF SPECIALS BUTTONS
    ====================== */
    const addBtn = e.target.closest(".mealCard .btn--orange");
    if (addBtn && addBtn.textContent.toLowerCase().includes("add")) {
        const card = addBtn.closest(".mealCard");
        if (!card) return;

        const name = card.querySelector("h3")?.textContent?.trim() || "Item";
        const priceText = card.querySelector(".price")?.textContent || "₦0";
        const price = nairaToNumber(priceText);
        const img = card.querySelector("img")?.getAttribute("src") || "";
        const id = createIdFromName(name);

        addToCart({ id, name, price, img });

        addBtn.textContent = "Added ✓";
        setTimeout(() => (addBtn.textContent = "Add to cart"), 800);

        return;
    }

    /* =====================
       CART PAGE + / −
    ====================== */
    const cartPlus = e.target.closest(".cartItem .plus");
    const cartMinus = e.target.closest(".cartItem .minus");
    const removeBtn = e.target.closest(".cartItem .removeBtn");

    if (cartPlus || cartMinus || removeBtn) {
        const cartItem = e.target.closest(".cartItem");
        if (!cartItem) return;

        const qtyEl = cartItem.querySelector(".qtyValue");
        if (!qtyEl) return;

        if (cartPlus) {
            qtyEl.textContent = String(Number(qtyEl.textContent) + 1);
        }

        if (cartMinus) {
            const value = Number(qtyEl.textContent);
            qtyEl.textContent = String(Math.max(1, value - 1));
        }

        if (removeBtn) {
            cartItem.remove();
        }

        return;
    }
});

/* =========================
   BACK TO TOP BUTTON
========================= */
const toTop = document.querySelector(".toTop");
if (toTop) {
    toTop.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" })
    );
}
