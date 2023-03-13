import Order from "./Order.js";

class Customer {
    constructor (name, socket) {
        this.name = name;
        this.currentOrder = null;
        this.socket = socket;
    }

    placeOrder(orderItem) {
        if (this.currentOrder && this.currentOrder.isActive()) {
            this.currentOrder.addItem(orderItem);
        } else {
            this.currentOrder = new Order();
            this.currentOrder.addItem(orderItem);
        }
    }

    updateSession() {
        this.socket.emit("customer:update-session", {customer: this});
    }

    static createFromSession(customerObject) {
        return new this(customerObject.name, customerObject.currentOrder,
            customerObject.hasCurrentOrder);
    }
}

export default Customer;