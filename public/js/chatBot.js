class ChatBot {
    constructor(username, messages, userInput, submitBtn) {
        this.username = username;
        this.messages = messages;
        this.userInput = userInput;
        this.submitBtn = submitBtn;
        this.chatOptions = {
            1: "Place an Order",
            97: "See current order",
            98: "See order history",
            99: "Checkout order",
            0: "Cancel Order"
        }

        this.showWelcomeMessage();
        this.showChatOptions();

        submitBtn.addEventListener('click', (e) => {
           e.preventDefault();
           const input = this.getUserInput();
           const validatedInput = this.validate(input);
           if (validatedInput) this.processInput(message);
        })
    }

    showWelcomeMessage() {
        this.sendMessage(`Welcome ${this.username}`)
    }

    showChatOptions() {
        let chatOptions = "Select one of the following to proceed:"
        for (let [code, action] of Object.entries(this.chatOptions)) {
            this.sendMessage(`\nSelect ${code} to ${action}`);
        }
    }

    sendMessage(text, color=null) {
        const message = document.createElement('li');
        message.style.color = color;
        message.textContent = text;
        this.messages.appendChild(message);
        window.scrollTo(0, document.body.scrollHeight);
    }

    getUserInput() {
        return this.userInput.value;
    }

    validate(input) {
        const validOptions = Object.keys(this.chatOptions)

        if (!input.trim()) return
        if (isNaN(input)) return this.sendMessage("Please enter a number 🙃", "red")
        if(!validOptions.includes(input)) return this.sendMessage("Invalid option😩, Try again!", "red");
        return parseInt(input);
    }

    processInput(message) {

    }
}

export default ChatBot ;