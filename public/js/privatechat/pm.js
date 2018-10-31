$(document).ready(function(){
    var socket = io();
    
    var paramOne = $.deparam(window.location.pathname);
    var newParam = paramOne.split('.');
    
    var username = newParam[0];
    $('#receiver_name').text('@'+username);
    
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
        
        // listen to messages from other users and display them on notifications panel.
        socket.on('message display', function(){
            $('#reload').load(location.href + ' #reload');
        });
        
        socket.on('new refresh', function(){
            $('#reload').load(location.href + ' #reload');
        });
    });
    
    // listen to new message from user-sender and display it.
    socket.on('new message', function(data){
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.sender
        });
        $('#messages').append(message);
    });
    
    // send new private message and store it in database.
    $('#message_form').on('submit', function(e){
        e.preventDefault();
        var msg = $('#msg').val();
        var sender = $('#name-user').val();
        
        if(msg.trim().length > 0){
            $.ajax({
                url:'/chat/'+paramOne,
                type: 'POST',
                data: {
                    message: msg
                },
                success: function() {
                    socket.emit('private message', {
                        text: msg,
                        sender: sender,
                        room: paramOne
                    }, function(){
                        $('#msg').val('');
                    });
                }
            });

        }
    });
});

function swap(input, value_1, value_2){
    var temp = input[value_1];
    input[value_1] = input[value_2];
    input[value_2] = temp;
}