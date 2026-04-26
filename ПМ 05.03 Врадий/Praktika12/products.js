export class ProductCatalog {
    constructor() {
        this.products = [
            { id: 1, name: "Ноутбук", price: 50000 },
            { id: 2, name: "Мышка", price: 1500 },
            { id: 3, name: "Клавиатура", price: 3000 },
            { id: 4, name: "Монитор", price: 15000 }
        ];
    }

    // Получить товар по ID
    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    // Получить весь каталог
    getAllProducts() {
        return this.products;
    }
}