const getCustomer = function () {
  socket = this;
  const customerSession = socket.request.session.customerSession;
  if (!customerSession) {
    return socket.emit("customer:create");
  } else {
    return socket.emit("customer:post", customerSession);
  }
};

module.exports = {
  getCustomer,
};
