/* ===== Mobile Menu Toggle ===== */
document.getElementById('hamburger').addEventListener('click', function() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
});

/* ===== Preserve Scroll Position on Refresh ===== */
const scrollStorageKey = `freshbite-scroll:${window.location.pathname}`;

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
    sessionStorage.setItem(scrollStorageKey, String(window.scrollY));
});

window.addEventListener('load', () => {
    if (window.location.hash) return;
    const savedY = sessionStorage.getItem(scrollStorageKey);
    if (savedY !== null) {
        window.scrollTo(0, parseInt(savedY, 10) || 0);
    }
});

/* ===== Scroll Progress + Back To Top ===== */
const scrollProgressBar = document.createElement('div');
scrollProgressBar.className = 'scroll-progress';
document.body.prepend(scrollProgressBar);

const backToTopBtn = document.createElement('button');
backToTopBtn.className = 'back-to-top';
backToTopBtn.type = 'button';
backToTopBtn.setAttribute('aria-label', 'Back to top');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
document.body.appendChild(backToTopBtn);

function updateScrollEnhancements() {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    scrollProgressBar.style.width = `${Math.min(progress, 100)}%`;

    if (window.scrollY > 420) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', updateScrollEnhancements, { passive: true });
window.addEventListener('load', updateScrollEnhancements);

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('active');
    });
});

/* ===== Disable Social Icon Links ===== */
document.querySelectorAll('.social-links a, .social-links-large a').forEach(link => {
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('tabindex', '-1');
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

/* ===== Menu Filter Functionality ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Filter menu items
            menuItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 10);
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                    item.style.opacity = '0';
                }
            });
        });
    });
}

/* ===== Order Now Button Functionality ===== */
const orderButtons = document.querySelectorAll('.order-btn');

if (orderButtons.length > 0) {
    orderButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const menuItem = button.closest('.menu-item');
            if (!menuItem) return;

            const itemName = menuItem.querySelector('h3')?.textContent?.trim() || 'Menu Item';
            const itemPrice = menuItem.querySelector('.menu-price')?.textContent?.trim() || '';

            const params = new URLSearchParams({
                item: itemName,
                price: itemPrice
            });

            window.location.href = `reservation.html?${params.toString()}`;
        });
    });
}

/* ===== Testimonial Carousel ===== */
let currentTestimonial = 0;
const testimonialItems = document.querySelectorAll('.testimonial-item');

function showTestimonial(index) {
    testimonialItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

const nextTestimonialBtn = document.getElementById('nextTestimonial');
const prevTestimonialBtn = document.getElementById('prevTestimonial');

if (nextTestimonialBtn) {
    nextTestimonialBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
        showTestimonial(currentTestimonial);
    });
}

if (prevTestimonialBtn) {
    prevTestimonialBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonialItems.length) % testimonialItems.length;
        showTestimonial(currentTestimonial);
    });
}

// Auto-rotate testimonials every 5 seconds
setInterval(() => {
    if (testimonialItems.length > 1) {
        currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
        showTestimonial(currentTestimonial);
    }
}, 5000);

/* ===== Animated Counters ===== */
const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    let current = 0;
    const increment = target / 50;
    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(interval);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 20);
}

// Trigger animation when elements come into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('stat-number')) {
            if (!entry.target.animated) {
                animateCounter(entry.target);
                entry.target.animated = true;
            }
        }
    });
});

statNumbers.forEach(number => {
    observer.observe(number);
});

/* ===== Lightbox Gallery ===== */
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
let currentImageIndex = 0;
let galleryImages = [];

if (lightboxTriggers.length > 0) {
    lightboxTriggers.forEach((trigger, index) => {
        galleryImages.push(trigger.getAttribute('href'));
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            currentImageIndex = index;
            openLightbox();
        });
    });
}

function openLightbox() {
    lightboxImage.src = galleryImages[currentImageIndex];
    lightboxModal.classList.add('active');
}

function closeLightbox() {
    lightboxModal.classList.remove('active');
}

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImage.src = galleryImages[currentImageIndex];
    });
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        lightboxImage.src = galleryImages[currentImageIndex];
    });
}

// Close lightbox when clicking outside the image
if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            lightboxPrev.click();
        } else if (e.key === 'ArrowRight') {
            lightboxNext.click();
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});

