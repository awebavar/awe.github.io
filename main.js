// main.js
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  // به جای ID منفرد، الان در هر جایی که این span باشد همه را به‌روزرسانی کن
  document.querySelectorAll('#cart-count').forEach(b => {
    b.textContent = count;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});

// ... سایر کدها (همانند گذشته) ...
