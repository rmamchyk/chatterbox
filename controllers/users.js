'use strict';

module.exports = function(_, passport, userValidator) {
    return {
        setRouting(router) {
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);

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
        getGoogleLogin: passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/plus.login', 
            'https://www.googleapis.com/auth/plus.profile.emails.read']
        }),
        googleLogin: passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
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