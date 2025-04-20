// main.js

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('#cart-count').forEach(node => node.textContent = count);
}

// فروشگاه: افزودن به سبد
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const id    = this.dataset.id;
      const title = this.dataset.title;
      const price = parseInt(this.dataset.price);
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      let existing = cart.find(item => item.id === id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, title, price, qty: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      alert('محصول اضافه شد!');
    });
  });
  
  // cart.html: نمایش سبد
  if (document.querySelector('.cart-page')) renderCart();
  
  // موبایل: دکمه منو
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.navigation');
  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      navigation.classList.toggle('active');
    });
  }
});

function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const container = document.getElementById('cart-items');
  const totalDiv = document.getElementById('cart-total');
  container.innerHTML = '';
  let total = 0;
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart-message">سبد خرید شما خالی است.</p>';
    totalDiv.innerHTML = '';
    document.querySelector('.cart-actions').style.display = 'none';
    updateCartCount();
    return;
  }
  document.querySelector('.cart-actions').style.display = 'flex';
  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.image || 'image_0.png'}" alt="${item.title}">
      <div class="cart-item-title">${item.title}</div>
      <div class="cart-item-price">${item.price.toLocaleString()} تومان</div>
      <div class="qty-controls">
        <button class="dec-btn" data-id="${item.id}">−</button>
        <span>${item.qty}</span>
        <button class="inc-btn" data-id="${item.id}">+</button>
      </div>
      <div class="cart-item-subtotal">${subtotal.toLocaleString()} تومان</div>
      <button class="remove-btn" data-id="${item.id}">&times;</button>
    `;
    container.appendChild(el);
  });
  totalDiv.innerHTML = `<h3>جمع کل: ${total.toLocaleString()} تومان</h3>`;
  container.querySelectorAll('.inc-btn').forEach(btn =>
    btn.addEventListener('click', () => changeQty(btn.dataset.id, +1))
  );
  container.querySelectorAll('.dec-btn').forEach(btn =>
    btn.addEventListener('click', () => changeQty(btn.dataset.id, -1))
  );
  container.querySelectorAll('.remove-btn').forEach(btn =>
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id))
  );
  updateCartCount();
}

function changeQty(id, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.map(item => {
    if (item.id == id) {
      item.qty = Math.max(1, item.qty + delta);
    }
    return item;
  });
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id != id);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}
