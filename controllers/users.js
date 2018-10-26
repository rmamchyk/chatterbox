'use strict';

module.exports = function(_, passport, userValidator) {
    return {
        setRouting(router) {
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/home', this.homePage);
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);

            router.post('/signup', userValidator.signupValidation, this.postSignUp);
            router.post('/', userValidator.loginValidation, this.postLogin);
        },

        indexPage(req, res) {
            const errors = req.flash('error');
            return res.render('index', { title: 'Chatterbox | SignUp', messages: errors, hasErrors: errors.length > 0});
        },
        getSignUp(req, res) {
            const errors = req.flash('error');
            return res.render('signup', { title: 'Chatterbox | Login', messages: errors, hasErrors: errors.length > 0});
        },
        getFacebookLogin: passport.authenticate('facebook', {
            scope: 'email'
        }),
        facebookLogin: passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        homePage(req, res) {
            return res.render('home');
        },
        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        })
    }
}