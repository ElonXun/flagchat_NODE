'use strict';
var md5 = require('md5');
var tea = require('tea'); 
var uuid = require('uuid');

var common = {}

/**
   解密得到客户端生成的随机秘钥key接口
   @userPhone
   @userPass
   @clientInfo
**/
common.getClientKey = function(userPhone,userPass,clientInfo){
   var ouid = md5(userPhone)
   var opass = md5(userPass)
   var key = md5(ouid + opass)

   return tea.decrypt(clientInfo,key)
}

/**
   加密accessToken 和 refreshToken 接口
   @accessToken
   @refreshToken
   @key
**/
common.encryptToken = function(accessToken,refreshToken,key){
   var data = {
   	  token:accessToken,
   	  rToken:refreshToken
   }

   return tea.encrypt(JSON.stringify(data),key)
}

/**
   以_id为Key uuid + 时间戳 加密后 生成refreshToken
   @_id
**/

common.getRefreshToken =function(_id){
   var timestamp = Date.now() + 30*24*60*60*1000
   var data = uuid.v4() + ':' + timestamp
   
   return tea.encrypt(data,_id)
}

/**
   解密refreshToken信息
   @info
   @_id
**/
common.decryptRefreshToken = function(info,_id){
   return tea.decrypt(info,_id)
}

module.exports = exports.common = common;
