'use strict';

module.exports = function(_, passport, userValidator) {
    return {
        setRouting(router) {
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/home', this.homePage)

            router.post('/signup', userValidator.signupValidation, this.postSignUp);
        },

        indexPage(req, res) {
            return res.render('index');
        },
        getSignUp(req, res) {
            const errors = req.flash('error');
            return res.render('signup', { 
                title: 'Chatterbox | Login', 
                messages: errors, 
                hasErrors: errors.length > 0});
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