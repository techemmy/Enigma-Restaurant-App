module.exports = (io, sessionMiddleware) => {
  // convert a connect middleware to a Socket.IO middleware
  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);

  io.use(wrap(sessionMiddleware));

  // only allow authenticated users
  io.use((socket, next) => {

    // socket.request.session.name = "Emma";
    console.log(socket.request.session.name);
  });
};
