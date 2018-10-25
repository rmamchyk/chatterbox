'use strict';

module.exports = function(_) {
    return {
        setRouting(router) {
            router.get('/', this.indexPage);
        },

        indexPage(req, res) {
            return res.render('index', {
                test: 'This is a test'
            });
        }
    }
}