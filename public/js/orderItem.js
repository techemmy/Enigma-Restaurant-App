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

    static createFromObject(itemObject) {
        /* since socket.emit stringifies our object
           this function helps us to recreate the customer object from the object returned when
           we query for an existing customer from the server session

           @param {string} itemObject.name The name of the OrderItem object
           @param {string} itemObject.price The price of the OrderItem object
           @param {string} itemObject.quantity The quantity of the OrderItem object
           @return {OrderItem} the OrderItem instance made from name, price and quantity
        */
        const item = new this(itemObject.name, itemObject.price);
        item.quantity = itemObject.quantity;
        return item;
    }
}

export default OrderItem;