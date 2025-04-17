// main.js
// ماژول اصلی برای صفحات index و shop

document.addEventListener('DOMContentLoaded', () => {
  renderShopProducts();
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
