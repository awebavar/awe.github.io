// main.js
// ماژول اصلی برای صفحات index, shop و cart

// --------------------- بروزرسانی عدد badge سبد خرید ----------------------
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart'))
  renderShopProducts();
  updateCartCount();
  calculateCartTotal
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('#cart-count').forEach(b => b.textContent = count);
}

// ----------------- ساخت دکمه منوی موبایل (responsive) --------------------
document.addEventListener('DOMContentLoaded', function () {



  
  const header = document.querySelector('header .container');
  const navigation = document.querySelector('.navigation');
  if (!header || !navigation) return;

  // دکمه فقط یک بار ساخته شود
  if (!header.querySelector('.menu-toggle')) {
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
        navigation.classList.remove('mobile-menu', 'active');
      }
    }
    adjustMenuVisibility();
    window.addEventListener('resize', adjustMenuVisibility);

    menuToggle.addEventListener('click', function () {
      const isNowOpen = navigation.style.display === 'none' || navigation.style.display === '';
      navigation.style.display = isNowOpen ? 'block' : 'none';
      navigation.classList.toggle('active', isNowOpen);
    });
  }
});

// ---------------------- رندر محصولات shop.html ---------------------------
function renderShopProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  // نمونه داده محصولات (می‌توانید این بخش را داینامیک‌تر کنید)
  const products = [
    {
      id: 1,
      title: 'سفر به اعماق رازهای نهان باورها',
      description: 'درون این کتاب، گنجینه‌ای از خودشناسی نهفته است…',
      price: 998000,
      image: 'image_0.png',
      link: '#'
    },
    {
      id: 2,
      title: 'عنوان محصول دوم',
      description: 'خلاصه‌ای از این محصول دوم؛ توضیحی کوتاه.',
      price: 520000,
      image: 'image_0 (1).png',
      link: '#'
    },
    {
      id: 3,
      title: 'عنوان محصول سوم',
      description: 'نکتهٔ کلیدی دربارهٔ این محصول.',
      price: 370000,
      image: 'image_0 (2).png',
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
      <div class="book-meta">
        <span class="book-price">${p.price.toLocaleString()} تومان</span>
        <button class="add-to-cart"
          data-id="${p.id}"
          data-title="${p.title}"
          data-price="${p.price}"
          data-image="${p.image}"
        >افزودن به سبد</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ----------------- افزودن به سبد خرید (shop.html) -----------------------
document.addEventListener('DOMContentLoaded', function () {
  renderShopProducts();
  updateCartCount();
  calculateCartTotal();

  // event delegation برای افزودن به سبد خرید
  document.body.addEventListener('click', function (e) {
     renderShopProducts();
  updateCartCount();
    calculateCartTotal();
    if (e.target.classList.contains('add-to-cart')) {
      const btn = e.target;
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      const price = parseInt(btn.dataset.price);
      const image = btn.dataset.image;

      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      let existing = cart.find(item => item.id == id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, title, price, image, qty: 1 });
      }
            localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      calculateCartTotal();
      alert('محصول به سبد اضافه شد!');
    }
  });
});

// --------------------- رندر آیتم‌های سبد خرید (cart.html) -----------------
function renderCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>سبد شما خالی است.</p>';
    // دکمه‌های اقدام به خرید را در صورت خالی بودن پنهان کن
    const actions = document.querySelector('.cart-actions');
    if (actions) actions.style.display = 'none';
    return;
  }

  cart.forEach(item => {
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
      <div class="cart-item-subtotal">${(item.price * item.qty).toLocaleString()} تومان</div>
      <button class="remove-btn" data-id="${item.id}">&times;</button>
    `;
    container.appendChild(div);
  });

  // رویداد دکمه‌ها:
  container.querySelectorAll('.inc-btn').forEach(b =>
    b.addEventListener('click', () => changeQty(b.dataset.id, +1)));
  container.querySelectorAll('.dec-btn').forEach(b =>
    b.addEventListener('click', () => changeQty(b.dataset.id, -1)));
  container.querySelectorAll('.remove-btn').forEach(b =>
    b.addEventListener('click', () => changeQty(b.dataset.id, 0)));

  calculateCartTotal();
}

// ----------------- حذف/تغییر تعداد آیتم سبد خرید (cart.html) ----------------
function changeQty(id, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let changed = false;
  cart = cart.map(item => {
    if (item.id == id) {
      if (delta === 0) return null; // حذف کلی
      item.qty = Math.max(1, item.qty + delta);
      changed = true;
    }
    return item;
  }).filter(Boolean);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
        calculateCartTotal();

}

// ------------- جمع کل سبد خرید (cart.html) ---------------------------------
function calculateCartTotal() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const el = document.getElementById('cart-total');
  if (el) el.textContent = total.toLocaleString() + ' تومان';
  
  // نمایش یا مخفی کردن دکمه های اقدام به خرید
  const actions = document.querySelector('.cart-actions');
  if (actions) {
    // فقط اگر تنها یک آیتم و آنهم id=1 باشد
    if (cart.length === 1 && cart[0].id == 1) {
      actions.style.display = 'block';
    } else {
      actions.style.display = 'none';
    }
  }
}


// ----------------- اجرای توابع cart فقط در cart.html ----------------------
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('cart-items')) {
    renderCartItems();
    updateCartCount();
  }
});
