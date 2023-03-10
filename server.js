const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const fs = require("fs");
const { sessionMiddleware, useSocketMiddleware } = require('./middlewares');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(sessionMiddleware);
useSocketMiddleware(io, sessionMiddleware);

io.on("connection", (socket) => {
  console.log(socket.request.session);
});

app.get("/", (req, res) => {
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
    console.log("Chat: ", req.session);
    res.render("chat")
})

server.listen(process.env.PORT || 8000, () => {
    console.log(`listening at ${process.env.PORT}`);
})