var session = require("express-session");
const { sessionConfiguration } = require("./../config");

const sessionMiddleware = session(sessionConfiguration);

module.exports = (app, express, io) => {
  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(sessionMiddleware);

  io.engine.use(sessionMiddleware);
};
