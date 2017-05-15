'use strict';

const AliDaYu = require('super-alidayu');
var speakeasy = require('speakeasy'); 

const client = new AliDaYu({
  app_key: '23821881',
  secret: '27d165b1f576a6232553af9af9961e76',
});

exports.getCode = function() {
     var code = speakeasy.totp({
     	secret: 'flagchat_code',
     	digists: 6,
     });

     return code;
}

exports.sendCode = function(code,phoneNumber,SMSID){
	var options = {
	  sms_free_sign_name: '云图科技',
	  sms_param: {
	    code: code,
	    //product: '一登',
	  },
	  rec_num: phoneNumber,
	  sms_template_code: SMSID,
	};

	// 发送短信，promise方式调用
	client.sms(options)
	  .then(ret => console.log('success', ret))
	  .catch(err => console.log('error', err));

	// // 发送短信，callback方式调用
	// client.sms(options, (err, ret) => {
	//   if (err) {
	//     console.log('error', err);
	//   } else {
	//     console.log('success', ret);
	//   }
	// });
}
