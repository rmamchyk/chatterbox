$(document).ready(function(){
    var socket = io();
    
    var paramOne = $.deparam(window.location.pathname);
    var newParam = paramOne.split('.');
    
    swap(newParam, 0, 1);
    var paramTwo = newParam[0]+'.'+newParam[1];
    
    // listen to user connection
    socket.on('connect', function(){
        var params = {
           room1: paramOne,
           room2: paramTwo
        } 
        // send user joined private chat
        socket.emit('join PM', params);
        
        // refresh notification panel upon new messages
        socket.on('new refresh', function(){
            $('#reload').load(location.href + ' #reload');
        });
    });
    
    // click on message in notification panel to read it.
    $(document).on('click', '#messageLink', function(){
        var chatId = $(this).data().value;
        // update 'isRead' flag of the message to true.
        $.ajax({
            url: '/chat/'+paramOne,
            type: 'POST',
            data: {chatId: chatId},
            success: function() {}
        });
        
        socket.emit('refresh', {});
    });  
});

function swap(input, value_1, value_2){
    var temp = input[value_1];
    input[value_1] = input[value_2];
    input[value_2] = temp;
}