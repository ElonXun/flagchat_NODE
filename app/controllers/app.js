'use strict';

var mongoose = require('mongoose')
var User = mongoose.model('User')
var bluebird = require('bluebird')
var common = require('../../config/common')
var uuid = require('uuid')

exports.signature = function (req, res, next) {
	var num = 10,
    name ="Addy Osmani",
    obj1 = { value: "first value" },
    obj2 = { value: "second value" },
    obj3 = obj2;

    function change(num, name, obj1, obj2) {
      num = num * 10;
      name = "Paul Irish";
      obj1 = obj2;
      obj2.value = "new value";
    }

change(num, name, obj1, obj2);

console.log(num);
console.log(name);
console.log(obj1.value);
console.log(obj2.value);
console.log(obj3.value);

}

exports.hasBody = async function (req, res, next) {
   var body = req.body || {}
   if(Object.keys(body).length === 0) {
       var obj = {
          success: false,
          err:'badRequest',
       }
       res.json(obj)
       return
   }else{
      next()
   }
}

exports.hasToken = async function (req, res, next) {
	var accessToken = req.body.accessToken
  var refreshToken = req.body.refreshToken
  var data = {
  	success:false,
  }
  //如果post过来的数据中不包含accessToken 则返回重新登录
	if(!accessToken) {
        data.success = false
        data.err = 'Access without permission'
        res.json(data)
        return
	}
  
  var redis = require("redis");
  var client = redis.createClient('6379','118.89.172.216');
  bluebird.promisifyAll(redis.RedisClient.prototype);
  bluebird.promisifyAll(redis.Multi.prototype);

  // redis 链接错误
  client.on("error", function(error) {
      console.log(error);
  });
  // redis 验证 (reids.conf未开启验证，此项可不需要)
  client.auth("20141226xyf");

  //post过来的数据中如果同时包含refreshToken,说明此次为刷新Token操作
  if(refreshToken) {
      var user = await User.findOne({
       accessToken: accessToken,
       refreshToken: refreshToken
      }).exec()

      if(!user){
           client.quit()
           data.success = false
           data.err = 'Access without permission ！Login Again Please ！'
           res.json(data)
           return
      }else{
         // 判断refreshToken是否过期
         var refreshDate = common.decryptRefreshToken(refreshToken,user._id.toString()).split(':').pop()
         if(refreshDate > Date.now()){
            //refreshToken有效,刷新Token
            var query = {
               accessToken:accessToken,
               refreshToken:refreshToken,
            }
            accessToken = uuid.v4()
            refreshToken = common.getRefreshToken(user._id.toString())
            var reply = await client.setAsync(accessToken,user._id.toString(),'EX',3600*2)
            if(reply != 'OK'){
               console.log(reply)
               console.log('票据写入错误,请联系管理员')
            }
            user = await User.findOneAndUpdate(query, { accessToken: accessToken ,refreshToken: refreshToken })
            req.user = user
            client.quit()
            next()
         }else{
              client.quit()
              data.success = false
              data.err = 'Login Again Please ！'
              res.json(data)
              return
         }
      }
  }
    //在redis中判断有无accessToken
   var redis_User_id =  await client.getAsync(accessToken)
   //redis中没有,则说明accessToken已经过期,返回错误代码请求获取refreshToken
   if(!redis_User_id){
      client.quit()
      data.success = false
      data.err = 'Need refreshToken Please !'
      res.json(data)
      return
   }else{
       //如果有accssToken则刷新redis中的过期时间
       var reply = await client.expireAsync(accessToken,3600*2)
       if(reply == 1){
           var user = {
             accessToken:accessToken,
             _id:redis_User_id,
           }
           client.quit()
           req.user = user
           next()
       }else{
           client.quit()
           data.success = false
           data.err = '票据刷新错误,请联系管理员'
           res.json(data)
           return
       }
   }

}