/* ===== Newsletter Form ===== */
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Simulate form submission (replace with actual API call)
        console.log('Newsletter subscription:', email);
        
        // Show success message
        alert('Thank you for subscribing! Check your email for confirmation.');
        newsletterForm.reset();
    });
}

/* ===== Reservation Form ===== */
const reservationForm = document.getElementById('reservationForm');
const formMessage = document.getElementById('formMessage');

if (reservationForm) {
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Pre-fill reservation request from Order Now selection
    const urlParams = new URLSearchParams(window.location.search);
    const selectedItem = urlParams.get('item');
    const selectedPrice = urlParams.get('price');
    const requestsField = document.getElementById('requests');

    if (selectedItem && requestsField) {
        const orderLine = selectedPrice
            ? `Order request: ${selectedItem} (${selectedPrice})`
            : `Order request: ${selectedItem}`;
        requestsField.value = orderLine;
    }

    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            guests: document.getElementById('guests').value,
            occasion: document.getElementById('occasion').value,
            requests: document.getElementById('requests').value,
        };

        // Validate form
        if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time || !formData.guests) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Validate date is in the future
        const selectedDate = new Date(formData.date);
        if (selectedDate < new Date()) {
            showFormMessage('Please select a future date.', 'error');
            return;
        }

        // Simulate API call (replace with actual backend call)
        console.log('Reservation data:', formData);

        // Show success message
        showFormMessage('Your reservation has been confirmed! We will send a confirmation email shortly.', 'success');
        
        // Reset form
        reservationForm.reset();
    });
}

function showFormMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

/* ===== Contact Form ===== */
const contactForm = document.getElementById('contactForm');
const contactFormMessage = document.getElementById('contactFormMessage');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            phone: document.getElementById('contact-phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
        };

        // Validate form
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showContactFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showContactFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate API call (replace with actual backend call)
        console.log('Contact form data:', formData);

        // Show success message
        showContactFormMessage('Thank you for your message! We will get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
    });
}

function showContactFormMessage(message, type) {
    if (contactFormMessage) {
        contactFormMessage.textContent = message;
        contactFormMessage.className = `form-message ${type}`;
        contactFormMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            contactFormMessage.style.display = 'none';
        }, 5000);
    }
}

/* ===== Scroll Animations with AOS (Animate On Scroll) ===== */
// Simple scroll animation without external library
const animateOnScrollElements = document.querySelectorAll('[data-aos]');

function handleScroll() {
    animateOnScrollElements.forEach(element => {
        const position = element.getBoundingClientRect();
        const isVisible = position.top < window.innerHeight - 100;
        
        if (isVisible && !element.classList.contains('aos-animate')) {
            element.classList.add('aos-animate');
            const animationType = element.getAttribute('data-aos');
            applyAnimation(element, animationType);
        }
    });
}

function applyAnimation(element, type) {
    const animationMap = {
        'fade-up': 'fadeInUp',
        'fade-down': 'fadeInDown',
        'fade-left': 'slideInLeft',
        'fade-right': 'slideInRight',
        'zoom-in': 'zoomIn',
    };

    const animation = animationMap[type] || 'fadeIn';
    element.style.animation = `${animation} 0.8s ease-out forwards`;
}

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .aos-animate {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Trigger scroll animations on page load and scroll
window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);

/* ===== Smooth Scroll for Navigation ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

/* ===== Add Active Class to Navigation on Scroll ===== */
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'var(--shadow)';
    }
});

/* ===== Smooth Page Transition for Navbar Links ===== */
const navbarLinks = document.querySelectorAll('.nav-links a[href]');

if (navbarLinks.length > 0) {
    navbarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#')) return;

            const targetUrl = new URL(href, window.location.href);
            const isSamePage =
                targetUrl.pathname === window.location.pathname &&
                targetUrl.search === window.location.search &&
                targetUrl.hash === window.location.hash;

            if (targetUrl.origin !== window.location.origin || isSamePage) return;

            e.preventDefault();
            document.body.classList.add('page-transitioning');

            setTimeout(() => {
                window.location.href = targetUrl.href;
            }, 320);
        });
    });
}

/* ===== Prevent Form Double Submit ===== */
function preventDoubleSubmit(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function() {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }, 3000);
    });
}

if (reservationForm) preventDoubleSubmit(reservationForm);
if (contactForm) preventDoubleSubmit(contactForm);
if (newsletterForm) preventDoubleSubmit(newsletterForm);

