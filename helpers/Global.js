class Global {
    constructor(){
        this.globalRoom = [];
    }
    
    EnterRoom(id, name, room, img){
        var user = {id, name, room, img};
        this.globalRoom.push(user);
        return user;
    }
    
    RemoveUser(id){
        var user = this.GetUser(id);
        if(user){
            this.users = this.globalRoom.filter((user) => user.id !== id);
        }
        return user;
    }
    
    GetUser(id){
        var getUser = this.globalRoom.filter((userId) => {
            return userId.id === id;
        })[0];
        return getUser;
    }
    
    GetRoomList(room){
        var roomUsers = this.globalRoom.filter((user) => user.room === room);
        
        var userNames = roomUsers.map((user) => {
            return {
                name: user.name,
                img: user.img
            }
        });
        return userNames;
    }
}

module.exports = {Global};