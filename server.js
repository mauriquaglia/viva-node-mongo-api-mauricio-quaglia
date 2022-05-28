require('rootpath')();
var fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
var https = require('https');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/questions', require('./questions/question.controller'));
app.use('/items', require('./items/item.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
if (1==1) {
	https.createServer({
	 key: fs.readFileSync('node_private.key'),
	 cert: fs.readFileSync('node_certificate.crt')
	}, app).listen(port, function(){
	console.log('Https Express Server Puerto '+ port +': \x1b[32m%s\x1b[0m', 'online');
	});
} else {
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
}
