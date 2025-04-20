// main.js
// universally applies for all sections/pages (shop, cart, ...)

// نمایش تعداد آیتم‌های سبد در هرجا که span یا هر المنت cart-count باشد
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  // همه span ها یا المان‌هایی با id یا class cart-count پیدا و مقداردهی شود
  document.querySelectorAll('#cart-count, .cart-count').forEach(b => b.textContent = count);
}

// برای ورود به هر صفحه، تعداد آیتم‌های سبد را به‌روزرسانی کن
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderShopProducts();
  renderCartItems();
  // اگر صفحه shop است، دکمه‌های افزودن به سبد را وصل کن
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function(){
      const id    = this.dataset.id;
      const title = this.dataset.title;
      const price = parseInt(this.dataset.price);
      // image اگر داری
      const image = this.dataset.image || '';
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
});

// رندر محصولات در فروشگاه (درصورتی که بخش grid باشد)
function renderShopProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  // نمونه محصولات
  const products = [
    {
      id: "book1",
      title: 'سفر به اعماق رازهای نهان باورها',
      description: 'درون این کتاب، گنجینه‌ای از خودشناسی نهفته است…',
      image: 'image_0.png',
      price: 998000
    },
    {
      id: "book2",
      title: 'عنوان محصول دوم',
      description: 'خلاصه‌ای از این محصول دوم؛ توضیحی کوتاه.',
      image: 'image_0 (1).png',
      price: 500000
    },
    {
      id: "book3",
      title: 'عنوان محصول سوم',
      description: 'نکته کلیدی درباره این محصول.',
      image: 'image_0 (2).png',
      price: 750000
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
      <span>قیمت: ${p.price.toLocaleString()} تومان</span>
      <button class="add-to-cart"
        data-id="${p.id}"
        data-title="${p.title}"
        data-price="${p.price}"
        data-image="${p.image}">
        افزودن به سبد
      </button>
    `;
    grid.appendChild(card);
  });
}

// رندر آیتم‌های سبد خرید (در cart.html)
function renderCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>سبد خرید شما خالی است.</p>';
    document.getElementById('cart-total').innerHTML = '';
    return;
  }
  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image || 'placeholder.png'}" alt="${item.title}">
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

  // دکمه‌ها
  container.querySelectorAll('.inc-btn').forEach(b =>
    b.addEventListener('click', () => changeQty(b.dataset.id, +1)));
  container.querySelectorAll('.dec-btn').forEach(b =>
    b.addEventListener('click', () => changeQty(b.dataset.id, -1)));
  container.querySelectorAll('.remove-btn').forEach(b =>
    b.addEventListener('click', () => changeQty(b.dataset.id, 0)));

  document.getElementById('cart-total').innerHTML =
    `<h3 id="cart-summary">مبلغ کل: ${total.toLocaleString()} تومان</h3>`;
  updateCartCount();
}

// مدیریت تعداد کالا و حذف
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
  renderCartItems();
  updateCartCount();
}

// دکمه منوی موبایل
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header .container');
  const navigation = document.querySelector('.navigation');
  if (!header || !navigation) return;
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
