// client request module
var request = require('request');
var util = require('util');

var Client = exports.Client= function() {
  'use strict';
  this.werckerUrl = process.env.werckerurl || 'http://app.wercker.com';
  this.apiVersion = "1.0";

  /*
  * @param {Object} data Javascript object which will be posted
  * @param {String} path Path of url after version, without leading slash
  * @param {Function} callback
   */
  this.doPost = function(data, path,  callback){

  var url = this.werckerUrl + "/api/" + this.apiVersion + '/' + path;

  var dataString = JSON.stringify(data);

  try {
    request({
      method: 'POST',
      url: url,
      body: dataString,
      headers: {
        "Content-Length": dataString.length,
        "Content-Type": "application/json"
      }
    }, function(error, response, body) {

      if (error) {
        callback(error);
      }
      else {
        callback(null, JSON.parse(body));
      }
    });
  } catch (error) {
    console.error(error.toString());
    console.error(error.stack);
    callback(error);
  }

};

};

Client.prototype.getOAuthToken = function(username, password, oauthScope, callback) {
  'use strict';
  this.doPost(
    {username: username , password : password, oauthScope : oauthScope},
    'oauth/basicauthaccesstoken', callback
  );
};


Client.prototype.createProject = function(gitUrl, userName, projectName, sourceControl, environment, token, callback) {
  'use strict';

  this.doPost(
    {gitUrl: gitUrl, userName: userName, projectName: projectName,
        sourceControl: sourceControl, token : token},
    "project/create", callback
  );
};

Client.prototype.getTemplates = function(projectName, platform, token, callback) {
  'use strict';
  this.doPost(
    {projectName: projectName, platform: platform, token : token},
    "project/gettemplates", callback
  );
};



