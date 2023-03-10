const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var session = require('express-session')
const fs = require("fs");
require('dotenv').config();



app.use(express.static("public"))
app.set('view engine', 'ejs');

ONEDAY = 1000 * 60 * 60 * 24;
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: ONEDAY }
  }))

app.get("/", (req, res) => {
    console.log(req.session);
    console.log(req.session.cookie);
    res.render("index");
})

app.get("/orderItems", (req, res) => {
    const orderItems = fs.readFile("database/orderItems.json", (err, data) => {
        if (err) {
            return res.json(err.message);
        }
        const items = Buffer.from(data, "utf-8").toString();
        return res.json(items)
    });
})

app.get("/chat", (req, res) => {

    res.render("chat")
})

server.listen(process.env.PORT || 8000, () => {
    console.log(`listening at ${process.env.PORT}`);
})