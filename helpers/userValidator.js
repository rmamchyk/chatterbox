'use strict';

module.exports = function(_) {
    return {
        signupValidation(req, res, next) {
            req.checkBody('username', 'Username is required').notEmpty();
            req.checkBody('username', 'Username must not be less than 5').isLength({min: 5});
            req.checkBody('email', 'Email is required').notEmpty();
            req.checkBody('email', 'Email is invalid').isEmail();
            req.checkBody('password', 'Password is required').notEmpty();
            req.checkBody('password', 'Password must not be less than 5').isLength({min: 5});

            req.getValidationResult()
                .then(result => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach(err => {
                        messages.push(err.msg);
                    });

                    req.flash('error', messages);
                    res.redirect('/signup');
                })
                .catch(err => {
                    return next();
                });
        }
    };
}