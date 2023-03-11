const { getCustomer } = require("./customer");

const onConnection = (socket) => {
    console.log("Customer Connected!")
    socket.on("customer:get", getCustomer);

    // socket.on("customer:create")
}

module.exports =  onConnection;