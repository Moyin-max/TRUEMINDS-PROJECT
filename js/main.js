// Mobile nav toggle
const toggleBtn = document.querySelector(".navToggle");
const mobileNav = document.querySelector(".mobileNav");

if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener("click", () => {
        const open = mobileNav.classList.toggle("show");
        toggleBtn.setAttribute("aria-expanded", String(open));
        mobileNav.setAttribute("aria-hidden", String(!open));
    });

    // close after clicking any link
    mobileNav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
            mobileNav.classList.remove("show");
            toggleBtn.setAttribute("aria-expanded", "false");
            mobileNav.setAttribute("aria-hidden", "true");
        });
    });
}

// Show/Hide password on login screen
const eyeBtn = document.querySelector(".eyeBtn");
const password = document.querySelector("#password");

if (eyeBtn && password) {
    eyeBtn.addEventListener("click", () => {
        password.type = password.type === "password" ? "text" : "password";
    });
}

// Cart quantity UI demo (no backend)
document.querySelectorAll(".cartItem").forEach((item) => {
    const qtyEl = item.querySelector(".qtyValue");
    const plus = item.querySelector(".plus");
    const minus = item.querySelector(".minus");
    const remove = item.querySelector(".removeBtn");

    if (plus && minus && qtyEl) {
        plus.addEventListener("click", () => {
            qtyEl.textContent = String(Number(qtyEl.textContent) + 1);
        });

        minus.addEventListener("click", () => {
            const value = Number(qtyEl.textContent);
            qtyEl.textContent = String(Math.max(1, value - 1));
        });
    }

    if (remove) {
        remove.addEventListener("click", () => item.remove());
    }
});

// Back to top
const toTop = document.querySelector(".toTop");
if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
