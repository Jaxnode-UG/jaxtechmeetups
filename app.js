
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , meetups = require('./routes/meetups')
  , about = require('./routes/about')  
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(function(req, res, next){
    res.render('errors', { title: '404 This page does not exist.' });
  });
});

app.locals.moment = require('moment');

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', meetups.events);
app.get('/events', meetups.events);
app.get('/groups', meetups.groups);
app.get('/about', about.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
