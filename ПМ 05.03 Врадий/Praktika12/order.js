// order.js
export class OrderManager {
    constructor() {
        this.orders = [];
        this.nextOrderId = 1000;
    }

    // Создание заказа
    createOrder(cartItems, totalPrice) {
        if (cartItems.length === 0) {
            throw new Error("Нельзя создать заказ с пустой корзиной");
        }

        const newOrder = {
            orderId: this.nextOrderId++,
            date: new Date().toISOString(),
            items: cartItems, // Копируем данные товаров
            totalAmount: totalPrice,
            status: "CREATED"
        };

        this.orders.push(newOrder);
        return newOrder;
    }

    // Получение информации о заказе
    getOrderInfo(orderId) {
        return this.orders.find(o => o.orderId === orderId);
    }
}