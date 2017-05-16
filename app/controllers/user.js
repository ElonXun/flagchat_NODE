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
       phoneNumber: phoneNumber,
    }).exec()
   
   var verifyCode = sms.getCode()
   var obj = {
        "success": false,
        //"error_code":"NOT_LOGIN"
    }
    
    if(!user){
        //用户表中没有该用户
        var accessToken = uuid.v4() 

        user = new User({
            nickname: '未命名',
            phoneNumber:xss(phoneNumber),
            verifyCode: verifyCode,
            accessToken: accessToken,
        })
    }else{
        //用户表中已有该用户但未注册过
        if(!user.password){
            user.verifyCode = verifyCode
        }else{
            //该用户已注册过 返回 让其直接登录
            obj.success = false;
            res.json(obj);
            return
        }
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
    //  sms.sendCode(verifyCode,phoneNumber,'SMS_67290438');

    } catch(e) {
        console.log(e);
        obj.success = false;
        res.json(obj);
        return
    }
    
   
    console.log('success');
    obj.success = true;
    res.json(obj);

}

//注册发送验证码
exports.signup = function(req,res,next) {
   asyncSignup(req,res)
}

//注册用验证验证码
exports.verifyCode = function(req,res,next) {
   asyncVerify(req,res)
}

//注册设置密码
exports.setPassword = function(req,res,next) {
   asyncVerify(req,res)
}

//验证登录

exports.verifyLogin = function(req,res,next) {
   asyncVerify(req,res)
}

exports.update = function *(next) {
	this.body = {
		success: true
	}
}





