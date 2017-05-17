'use strict';

var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
	phoneNumber: {
		unique: true,
		type: String,
	},
    password: String,
    areaCode: String,//区号
    verifyCode: String,
    verifyed: {
         type: Boolean,
         default: false,
    },
    accessToken: String,
    nickname: String,
    gender: String,
    age: String,
    avatar: String,
    meta: {
    	createAt: {
    		type: Date,
    		dafault: Date.now(),
    	},
    	updateAt: {
    		type: Date,
    		dafault: Date.now(),
    	},
    }
  
})

UserSchema.pre('save', function(next){
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else {
        this.meta.updateAt = Date.now()
    }

    next()
})


module.exports = mongoose.model('User', UserSchema)
