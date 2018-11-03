module.exports = function(){
    return {
        setRouting: function(router){
            router.get('/latest-football-news', this.footbalNews);
        },
        
        footbalNews: function(req, res){
            res.render('news/footballnews', {title: 'Chatterbox - Latest News', user: req.user});
        }
    }
}