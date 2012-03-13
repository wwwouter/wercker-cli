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

function createDirectoryIfNotExist(fullPath){
  'use strict';
  var dirname = path.dirname(fullPath);

  if(path.existsSync(fullPath)){
    return;
  }
  if(!path.existsSync(dirname)){
    createDirectoryIfNotExist(dirname);
  }
  fs.mkdirSync(fullPath);
}

Wercker.prototype.template = function(environment) {
  'use strict';
  var self = this;
  async.waterfall([
    function(next){
          if(!self.isAuthenticated()){
            self.login(next);
          }
          else{
            next(null);
          }
        },
        function(next){
          if(!self.isAuthenticated()){
            next(new Error('Still not authenticated'));
          }
          else{
            next(null);
          }
        },
  function(next){
    var repository = new Repository();
          repository.readConfig(function(config) {
            next(null, config);
          });
  },
    function(config, next){
      if(!config){
        next('No config');
      }
      else{
      var client = new Client();
        client.getTemplates(config.projectName, process.platform, self.token, next);
      }
      },
    function(result, next){
      var i, template, targetFullFileName;
      var gitHookDirectory = path.resolve('./.git/hooks');
      var projectDirectory = path.resolve('./');




      for(i = 0; i < result.result.length; i++){
        template = result.result[i];

        if(template .templateType === 'hook'){
          targetFullFileName = path.join(gitHookDirectory, template.fileName);
        }
        else if(template .templateType === 'project'){
          targetFullFileName = path.join(projectDirectory, template.fileName);
        }
        if(path.existsSync(targetFullFileName)){
          console.log(util.format('Ignoring %s because file already exists.', template.fileName));
        }
        else{
          createDirectoryIfNotExist(path.dirname(targetFullFileName));

          fs.writeFileSync(targetFullFileName, template.content);
          console.log(util.format('%s created.', template.fileName));

        }

      }
    }],
  function(error, result){
    if(error){
      console.log(error);
    }
    console.log(result);
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
      if(!config){
        callback('No config');
      }
      else{


      var client = new Client();
      client.createProject(
        config.gitUrl, config.userName, config.projectName, config.sourceControl, environment, self.token, callback
      );
      }
    },

    function(result, callback){
      if(result.failed){
        if(result.authenticateUrl){
          console.log(util.format('Please goto %s to connect to this git provider.', result.authenticateUrl));
        }
        else if(result.error){
          console.log('Cannot create project');
        }
        else{
          console.log('Cannot create project: ' + result.message);
        }
      }
      else{
        console.log('Project has been created.');
      }

      callback();
    }
  ],
    function(error, result){
    }
  );

};
