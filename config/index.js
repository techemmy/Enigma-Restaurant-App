require('dotenv').config();

ONEDAY = 1000 * 60 * 60 * 24;
const sessionConfiguration = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: ONEDAY }
  };

module.exports = {
    sessionConfiguration,
}