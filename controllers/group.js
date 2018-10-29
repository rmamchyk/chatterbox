module.exports = function() {
    return {
        setRouting(router) {
            router.get('/group/:name', this.groupPage);
        },

        groupPage(req, res) {
            const name = req.params.name;

            res.render('groupchat/group',{ title: 'Footballkik - Group', groupName: name});
        }
    }
}