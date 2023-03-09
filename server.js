const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var session = require('express-session')
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

app.get("/chat", (req, res) => {
    if (!req.session.views) {
        req.session.views = 0;
      }
      req.session.views++;
      console.log(req.session.views);

    res.render("chat", {views: req.session.views})
})

server.listen(process.env.PORT || 8000, () => {
    console.log(`listening at ${process.env.PORT}`);
})