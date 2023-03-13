import OrderItem from "./orderItem.js";

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
        if (this.isActive()) {
            return this.orderItems.push(orderItem);
        }
    }

    getTotal() {
        let total = 0;
        this.orderItems.forEach(orderItem => {
            total += orderItem.totalPrice;
        })
        return total;
    }

    static createFromObject(OrderObject) {
        const order = new this();
        order.state = OrderObject.state;

        OrderObject.orderItems.forEach(orderItemObj => {
            const orderItem = OrderItem.createFromObject(orderItemObj);
            order.orderItems.push(orderItem);
        })

        return order;
    }
}

export default Order;