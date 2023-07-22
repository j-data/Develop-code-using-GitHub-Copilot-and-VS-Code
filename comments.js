// Create web server for comments
// Load the 'express' module which makes creating the web server easier
var express = require('express');
// Create a web server
var app = express();
// Load the 'hbs' module for rendering templates
var hbs = require('hbs');
// Load the 'fs' module for reading files
var fs = require('fs');
// Load the 'body-parser' module for parsing request bodies
var bodyParser = require('body-parser');
// Load the 'request' module for making HTTP requests
var request = require('request');

// Load the 'mongoose' module for connecting to MongoDB
var mongoose = require('mongoose');
// Connect to the 'comments' database running on localhost
mongoose.connect('mongodb://localhost/comments');

// Load the 'Comment' model
var Comment = require('./models/comment');

// Create a static file server that can serve files from the 'public' folder
app.use(express.static(__dirname + '/public'));

// Use the 'body-parser' middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Set up the view engine
app.set('view engine', 'html');
app.engine('html', hbs.__express);

// Set up the request logger
app.use(function (req, res, next) {
  console.log('Received a request for: ' + req.url);
  next();
});

// Set up the home page
app.get('/', function (req, res) {
  res.render('index', {});
});

// Set up the route for posting comments
app.post('/comment', function (req, res) {
  // Create a comment
  var comment = new Comment({
    name: req.body.name,
    email: req.body.email,
    comment: req.body.comment
  });

  // Save the comment to the database
  comment.save(function (err) {
    if (err) {
      console.log('Error saving comment: ' + err);
      res.status(500).send('Error saving comment');
    } else {
      console.log('Comment saved');
      res.redirect('/comments');
    }
  });
});

// Set up the route for getting comments
app.get('/comments', function (req, res) {
  // Find all the comments in the database
  Comment.find({}, function (err, comments) {
    if (err) {
      console.log('Error finding comments: ' + err);
      res.status(500).send('Error

