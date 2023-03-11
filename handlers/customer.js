const getCustomer = function () {
  socket = this;
  const customerSession = socket.request.session.customerSession;
  if (!customerSession) {
    return socket.emit("customer:create");
  } else {
    return socket.emit("customer:post", customerSession);
  }
};

const updateCustomerSession = (customerSession) => {
    socket.request.session.customerSession = customerSession;
    socket.request.session.save();
}

module.exports = {
  getCustomer,
  updateCustomerSession
};
