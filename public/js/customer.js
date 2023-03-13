class Customer {
    constructor (name) {
        this.name = name;
        this.currentOrder = null;
        this.hasCurrentOrder = false;
    }

    placeOrder(orderItem) {
        // TODO: create Order object to do the below
        // TODO: implement adding order items to this.currentOrder
        console.log(orderItem);
    }

    static createFromSession(customerObject) {
        return new this(customerObject.name, customerObject.currentOrder,
            customerObject.hasCurrentOrder);
    }
}

export default Customer;