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
        socket.emit("session:update", {customer, chatBot});
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
        console.log(customerSession);
    })

    socket.on("customer:post", )

})
