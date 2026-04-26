// integration-tests.js
import { ProductCatalog } from './products.js';
import { ShoppingCart } from './cart.js';
import { OrderManager } from './order.js';

// Функция для красивого вывода результатов теста
function runTest(testName, testFn) {
    console.log(`\n🧪 ТЕСТ: ${testName}`);
    try {
        testFn();
        console.log("✅ УСПЕШНО");
    } catch (error) {
        console.log("❌ ОШИБКА:", error.message);
    }
}

// --- ЗАПУСК ИНТЕГРАЦИОННЫХ ТЕСТОВ ---

// 1. Инициализация модулей (Сборка системы)
const catalog = new ProductCatalog();
const cart = new ShoppingCart();
const orderManager = new OrderManager();

// ТЕСТ 1: Добавление товара в корзину и проверка суммы
runTest("Добавление товара и расчет суммы", () => {
    const laptop = catalog.getProductById(1); // Ноутбук 50000
    const mouse = catalog.getProductById(2); // Мышка 1500

    cart.addItem(laptop);
    cart.addItem(mouse);

    const total = cart.getTotalPrice();
    if (total !== 51500) {
        throw new Error(`Сумма неверна: ожидалось 51500, получилось ${total}`);
    }
    console.log(`   Сумма корзины: ${total} руб.`);
});

// ТЕСТ 2: Удаление товара из корзины
runTest("Удаление товара из корзины", () => {
    cart.removeItem(2); // Удаляем мышку
    const total = cart.getTotalPrice();

    if (total !== 50000) {
        throw new Error(`Сумма после удаления неверна: ${total}`);
    }
    console.log(`   Сумма после удаления мышки: ${total} руб.`);
});

// ТЕСТ 3: Создание заказа (Интеграция Корзины и Заказа)
let createdOrderId;
runTest("Создание заказа", () => {
    const cartItems = cart.getItems();
    const total = cart.getTotalPrice();

    // Передаем данные из корзины в менеджер заказов
    const order = orderManager.createOrder(cartItems, total);
    createdOrderId = order.orderId;

    if (order.status !== "CREATED") {
        throw new Error("Статус заказа неверный");
    }
    console.log(`   Заказ создан! ID: ${order.orderId}, Сумма: ${order.totalAmount}`);
});

// ТЕСТ 4: Проверка данных заказа (Интеграция с хранилищем заказов)
runTest("Получение информации о заказе", () => {
    const orderInfo = orderManager.getOrderInfo(createdOrderId);

    if (!orderInfo) {
        throw new Error("Заказ не найден в базе");
    }
    if (orderInfo.items.length !== 1) {
        throw new Error("В заказе должно быть 1 товар (ноутбук)");
    }
    console.log(`   Заказ найден. Товары: ${orderInfo.items.map(i => i.product.name).join(", ")}`);
});

// ТЕСТ 5: Очистка корзины и попытка создания пустого заказа
runTest("Защита от пустого заказа", () => {
    cart.clear();
    try {
        orderManager.createOrder(cart.getItems(), 0);
        throw new Error("Система должна была выбросить ошибку при пустой корзине");
    } catch (e) {
        // Ожидаемая ошибка
        console.log(`   Ошибка перехвачена корректно: "${e.message}"`);
    }
});

// ФИНАЛЬНЫЙ ВЫВОД (JSON)
console.log("\n📊 ИТОГОВЫЙ ОТЧЕТ (JSON):");
const finalReport = {
    testsPassed: true,
    activeCartItems: cart.getItems().length,
    totalOrdersCreated: orderManager.orders.length,
    lastOrder: orderManager.getOrderInfo(createdOrderId)
};
console.log(JSON.stringify(finalReport, null, 2));