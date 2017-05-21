'use strict';

var http = require('http');
var crypto = require('crypto');
var fs = require('fs');
var CryptoJS = require("crypto-js");
var FormData = require('form-data');


var utils = {};

utils.base64 = function (str) {
    return new Buffer(str).toString('base64');
};

utils.URLSafeBase64 = function (str) {
    return new Buffer(str).toString('base64')
        .replace(/\+/g, '-') // Convert '+' to '-'
        .replace(/\//g, '_') // Convert '/' to '_'
        .replace(/=+$/, ''); // Remove ending '=';
};

utils.getResourceId = function (namespace, dir, name) {
    if (name) {
        return this.URLSafeBase64(JSON.stringify([namespace, dir, name]));
    } else {
        return this.URLSafeBase64(JSON.stringify([namespace, dir]));
    }
};


utils.manageAuth = function (path, query, body, date, SK, AK) {
    var stringBeforeSign;
    if (query) {
        stringBeforeSign = path + '?' + query + "\n" + body + "\n" + date;
    } else {
        stringBeforeSign = path + "\n" + body + "\n" + date;
    }
    var sign = CryptoJS.HmacSHA1(stringBeforeSign, SK);
    var preencode = AK + ":" + sign;
    return this.URLSafeBase64(preencode);
};

utils.uploadAuth = function (uploadPolicy, AK, SK) {
    var encodedPolicy = this.URLSafeBase64(JSON.stringify(uploadPolicy)),
        sign = CryptoJS.HmacSHA1(encodedPolicy, SK);
    return this.URLSafeBase64(AK + ":" + encodedPolicy + ":" + sign);
};

utils.getUserAgent = function (type) {
    if (type == "TOP") {
        return "ALIMEDIASDK_NODEJS_TAE";
    } else {
        return "ALIMEDIASDK_NODEJS_CLOUD";
    }
};

utils.request = function (options, callback, body, isMultipart) {

    var resData = "",
        form;

    if (isMultipart) {
        form = new FormData();
        Object.keys(body).forEach(function (k, v, _array) {
            if (k == "content") {
                var idxs = {};
                if (body[k].length > 1) {
                    idxs = {
                        start: parseInt(body[k][1]),
                        end: parseInt(body[k][1]) + parseInt(body[k][2]) - 1
                    }
                }
                form.append("content", fs.createReadStream(body[k][0], idxs));
            } else {
                form.append(k, body[k]);
            }
        });
        options.headers["content-type"] = form.getHeaders()["content-type"];
    }

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            resData += chunk;
        });
        res.on('end', function () {
            callback(null, {
                statusCode: res.statusCode,
                headers: res.headers,
                data: resData
            });
        });
    });
    if (isMultipart) {
        form.pipe(req);
        form.on('end', function () {
            req.end();
        })
    } else {
        if (body) {
            req.write(body);
        }
        req.end();
    }


    req.on('error', function (err) {
        callback(err);
    });
};

module.exports = exports.utils = utils;


