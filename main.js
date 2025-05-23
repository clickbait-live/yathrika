// Sample data for products
const products = {
    groceries: [
        { id: 1, name: "Bread", price: 35, image: "https://via.placeholder.com/150?text=Bread" },
        { id: 2, name: "Milk (1L)", price: 50, image: "https://via.placeholder.com/150?text=Milk" },
        { id: 3, name: "Eggs (6)", price: 45, image: "https://via.placeholder.com/150?text=Eggs" },
        { id: 4, name: "Rice (1kg)", price: 60, image: "https://via.placeholder.com/150?text=Rice" },
        { id: 5, name: "Sugar (1kg)", price: 40, image: "https://via.placeholder.com/150?text=Sugar" },
        { id: 6, name: "Tea Powder", price: 30, image: "https://via.placeholder.com/150?text=Tea" }
    ],
    medicines: [
        { id: 101, name: "Paracetamol", price: 15, image: "https://via.placeholder.com/150?text=Paracetamol" },
        { id: 102, name: "Cetirizine", price: 20, image: "https://via.placeholder.com/150?text=Cetirizine" },
        { id: 103, name: "Dolo 650", price: 30, image: "https://via.placeholder.com/150?text=Dolo" },
        { id: 104, name: "Volini Spray", price: 120, image: "https://via.placeholder.com/150?text=Volini" },
        { id: 105, name: "Digene", price: 25, image: "https://via.placeholder.com/150?text=Digene" },
        { id: 106, name: "Band-Aid", price: 10, image: "https://via.placeholder.com/150?text=Band-Aid" }
    ],
    food: [
        { id: 201, name: "Veg Wrap", price: 60, image: "https://via.placeholder.com/150?text=Veg+Wrap" },
        { id: 202, name: "Chicken Wrap", price: 80, image: "https://via.placeholder.com/150?text=Chicken+Wrap" },
        { id: 203, name: "Egg Roll", price: 50, image: "https://via.placeholder.com/150?text=Egg+Roll" },
        { id: 204, name: "Paneer Roll", price: 70, image: "https://via.placeholder.com/150?text=Paneer+Roll" },
        { id: 205, name: "Frankie", price: 65, image: "https://via.placeholder.com/150?text=Frankie" },
        { id: 206, name: "Burrito", price: 90, image: "https://via.placeholder.com/150?text=Burrito" }
    ]
};

// DOM Elements
const cart = document.getElementById('cart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const cartClose = document.getElementById('cartClose');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartIcon = document.querySelector('.cart-icon');
const navLinks = document.querySelectorAll('.nav-link');
const mainContents = document.querySelectorAll('.main-content');
const busModal = document.getElementById('busModal');
const categoryModal = document.getElementById('categoryModal');
const submitBusInfo = document.getElementById('submitBusInfo');
const groceriesBtn = document.getElementById('groceriesBtn');
const medicinesBtn = document.getElementById('medicinesBtn');
const foodBtn = document.getElementById('foodBtn');
const prescriptionUpload = document.getElementById('prescriptionUpload');
const prescriptionFile = document.getElementById('prescriptionFile');
const medicineGrid = document.getElementById('medicineGrid');

// State variables
let currentCart = [];
let busInfo = {
    number: '',
    stand: '',
    time: ''
};

// Initialize the app
function init() {
    // Show bus info modal first
    setTimeout(() => {
        busModal.style.display = 'flex';
    }, 500);

    // Load products
    loadProducts('groceries');
    loadProducts('medicines');
    loadProducts('food');

    // Set up event listeners
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.getAttribute('data-section');
            showSection(section);
        });
    });

    // Cart interactions
    cartIcon.addEventListener('click', () => {
        cart.style.display = 'block';
        updateCartDisplay();
    });

    cartClose.addEventListener('click', () => {
        cart.style.display = 'none';
    });

    checkoutBtn.addEventListener('click', placeOrder);

    // Bus info modal
    submitBusInfo.addEventListener('click', () => {
        const busNumber = document.getElementById('busNumber').value;
        const nextStand = document.getElementById('nextStand').value;
        const arrivalTime = document.getElementById('arrivalTime').value;

        if (busNumber && nextStand && arrivalTime) {
            busInfo = {
                number: busNumber,
                stand: nextStand,
                time: arrivalTime
            };
            busModal.style.display = 'none';
            categoryModal.style.display = 'flex';
        } else {
            alert('Please fill in all fields');
        }
    });

    // Category selection
    groceriesBtn.addEventListener('click', () => {
        categoryModal.style.display = 'none';
        showSection('groceries');
    });

    medicinesBtn.addEventListener('click', () => {
        categoryModal.style.display = 'none';
        showSection('medicines');
    });

    foodBtn.addEventListener('click', () => {
        categoryModal.style.display = 'none';
        showSection('food');
    });

    // Prescription upload
    prescriptionUpload.addEventListener('click', () => {
        prescriptionFile.click();
    });

    prescriptionFile.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                prescriptionUpload.innerHTML = `
                    <img src="${event.target.result}" style="max-width: 100%; max-height: 200px; margin-bottom: 15px;">
                    <p>Prescription uploaded: ${file.name}</p>
                `;
                medicineGrid.style.display = 'grid';
            };
            
            reader.readAsDataURL(file);
        }
    });
}

