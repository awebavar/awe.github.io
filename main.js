// main.js - نسخه اصلاحی (رفع حلقه های بینهایت و ایرادات عملکردی)

//----------------- بروزرسانی عدد badge سبد خرید ------------------
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('#cart-count').forEach(b => b.textContent = count);
}

//--------------- منوی موبایل ----------------------
document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('header .container');
  const navigation = document.querySelector('.navigation');
  if (!header || !navigation) return;

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

//--------------- رندر محصولات فروشگاه -----------------
function renderShopProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

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

//----------- افزودن به سبد خرید (shop.html) ------------
document.addEventListener('DOMContentLoaded', function () {
  renderShopProducts();
  updateCartCount();
  calculateCartTotal();

  // فقط روی دکمه افزودن سبد خرید اتفاق بیافتد
  document.body.addEventListener('click', function (e) {
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

//-------------------- رندر آیتم‌ سبد خرید (cart.html) -----------------
function renderCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart-message">سبد شما خالی است.</p>';
    // دکمه‌های اقدام به خرید را در صورت خالی بودن پنهان کن
    const actions = document.querySelector('.cart-actions');
    if (actions) actions.style.display = 'none';
    document.getElementById('cart-total').textContent = '۰ تومان';
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

//------------ حذف/تغییر تعداد آیتم سبد خرید (cart.html) --------------
function changeQty(id, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (delta === 0) {
    cart = cart.filter(item => item.id != id);
  } else {
    cart = cart.map(item => {
      if (item.id == id) {
        item.qty = Math.max(1, item.qty + delta);
      }
      return item;
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

//------------- جمع کل سبد خرید --------------
function calculateCartTotal() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.querySelectorAll('#cart-total').forEach(el => {
    el.textContent = total.toLocaleString() + ' تومان';
  });
  const actions = document.querySelector('.cart-actions');
  if (actions) {
    actions.style.display = cart.length > 0 ? 'block' : 'none';
  }
}

//----------------- مخصوص cart.html -------------------
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('cart-items')) {
    renderCartItems();
    updateCartCount();
  }
});
