import OrderItem from "./orderItem.js";

class ChatBot {
    commands = {
        1: "Place an Order",
        97: "See current order",
        98: "See order history",
        99: "Checkout order",
        0: "Cancel Order"
    }
    states = {
        0: "CHOOSE_OPTION",
        1: "SELECT_ORDERITEM",
        2: "TYPE_ORDERITEM_QUANTITY",
        3: "CONFIRM_ORDERITEM"
    }
    confirmOrCancel = {
        0: "CANCEL",
        1: "CONFIRM",
    }
    constructor(user, messages, userInput, submitBtn) {
        this.state = this.states[0];
        this.customer = user;
        this.messages = messages;
        this.userInput = userInput;
        this.submitBtn = submitBtn;
        this.orderItems = null;
        this.currentOrderItem = null;

        this.chatOptions = this.commands;
        this.validOptions = null;

        this.showWelcomeMessage(`Welcome ${this.customer.name}`);
        this.showChatOptions();

        submitBtn.addEventListener('click', (e) => {
           e.preventDefault();
           const userInput = this.getUserInput();
           if (!this.validate(userInput)) return;
            this.clearUserInput();
           // if we're waiting for user to pick an option
           if (this.state === this.states[0]) {
               this.sendMessage({message: userInput, user: true })
               this.processInput(parseInt(userInput));
           } else if (this.state === this.states[1]) {
                const selectedItem = this.orderItems[userInput];
                this.sendMessage({
                    message: `You selected: ${selectedItem[0]}`,
                    user: true
                })
                this.currentOrderItem = new OrderItem(selectedItem[0], selectedItem[1]);
                this.state = this.states[2];
                this.sendMessage({message: "How many of these: "})
           } else if (this.state === this.states[2]) {
                this.currentOrderItem.quantity = userInput;
                this.sendMessage({message: userInput});
                this.state = this.states[3]
                this.chatOptions = this.confirmOrCancel;
                this.showChatOptions();
           } else if (this.state === this.states[3]) {
               const confirmed = this.confirmOrderPlacement(this.confirmOrCancel[userInput]);
               if (confirmed) {
                    this.sendMessage({message: "Order Item confirmed!"})
                } else {
                    this.sendMessage({message: "Order Item Cancelled!"})
                }
               this.resetVariables();
               this.showChatOptions();
           }
        })
    }

    showWelcomeMessage(message) {
        this.sendMessage({message})
    }

    showChatOptions() {
        this.sendMessage({message: "Select one of the following to proceed:"});
        for (let [code, action] of Object.entries(this.chatOptions)) {
            this.sendMessage({message: `Select ${code} to ${action}`});
        }
    }

    resetVariables() {
        this.chatOptions = this.commands;
        this.state = this.states[0]
        this.currentOrderItem = null;

    }

    sendMessage({message, backgroundColor, user}) {
        const text = document.createElement('li');
        if (user) text.style.backgroundColor = backgroundColor;
        text.textContent = message;
        this.messages.appendChild(text);
        window.scrollTo(0, document.body.scrollHeight);
    }

    getUserInput() {
        return this.userInput.value;
    }

    clearUserInput() {
        this.userInput.value = "";
    }

    validate(input) {
        if (this.state !== this.states[2]) {
            this.validOptions = Object.keys(this.chatOptions)
            if(!this.validOptions.includes(input)) return this.sendMessage({message: "Invalid option😩, Try again!"});
        }

        if (!input.trim()) return
        if (isNaN(input)) return this.sendMessage({message: "Please enter a number 🙃"})
        return true;
    }

    processInput(message) {
        if (message === 1) this.placeOrder();
        else if (message === 97) this.getCurrentOrder();
        else if (message === 98) this.getOrderHistory();
        else if (message === 99) this.checkoutOrder();
        else if (message === 0) this.cancelOrder();
    }

    async getOrderItems() {
        try {
            const data = await fetch("/orderItems");
            const response = await data.json()
            return response
        } catch (error) {
            return this.sendMessage({message: error.message});
        }
    }

    async placeOrder() {
        this.orderItems = JSON.parse(await this.getOrderItems());
        this.chatOptions = this.orderItems;
        this.showChatOptions();
        this.state = this.states[1];
    }

    confirmOrderPlacement(value) {
        if (value === this.confirmOrCancel[1]) {
            this.customer.placeOrder(this.currentOrderItem);
            return true;
        }
    }

    getCurrentOrder() {
        console.log("get current order")
    }

    getOrderHistory() {
        console.log("get order history")
    }

    checkoutOrder() {
        console.log("checkout order")
    }

    cancelOrder() {
        console.log("cancel order")
    }
}

export default ChatBot ;