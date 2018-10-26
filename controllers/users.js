'use strict';

module.exports = function(_, passport) {
    return {
        setRouting(router) {
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/home', this.homePage)

            router.post('/signup', this.postSignUp);
        },

        indexPage(req, res) {
            return res.render('index');
        },
        getSignUp(req, res) {
            return res.render('signup');
        },
        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        homePage(req, res) {
            return res.render('home');
        }
    }
}