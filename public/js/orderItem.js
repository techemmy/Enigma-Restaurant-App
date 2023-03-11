class OrderItem {
    constructor(name, price) {
        this.name = name;
        this._price = parseFloat(price);
        this.quantity = null;
    }

    get price() {
        if (!this.quantity) return this._price;
        return this._price * this.quantity;
    }
}

export default OrderItem;