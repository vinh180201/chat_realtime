const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {origin: "*"}
});

io.on('connection', (socket) => {
    console.log("connected");

    socket.on('joinConversation', (room) => {
        socket.join(room);
        console.log(io.sockets.adapter.rooms);

        socket.on(room + "send_message", (data) => {
            console.log(data);
            io.emit("room" + data.receiver + "get_message", data);
            io.emit("room" + data.sender + "get_message", data);
            io.emit("room" + data.receiver + "change_conversation_msg", data);
            io.emit("room" + data.sender + "change_conversation_msg", data);
        });
        socket.on(room + "send_connect", (data) => {
            io.emit("room" + data.receiver_id + "get_connect", data);
        });
        socket.on(room + 'accept_connect', (data) => {
            io.emit("room" + data.requester_id + "new_conversation", data);
        })
    });

    socket.on('disconnect', (socket) => {
        console.log('Disconnect');
    });

});

httpServer.listen(3001, () => {
    console.log("Server is running");
});