/* ===== Loading Animation ===== */
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

/* ===== Keyboard Accessibility ===== */
// Add keyboard navigation for modals and forms
document.addEventListener('keydown', (e) => {
    // Tab through form inputs
    if (e.key === 'Tab') {
        // Allow normal tab behavior
        return;
    }
    
    // Enter to submit forms
    if (e.key === 'Enter') {
        if (e.target.tagName === 'FORM') {
            e.target.dispatchEvent(new Event('submit'));
        }
    }
});

/* ===== Console Log for Debugging ===== */
console.log('%cFreshBite Café Website Loaded', 'color: #C8A97E; font-size: 20px; font-weight: bold;');
console.log('%cVersion 1.0.0 - Premium Responsive Design', 'color: #4B2E2B; font-size: 12px;');

/* ===== Additional Utility Functions ===== */

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Get date in readable format
function getReadableDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ===== SHOPPING CART FUNCTIONALITY (Order Online Page) ===== */
let cart = JSON.parse(localStorage.getItem('freshbite-cart')) || [];

// Update cart badge
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
                <small>Add items to get started</small>
            </div>
        `;
        if (cartFooter) cartFooter.style.display = 'none';
        return;
    }
    
    // Display cart items
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">₹${item.price}</p>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="decrementQuantity(${index})">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="qty">${item.quantity}</span>
                <button class="qty-btn" onclick="incrementQuantity(${index})">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    
    // Update summary
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(0)}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(0)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(0)}`;
    
    if (cartFooter) cartFooter.style.display = 'block';
    
    // Generate pickup times
    generatePickupTimes();
}

// Generate available pickup times
function generatePickupTimes() {
    const pickupTimeSelect = document.getElementById('pickupTime');
    if (!pickupTimeSelect || pickupTimeSelect.options.length > 1) return;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Add 30 minutes to current time
    let startTime = new Date(now.getTime() + 30 * 60000);
    
    // Round up to next 15-minute interval
    const minutes = startTime.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    startTime.setMinutes(roundedMinutes);
    startTime.setSeconds(0);
    
    // Generate time slots for the next 8 hours
    for (let i = 0; i < 32; i++) {
        const time = new Date(startTime.getTime() + i * 15 * 60000);
        const hour = time.getHours();
        const minute = time.getMinutes();
        
        // Only show times between 7 AM and 10 PM
        if (hour >= 7 && hour < 22) {
            const timeString = time.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            const option = document.createElement('option');
            option.value = timeString;
            option.textContent = timeString;
            pickupTimeSelect.appendChild(option);
        }
    }
}

// Add to cart
function addToCart(name, price, category) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, category, quantity: 1 });
    }
    
    localStorage.setItem('freshbite-cart', JSON.stringify(cart));
    updateCartBadge();
    updateCartDisplay();
    
    // Show cart sidebar on mobile
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar && window.innerWidth < 992) {
        cartSidebar.classList.add('active');
    }
}

// Increment quantity
function incrementQuantity(index) {
    cart[index].quantity++;
    localStorage.setItem('freshbite-cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartBadge();
}

// Decrement quantity
function decrementQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    localStorage.setItem('freshbite-cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartBadge();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('freshbite-cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartBadge();
}

// Order page specific functionality
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
if (addToCartBtns.length > 0) {
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const category = btn.getAttribute('data-category');
            addToCart(name, price, category);
            
            // Visual feedback
            btn.innerHTML = '<i class="fas fa-check"></i> Added';
            btn.style.backgroundColor = '#2ecc71';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-plus"></i> Add';
                btn.style.backgroundColor = '';
            }, 1000);
        });
    });
}

// Order filter functionality
const orderFilterBtns = document.querySelectorAll('.order-filter-btn');
const orderItems = document.querySelectorAll('.order-item');

if (orderFilterBtns.length > 0) {
    orderFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            orderFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            // Filter items
            orderItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Floating cart button
const floatingCartBtn = document.getElementById('floatingCartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtn = document.getElementById('closeCartBtn');

if (floatingCartBtn && cartSidebar) {
    floatingCartBtn.addEventListener('click', () => {
        cartSidebar.classList.toggle('active');
    });
}

if (closeCartBtn && cartSidebar) {
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });
}

