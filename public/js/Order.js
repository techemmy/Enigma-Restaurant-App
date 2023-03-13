class Order {
    states = {
        0: "cancelled",
        1: "active",
        2: "ordered"
    }
    constructor() {
        this.state = this.states[1];
        this.orderItems = [];
    }

    isActive() {
        return this.state === this.states[1];
    }

    addItem(orderItem) {
        console.log(this.state);
        // if order is active
        if (this.isActive()) {
            return this.orderItems.push(orderItem);
        }
    }
}

export default Order;