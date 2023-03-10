
var session = require('express-session')
const { sessionConfiguration } = require("./../config");
const useSocketMiddleware = require("./socket");


const sessionMiddleware = session(sessionConfiguration);

module.exports = {
    sessionMiddleware,
    useSocketMiddleware,
}