// Load products for a category
function loadProducts(category) {
    const container = document.querySelector(`#${category} .product-grid`);
    
    products[category].forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${product.price}</div>
                <button class="add-to-cart" data-id="${product.id}" data-category="${category}">Add to Cart</button>
            </div>
        `;
        container.appendChild(productCard);
    });

    // Add event listeners to the add to cart buttons
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const category = e.target.getAttribute('data-category');
            addToCart(id, category);
        });
    });
}

// Show a specific section
function showSection(section) {
    mainContents.forEach(content => {
        content.classList.remove('active-section');
    });
    document.getElementById(section).classList.add('active-section');
}

// Add item to cart
function addToCart(id, category) {
    const product = products[category].find(p => p.id === id);
    
    if (product) {
        const existingItem = currentCart.find(item => item.id === id && item.category === category);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            currentCart.push({
                ...product,
                category,
                quantity: 1
            });
        }
        
        updateCartCount();
        showCartNotification(product.name);
    }
}

// Update cart count display
function updateCartCount() {
    const count = currentCart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Update cart items display
function updateCartDisplay() {
    cartItems.innerHTML = '';
    
    if (currentCart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center;">Your cart is empty</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    let subtotal = 0;
    
    currentCart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <div>${item.name}</div>
                <div style="font-size: 12px; color: #666;">${item.category}</div>
            </div>
            <div style="display: flex; align-items: center;">
                <button class="quantity-btn" data-id="${item.id}" data-category="${item.category}" data-action="decrease">-</button>
                <span style="margin: 0 10px;">${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-category="${item.category}" data-action="increase">+</button>
                <span style="margin-left: 15px; font-weight: bold;">₹${itemTotal}</span>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Add event listeners to quantity buttons
    cartItems.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const category = e.target.getAttribute('data-category');
            const action = e.target.getAttribute('data-action');
            updateQuantity(id, category, action);
        });
    });
    
    // Calculate total with delivery fee
    const total = subtotal + 15;
    cartTotal.textContent = total;
}

// Update item quantity in cart
function updateQuantity(id, category, action) {
    const item = currentCart.find(item => item.id === id && item.category === category);
    
    if (item) {
        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease') {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                currentCart = currentCart.filter(i => !(i.id === id && i.category === category));
            }
        }
        
        updateCartCount();
        updateCartDisplay();
    }
}

// Show notification when item is added to cart
function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '100px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '15px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.transition = 'all 0.3s';
    notification.textContent = `${productName} added to cart`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Place order via WhatsApp
function placeOrder() {
    if (currentCart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    // Format order details
    let orderDetails = `*YATHRIKA ORDER*\n\n`;
    orderDetails += `*Bus Number:* ${busInfo.number}\n`;
    orderDetails += `*Next Stand:* ${busInfo.stand}\n`;
    orderDetails += `*Arrival Time:* ${busInfo.time}\n\n`;
    orderDetails += `*ORDER ITEMS:*\n`;
    
    currentCart.forEach((item, index) => {
        orderDetails += `${index + 1}. ${item.name} (${item.category}) - ${item.quantity} x ₹${item.price} = ₹${item.price * item.quantity}\n`;
    });
    
    orderDetails += `\n*Delivery Fee:* ₹15\n`;
    orderDetails += `*TOTAL:* ₹${parseInt(cartTotal.textContent)}\n\n`;
    orderDetails += `Please confirm this order. Thank you!`;
    
    // Create a hidden link with the WhatsApp URL
    const whatsappUrl = `https://wa.me/917558856801?text=${encodeURIComponent(orderDetails)}`;
    
    // Create a temporary link element and trigger click
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Reset cart
    currentCart = [];
    updateCartCount();
    updateCartDisplay();
    cart.style.display = 'none';
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);