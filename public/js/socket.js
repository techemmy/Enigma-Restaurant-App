import ChatBot from "./chatBot.js";
import Customer from "./customer.js";

const messagesContainer = document.querySelector("#messages");
const userInputBox = document.querySelector("#input");
const submitBtn = document.querySelector("#submitBtn");
const currencyLabel = document.querySelector("#currency");

const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    let chatBot;
    let customer;

    socket.emit("customer:get");

    socket.on("customer:create", () => {
      let username;
      while (!username || !username.trim()) {
        username = prompt("Enter your username: ");
      }
      customer = new Customer(username);
      chatBot = new ChatBot(socket, customer, messagesContainer, userInputBox, submitBtn, currencyLabel);
      chatBot.updateCustomerSession();
    });

    socket.on("customer:post", customerSession => {
        const customerObj = customerSession.customer;
        customer = Customer.createFromSession(customerObj)
        chatBot = new ChatBot(socket, customer, messagesContainer, userInputBox, submitBtn, currencyLabel);
    })

})
