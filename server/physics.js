module.exports = (socket) => {
    socket.on('bullet', (bodyData) => {
        socket.broadcast.emit('bullet', bodyData);
    });
};