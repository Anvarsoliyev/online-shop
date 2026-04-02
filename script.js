// 1. Firebase havola (oxiriga .json qo'shilgan)
const databaseURL = "https://my-shop-bff-default-rtdb.firebaseio.com/products.json";

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let products = [];

// Sayt yuklanganda bazadan ma'lumotlarni yuklab olish
window.onload = function() {
    fetchProducts();
    updateCartUI();
    updateWishlistUI();
    checkTheme();
};

// 2. Firebase'dan mahsulotlarni o'qib olish (GET)
async function fetchProducts() {
    try {
        const response = await fetch(databaseURL);
        const data = await response.json();
        products = [];
        if (data) {
            // Firebase obyekt formatida beradi, uni arrayga o'tkazamiz
            Object.keys(data).forEach(key => {
                products.push({ id: key, ...data[key] });
            });
        }
        renderStoredProducts();
    } catch (error) {
        console.error("Ma'lumot olishda xato:", error);
    }
}

// 3. Yangi mahsulot qo'shish (POST)
async function addProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const img = document.getElementById('pImg').value;
    const category = document.getElementById('pCategory').value;

    if (name && price && img) {
        const newObj = { name, price, img, category };
        try {
            await fetch(databaseURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newObj)
            });
            alert("Mahsulot barcha qurilmalar uchun qo'shildi!");
            // Formani tozalash
            document.getElementById('pName').value = '';
            document.getElementById('pPrice').value = '';
            document.getElementById('pImg').value = '';
            fetchProducts(); // Ro'yxatni yangilash
        } catch (error) {
            alert("Xatolik yuz berdi!");
        }
    } else {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
    }
}

// 4. Mahsulotni o'chirish (DELETE)
async function deleteProduct(id) {
    if (confirm("Ushbu mahsulotni o'chirmoqchimisiz?")) {
        const deleteURL = `https://my-shop-bff-default-rtdb.firebaseio.com/products/${id}.json`;
        try {
            await fetch(deleteURL, { method: 'DELETE' });
            fetchProducts(); // Ro'yxatni yangilash
        } catch (error) {
            alert("O'chirishda xatolik!");
        }
    }
}

// 5. Mahsulotlarni ekranga chiqarish
function displayProduct(product, index) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    const isAdmin = window.isAdmin === true;
    // O'chirish tugmasi uchun endi index emas, Firebase ID (product.id) ishlatiladi
    const deleteBtn = isAdmin ? `<button onclick="deleteProduct('${product.id}')" class="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs z-10">✕</button>` : '';

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

// 6. Qidiruv va Filtrlash
function filterProducts() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const name = card.querySelector('h4').innerText.toLowerCase();
        card.style.display = name.includes(term) ? 'block' : 'none';
    });
}

function filterCategory(cat) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        if (cat === 'all') card.style.display = 'block';
        else card.style.display = card.getAttribute('data-category') === cat ? 'block' : 'none';
    });
}

// 7. Savatcha, Sevimlilar va Tungi rejim
function updateCartUI() {
    const cartBtn = document.getElementById('cart-btn') || document.querySelector('button[onclick="showCart()"]');
    if (cartBtn) cartBtn.innerText = `Savatcha (${cart.length})`;
}

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    alert(name + " savatchaga qo'shildi!");
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
    else alert("Savatchada " + cart.length + " ta mahsulot bor.");
}

function showWishlist() {
    if (wishlist.length === 0) alert("Sevimlilar bo'sh");
    else alert("Siz yoqtirgan tovarlar soni: " + wishlist.length);
}