import ChatBot from "./chatBot.js";

let username = localStorage.getItem("username");
const messagesContainer = document.querySelector("#messages");
const userInputBox = document.querySelector("#input");
const submitBtn = document.querySelector("#submitBtn");

while (!username || !username.trim()) {
  username = prompt("Enter your username: ");
}

const chatBot = new ChatBot(username, messagesContainer, userInputBox, submitBtn);
