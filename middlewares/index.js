const session = require('express-session')
const { sessionConfiguration } = require('./../config')
const MongoStore = require('connect-mongo')
require('dotenv').config()

if (process.env.NODE_ENV === 'production') {
    sessionConfiguration.store = MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: 'session-store',
    })
}

const sessionMiddleware = session(sessionConfiguration)

module.exports = (app, express, io) => {
    app.set('view engine', 'ejs')
    app.use(express.static('public'))
    app.use(sessionMiddleware)

    io.engine.use(sessionMiddleware)
}
