// main.js
// ماژول اصلی برای صفحات index و shop
// به‌روز رسانی عدد badge روی آیکون سبد
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badgeElems = document.querySelectorAll('#cart-count');
  badgeElems.forEach(b => b.textContent = count);
}

document.addEventListener('DOMContentLoaded', () => {
  renderShopProducts();
updateCartCount();

});

// تابع رندر محصولات صفحه فروشگاه
function renderShopProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  // نمونه داده محصولات
  const products = [
    {
      id: 1,
      title: 'سفر به اعماق رازهای نهان باورها',
      description: 'درون این کتاب، گنجینه‌ای از خودشناسی نهفته است…',
      image: 'image_0.png',
      link: '#'
    },
    {
      id: 2,
      title: 'عنوان محصول دوم',
      description: 'خلاصه‌ای از این محصول دوم؛ توضیحی کوتاه.',
      image: 'image_0 (1).png',
      link: '#'
    },
    {
      id: 3,
      title: 'عنوان محصول سوم',
      description: 'نکتهٔ کلیدی دربارهٔ این محصول.',
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
      <a href="${p.link}" class="btn btn-secondary">مشاهده و خرید</a>
    `;
    grid.appendChild(card);
  });
}
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function(){
      const id    = this.dataset.id;
      const title = this.dataset.title;
      const price = parseInt(this.dataset.price);
updateCartCount();
      // خواندن سبد
      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      // اگر هست، تعدادش را زیاد کن
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, title, price, qty: 1 });
      }

      // ذخیره در localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
updateCartCount();

      alert('محصول به سبد اضافه شد!');
    });
  });
});
// نمایش آیتم‌های سبد در cart.html
function renderCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>سبد شما خالی است.</p>';
    document.getElementById('cart-summary').style.display = 'none';
    return;
  }
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="">
      <div class="cart-item-title">${item.title}</div>
      <div class="cart-item-price">${item.price.toLocaleString()}</div>
      <div class="qty-controls">
        <button class="dec-btn" data-id="${item.id}">-</button>
        <span>${item.qty}</span>
        <button class="inc-btn" data-id="${item.id}">+</button>
      </div>
      <div class="cart-item-subtotal">${(item.price * item.qty).toLocaleString()}</div>
      <button class="remove-btn" data-id="${item.id}">&times;</button>
    `;
    container.appendChild(div);
  });

  // پیوند دکمه‌ها
  container.querySelectorAll('.inc-btn').forEach(b =>
    b.addEventListener('click', () => changeQty(b.dataset.id, +1)));
  container.querySelectorAll('.dec-btn').forEach(b =>
    b.addEventListener('click', () => changeQty(b.dataset.id, -1)));
  container.querySelectorAll('.remove-btn').forEach(b =>
    b.addEventListener('click', () => changeQty(b.dataset.id, 0)));

  calculateCartTotal();
}

// تغییر تعداد یا حذف
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

// محاسبه جمع کل
function calculateCartTotal() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const el = document.getElementById('cart-total');
  if (el) el.textContent = total.toLocaleString();
}

// وقتی cart.html لود شد
document.addEventListener('DOMContentLoaded', () => {
  renderCartItems();
  updateCartCount();
});
// اضافه کردن دکمه منو برای موبایل
document.addEventListener('DOMContentLoaded', function() {
  // ایجاد دکمه منو برای حالت موبایل
  const header = document.querySelector('header .container');
  const navigation = document.querySelector('.navigation');
  
  // ساخت دکمه منو
  const menuToggle = document.createElement('button');
  menuToggle.className = 'menu-toggle';
  menuToggle.innerHTML = '&#9776;'; // نماد همبرگر
  menuToggle.style.display = 'none'; // در ابتدا مخفی
  
  // اضافه کردن به هدر، قبل از navigation
  header.insertBefore(menuToggle, navigation);
  
  // تنظیم نمایش دکمه منو در موبایل
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
  
  // اجرا در بارگذاری و تغییر سایز
  adjustMenuVisibility();
  window.addEventListener('resize', adjustMenuVisibility);
  
  // کلیک روی دکمه منو
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
// عملکرد دکمه "نمایش بیشتر" در متن‌های طولانی
document.addEventListener('DOMContentLoaded', function() {
  const aboutUsText = document.querySelector('#about-us p');
  
  if (aboutUsText && aboutUsText.scrollHeight > aboutUsText.clientHeight) {
    const readMoreBtn = document.createElement('span');
    readMoreBtn.className = 'read-more-btn';
    readMoreBtn.textContent = 'نمایش بیشتر...';
    aboutUsText.after(readMoreBtn);
    
    readMoreBtn.addEventListener('click', function() {
      if (aboutUsText.classList.contains('expanded-text')) {
        aboutUsText.classList.remove('expanded-text');
        this.textContent = 'نمایش بیشتر...';
      } else {
        aboutUsText.classList.add('expanded-text');
        this.textContent = 'نمایش کمتر';
      }
    });
  }
});
