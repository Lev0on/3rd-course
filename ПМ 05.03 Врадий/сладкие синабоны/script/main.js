/**
 * Sweet Cinnabon - Основной скрипт
 * Все переменные инкапсулированы в IIFE для избежания глобального пространства имён
 */
(function() {
    'use strict';

    // ==================== ДАННЫЕ ====================
    const state = {
        cart: [],
        products: [
            { id: 1, name: "Классический Синабон", price: 250, size: "standard", desc: "Традиционный синабон с нежной корицей и сахарной пудрой.", ingredients: "Мука пшеничная, масло сливочное, корица, сахар, сливочный крем.", img: "image/classic.png" },
            { id: 2, name: "Шоколадный Вихрь", price: 320, size: "standard", desc: "Насыщенный шоколадный крем с кусочками тёмного шоколада.", ingredients: "Какао-порошок, тёмный шоколад, мука, яйца, сливки.", img: "image/vihr.png" },
            { id: 3, name: "Ягодный Микс", price: 380, size: "large", desc: "Свежая малина и черника в сочетании с ванильным кремом.", ingredients: "Малина, черника, ванильный экстракт, мука, сахарная пудра.", img: "image/yagod.png" },
            { id: 4, name: "Карамельный Рай", price: 350, size: "large", desc: "Густая солёная карамель и хрустящие орехи пекан.", ingredients: "Карамель, пекан, масло, мука, морская соль.", img: "image/caramel.png" },
            { id: 5, name: "Фисташковый Бриз", price: 410, size: "standard", desc: "Натуральная фисташковая паста и белый шоколад.", ingredients: "Фисташки, белый шоколад, сливки, мука высшего сорта.", img: "image/briz.png" },
            { id: 6, name: "Тропический Закат", price: 390, size: "large", desc: "Манго и кокосовая стружка для летнего настроения.", ingredients: "Манговое пюре, кокосовая стружка, сливочный сыр, тесто.", img: "image/tropic.png" }
        ],
        filters: { search: "", size: "all", maxPrice: Infinity }
    };

    // ==================== DOM-ЭЛЕМЕНТЫ ====================
    const DOM = {
        catalogGrid: document.getElementById('catalog-grid'),
        searchInput: document.getElementById('search-input'),
        sizeFilter: document.getElementById('size-filter'),
        priceFilter: document.getElementById('price-filter'),
        cartBtn: document.getElementById('open-cart'),
        cartModal: document.getElementById('cart-modal'),
        closeCartBtn: document.getElementById('close-cart'),
        cartItemsContainer: document.getElementById('cart-items'),
        cartTotalEl: document.getElementById('cart-total'),
        cartCountEl: document.getElementById('cart-count'),
        checkoutBtn: document.getElementById('checkout-btn'),
        detailsModal: document.getElementById('details-modal'),
        closeDetailsBtn: document.getElementById('close-details'),
        detailsContent: document.getElementById('details-content'),
        orderForm: document.getElementById('order-form'),
        successModal: document.getElementById('success-modal'),
        closeSuccessBtn: document.getElementById('close-success')
    };

    // ==================== РЕНДЕР КАТАЛОГА ====================
    function renderCatalog() {
        DOM.catalogGrid.innerHTML = '';
        const filtered = state.products.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(state.filters.search.toLowerCase());
            const matchSize = state.filters.size === 'all' || p.size === state.filters.size;
            const matchPrice = p.price <= state.filters.maxPrice;
            return matchSearch && matchSize && matchPrice;
        });

        if (filtered.length === 0) {
            DOM.catalogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; font-size: 1.2rem; color: #888;">Товары не найдены</p>';
            return;
        }

        filtered.forEach(product => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${product.img}" alt="${product.name}" class="card__img">
                <div class="card__body">
                    <h3 class="card__title">${product.name}</h3>
                    <p style="font-size: 0.9rem; color: #555;">${product.desc}</p>
                    <p class="card__price">${product.price} ₽</p>
                    <div class="card__actions">
                        <button class="btn btn--primary add-to-cart" data-id="${product.id}">В корзину</button>
                        <button class="btn btn--accent view-details" data-id="${product.id}">Подробнее</button>
                    </div>
                </div>
            `;
            DOM.catalogGrid.appendChild(card);
        });
    }

    // ==================== КОРЗИНА ====================
    function updateCartUI() {
        DOM.cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (state.cart.length === 0) {
            DOM.cartItemsContainer.innerHTML = '<p class="empty-msg">Корзина пуста</p>';
            DOM.checkoutBtn.disabled = true;
        } else {
            DOM.checkoutBtn.disabled = false;
            state.cart.forEach(item => {
                const product = state.products.find(p => p.id === item.id);
                const itemTotal = product.price * item.qty;
                total += itemTotal;
                count += item.qty;

                const row = document.createElement('div');
                row.className = 'cart-item';
                row.innerHTML = `
                    <div class="cart-item-info">
                        <strong>${product.name}</strong><br>
                        <small>${product.price} ₽ × ${item.qty} = ${itemTotal} ₽</small>
                    </div>
                    <div class="cart-controls">
                        <button class="qty-minus" data-id="${item.id}">−</button>
                        <span>${item.qty}</span>
                        <button class="qty-plus" data-id="${item.id}">+</button>
                        <button class="remove-btn" data-id="${item.id}">🗑️</button>
                    </div>
                `;
                DOM.cartItemsContainer.appendChild(row);
            });
        }

        DOM.cartTotalEl.textContent = total;
        DOM.cartCountEl.textContent = count;
    }

    function addToCart(id) {
        const existing = state.cart.find(item => item.id === id);
        if (existing) {
            existing.qty++;
        } else {
            state.cart.push({ id, qty: 1 });
        }
        updateCartUI();
    }

    function changeQty(id, delta) {
        const item = state.cart.find(i => i.id === id);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            state.cart = state.cart.filter(i => i.id !== id);
        }
        updateCartUI();
    }

    function removeFromCart(id) {
        state.cart = state.cart.filter(i => i.id !== id);
        updateCartUI();
    }

    // ==================== МОДАЛЬНЫЕ ОКНА ====================
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showDetails(id) {
        const product = state.products.find(p => p.id === id);
        if (!product) return;
        DOM.detailsContent.innerHTML = `
            <img src="${product.img}" alt="${product.name}" style="width:100%; border-radius:8px; margin-bottom:15px;">
            <h3>${product.name}</h3>
            <p><strong>Цена:</strong> ${product.price} ₽</p>
            <p><strong>Размер:</strong> ${product.size === 'standard' ? 'Стандартный' : 'Большой'}</p>
            <p><strong>Описание:</strong> ${product.desc}</p>
            <p><strong>Состав:</strong> ${product.ingredients}</p>
        `;
        openModal(DOM.detailsModal);
    }

    // ==================== ФИЛЬТРАЦИЯ ====================
    function handleFilters() {
        state.filters.search = DOM.searchInput.value.trim();
        state.filters.size = DOM.sizeFilter.value;
        const priceVal = parseInt(DOM.priceFilter.value, 10);
        state.filters.maxPrice = isNaN(priceVal) ? Infinity : priceVal;
        renderCatalog();
    }

    // ==================== ВАЛИДАЦИЯ И ОТПРАВКА ====================
    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const address = document.getElementById('address');

        // Сброс ошибок
        [name, phone, address].forEach(el => {
            el.classList.remove('invalid');
            document.getElementById(`${el.id}-error`).textContent = '';
        });

        // Имя: только буквы и пробелы
        const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
        if (!name.value.trim() || !nameRegex.test(name.value)) {
            document.getElementById('name-error').textContent = 'Введите имя (только буквы)';
            name.classList.add('invalid');
            isValid = false;
        }

        // Телефон: +7 (XXX) XXX-XX-XX
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(phone.value)) {
            document.getElementById('phone-error').textContent = 'Формат: +7 (XXX) XXX-XX-XX';
            phone.classList.add('invalid');
            isValid = false;
        }

        // Адрес
        if (!address.value.trim()) {
            document.getElementById('address-error').textContent = 'Укажите адрес доставки';
            address.classList.add('invalid');
            isValid = false;
        }

        return isValid;
    }

    // ==================== ИНИЦИАЛИЗАЦИЯ ====================
    function init() {
        // Рендер каталога
        renderCatalog();
        updateCartUI();

        // События фильтрации
        DOM.searchInput.addEventListener('input', handleFilters);
        DOM.sizeFilter.addEventListener('change', handleFilters);
        DOM.priceFilter.addEventListener('input', handleFilters);

        // Делегирование событий для каталога
        DOM.catalogGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) addToCart(parseInt(e.target.dataset.id));
            if (e.target.classList.contains('view-details')) showDetails(parseInt(e.target.dataset.id));
        });

        // Корзина: открытие/закрытие
        DOM.cartBtn.addEventListener('click', () => openModal(DOM.cartModal));
        DOM.closeCartBtn.addEventListener('click', () => closeModal(DOM.cartModal));
        DOM.cartModal.addEventListener('click', (e) => { if (e.target === DOM.cartModal) closeModal(DOM.cartModal); });

        // Корзина: изменение количества и удаление
        DOM.cartItemsContainer.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            if (e.target.classList.contains('qty-plus')) changeQty(id, 1);
            if (e.target.classList.contains('qty-minus')) changeQty(id, -1);
            if (e.target.classList.contains('remove-btn')) removeFromCart(id);
        });

        // Переход к оформлению из корзины
        DOM.checkoutBtn.addEventListener('click', () => {
            closeModal(DOM.cartModal);
            document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
        });

        // Подробности: закрытие
        DOM.closeDetailsBtn.addEventListener('click', () => closeModal(DOM.detailsModal));
        DOM.detailsModal.addEventListener('click', (e) => { if (e.target === DOM.detailsModal) closeModal(DOM.detailsModal); });

        // Форма заказа
        DOM.orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validateForm()) return;
            if (state.cart.length === 0) {
                alert('Добавьте товары в корзину перед оформлением заказа!');
                return;
            }
            try {
                // Имитация отправки
                console.log('Заказ оформлен:', {
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    comment: document.getElementById('comment').value,
                    items: state.cart,
                    total: DOM.cartTotalEl.textContent
                });
                state.cart = [];
                updateCartUI();
                DOM.orderForm.reset();
                openModal(DOM.successModal);
            } catch (err) {
                console.error('Ошибка при оформлении:', err);
                alert('Произошла ошибка. Попробуйте позже.');
            }
        });

        // Успех: закрытие
        DOM.closeSuccessBtn.addEventListener('click', () => closeModal(DOM.successModal));
        DOM.successModal.addEventListener('click', (e) => { if (e.target === DOM.successModal) closeModal(DOM.successModal); });
    }

    // Запуск при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();