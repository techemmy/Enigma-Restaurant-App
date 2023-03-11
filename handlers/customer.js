const getCustomer = function () {
  socket = this;
  const customer = socket.request.session.customer;
  if (!customer) {
    return socket.emit("customer:create");
  } else {
    return socket.emit("customer:post", customer);
  }
};

module.exports = {
  getCustomer,
};