// Checkout button
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        const pickupTime = document.getElementById('pickupTime').value;
        
        if (!pickupTime) {
            alert('Please select a pickup time');
            return;
        }
        
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.05;
        const total = subtotal + tax;
        
        // Show order summary
        const orderSummary = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
        
        alert(`Order Confirmed!\n\nItems: ${orderSummary}\n\nTotal: ₹${total.toFixed(0)}\nPickup Time: ${pickupTime}\n\nThank you for your order! We'll have it ready for pickup.`);
        
        // Clear cart
        cart = [];
        localStorage.removeItem('freshbite-cart');
        updateCartDisplay();
        updateCartBadge();
        
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
        }
    });
}

// Initialize cart on page load
updateCartBadge();
if (document.getElementById('cartItems')) {
    updateCartDisplay();
}

/* ===== QUEUE MANAGEMENT FUNCTIONALITY (Homepage) ===== */

// Simulate dynamic wait time
function updateWaitTime() {
    const waitTimeElement = document.getElementById('waitTime');
    if (!waitTimeElement) return;
    
    const hour = new Date().getHours();
    let waitMinutes;
    
    // Peak hours: 12-2 PM and 7-9 PM
    if ((hour >= 12 && hour < 14) || (hour >= 19 && hour < 21)) {
        waitMinutes = Math.floor(Math.random() * 15) + 20; // 20-35 minutes
    } else if ((hour >= 8 && hour < 12) || (hour >= 14 && hour < 19)) {
        waitMinutes = Math.floor(Math.random() * 10) + 10; // 10-20 minutes
    } else {
        waitMinutes = Math.floor(Math.random() * 10) + 5; // 5-15 minutes
    }
    
    const timeNumber = waitTimeElement.querySelector('.time-number');
    const statusText = document.getElementById('queueStatusText');
    
    if (timeNumber) {
        timeNumber.textContent = waitMinutes;
    }
    
    if (statusText) {
        if (waitMinutes < 10) {
            statusText.textContent = 'Low crowd - Great time to visit!';
        } else if (waitMinutes < 20) {
            statusText.textContent = 'Moderate crowd - Perfect time to visit!';
        } else {
            statusText.textContent = 'Busy period - Join the queue for faster service!';
        }
    }
}

// Queue modal functionality
const joinQueueBtn = document.getElementById('joinQueueBtn');
const queueModal = document.getElementById('queueModal');
const closeQueueModal = document.getElementById('closeQueueModal');
const queueForm = document.getElementById('queueForm');
const queueSuccess = document.getElementById('queueSuccess');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');

if (joinQueueBtn && queueModal) {
    joinQueueBtn.addEventListener('click', () => {
        queueModal.classList.add('active');
    });
}

if (closeQueueModal && queueModal) {
    closeQueueModal.addEventListener('click', () => {
        queueModal.classList.remove('active');
        resetQueueForm();
    });
}

if (queueModal) {
    queueModal.addEventListener('click', (e) => {
        if (e.target === queueModal) {
            queueModal.classList.remove('active');
            resetQueueForm();
        }
    });
}

if (queueForm) {
    queueForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('queueName').value;
        const phone = document.getElementById('queuePhone').value;
        const partySize = document.getElementById('queuePartySize').value;
        
        // Calculate queue position and wait time
        const position = Math.floor(Math.random() * 5) + 1; // 1-5
        const estimatedWait = position * 5 + Math.floor(Math.random() * 10) + 5; // Minutes
        
        // Update success message
        document.getElementById('queuePosition').textContent = position;
        document.getElementById('estimatedWait').textContent = `${estimatedWait} minutes`;
        
        // Show success, hide form
        queueForm.style.display = 'none';
        if (queueSuccess) {
            queueSuccess.style.display = 'block';
        }
        
        // Store queue data in localStorage
        const queueData = {
            name,
            phone,
            partySize,
            position,
            estimatedWait,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('freshbite-queue', JSON.stringify(queueData));
        
        console.log('Queue joined:', queueData);
    });
}

if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
        if (queueModal) {
            queueModal.classList.remove('active');
        }
        resetQueueForm();
    });
}

function resetQueueForm() {
    if (queueForm) {
        queueForm.reset();
        queueForm.style.display = 'block';
    }
    if (queueSuccess) {
        queueSuccess.style.display = 'none';
    }
}

// Update wait time every 2 minutes
updateWaitTime();
setInterval(updateWaitTime, 120000);
