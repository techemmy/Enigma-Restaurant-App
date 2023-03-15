import ChatBot from './chatBot.js'
import Customer from './customer.js'

const messagesContainer = document.querySelector('#messages')
const userInputBox = document.querySelector('#input')
const submitBtn = document.querySelector('#submitBtn')
const currencyLabel = document.querySelector('#currency')
const loader = document.querySelector('#loader')

// eslint-disable-next-line no-undef
const socket = io()

document.addEventListener('DOMContentLoaded', () => {
    let chatBot
    let customer

    socket.emit('customer:get') // get current user session if it exists

    socket.on('customer:create', () => {
        // we create a new customer and update the server session if the user doesn't have a session already
        loader.style.display = 'none'
        let username
        while (!username || !username.trim()) {
            username = prompt('Enter your username: ')
        }
        customer = new Customer(username)
        chatBot = new ChatBot(
            socket,
            customer,
            messagesContainer,
            userInputBox,
            submitBtn,
            currencyLabel
        )
        chatBot.updateCustomerSession() // update new customer in server session
    })

    socket.on('customer:post', (customerSession) => {
        // if the user has a session, we recreate the customer from the customer data stored in the session
        loader.style.display = 'none'
        const customerObj = customerSession.customer
        customer = Customer.createFromSession(customerObj)
        chatBot = new ChatBot(
            socket,
            customer,
            messagesContainer,
            userInputBox,
            submitBtn,
            currencyLabel
        )
    })
})
