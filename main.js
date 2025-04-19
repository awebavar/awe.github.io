// فایل main.js - به‌روزرسانی شده

// تابع برای به‌روزرسانی تعداد آیتم‌ها در سبد خرید
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        let totalQuantity = 0;
        cartItems.forEach(item => {
            totalQuantity += item.quantity;
        });
        
        cartCount.textContent = totalQuantity;
    }
}

// تابع برای نمایش محصولات در صفحه فروشگاه
function displayProducts() {
// افزودن آیتم به سبد خرید
function addToCart(productId, productName, productPrice, inStock = true) {
    // اگر محصول موجود نیست، اضافه نکن
    if (!inStock) {
        alert(`${productName} موجود نیست و نمی‌تواند به سبد خرید اضافه شود.`);
        return;
    }
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // بررسی آیا محصول قبلاً در سبد خرید بوده است
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        // افزایش تعداد اگر محصول قبلاً در سبد خرید بوده است
        existingItem.quantity += 1;
    } else {
        // افزودن محصول جدید به سبد خرید
        cartItems.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    // ذخیره در localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // به‌روزرسانی تعداد سبد خرید
    updateCartCount();
    
    // نمایش پیام موفقیت
    alert(`${productName} به سبد خرید اضافه شد.`);
}

    
    // ذخیره در localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // به‌روزرسانی تعداد سبد خرید
    updateCartCount();
    
    // نمایش پیام موفقیت
    alert(`${productName} به سبد خرید اضافه شد.`);
}

// تابع برای نمایش آیتم‌های سبد خرید
function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCart = document.getElementById('empty-cart');
    
    if (cartItems.length === 0) {
        // نمایش پیام سبد خرید خالی
        if (cartContainer) cartContainer.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        return;
    }
    
    // مخفی کردن پیام سبد خرید خالی
    if (cartContainer) cartContainer.style.display = 'block';
    if (cartSummary) cartSummary.style.display = 'flex';
    if (emptyCart) emptyCart.style.display = 'none';
    
    // خالی کردن محتوای موجود
    if (cartContainer) cartContainer.innerHTML = '';
    
    // اضافه کردن هدر سبد خرید
    if (cartContainer) {
        cartContainer.innerHTML = `
            <div class="cart-header">
                <div>محصول</div>
                <div>قیمت واحد</div>
                <div>تعداد</div>
                <div>قیمت کل</div>
            </div>
        `;
    }
    
    let totalPrice = 0;
    
    // اضافه کردن آیتم‌ها به سبد خرید
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        if (cartContainer) {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="product-info">
                    <img src="placeholder.jpg" alt="${item.name}">
                    <div class="product-details">
                        <h3>${item.name}</h3>
                    </div>
                </div>
                <div class="item-price">${item.price.toLocaleString()} تومان</div>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="item-subtotal">${itemTotal.toLocaleString()} تومان</div>
                <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
            `;
            cartContainer.appendChild(cartItemElement);
        }
    });
    
    // به‌روزرسانی خلاصه سبد خرید
    const summaryElement = document.querySelector('.summary-details');
    if (summaryElement) {
        summaryElement.innerHTML = `
            <div class="summary-row">
                <span>جمع کل:</span>
                <span>${totalPrice.toLocaleString()} تومان</span>
            </div>
            <div class="summary-row">
                <span>مالیات بر ارزش افزوده (9%):</span>
                <span>${(totalPrice * 0.09).toLocaleString()} تومان</span>
            </div>
            <div class="summary-row total-row">
                <span>مبلغ قابل پرداخت:</span>
                <span>${(totalPrice * 1.09).toLocaleString()} تومان</span>
            </div>
            <button class="checkout-btn">تکمیل خرید</button>
        `;
    }
    
    // اضافه کردن رویدادها به دکمه‌های کم و زیاد کردن و حذف
    addCartButtonEvents();
}

// اضافه کردن رویداد به دکمه‌های سبد خرید
function addCartButtonEvents() {
    // دکمه‌های افزایش تعداد
    const increaseButtons = document.querySelectorAll('.increase');
    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            changeQuantity(productId, 1);
        });
    });
    
    // دکمه‌های کاهش تعداد
    const decreaseButtons = document.querySelectorAll('.decrease');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            changeQuantity(productId, -1);
        });
    });
    
    // دکمه‌های حذف
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            removeFromCart(productId);
            // اضافه کردن event listener به دکمه‌های "افزودن به سبد خرید"
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const productName = button.getAttribute('data-name');
            const productPrice = parseFloat(button.getAttribute('data-price'));
            const inStock = button.getAttribute('data-stock') !== 'false';
            
            addToCart(productId, productName, productPrice, inStock);
        });
    });
}

// اجرای توابع مورد نیاز هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // نمایش آیتم‌های سبد خرید اگر در صفحه سبد خرید هستیم
    if (document.getElementById('cart-items')) {
        displayCartItems();
    }
    
    // راه‌اندازی دکمه‌های افزودن به سبد خرید
    setupAddToCartButtons();
});

        });
    });
}

// تغییر تعداد محصول در سبد خرید
function changeQuantity(productId, change) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity += change;
        
        // حذف آیتم اگر تعداد آن صفر یا کمتر شود
        if (cartItems[itemIndex].quantity <= 0) {
            cartItems.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
        displayCartItems();
    }
}

// حذف از سبد خرید
function removeFromCart(productId) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCart = cartItems.filter(item => item.id !== productId);
    
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    updateCartCount();
    displayCartItems();
}

// اضافه کردن event listener به دکمه‌های "افزودن به سبد خرید"
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const productName = button.getAttribute('data-name');
            const productPrice = parseInt(button.getAttribute('data-price'));
            
            addToCart(productId, productName, productPrice);
        });
    });
}

// کنترل منوی موبایل (همبرگری)
function setupMobileMenu() {
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const navigation = document.querySelector('.navigation');
    
    if (mobileMenuIcon && navigation) {
        mobileMenuIcon.addEventListener('click', () => {
            navigation.classList.toggle('show');
        });
    }
}

// اجرای توابع لازم در زمان بارگذاری صفحه
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setupAddToCartButtons();
    setupMobileMenu();
    
    // نمایش آیتم‌های سبد خرید اگر در صفحه سبد خرید هستیم
    if (document.getElementById('cart-items')) {
        displayCartItems();
    }
});
