const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
var session = require('express-session')
const fs = require("fs");
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

ONEDAY = 1000 * 60 * 60 * 24;
const sessionMiddleware = session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    // cookie: { httpOnly: true, maxAge: ONEDAY }
  });

app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(sessionMiddleware);

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

// only allow authenticated users
io.use((socket, next) => {
    console.log("here")
    console.log(socket.request.session);
//   const session = socket.request.session;
//   if (session && session.authenticated) {
//     next();
//   } else {
//     next(new Error("unauthorized"));
//   }
});

io.on("connection", (socket) => {
  console.log(socket.request.session);
});

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