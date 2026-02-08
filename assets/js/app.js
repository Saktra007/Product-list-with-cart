import { products } from "./data.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productGrid = document.getElementById("product-grid");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalPriceElement = document.getElementById("total-price");
const cartTotalSection = document.getElementById("cart-total-section");
const orderModal = document.getElementById("order-modal");
const confirmBtn = document.getElementById("confirm-order");
const orderSummary = document.getElementById("order-summary");
const startNewOrderBtn = document.getElementById("start-new-order");

function renderProducts() {
  productGrid.innerHTML = products
    .map((product) => {
      const itemInCart = cart.find((item) => item.id === product.id);
      const buttonHTML = itemInCart
        ? `<div class="qty-selector">
          <button class="qty-btn dec" data-id="${product.id}"><i class="fa-solid fa-minus"></i></button>
          <span>${itemInCart.quantity}</span>
          <button class="qty-btn inc" data-id="${product.id}"><i class="fa-solid fa-plus"></i></button>
          </div>`
        : `<button class="add-to-cart-btn" data-id="${product.id}">
          <i class="fa-solid fa-cart-plus"></i>Add to Cart
          </button>`;

      return `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="${itemInCart ? "selected-img" : ""}"/>
                ${buttonHTML}
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
        </div>
  `;
    })
    .join("");
  const loadingText = document.querySelector("#product-grid>p");
  if (loadingText) loadingText.remove();
}

function updateUI() {
  localStorage.setItem("cart", JSON.stringify(cart));

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.innerText = totalQty;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
        <div class="empty-cart">
           <i class="fa-solid fa-basket-shopping fa-4x" style="color: #ad8a85; margin-bottom: 20px;"></i>
            <p>Your added items will appear here</p>
        </div>
        `;
    cartTotalSection.classList.add("hidden");
  } else {
    cartTotalSection.classList.remove("hidden");
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img"/>
            <div class="item-details">
                <p class="item-name">${item.name}</p>
                <div class="item-meta">
                  <span class="item-qty">${item.quantity}x</span>
                  <span class="item-price">@ $${item.price.toFixed(2)}</span>
                  <span class="item-subtotal">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}"><i class="fa-regular fa-circle-xmark"></i></button>
        </div> `,
      )
      .join("");

    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    totalPriceElement.innerText = `$${totalAmount.toFixed(2)}`;
  }
}
productGrid.addEventListener("click", (e) => {
  const target = e.target.closest("button");
  if (!target) return;

  const id = parseInt(target.dataset.id);
  const existingItem = cart.find((item) => item.id === id);
  if (
    target.classList.contains("add-to-cart-btn") ||
    target.classList.contains("inc")
  ) {
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const product = products.find((p) => p.id === id);
      cart.push({ ...product, quantity: 1 });
    }
  } else if (target.classList.contains("dec")) {
    if (existingItem.quantity > 1) {
      existingItem.quantity -= 1;
    } else {
      cart = cart.filter((item) => item.id !== id);
    }
  }
  updateUI();
  renderProducts();
});

cartItemsContainer.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".remove-item");
  if (removeBtn) {
    const id = parseInt(removeBtn.dataset.id);
    cart = cart.filter((item) => item.id !== id);
    updateUI();
    renderProducts();
  }
});
confirmBtn.addEventListener("click", () => {
  orderSummary.innerHTML = `
  <div class="modal-items-container">
    ${cart
      .map(
        (item) => `
      <div class="modal-item">
        <div class="modal-item-left">
          <img src="${item.image}" alt="${item.name}" class="modal-item-img" />
          <div class="modal-item-info">
            <p class="modal-item-name">${item.name}</p>
            <div class="modal-item-meta">
              <span class="modal-item-qty">${item.quantity}x</span>
              <span class="modal-item-price">@ $${item.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div class="modal-item-right">
          <p class="modal-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    `,
      )
      .join("")}
    <div class="modal-total-section">
      <span>Order Total</span>
      <span class="modal-total-price">${totalPriceElement.innerText}</span>
    </div>
  </div>
    `;
  orderModal.classList.remove("hidden");
});

startNewOrderBtn.addEventListener("click", () => {
  cart = [];
  updateUI();
  renderProducts();
  orderModal.classList.add("hidden");
});
renderProducts();
updateUI();
