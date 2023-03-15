require('dotenv').config();

ONEDAY = 1000 * 60 * 60 * 24;
const sessionConfiguration = {
    secret: process.env.SECRET,
    name: "EnigmaPizza",
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: { httpOnly: true, maxAge: ONEDAY, secure: process.env.NODE_ENV === "production" }
  };

module.exports = {
    sessionConfiguration,
}