// main.js
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badgeElems = document.querySelectorAll('#cart-count');
  badgeElems.forEach(b => b.textContent = count);
}

document.addEventListener('DOMContentLoaded', () => {
  renderShopProducts();
  updateCartCount();
  renderCartItems();
});

function renderShopProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  // فقط یک کتاب مجاز
  const products = [
    {
      id: 1,
      title: 'سفر به اعماق رازهای نهان باورها',
      description: 'درون این کتاب، گنجینه‌ای از خودشناسی نهفته است. باورهای پنهانی که سال‌ها زندگی‌ات را تحت تاثیر قرار داده‌اند را کشف کن و با سفر به اعماق باورهایت ، کلید رهایی را پیدا کن',
      image: 'image_0.png',
      link: '#'
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
      <button class="add-to-cart"
        data-id="${p.id}"
        data-title="${p.title}"
        data-price="0"
        data-image="${p.image}">افزودن به سبد خرید</button>
    `;
    grid.appendChild(card);
  });

  // فعال‌سازی دکمه سبد فقط برای کتاب موجود
  grid.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function(){
      const id = this.dataset.id;
      const title = this.dataset.title;
      const price = 0; // قیمت صفر، طبق درخواست
      const image = this.dataset.image;
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, title, price, image, qty: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      alert('محصول به سبد اضافه شد!');
    });
  });
}

// نمایش آیتم‌های سبد در cart.html
function renderCartItems() {
  const container = document.getElementById('cart-items');
  const totalElem = document.getElementById('cart-total');
  if (!container) return;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>سبد شما خالی است.</p>';
    if(totalElem) totalElem.style.display = 'none';
    return;
  }
  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="">
      <div class="cart-item-title">${item.title}</div>
      <div class="cart-item-price">${item.price}</div>
      <div class="qty-controls">
        <button class="dec-btn" data-id="${item.id}">-</button>
        <span>${item.qty}</span>
        <button class="inc-btn" data-id="${item.id}">+</button>
      </div>
      <div class="cart-item-subtotal">${(item.price * item.qty)}</div>
      <button class="remove-btn" data-id="${item.id}">&times;</button>
    `;
    container.appendChild(div);
  });
  if(totalElem) {
    totalElem.style.display = 'block';
    totalElem.innerHTML = `<h3 id="cart-summary">مبلغ کل: ${total} تومان</h3>`;
  }
  // دکمه‌ها
  container.querySelectorAll('.inc-btn').forEach(b =>
    b.addEventListener('click', () => changeQty(b.dataset.id, +1)));
  container.querySelectorAll('.dec-btn').forEach(b =>
    b.addEventListener('click', () => changeQty(b.dataset.id, -1)));
  container.querySelectorAll('.remove-btn').forEach(b =>
    b.addEventListener('click', () => changeQty(b.dataset.id, 0)));
 // update count badge
  updateCartCount();
}

function changeQty(id, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.map(item => {
    if (item.id == id) {
      if (delta === 0) return null;
      item.qty = Math.max(1, item.qty + delta);
    }
    return item;
  }).filter(i => i);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// منوی موبایل
document.addEventListener('DOMContentLoaded', function() {
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
