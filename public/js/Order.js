class Order {
    states = {
        0: "cancelled",
        1: "active",
        2: "ordered"
    }
    constructor() {
        this.state = this.states[0];
        this.orderItems = [];
    }

    isActive() {
        return this.state === this.states[1];
    }

    addItem(orderItem) {
        // if order is active
        if (this.states[this.state] === this.states[1]) {
            this.orderItems.push(orderItem);
        }
    }
}

export default Order;