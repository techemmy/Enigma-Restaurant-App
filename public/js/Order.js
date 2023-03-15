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

    getItemNames() {
        /* concatenates the names of the order items into a string and return it */
        let names = []
        this.orderItems.forEach(order => {
            names.push(order.name);
        })

        names = "".concat(names);
        return names;
    }

    static createFromObject(OrderObject) {
        /* since socket.emit stringifies our object
           this function helps us to recreate the Order object from the object returned when
           we query for an existing customer from the server session

           @param {Array} OrderObject.orderItems An array containing the order items object
           @return {Order} order An instance of the Order object created from the OrderItems recreated
        */
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