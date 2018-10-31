module.exports = function(io){
    io.on('connection', (socket) => {

        // listen to joining private room and connect two users.
        socket.on('join PM', (pm) => {
            socket.join(pm.room1);
            socket.join(pm.room2);
        });
        
        // listen to private message and pass it to user-receiver.
        socket.on('private message', (message, callback) => {
            // send the private message to user-receiver.
            io.to(message.room).emit('new message', {
                text: message.text,
                sender: message.sender
            });
            
            // send the private message to notifications panel of user-receiver.
            io.emit('message display', {});
            
            callback();
        });
        
        socket.on('refresh', function(){
            io.emit('new refresh', {});
        });  
    });
}