import ChatBot from "./chatBot.js";
import Customer from "./customer.js";

const messagesContainer = document.querySelector("#messages");
const userInputBox = document.querySelector("#input");
const submitBtn = document.querySelector("#submitBtn");

const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    let chatBot;
    let customer;

    const updateCustomerSession = () => {
      // TODO: start here
      // BUG: implement functionality to store necessary user data in sessions
        socket.emit("customer:update-session", {customer});
    }

    socket.emit("customer:get");

    socket.on("customer:create", () => {
      let username;
      while (!username || !username.trim()) {
        username = prompt("Enter your username: ");
      }
      customer = new Customer(username);
      chatBot = new ChatBot(customer, messagesContainer, userInputBox, submitBtn);
      updateCustomerSession();
    });

    socket.on("customer:post", customerSession => {
      // TODO: after BUG line 15 is resolved, create new customer object from necessary customer info saved
      customer = customerSession.customer;
        chatBot = new ChatBot(customer, messagesContainer, userInputBox, submitBtn);
    })

})
