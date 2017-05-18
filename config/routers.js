'use strict';

var express = require('express');
var Router = express.Router();
var User = require('../app/controllers/user'); 
var App = require('../app/controllers/app'); 



// var router = new Router({
// 	presfix: '/api/1'
// }) 

Router.post('/u/signUpCode',User.signUpCode);
Router.post('/u/verifyCode',User.verifyCode);
Router.post('/u/setPassword',User.setPassword);
Router.post('/u/verifyLogin',User.verifyLogin);

Router.post('/signature',App.signature);


module.exports = Router;