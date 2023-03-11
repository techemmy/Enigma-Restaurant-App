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
    }
    constructor(user, messages, userInput, submitBtn) {
        this.state = this.states[0];
        this.user = user;
        this.messages = messages;
        this.userInput = userInput;
        this.submitBtn = submitBtn;

        this.chatOptions = this.commands;

        this.showWelcomeMessage();
        this.showChatOptions();

        submitBtn.addEventListener('click', (e) => {
           e.preventDefault();
           const input = this.getUserInput();
           if (!this.validate(input)) return;
            this.clearUserInput();
           // if we're waiting for user to pick an option
           if (this.state === this.states[0]) {
               this.sendMessage(input, "white", true)
               this.processInput(parseInt(input));
           } else if (this.state === this.states[1]) {
                const selectedItem = this.orderItems[input];
                this.sendMessage(`You selected: ${selectedItem[0]}`, "white", true)
           }
        })
    }

    showWelcomeMessage() {
        this.sendMessage(`Welcome ${this.user.name}`)
    }

    showChatOptions() {
        this.sendMessage("Select one of the following to proceed:");
        for (let [code, action] of Object.entries(this.chatOptions)) {
            this.sendMessage(`Select ${code} to ${action}`);
        }
    }

    sendMessage(text, color=null, user=false) {
        const message = document.createElement('li');
        message.style.color = color;
        if (user) message.style.backgroundColor = "brown";
        message.textContent = text;
        this.messages.appendChild(message);
        window.scrollTo(0, document.body.scrollHeight);
    }

    getUserInput() {
        return this.userInput.value;
    }

    clearUserInput() {
        this.userInput.value = "";
    }

    validate(input) {
        const validOptions = Object.keys(this.chatOptions)

        if (!input.trim()) return
        if (isNaN(input)) return this.sendMessage("Please enter a number 🙃", "red")
        if(!validOptions.includes(input)) return this.sendMessage("Invalid option😩, Try again!", "red");
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
            return this.sendMessage(error.message);
        }
    }

    async placeOrder() {
        this.orderItems = JSON.parse(await this.getOrderItems());
        this.chatOptions = this.orderItems;
        this.sendMessage("Pick an item")
        for (let [code, item] of Object.entries(this.orderItems)) {
            this.sendMessage(`Select ${code}: ${item[0]} at ${item[1]}`)
        }
        this.state = this.states[1];
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