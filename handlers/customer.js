const getCustomer = function () {
    const socket = this
    const customerSession = socket.request.session.customerSession
    if (!customerSession) {
        return socket.emit('customer:create')
    } else {
        return socket.emit('customer:post', customerSession)
    }
}

const updateCustomerSession = function (customerSession) {
    const socket = this
    socket.request.session.customerSession = customerSession
    socket.request.session.save()
}

module.exports = {
    getCustomer,
    updateCustomerSession,
}
