'use strict';

exports.signature = function *(next) {
	this.body = {
		success: true
	}
}

exports.hasToken = function *(next) {
	this.body = {
		success: true  
	}
}






