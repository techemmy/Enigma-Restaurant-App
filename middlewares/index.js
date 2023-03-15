var session = require("express-session");
const { sessionConfiguration } = require("./../config");
const MongoStore = require('connect-mongo');

const sessionMiddleware = session(sessionConfiguration);

if (process.env.NODE_ENV === "production") {
  sessionMiddleware.store = MongoStore.create({mongoUrl: process.env.MONGO_URI, dbName: "session-store"})
  sessionMiddleware.cookie.secure = true;
}

module.exports = (app, express, io) => {
  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(sessionMiddleware);

  io.engine.use(sessionMiddleware);
};
