'use strict';

var wantuUtils = require('../../config/utils');

var AK = '23820269';
var SK = 'cce1ccbcee00c6f97e42791965cc0fa7';
var namespace = 'flagchat';
var expiration = Date.now() + (7*24*3600*1000);

var uploadPolicy = {
   namespace: namespace,
   expiration: expiration,
   insertOnly: 0,
}


//得到上传Token  有限期限为7天  
exports.getToken = function(req,res,next){
   // console.log('in wentu')
   // console.log(req.user)
   var obj = {
   	  success: true,
      Authorization: "UPLOAD_AK_TOP " + wantuUtils.uploadAuth(uploadPolicy, AK, SK),
      "User-Agent": wantuUtils.getUserAgent(),
   }
    
   res.json(obj)
}