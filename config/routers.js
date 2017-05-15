'use strict';

var express = require('express');
var Router = express.Router();
var User = require('../app/controllers/user'); 
var App = require('../app/controllers/app'); 



// var router = new Router({
// 	presfix: '/api/1'
// }) 

Router.post('/u/signup',User.signup);
Router.post('/u/verify',User.verify);
Router.post('/u/update',User.update);

Router.post('/signature',App.signature);


module.exports = Router;