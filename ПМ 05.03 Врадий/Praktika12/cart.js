// cart.js
export class ShoppingCart {
    constructor() {
        this.items = []; // Хранит объекты { product, quantity }
    }

    // Добавление товара
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ product: product, quantity: quantity });
        }
    }

    // Удаление товара
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
    }

    // Очистка корзины
    clear() {
        this.items = [];
    }

    // Получить содержимое корзины
    getItems() {
        return this.items;
    }

    // Подсчет общей суммы
    getTotalPrice() {
        return this.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }
}