import OrderItem from './orderItem.js'

class ChatBot {
    commands = {
        1: 'To place an Order',
        97: 'To see current order',
        98: 'To check order history',
        99: 'To checkout current Order',
        0: 'To cancel current Order',
    }

    states = {
        0: 'CHOOSE_OPTION',
        1: 'SELECT_ORDERITEM',
        2: 'TYPE_ORDERITEM_QUANTITY',
        3: 'CONFIRM_ORDERITEM',
    }

    confirmOrCancel = {
        0: 'To Cancel',
        1: 'To Confirm',
    }

    chatOptionsTemplate = `
        <div class='msg {{direction}}-msg'>
            <div class='msg-bubble' style='background-color:{{background}}'>
                <div class='msg-info'>
                    <div class='msg-info-name'>{{name}}</div>
                </div>

                <div class='msg-text' id='msg-list'>
                    {{#each message}}
                    <p>{{this}}</p>
                    {{/each}}
                </div>
            </div>
        </div>
      `
    singleMessageTemplate = `
        <div class='msg {{direction}}-msg'>
            <div class='msg-bubble' style='background-color:{{background}}'>
                <div class='msg-info'>
                    <div class='msg-info-name'>{{name}}</div>
                </div>

                <div class='msg-text' id='msg-list'>
                    {{{message}}}
                </div>
            </div>
        </div>
      `
    constructor(socket, user, messages, userInput, submitBtn, currencyLabel) {
        this.socket = socket
        // the `this.state` variable tells us what stage of communication the bot is in with the user
        // as a user chooses a command from the `chatOptions`, the state of the object changes for next `chatOptions`
        this.state = this.states[0]
        this.customer = user
        this.messages = messages
        this.userInput = userInput
        this.submitBtn = submitBtn
        this.orderItems = null
        this.currentOrderItem = null
        this.currencyLabel = currencyLabel
        this.currency = null

        // this.chatOptions changes as user progresses, it holds the current list of available commands a user choose from
        // it is initiated with the list of commands `this.commands` at first. it is related with the object state variable
        this.chatOptions = this.commands
        this.validOptions = null // this holds an array of the keys of the current `this.chatOptions` when validating input

        this.sendWelcome(`Welcome <b>${this.customer.name}</b>!`)
        ;(async () => await this.getOrderItems())() // get the order items from the server
        this.showChatOptions()

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault()
            const userInput = this.getUserInput()
            this.clearUserInput() // clear the html input box
            if (!this.validate(userInput)) return // stop here if the user input is invalid

            // if we're waiting for customer to pick an option from the commands
            if (this.state === this.states[0]) {
                this.sendMessage({ message: userInput, user: true })
                this.getResponse(parseInt(userInput)) // it calls other methods based on the option chosen by the user

                // if we're waiting for customer to select order item
            } else if (this.state === this.states[1]) {
                const selectedItem = this.orderItems[userInput]
                this.sendMessage({
                    message: `You selected: ${selectedItem[0]}`,
                })
                this.currentOrderItem = new OrderItem(
                    selectedItem[0],
                    selectedItem[1]
                )
                this.state = this.states[2]
                this.sendMessage({ message: 'How many: ' })

                // if we're waiting for user to select quantity of order item
            } else if (this.state === this.states[2]) {
                this.currentOrderItem.quantity = userInput
                this.sendMessage({ message: userInput, user: true })
                this.state = this.states[3]
                this.chatOptions = this.confirmOrCancel
                this.showChatOptions()

                // if we're waiting for user to confirm OrderItem before adding it to Order
            } else if (this.state === this.states[3]) {
                const confirmed = this.confirmOrderPlacement(
                    this.confirmOrCancel[userInput]
                )
                this.sendMessage({ message: userInput, user: true })
                if (confirmed) {
                    this.sendMessage({ message: 'Order Item confirmed!' })
                } else {
                    this.sendMessage({
                        message: 'Order Item Cancelled!',
                        error: true,
                    })
                }
                this.resetVariables()
                this.sendMessage({ message: `Press 97: ${this.commands[97]}` })
            }
        })
    }

    sendWelcome(message) {
        this.sendMessage({ message })
    }

    showChatOptions() {
        this.sendMessage({ message: 'Select one of the following to proceed:' })
        const messages = []
        for (const [code, action] of Object.entries(this.chatOptions)) {
            messages.push(`Select ${code}: ${action}`)
        }
        this.sendMessage({ message: messages })
    }

    resetVariables() {
        // resets the variables whenever a process of ordering has been completed or cancelled
        this.chatOptions = this.commands
        this.state = this.states[0]
        this.currentOrderItem = null
    }

    sendMessage({ message, user, error }) {
        let template
        if (typeof message === 'object') {
            // eslint-disable-next-line no-undef
            template = Handlebars.compile(this.chatOptionsTemplate)
        } else {
            // eslint-disable-next-line no-undef
            template = Handlebars.compile(this.singleMessageTemplate)
        }
        const name = user ? this.customer.name : 'BOT'
        const direction = user ? 'right' : 'left'
        const background = error ? 'red' : ''

        // execute the compiled template and append it to messages container
        const htmlStr = template({ name, message, direction, background })

        this.messages.innerHTML += htmlStr
        this.messages.scrollTo(0, this.messages.scrollHeight)
    }

    getUserInput() {
        return this.userInput.value.trim()
    }

    clearUserInput() {
        this.userInput.value = ''
    }

    validate(input) {
        if (this.state !== this.states[2]) {
            this.validOptions = Object.keys(this.chatOptions)
            if (!this.validOptions.includes(input))
                return this.sendMessage({
                    message: 'Invalid option😩, Try again!',
                    error: true,
                })
        }

        if (!input.trim()) return
        if (isNaN(input))
            return this.sendMessage({
                message: 'Please enter a number 🙃',
                error: true,
            })
        return true
    }

    getResponse(message) {
        // the function calls other methods based on the option chosen by the user
        if (message === 1) this.placeOrder()
        else if (message === 97) this.getCurrentOrder()
        else if (message === 98) this.getOrderHistory()
        else if (message === 99) this.checkoutOrder()
        else if (message === 0) this.cancelOrder()
    }

    async getOrderItems() {
        try {
            const data = await fetch('/orderItems')
            const response = JSON.parse(await data.json())
            this.orderItems = response.items
            this.setCurrency(response.currency)

            return response
        } catch (error) {
            return this.sendMessage({ message: error.message })
        }
    }

    async placeOrder() {
        if (!this.orderItems && !this.currency) {
            // fetch order items from the server only if it hasn't been fetched before
            await this.getOrderItems()
        }
        this.chatOptions = this.orderItems
        this.showChatOptions()
        this.state = this.states[1]
    }

    setCurrency(currency) {
        this.currency = currency
        this.currencyLabel.textContent += this.currency
    }

    updateCustomerSession() {
        this.socket.emit('customer:update-session', { customer: this.customer })
    }

    confirmOrderPlacement(value) {
        if (value === this.confirmOrCancel[1]) {
            this.customer.placeOrder(this.currentOrderItem)
            this.updateCustomerSession()
            return true
        }
    }

    getCurrentOrder() {
        const currentOrder = this.customer.currentOrder
        if (!currentOrder) {
            return this.sendMessage({ message: 'You have no current order 😬' })
        }

        const orderMessages = []
        orderMessages.push("Here's what you have in your order:")
        currentOrder.orderItems.forEach((orderItem) => {
            orderMessages.push(
                `${orderItem.name} worth of ${this.currency}${orderItem.totalPrice}`
            )
        })
        this.sendMessage({ message: orderMessages })
        this.sendMessage({
            message: `The total is: ${this.currency}${currentOrder.getTotal()}`,
        })

        setTimeout(() => {
            this.showChatOptions()
        }, 2000)
    }

    getOrderHistory() {
        const orderHistory = this.customer.orderHistory
        if (orderHistory.length > 0) {
            this.sendMessage({ message: 'Here it is:' })
            for (let i = 0; i < orderHistory.length; i++) {
                const order = orderHistory[i]
                this.sendMessage({
                    message: `${i + 1}: Item "${
                        order.state
                    }" containing ${order.getItemNames()} with a total of ${
                        this.currency
                    }${order.getTotal()}`,
                })
            }
        } else {
            this.sendMessage({ message: 'Nothing in your history yet 🤔' })
        }
    }

    checkoutOrder() {
        if (!this.customer.currentOrder) {
            this.sendMessage({ message: 'No order to place 😢' })
            setTimeout(() => {
                this.sendMessage({
                    message: `Press 1 ${this.commands[1].toLowerCase()}`,
                })
            }, 2000)
        } else {
            // change the current order state to ordered
            this.customer.currentOrder.state =
                this.customer.currentOrder.states[2]
            this.sendMessage({ message: 'Order placed 🥳' })
            this.customer.orderHistory.push(this.customer.currentOrder)
            this.customer.currentOrder = null
            this.resetVariables()
            this.updateCustomerSession()
        }
    }

    cancelOrder() {
        if (this.customer.currentOrder) {
            this.customer.currentOrder.state =
                this.customer.currentOrder.states[0]
            this.customer.orderHistory.push(this.customer.currentOrder)
            this.customer.currentOrder = null
            this.updateCustomerSession()
            this.resetVariables()
            this.sendMessage({
                message: 'Your current order has been cancelled!',
            })
        } else {
            this.sendMessage({ message: 'You do not have a current order' })
        }
    }
}

export default ChatBot
