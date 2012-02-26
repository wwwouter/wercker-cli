var async = require('async');
var util = require('util');
var fs = require('fs');
var path = require('path');
var rl = require('readline');
var Repository = require('./repository.js').Repository;
var Client = require('../lib/client.js').Client;

var Wercker = exports.Wercker = function() {
  'use strict';
  this.isAuthenticated= function(){
    if(this.token){
      return true;
    }
    else{
      if(!path.existsSync(this.getGlobalWerckerFullFilename())){
        return false;
      }
      else{
        this.token = fs.readFileSync(this.getGlobalWerckerFullFilename()).toString();
        return true;
      }
    }
  };

  this.getGlobalWerckerPath = function(){
    return path.join( process.env.HOME , '.wercker' );
  };

  this.getGlobalWerckerFullFilename = function(){
    return path.join(this.getGlobalWerckerPath() , 'credentials');
  };

  this.token = null;
};



Wercker.prototype.login= function(callback) {
  'use strict';
  var self = this;
  var i = rl.createInterface(process.stdin, process.stdout, null);
  console.log("Enter your Wercker credentials.");
  i.question("Username:", function(username) {
    i.question("Password:", function(password) {

      var client = new Client();
      client.getOAuthToken(username,password, 'cli', function(err, result){
        if(err){
          console.log('Authentication failed');

          console.log(err);
          callback(err);
        }
        else{
          if(result && result.result.token){

            console.log('Authentication successful');

            if(!path.existsSync(self.getGlobalWerckerPath())){
              fs.mkdirSync(self.getGlobalWerckerPath());

            }

            fs.writeFileSync(self.getGlobalWerckerFullFilename(), result.result.token);

          }
          else{
            console.log('Authentication failed');
          }
          callback();
        }

        i.close();
        process.stdin.destroy();


      });
    });
  });
};

Wercker.prototype.create = function(environment) {
  'use strict';
  var self = this;

  async.waterfall([
    function(callback){
      if(!self.isAuthenticated()){
        self.login(callback);
      }
      else{
        callback(null);
      }
    },
    function(callback){
      if(!self.isAuthenticated()){
        callback(new Error('Still not authenticated'));
      }
      else{
        callback(null);
      }
    },
    function(callback){
      var repository = new Repository();
      repository.readConfig(function(config) {
        callback(null, config);
      });
    },
    function(config, callback){
      var client = new Client();
      client.createProject(
        config.gitUrl, config.userName, config.projectName, config.sourceControl, environment, self.token, callback
      );

    },

    function(result, callback){
      if(result.failed){
        if(result.authenticateUrl){
          console.log(util.format('Please goto %s to connect to this git provider', result.authenticateUrl));
        }
      }
      console.log('created ofzo');
      callback();
    }
  ],
    function(error, result){
    }
  );

};
