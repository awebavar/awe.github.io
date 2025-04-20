// main.js
// ماژول اصلی برای صفحات index، shop و cart

// به‌روز رسانی عدد badge روی آیکون سبد
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badgeElems = document.querySelectorAll('#cart-count');
  badgeElems.forEach(b => b.textContent = count);
}

// رندر محصولات فروشگاه
function renderShopProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const products = [
    {
      id: "1",
      title: 'سفر به اعماق رازهای نهان باورها',
      description: 'درون این کتاب، گنجینه‌ای از خودشناسی نهفته است…',
      image: 'image_0.png',
      price: 998000
    },
    {
      id: "2",
      title: 'عنوان محصول دوم',
      description: 'خلاصه‌ای از این محصول دوم؛ توضیحی کوتاه.',
      image: 'image_0 (1).png',
      price: 650000
    },
    {
      id: "3",
      title: 'عنوان محصول سوم',
      description: 'نکته‌ای کلیدی درباره این محصول…',
      image: 'image_0 (2).png',
      price: 470000
    }
  ];

  grid.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'book-item';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <span class="book-price">${p.price.toLocaleString()} تومان</span>
      <button class="add-to-cart" 
        data-id="${p.id}" data-title="${p.title}" data-price="${p.price}" data-image="${p.image}">
        افزودن به سبد
      </button>
    `;
    grid.appendChild(card);
  });

  // رویداد افزودن به سبد
  grid.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const id     = this.dataset.id;
      const title  = this.dataset.title;
      const price  = parseInt(this.dataset.price);
      const image  = this.dataset.image;
      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, title, price, qty: 1, image });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      alert('محصول به سبد اضافه شد!');
    });
  });
}

// رندر سبد خرید برای cart.html
function renderCartItems() {
  const container = document.getElementById('cart-items');
  const totalDiv = document.getElementById('cart-total');
  if (!container) return;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  container.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart-message">سبد خرید شما خالی است.</p>';
    if (totalDiv) totalDiv.innerHTML = '';
    const acts = document.querySelector('.cart-actions');
    if (acts) acts.style.display = 'none';
    updateCartCount();
    return;
  }
  const acts = document.querySelector('.cart-actions');
  if (acts) acts.style.display = 'flex';

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    const itemHTML = `
      <div class="cart-item">
        <img src="${item.image || 'placeholder.png'}" alt="${item.title}">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-price">${item.price.toLocaleString()} تومان</div>
        <div class="qty-controls">
          <button class="decrease" data-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button class="increase" data-id="${item.id}">+</button>
        </div>
        <div class="cart-item-subtotal">${subtotal.toLocaleString()} تومان</div>
        <button class="remove-btn" data-id="${item.id}">&times;</button>
      </div>`;
    container.insertAdjacentHTML('beforeend', itemHTML);
  });

  if (totalDiv)
    totalDiv.innerHTML = `<h3 id="cart-summary">مبلغ کل: ${total.toLocaleString()} تومان</h3>`;

  // رویدادها
  container.querySelectorAll('.increase').forEach(btn => 
    btn.addEventListener('click', () => changeQty(btn.dataset.id, +1)));
  container.querySelectorAll('.decrease').forEach(btn => 
    btn.addEventListener('click', () => changeQty(btn.dataset.id, -1)));
  container.querySelectorAll('.remove-btn').forEach(btn =>
    btn.addEventListener('click', () => changeQty(btn.dataset.id, 'remove')));

  updateCartCount();
}

// تغییر تعداد یا حذف آیتم سبد
function changeQty(id, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.map(item => {
    if (item.id == id) {
      if (delta === 'remove') return null;
      item.qty += delta;
      if (item.qty < 1) return null;
    }
    return item;
  }).filter(Boolean);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCartItems();
}

document.addEventListener('DOMContentLoaded', () => {
  // فقط محصولات فروشگاه را اگر grid وجود داشت رندر کن
  renderShopProducts();
  // اگر در صفحه cart.html باشیم
  if (document.getElementById('cart-items')) {
    renderCartItems();
  }
  updateCartCount();
});

// ================= دکمه منوی موبایل =================
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header .container');
  const navigation = document.querySelector('.navigation');
  if (!header || !navigation) return;
  if (header.querySelector('.menu-toggle')) return; // اگر قبلاً اضافه شده
  const menuToggle = document.createElement('button');
  menuToggle.className = 'menu-toggle';
  menuToggle.innerHTML = '&#9776;';
  menuToggle.style.display = 'none';
  header.insertBefore(menuToggle, navigation);

  function adjustMenuVisibility() {
    if (window.innerWidth <= 991) {
      menuToggle.style.display = 'block';
      navigation.classList.add('mobile-menu');
      if (!navigation.classList.contains('active')) {
        navigation.style.display = 'none';
      }
    } else {
      menuToggle.style.display = 'none';
      navigation.style.display = 'block';
      navigation.classList.remove('mobile-menu');
      navigation.classList.remove('active');
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
