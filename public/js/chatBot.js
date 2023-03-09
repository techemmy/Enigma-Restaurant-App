class ChatBot {
    constructor(username, messages, userInput, submitBtn) {
        this.username = username;
        this.messages = messages;
        this.userInput = userInput;
        this.submitBtn = submitBtn;

        submitBtn.addEventListener('click', function() {
            console.log(this);
        })
    }

}

export default ChatBot ;