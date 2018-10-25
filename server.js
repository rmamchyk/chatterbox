const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const container = require('./container');

container.resolve(function(users) {
    const app = setupExpress();

    function setupExpress() {
        const app = express();
        const server = http.createServer(app);

        configureExpress(app);
        
        //Setup router
        const router = require('express-promise-router')();
        users.setRouting(router);
        
        app.use(router);

        server.listen(3000, () => console.log('Listening on port 3000...'));
    }

    function configureExpress(app) {
        app.use(express.static('/public'));
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
    }
})
