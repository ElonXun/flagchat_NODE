'use strict';

var Promise = require('bluebird');
var xss = require('xss');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var uuid = require('uuid');
var sms = require('../../service/sms');

async function asyncSignup(req,res){
    var phoneNumber = req.body.phoneNumber
    var user = await User.findOne({
       phoneNumber: phoneNumber
    }).exec()
   
   var verifyCode = sms.getCode()
   var obj = {
        "success": false,
        //"error_code":"NOT_LOGIN"
    }
    
    if(!user){
        var accessToken = uuid.v4() 

        user = new User({
            nickname: '未命名',
            phoneNumber:xss(phoneNumber),
            verifyCode: verifyCode,
            accessToken: accessToken,
        })
    }else{
        user.verifyCode = verifyCode

    }
    
    try {
         user = await user.save();
    } catch(e) {
        console.log(e);
        obj.success = false;
        res.json(obj);
        return
    }

    try {
      sms.sendCode(verifyCode,phoneNumber,'SMS_67290438');

    } catch(e) {
        console.log(e);
        obj.success = false;
        res.json(obj);
        return
    }
    
   
    console.log('success');
   // res.send('success')
    obj.success = true;
    res.json(obj);

}

exports.signup = function(req,res,next) {
   asyncSignup(req,res)
}

exports.verify = function *(next) {
	this.body = {
		success: true
	}
}


exports.update = function *(next) {
	this.body = {
		success: true
	}
}





