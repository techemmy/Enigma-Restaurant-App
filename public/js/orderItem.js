class OrderItem {
    constructor(name, price) {
        this.name = name;
        this._price = parseFloat(price);
        this._quantity = null;
    }

    get price() {
        if (!this._quantity) return this._price;
        return this._price * this._quantity;
    }

    set quantity(value) {
        this._quantity = value;
    }
}

export default OrderItem;