import Order from "./Order.js";
import OrderItem from "./orderItem.js";

class Customer {
    constructor (name) {
        this.name = name;
        this.currentOrder = null;
        this.orderHistory = [];
    }

    placeOrder(orderItem) {
        if (this.currentOrder && this.currentOrder.isActive()) {
            this.currentOrder.addItem(orderItem);
        } else {
            this.currentOrder = new Order();
            this.currentOrder.addItem(orderItem);
        }
    }

    static createFromSession(customerObject) {
        const customer =  new this(customerObject.name);
        customer.currentOrder = new Order();
        console.log(customerObject);

        if (customerObject.currentOrder) {
            customerObject.currentOrder.orderItems.forEach(orderItemObj => {
                const orderItem = OrderItem.createFromObject(orderItemObj);
                customer.currentOrder.orderItems.push(orderItem);
            })
        }
        return customer;
    }
}

export default Customer;