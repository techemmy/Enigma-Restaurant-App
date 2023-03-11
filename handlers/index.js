const { getCustomer } = require("./customer");

const onConnection = (socket) => {
    socket.on("customer:get", getCustomer);
    socket.on("session:update", customerSession => {
        socket.request.session.customerSession = customerSession;
        socket.request.session.save();
    })

}

module.exports =  onConnection;