var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const keys = require('./keys');
const fetch = require('isomorphic-fetch');
var app = express();
const bodyParser = require('body-parser');

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.set('trust proxy', function (ip) {
  if (ip === '127.0.0.1') return true // trusted IPs
  else return false
})

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// renders homepage
app.get('/', (req, res) => {  
  fetchLyftToken()
    .then(data => accessToken.lyft = data.access_token);
  return res.render('index.ejs');
});


app.get('/searchLyft', (req, res) => {
  console.log(accessToken.lyft);
  fetch(req.headers.url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken.lyft
    }
  })
    .then(response => response.json())
    .then(data => res.status(200).send(data))
    .catch(err => console.log(err));
});

app.get('/searchUber', (req, res) => {
  console.log(accessToken.uber);
  fetch(req.headers.url, {
		headers: {
			Authorization: 'Token ' + accessToken.uber,
			'Content-Type': 'application/json'
		}
	})
		.then(response => response.json())
		.then(data => res.status(200).send(data))
    .catch(err => console.log(err));
});

let accessToken = {
  lyft: 'lyftToken',
	uber: keys.uberKey
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
