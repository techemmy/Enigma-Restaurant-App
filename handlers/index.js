const { getCustomer, updateCustomerSession } = require("./customer");

const onConnection = (socket) => {
    socket.on("customer:get", getCustomer);
    socket.on("customer:update-session", updateCustomerSession)

}

module.exports =  onConnection;