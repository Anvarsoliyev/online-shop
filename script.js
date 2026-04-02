let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = JSON.parse(localStorage.getItem('myProducts')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

window.onload = function() {
    renderStoredProducts();
    updateCartUI();
    updateWishlistUI();
    checkTheme();
};

function addProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const img = document.getElementById('pImg').value;
    const category = document.getElementById('pCategory').value;

    if (name && price && img) {
        const newObj = { name, price, img, category };
        products.push(newObj);
        localStorage.setItem('myProducts', JSON.stringify(products));
        alert("Mahsulot qo'shildi!");
        location.reload();
    } else {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
    }
}

function deleteProduct(index) {
    if (confirm("Ushbu mahsulotni o'chirmoqchimisiz?")) {
        products.splice(index, 1);
        localStorage.setItem('myProducts', JSON.stringify(products));
        renderStoredProducts();
    }
}

function displayProduct(product, index) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    // Admin sahifada bo'lsak X tugmasini ko'rsatamiz, asosiyda esa yo'q
    const isAdmin = window.isAdmin === true;
    const deleteBtn = isAdmin ? `<button onclick="deleteProduct(${index})" class="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs z-10">✕</button>` : '';

    const productHTML = `
        <div class="bg-white p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 relative group product-card" data-category="${product.category}">
            ${deleteBtn}
            <button onclick="toggleWishlist(${index})" class="absolute top-2 left-2 bg-white text-red-500 w-8 h-8 rounded-full shadow-md flex items-center justify-center hover:scale-110 z-10">❤</button>
            <img src="${product.img}" class="w-full h-48 object-cover rounded-xl mb-4" onerror="this.src='https://via.placeholder.com/300'">
            <h4 class="font-bold text-lg text-gray-800">${product.name}</h4>
            <p class="text-blue-500 text-xs font-semibold mb-2 uppercase">${product.category || 'Umumiy'}</p>
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

// Qidirish funksiyasi
function filterProducts() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const name = card.querySelector('h4').innerText.toLowerCase();
        card.style.display = name.includes(term) ? 'block' : 'none';
    });
}

// Kategoriya bo'yicha saralash
function filterCategory(cat) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        if (cat === 'all') card.style.display = 'block';
        else card.style.display = card.getAttribute('data-category') === cat ? 'block' : 'none';
    });
}

// Qolgan funksiyalar (Cart, Wishlist, DarkMode) avvalgi kod bilan bir xil...
function updateCartUI() {
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) cartBtn.innerText = `Savatcha (${cart.length})`;
}
function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}
function toggleWishlist(index) {
    const product = products[index];
    const exists = wishlist.findIndex(w => w.name === product.name);
    if (exists > -1) wishlist.splice(exists, 1);
    else wishlist.push(product);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}
function updateWishlistUI() {
    const count = document.getElementById('wishlist-count');
    if (count) count.innerText = wishlist.length;
}
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
function checkTheme() {
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
}
function showCart() {
    if (cart.length === 0) alert("Savatcha bo'sh");
    else alert("Savatchada " + cart.length + " ta tovar bor");
}
function showWishlist() {
    if (wishlist.length === 0) alert("Sevimlilar bo'sh");
    else alert("Siz yoqtirgan tovarlar soni: " + wishlist.length);
}