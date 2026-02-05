import { products } from "./data.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productGrid = document.getElementById("product-grid");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalPriceElement = document.getElementById("total-price");
const cartTotalSection = document.getElementById("cart-total-section");

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) =>
        `<div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}"/>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
        </div>
  `,
    )
    .join("");
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }
  updateUI();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateUI();
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
            <div>
                <p class="item-name">${item.name}</p>
                <span class="item-qty">${item.quantity}x</span>
                <span class="item-price">@ $${item.price.toFixed(2)}</span>
                <span class="item-subtotal">$${(item.price * item.quantity).toFixed(2)}</span>
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
  const btn = e.target.closest(".add-to-cart-btn");
  if (btn) {
    const id = parseInt(btn.dataset.id);
    addToCart(id);
  }
});

cartItemsContainer.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".remove-item");
  if (removeBtn) {
    const id = parseInt(removeBtn.dataset.id);
    removeFromCart(id);
  }
});

renderProducts();
updateUI();
