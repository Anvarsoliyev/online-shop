// 1. Ma'lumotlarni LocalStorage'dan o'qib olish
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = JSON.parse(localStorage.getItem('myProducts')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Sayt yuklanganda hamma narsani ishga tushirish
window.onload = function() {
    renderStoredProducts();
    updateCartUI();
    updateWishlistUI();
    checkTheme();
};

// 2. Savatchaga qo'shish
function addToCart(name, price) {
    cart.push({ name: name, price: price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    alert(`${name} savatchaga qo'shildi!`);
}

function updateCartUI() {
    const cartBtn = document.getElementById('cart-btn') || document.querySelector('nav button');
    if (cartBtn) cartBtn.innerText = `Savatcha (${cart.length})`;
}

// 3. Savatchani ko'rsatish va Jami narx
function showCart() {
    if (cart.length === 0) {
        alert("Savatchangiz hozircha bo'sh!");
        return;
    }
    let itemsList = cart.map((item, index) => `${index + 1}. ${item.name} - ${item.price}`).join('\n');
    
    let total = cart.reduce((sum, item) => {
        let priceNum = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
        return sum + priceNum;
    }, 0);

    let choice = confirm(`Sizning savatchangiz:\n\n${itemsList}\n\nJami: ${total.toLocaleString()} so'm\n\nSavatchani tozalamoqchimisiz?`);
    if (choice) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        alert("Savatcha tozalandi!");
    }
}

// 4. Admin panel: Mahsulot qo'shish
function addProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const img = document.getElementById('pImg').value;

    if (name && price && img) {
        const newObj = { name, price, img };
        products.push(newObj);
        localStorage.setItem('myProducts', JSON.stringify(products));
        
        // Inputlarni tozalash
        document.getElementById('pName').value = '';
        document.getElementById('pPrice').value = '';
        document.getElementById('pImg').value = '';
        
        renderStoredProducts();
        alert("Mahsulot qo'shildi!");
    } else {
        alert("Iltimos, hamma maydonlarni to'ldiring!");
    }
}

// 5. Mahsulotni o'chirish
function deleteProduct(index) {
    if (confirm("Ushbu mahsulotni o'chirmoqchimisiz?")) {
        products.splice(index, 1);
        localStorage.setItem('myProducts', JSON.stringify(products));
        renderStoredProducts();
    }
}

// 6. Sevimlilar (Wishlist) logikasi
function toggleWishlist(index) {
    const product = products[index];
    const itemIndex = wishlist.findIndex(item => item.name === product.name);

    if (itemIndex > -1) {
        wishlist.splice(itemIndex, 1);
        alert("Sevimlilardan olib tashlandi");
    } else {
        wishlist.push(product);
        alert("Sevimlilarga qo'shildi! ❤️");
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

function updateWishlistUI() {
    const countSpan = document.getElementById('wishlist-count');
    if (countSpan) countSpan.innerText = wishlist.length;
}

function showWishlist() {
    if (wishlist.length === 0) {
        alert("Sevimlilar ro'yxati bo'sh!");
        return;
    }
    let list = wishlist.map((item, i) => `${i+1}. ${item.name}`).join('\n');
    alert("Siz yoqtirgan mahsulotlar:\n\n" + list);
}

// 7. Ekranda ko'rsatish
function displayProduct(product, index) {
    const productGrid = document.getElementById('product-grid');
    const productHTML = `
        <div class="bg-white p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 relative group">
            <button onclick="deleteProduct(${index})" class="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs z-10">✕</button>
            <button onclick="toggleWishlist(${index})" class="absolute top-2 left-2 bg-white text-red-500 w-8 h-8 rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10">❤</button>
            <img src="${product.img}" class="w-full h-48 object-cover rounded-xl mb-4" onerror="this.src='https://via.placeholder.com/300'">
            <h4 class="font-bold text-lg text-gray-800">${product.name}</h4>
            <p class="text-blue-500 text-xs font-semibold mb-2 uppercase">Umumiy</p>
            <div class="flex justify-between items-center">
                <span class="text-blue-600 font-bold">${product.price}</span>
                <button onclick="addToCart('${product.name}', '${product.price}')" class="bg-green-500 text-white w-10 h-10 rounded-full hover:bg-green-600 flex items-center justify-center font-bold">+</button>
            </div>
        </div>`;
    productGrid.innerHTML += productHTML;
}

function renderStoredProducts() {
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        productGrid.innerHTML = ''; 
        products.forEach((p, index) => displayProduct(p, index));
    }
}

// 8. Tungi rejim
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('dark-mode-btn').innerText = isDark ? '☀️' : '🌙';
}

function checkTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        if(document.getElementById('dark-mode-btn')) document.getElementById('dark-mode-btn').innerText = '☀️';
    }
}