module.exports = function(Users, async) {
    return {
        setRouting(router) {
            router.get('/group/:name', this.groupPage);

            router.post('/group/:name', this.groupPostPage);
        },

        groupPage(req, res) {
            const name = req.params.name;

            async.parallel([
                function(callback){
                    Users.findOne({'username': req.user.username})
                        .populate('request.userId')
                        
                        .exec((err, result) => {
                            callback(err, result);
                        })
                }
            ], (err, results) => {
                const result1 = results[0];
                
                res.render('groupchat/group',{ title: 'Chatterbox - Group', user: req.user, groupName: name, data: result1});
            });
            
        },

        groupPostPage: function(req, res){
            //saving new incoming friend request
            async.parallel([
                // add new incoming request to user-receiver
                function(callback) {
                    if(req.body.receiverName){
                       Users.update({
                           'username': req.body.receiverName,
                           'request.userId': {$ne: req.user._id},
                           'friendsList.friendId': {$ne: req.user._id}
                       }, {
                           $push: {request: { userId: req.user._id, username: req.user.username}},
                           $inc: {totalRequest: 1}
                       }, (err, count) => {
                           callback(err, count);
                       });
                    }
                },

                // add new sent request to 'sentRequest' array of user-sender
                function(callback) {
                    if (req.body.receiverName) {
                        Users.update({
                            'username': req.user.username,
                            'friendsList.friendName': {$ne: req.body.receiverName},
                            'sentRequest.username': {$ne: req.body.receiverName}
                        }, {
                            $push: {sentRequest: { username: req.body.receiverName}}
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                }
            ], (err, results) => {
                res.redirect('/group/'+req.params.name);
            });

            // handle accepting and canceling friend request
            async.parallel([
                // ACCEPT FRIEND: accept friend request by user-receiver and add new friend in friendList.
                function(callback) {
                    if (req.body.senderId) {
                        Users.update({
                            '_id': req.user._id,
                            'friendsList.friendId': {$ne: req.body.serderId} 
                        }, {
                            $push: {friendsList: {friendId: req.body.senderId, friendName: req.body.senderName}},
                            $pull: {request: {userId: req.body.senderId, username: req.body.senderName}},
                            $inc: {totalRequest: -1}
                        }, (err, count) =>  {
                            callback(err, count)
                        });
                    }
                },

                //  ACCEPT FRIEND: add new friend to user-sender when the user-receiver accepted friend request.
                function(callback) {
                    if (req.body.senderId) {
                        Users.update({
                            '_id': req.body.senderId,
                            'friendsList.friendId': {$ne: req.user._id} 
                        }, {
                            $push: {friendsList: {friendId: req.user._id, friendName: req.user.username}},
                            $pull: {sentRequest: {username: req.user.username}}
                        }, (err, count) =>  {
                            callback(err, count)
                        });
                    }
                },

                // CANCEL FRIEND: cancel incoming friend request by user-receiver.
                function(callback) {
                    if (req.body.user_Id) {
                        Users.update({
                            '_id': req.user._id,
                            'request.userId': {$eq: req.body.user_Id} 
                        }, {
                            $pull: {request: {userId: req.body.user_Id}},
                            $inc: {totalRequest: -1}
                        }, (err, count) =>  {
                            callback(err, count)
                        });
                    }
                },

                //CANCEL FRIEND: remove sent friend request of user-sender when user-receiver cancelled it.
                function(callback) {
                    if (req.body.user_Id) {
                        Users.update({
                            '_id': req.body.user_Id,
                            'sentRequest.username': {$eq: req.user.username} 
                        }, {
                            $pull: {sentRequest: {username: req.user.username}}
                        }, (err, count) =>  {
                            callback(err, count)
                        });
                    }
                },
            ], (err, results) => {
                res.redirect('/group/'+req.params.name);
            })
        },
    }
}