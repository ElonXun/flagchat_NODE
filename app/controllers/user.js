'use strict';

var Promise = require('bluebird');
var xss = require('xss');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var uuid = require('uuid');
var sms = require('../../service/sms');

async function asyncSignUpCode(req,res){
    var phoneNumber = xss(req.body.phoneNumber.trim())
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
            avatar: '默认头像',
            phoneNumber: phoneNumber,
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

async function asyncVerifyCode(req,res) {
   var phoneNumber = xss(req.body.phoneNumber.trim())
   var verifyCode  = xss(req.body.verifyCode.trim())
   
   var obj = {
      "success": false,
        //"error_code":"NOT_LOGIN"
   }

   if (!verifyCode || !phoneNumber) {
      obj.success = false
      res.json(obj)

      return
   }

   var user = await User.findOne({
      phoneNumber: phoneNumber,
      verifyCode: verifyCode,
   }).exec()

   if(!user) {
     obj.success = false
     res.json(obj)

     return  
   }else {

     obj.success = true
     obj.data = {
        phoneNumber: user.phoneNumber,
     }

     res.json(obj)

   }

}

async function asyncSetPassword(req,res){
    var phoneNumber = xss(req.body.phoneNumber.trim())
    var password = xss(req.body.password.trim())
    
    var obj = {
      "success": false,
        //"error_code":"NOT_LOGIN"
    }

    if(!phoneNumber || !password){
        obj.success = false
        res.json(obj)
        return
    }
     

   var query = { phoneNumber: phoneNumber }

   var user = await User.findOneAndUpdate(query, { password: password ,verifyed: true })

   obj.success = true
   obj.data = {
     accessToken: user.accessToken,
     avatar: user.avatar,
     nickname: user.nickname,
   }
   
   res.json(obj)

}

async function asyncverifyLogin(req,res) {
    var phoneNumber = xss(req.body.phoneNumber.trim())
    var password = xss(req.body.password.trim())

    var obj = {
      "success": false,
        //"error_code":"NOT_LOGIN"
    }

    if(!phoneNumber || !password){
        obj.success = false
        res.json(obj)
        return
    }

    var user = await User.findOne({
       phoneNumber: phoneNumber,
       password: password,
    }).exec()
    
    if(!user){
       obj.success = false
       res.json(obj)
       return
    }else {
       obj.success = true
       obj.data = {
         accessToken: user.accessToken,
         avatar: user.avatar,
         nickname: user.nickname,
       }
       res.json(obj)
    }
}

//注册发送验证码
exports.signUpCode = function(req,res,next) {
   asyncSignUpCode(req,res)
}

//注册用验证验证码
exports.verifyCode = function(req,res,next) {
   asyncVerifyCode(req,res)
}

//注册设置密码
exports.setPassword = function(req,res,next) {
   asyncSetPassword(req,res)
}

//验证登录
exports.verifyLogin = function(req,res,next) {
   asyncverifyLogin(req,res)
}

exports.update = function *(next) {
	this.body = {
		success: true
	}
}





