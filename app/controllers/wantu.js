'use strict';

var wantuUtils = require('../../config/utils');

var AK = '23820269';
var SK = 'cce1ccbcee00c6f97e42791965cc0fa7';
var namespace = 'flagchat';
var expiration = Date.now() + (7*24*3600*1000);
//var expiration = -1;

//var uploadPolicy='{"namespace":"'+namespace +'","expiration":'+ expiration +',"insertOnly":0}'
var uploadPolicy = {
   namespace: namespace,
   expiration: expiration,
   insertOnly: 0,
}

exports.getToken = function(req,res,next){
   //wantuUtils.URLSafeBase64('111')
   //uploadPolicy.returnBody = returnBody
  //console.log(uploadPolicy)
   var obj = {
   	  success: true,
      Authorization: "UPLOAD_AK_TOP " + wantuUtils.uploadAuth(uploadPolicy, AK, SK),
      "User-Agent": wantuUtils.getUserAgent(),
     // test: uploadPolicy
   }
    
   res.json(obj)
}