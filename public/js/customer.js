import Order from './Order.js'

class Customer {
    constructor(name) {
        this.name = name
        this.currentOrder = null
        this.orderHistory = []
    }

    placeOrder(orderItem) {
        if (this.currentOrder && this.currentOrder.isActive()) {
            this.currentOrder.addItem(orderItem)
        } else {
            this.currentOrder = new Order()
            this.currentOrder.addItem(orderItem)
        }
    }

    static createFromSession(customerObject) {
        /* since socket.emit stringifies our object
           this function helps us to recreate the customer object from the object returned when
           we query for an existing customer from the server session

           @param {string} customerObject.name The name of the customer
           @param {Object} customerObject.currentOrder The order object
           @param {Array} customerObject.orderHistory An array containing the order items that are not active
           @return {Customer} customer An instance of the customer object recreated from the server session object
        */
        const customer = new this(customerObject.name)
        const currentOrder = customerObject.currentOrder
        const orderHistory = customerObject.orderHistory

        if (currentOrder) {
            const order = Order.createFromObject(customerObject.currentOrder)
            customer.currentOrder = order
        }

        if (orderHistory.length > 0) {
            orderHistory.forEach((orderObject) => {
                const order = Order.createFromObject(orderObject)
                customer.orderHistory.push(order)
            })
        }

        return customer
    }
}

export default Customer
