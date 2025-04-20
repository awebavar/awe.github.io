// main.js
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('#cart-count').forEach(b => b.textContent = count);
}
function renderShopProducts() {
  const grid = document.getElementById('products-grid'); if (!grid) return;
  const products = [
    { id: "book1", title: 'سفر به اعماق رازهای نهان باورها', description: 'درون این کتاب، گنجینه‌ای از خودشناسی نهفته است…', image: 'image_0.png', price: 998000 },
    { id: "book2", title: 'عنوان محصول دوم', description: 'خلاصه‌ای از این محصول دوم؛ توضیحی کوتاه.', image: 'image_0 (1).png', price: 350000 },
    { id: "book3", title: 'عنوان محصول سوم', description: 'نکتهٔ کلیدی دربارهٔ این محصول.', image: 'image_0 (2).png', price: 220000 }
  ];
  grid.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div'); card.className = 'book-item';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <p>قیمت: <span class="product-price">${p.price.toLocaleString()}</span> تومان</p>
      <button class="add-to-cart" data-id="${p.id}" data-title="${p.title}" data-price="${p.price}" data-image="${p.image}">افزودن به سبد</button>
    `;
    grid.appendChild(card);
  });
  // اتصال دکمه‌ها
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.id, title = this.dataset.title, price = parseInt(this.dataset.price), image = this.dataset.image;
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const idx = cart.findIndex(item => item.id === id);
      if (idx > -1) { cart[idx].qty++; }
      else { cart.push({ id, title, price, image, qty: 1 }); }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      alert('محصول به سبد اضافه شد!');
    });
  });
}
function renderCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>سبد شما خالی است.</p>';
    document.querySelector('.cart-actions').style.display = 'none';
    updateCartCount();
    return;
  }
  document.querySelector('.cart-actions').style.display = 'flex';
  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item'; 
    div.innerHTML = `
      <img src="${item.image}" alt="">
      <div class="cart-item-title">${item.title}</div>
      <div class="cart-item-price">${item.price.toLocaleString()} تومان</div>
      <div class="qty-controls">
        <button class="dec-btn" data-id="${item.id}">-</button>
        <span>${item.qty}</span>
        <button class="inc-btn" data-id="${item.id}">+</button>
      </div>
      <div class="cart-item-subtotal">${subtotal.toLocaleString()} تومان</div>
      <button class="remove-btn" data-id="${item.id}">&times;</button>
    `;
    container.appendChild(div);
  }); 
  calculateCartTotal();
  container.querySelectorAll('.inc-btn').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.id, +1)));
  container.querySelectorAll('.dec-btn').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.id, -1)));
  container.querySelectorAll('.remove-btn').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.id, 0)));
}
function changeQty(id, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.map(item => {
    if (item.id == id) {
      if (delta === 0) return null;
      item.qty = Math.max(1, item.qty + delta);
    }
    return item;
  }).filter(Boolean);
  localStorage.setItem('cart', JSON.stringify(cart)); 
  updateCartCount();
  renderCartItems();
}
function calculateCartTotal() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const el = document.getElementById('cart-total');
  if (el) el.innerHTML = `<h3 id="cart-summary">مبلغ کل: ${total.toLocaleString()} تومان</h3>`;
}
document.addEventListener('DOMContentLoaded', function() {
  renderShopProducts();
  renderCartItems();
  updateCartCount();
  // منوی موبایل
  const header = document.querySelector('header .container');
  const navigation = document.querySelector('.navigation');
  const menuToggle = document.createElement('button');
  menuToggle.className = 'menu-toggle';
  menuToggle.innerHTML = '&#9776;';
  menuToggle.style.display = 'none';
  header.insertBefore(menuToggle, navigation);
  function adjustMenuVisibility() {
    if (window.innerWidth <= 991) {
      menuToggle.style.display = 'block';
      navigation.classList.add('mobile-menu');
      if (!navigation.classList.contains('active')) { navigation.style.display = 'none'; }
    } else {
      menuToggle.style.display = 'none';
      navigation.style.display = 'block';
      navigation.classList.remove('mobile-menu');
    }
  }
  adjustMenuVisibility();
  window.addEventListener('resize', adjustMenuVisibility);
  menuToggle.addEventListener('click', function() {
    if (navigation.style.display === 'none' || navigation.style.display === '') {
      navigation.style.display = 'block';
      navigation.classList.add('active');
    } else {
      navigation.style.display = 'none';
      navigation.classList.remove('active');
    }
  });
});
