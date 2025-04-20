// main.js
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('#cart-count').forEach(elem => elem.textContent = count);
}

function renderShopProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const products = [
    {
      id: 1,
      title: 'سفر به اعماق رازهای نهان باورها',
      description: 'درون این کتاب، گنجینه‌ای از خودشناسی نهفته است…',
      price: 998000,
      image: 'image_0.png'
    }
    // محصولات دیگر را در همین آرایه اضافه کنید
  ];

  grid.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <p>قیمت: <span class="product-price">${p.price.toLocaleString()}</span> تومان</p>
      <button class="add-to-cart"
        data-id="${p.id}"
        data-title="${p.title}"
        data-price="${p.price}">
        افزودن به سبد
      </button>
    `;
    grid.appendChild(card);
  });
  document.querySelectorAll('.add-to-cart').forEach(btn =>
    btn.addEventListener('click', function () {
      const id = this.dataset.id;
      const title = this.dataset.title;
      const price = parseInt(this.dataset.price);
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(item => String(item.id) === id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, title, price, qty: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      alert('محصول به سبد اضافه شد!');
    })
  );
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const container = document.getElementById('cart-items');
  const totalDiv = document.getElementById('cart-total');
  const actions = document.querySelector('.cart-actions');
  if (!container || !totalDiv) return;

  container.innerHTML = '';
  let total = 0;
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart-message">سبد خرید شما خالی است.</p>';
    totalDiv.innerHTML = '';
    if (actions) actions.style.display = 'none';
    updateCartCount();
    return;
  }
  if (actions) actions.style.display = 'flex';

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
      </div>
    `;
    container.insertAdjacentHTML('beforeend', itemHTML);
  });

  totalDiv.innerHTML = `<h3 id="cart-summary">مبلغ کل: ${total.toLocaleString()} تومان</h3>`;

  container.querySelectorAll('.increase').forEach(btn =>
    btn.addEventListener('click', () => changeQty(btn.dataset.id, 1))
  );
  container.querySelectorAll('.decrease').forEach(btn =>
    btn.addEventListener('click', () => changeQty(btn.dataset.id, -1))
  );
  container.querySelectorAll('.remove-btn').forEach(btn =>
    btn.addEventListener('click', () => changeQty(btn.dataset.id, 'remove'))
  );

  updateCartCount();
}

function changeQty(id, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.map(item => {
    if (String(item.id) === String(id)) {
      if (delta === 'remove') return null;
      item.qty += delta;
      if (item.qty < 1) return null;
    }
    return item;
  }).filter(Boolean);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function setupMobileMenu() {
  const header = document.querySelector('header .container');
  const navigation = document.querySelector('.navigation');
  if (!header || !navigation) return;
  if (document.querySelector('.menu-toggle')) return;
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
    }
  }

  adjustMenuVisibility();
  window.addEventListener('resize', adjustMenuVisibility);

  menuToggle.addEventListener('click', function () {
    if (navigation.style.display === 'none' || navigation.style.display === '') {
      navigation.style.display = 'block';
      navigation.classList.add('active');
    } else {
      navigation.style.display = 'none';
      navigation.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
  setupMobileMenu();

  if (document.body.classList.contains('cart-page')) {
    renderCart();
  } else if (document.body.classList.contains('shop-page')) {
    renderShopProducts();
  }
});
