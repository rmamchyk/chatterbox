module.exports = function(io, Users) {
    const users = new Users();

    io.on('connection', (socket) => {
        // listen to new users joining a room
        socket.on('join', (params, callback) => {
            socket.join(params.room);
            users.AddUserData(socket.id, params.name, params.room);
            io.to(params.room).emit('usersList', users.GetUsersList(params.room));
            callback();
        });

        // listen to user messages and pass them to other users
        socket.on('createMessage', (message, callback) => {
            io.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
                from: message.sender
            });
            callback();
        });

        // listen to users leaving the room.
        socket.on('disconnect', () => {
            var user = users.RemoveUser(socket.id);
            if(user){
                io.to(user.room).emit('usersList', users.GetUsersList(user.room));
            }
        });
    });
};