module.exports = function(Users, async, Message, FriendResult, GroupMessage) {
    return {
        setRouting(router) {
            router.get('/group/:name', this.groupPage);
            router.post('/group/:name', this.groupPostPage);

            router.get('/logout', this.logout);
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
                },

                // read last unread message to display it on notification panel
                function(callback){
                    const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i")
                    Message.aggregate([
                        {$match:{$or:[{"senderName":nameRegex}, {"receiverName":nameRegex}]}},
                        {$sort:{"createdAt":-1}},
                        {
                            $group:{ "_id": {
                                "last_message_between":{
                                    $cond: [{
                                        $gt:[
                                            {$substr:["$senderName",0,1]},
                                            {$substr:["$receiverName",0,1]}
                                        ]},
                                        {$concat:["$senderName"," and ","$receiverName"]},
                                        {$concat:["$receiverName"," and ","$senderName"]}
                                    ]
                                }}, 
                                "body": {$first:"$$ROOT"}
                            }
                        }], function(err, newResult){
                            const arr = [
                                {path: 'body.sender', model: 'User'},
                                {path: 'body.receiver', model: 'User'}
                            ];
                            
                            Message.populate(newResult, arr, (err, newResult1) => {
                                callback(err, newResult1);
                            });
                        }
                    )
                },

                // load all group messages
                function(callback){
                    GroupMessage.find({})
                         .populate('sender')
                         .exec((err, result) => {
                            callback(err, result)
                         });
                }
            ], (err, results) => {
                const res1 = results[0];
                const res2 = results[1];
                const res3 = results[2];
                
                res.render('groupchat/group',{ title: 'Chatterbox - Group', user: req.user, 
                    groupName: name, data: res1, chat: res2, groupMsg: res3});
            });
            
        },

        groupPostPage: function(req, res){
            FriendResult.PostRequest(req, res, '/group/'+req.params.name);

            async.parallel([
                function(callback){
                    if(req.body.message){
                        const group = new GroupMessage();
                        group.sender = req.user._id;
                        group.body = req.body.message;
                        group.name = req.body.groupName;
                        group.createdAt = new Date();
                        
                        group.save((err, msg) => {
                            callback(err, msg);
                        });
                    }
                }
            ], (err, results) => {
                res.redirect('/group/'+req.params.name);
            });
        },
        
        logout: function(req, res){
            req.logout();
            req.session.destroy((err) => {
               res.redirect('/');
            });
        }
    }
}