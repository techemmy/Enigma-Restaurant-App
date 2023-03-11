class Customer {
    constructor (name) {
        this.name = name;
        this.currentOrder = null;
        this.hasCurrentOrder = false;
    }

    placeOrder(orderItem) {
        console.log(orderItem);
    }
}

export default Customer;