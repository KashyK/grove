module.exports = (socket) => {
    socket.on('bullet', (pos) => {
        socket.broadcast.emit('bullet', pos);
    });
};