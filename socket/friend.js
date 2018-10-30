module.exports = function(io){
    io.on('connection', (socket) => {

        // listen to new users joining.
        socket.on('joinRequest', (myRequest, callback) => {
           socket.join(myRequest.sender);     
           callback();
        }); 
        
        // listen to friend request and emit it to receiver user.
        socket.on('friendRequest', (friend, callback) => {
            io.to(friend.receiver).emit('newFriendRequest', {
               from: friend.sender,
               to: friend.receiver
            }); 
            callback();
        });
    });
}