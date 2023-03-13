class OrderItem {
    constructor(name, price) {
        this.name = name;
        this.price = parseFloat(price);
        this.quantity = null;
    }

    get totalPrice() {
        if (!this.quantity) return this._price;
        return this.price * this.quantity;
    }
}

export default OrderItem;