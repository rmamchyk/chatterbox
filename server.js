'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');

const container = require('./container');

container.resolve(function(users, _, admin) {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/chatterbox', {useNewUrlParser: true});

    const app = setupExpress();

    function setupExpress() {
        const app = express();
        const server = http.createServer(app);

        configureExpress(app);
        
        //Setup router
        const router = require('express-promise-router')();
        users.setRouting(router);
        admin.setRouting(router);
        
        app.use(router);

        server.listen(3000, () => console.log('Listening on port 3000...'));
    }

    function configureExpress(app) {
        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');

        app.use(express.static(__dirname + '/public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        
        app.use(validator());
        
        app.use(session({
            secret: 'thisisasecretkey',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());

        app.locals._ = _;
    }
})
