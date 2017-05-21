'use strict';

var express = require('express');
var Router = express.Router();
var User = require('../app/controllers/user'); 
var App = require('../app/controllers/app'); 
var Wantu = require('../app/controllers/wantu'); 



 
// 用户相关


Router.post('/u/signUpCode',User.signUpCode);
Router.post('/u/verifyCode',User.verifyCode);
Router.post('/u/setPassword',User.setPassword);
Router.post('/u/verifyLogin',User.verifyLogin);

// 第三方
Router.post('/wantu/getToken',Wantu.getToken);

Router.post('/signature',App.signature);


module.exports = Router;