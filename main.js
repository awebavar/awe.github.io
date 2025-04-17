// لیست نمونه برای پیشنهادات جستجو
const sampleSuggestions = [
  'رازهای باور به قدرت بیکران هستی',
  'زخم‌های کودکی و باورهای بزرگسالی',
  'ویروس‌های ذهنی پاکسازی باورهای سمی',
  'تمرینات روزانه برای تقویت باور',
  'کتاب سفر به اعماق رازهای نهان باورها'
];

function setupSearch(inputId, suggId) {
  const input = document.getElementById(inputId);
  const suggBox = document.getElementById(suggId);

  input.addEventListener('input', () => {
    const val = input.value.trim().toLowerCase();
    suggBox.innerHTML = '';
    if (!val) {
      suggBox.style.display = 'none';
      return;
    }
    const matches = sampleSuggestions.filter(item =>
      item.toLowerCase().includes(val)
    );
    if (matches.length) {
      matches.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        li.onclick = () => {
          input.value = text;
          suggBox.style.display = 'none';
        };
        suggBox.appendChild(li);
      });
      suggBox.style.display = 'block';
    } else {
      suggBox.style.display = 'none';
    }
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target)) {
      suggBox.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupSearch('search-input', 'suggestions');
  setupSearch('search-input-shop', 'suggestions-shop');
});
