var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const keys = require('./keys');
var router = express.Router();
const fetch = require('isomorphic-fetch');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// renders homepage
app.get('/', (req, res) => {
  if (accessToken.uber == 'uberToken')
    accessToken.uber = keys.uberKey;
  if (accessToken.lyft == 'lyftToken') {
    fetchLyftToken()
      .then(data => { accessToken.lyft = data.access_token; 
        console.log(accessToken);
      });
  }
  return res.render('index.ejs');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


/********************************************
 * Core implementation starts here...
 ********************************************/

let accessToken = {
	lyft: 'lyftToken',
	uber: 'uberToken'
}

/**
 * Use .then to get access to the data post-fetched
 */
function fetchLyftToken() {
	return fetch("https://api.lyft.com/oauth/token", {
		body: JSON.stringify({
			"grant_type": "client_credentials",
			"scope": "public"
		}),
		headers: {
			Authorization: "Basic " + keys.lyftKey,
			"Content-Type": "application/json"
		},
		method: "POST"
	})
		.then(response => response.json());
}

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
