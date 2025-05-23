const desserts = [
  { name: 'Waffle with Berries', price: 6.50,image:'untitled.png' },
  { name: 'Vanilla Bean Crème Brûlée', price: 7.00,image:'' },
  { name: 'Macaron Mix of Five', price: 8.00 },
  { name: 'Classic Tiramisu', price: 5.50 },
  { name: 'Pistachio Baklava', price: 4.00 },
  { name: 'Lemon Meringue Pie', price: 5.00 },
  { name: 'Red Velvet Cake', price: 4.50 },
  { name: 'Salted Caramel Brownie', price: 5.50 },
  { name: 'Vanilla Panna Cotta', price: 6.50 },
];

const itemsContainer = document.getElementById('items-container');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const confirmOrderBtn = document.getElementById('confirm-order');


const orderConfirmation = document.getElementById('order-confirmation');
const orderSummary = document.getElementById('order-summary');
const summaryTotal = document.getElementById('summary-total');
const newOrderBtn = document.getElementById('new-order');

const cart = {};  

function updateCartUI() {
  cartItems.innerHTML = '';
  let total = 0;
  let count = 0;
  for (let name in cart) {
    const item = cart[name];
    total += item.price * item.qty;
    count += item.qty;
    const li = document.createElement('li');
    li.innerHTML=`
    <div style="display:flex;align-items:center;gap:0.5rem;"><img src="${item.image}" alt="${name}" style="width:40px;height:40px;border-radius:6px;"/>
      <div>
        <strong>${item.qty}x ${name}</strong><br/>
        <small>$${(item.price*item.qty).toFixed(2)}</small>
      </div>
    </div>  `
    // li.textContent = `${item.qty}x ${name} ($${(item.price * item.qty).toFixed(2)})`;
    cartItems.appendChild(li); 
  }
  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = count;
}

function createItemCard(item) {
  const card = document.createElement('div');
  card.className = 'item-card';
  card.innerHTML = `
    <img src="${item.image}" alt="">
    <h3>${item.name}</h3>
    <p>$${item.price.toFixed(2)}</p>
    <div class="qty-controls">
      <button class="decrease">-</button>
      <input type="number" min="1" value="1" class="qty-input" />
      <button class="increase">+</button>
    </div>
    <button class="add-btn">Add to Cart</button>
  `;

  const input = card.querySelector('.qty-input');
  const increaseBtn = card.querySelector('.increase');
  const decreaseBtn = card.querySelector('.decrease');
  const addBtn = card.querySelector('.add-btn');

  increaseBtn.addEventListener('click', () => input.value = parseInt(input.value) + 1);
  decreaseBtn.addEventListener('click', () => {
    if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
  });

  addBtn.addEventListener('click', () => {
    const qty = parseInt(input.value);
    if (!cart[item.name]) {
      cart[item.name] = { ...item, qty };
    } else {
      cart[item.name].qty += qty;
    }
    updateCartUI();
  });

  itemsContainer.appendChild(card);
}

confirmOrderBtn.addEventListener('click', () => {
  orderSummary.innerHTML = '';
  let total = 0;
  for (let name in cart) {
    const item = cart[name];
    const li = document.createElement('li');
    li.innerHTML=`
    <div style="display:flex;align-items:center;gap:0.5rem;"><img src="${item.image}" alt="${name}" style="width:40px;height:40px;border-radius:6px;"/>
      <div>
        <strong>${item.qty}x ${name}</strong><br/>
        <small>$${(item.price*item.qty).toFixed(2)}</small>
      </div>
    </div>  `
    // li.textContent = `${item.qty}x ${name} - $${(item.price * item.qty).toFixed(2)}`;
    orderSummary.appendChild(li);
    total += item.price * item.qty;
  }
  summaryTotal.textContent = total.toFixed(2);
  orderConfirmation.classList.remove('hidden');
});

newOrderBtn.addEventListener('click', () => {
  orderConfirmation.classList.add('hidden');
  for (let name in cart) delete cart[name];
  updateCartUI();
});

desserts.forEach(createItemCard);