// client request module
var request = require('request');

var Client = exports.Client= function() {
  'use strict';
  this.werckerUrl = process.env.werckerurl || 'http://app.wercker.com/';
  this.apiVersion = "1.0";
};

Client.prototype.getOAuthToken = function(username, password, oauthScope, callback) {
  'use strict';
  var url = this.werckerUrl + "/api/" + this.apiVersion + "/oauth/basicauthaccesstoken";

  var data = JSON.stringify({username: username , password : password, oauthScope : oauthScope});

  try {
    request({
      method: 'POST',
      url: url,
      body: data,
      headers: {
        "Content-Length": data.length,
        "Content-Type": "application/json"
      }
    }, function(error, response, body) {

      if (error) {
        console.error(error);
        callback(error);
      }
      else {
        console.log(body);
        callback(null, JSON.parse(body));
      }
    });
  } catch (error) {
    console.error(error.toString());
    console.error(error.stack);
    callback(error);
  }

};