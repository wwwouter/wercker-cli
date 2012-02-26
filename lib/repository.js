var path = require('path');
var iniparser = require('iniparser');
var async = require('async');

/*
 git@bitbucket.org:mies/wercker-cli.git
 */

var Repository = exports.Repository = function() {
};


Repository.prototype.readConfig = function(callback) {
  'use strict';
  var fp = path.resolve('./.git/config');

  iniparser.parse(fp, function(err, config){
    var gitUrl = config['remote "origin"'].url;
    var sourceControl ;
    if(gitUrl.indexOf('git://github.com') === 0){
      sourceControl = 'github';
    }
    else if(gitUrl.indexOf('git@bitbucket.org') === 0){
      sourceControl = 'bitbucket';
    }
    else{
      sourceControl = 'unknown';
      console.log('Cannot determine source control provider from this url:' + gitUrl);
      callback(null);
      return;
    }

    var details;
    if(sourceControl === 'bitbucket'){
      details =  gitUrl.split(':');
    }
    else if(sourceControl === 'github'){
      details = gitUrl.split('/');
    }


    if (err) {
      console.log(err);
    }

    async.parallel({
        gitUrl : function(callback) {
          callback(null, gitUrl);
        },
        userName : function(callback) {
          var username ;
          if(sourceControl === 'bitbucket'){
            username = details[1].split('/')[0];
          }
          else if( sourceControl === 'github'){
            username = details[3];
          }
          callback(null, username);

        },
        projectName : function(callback) {
          var project;
          if(sourceControl === 'bitbucket'){
          project = details[1].split('/')[1].split('.')[0];

          }

          else if( sourceControl === 'github'){
            project = details[4].split('.')[0];

          }
          callback(null, project);
        },
        sourceControl : function(callback) {

          callback(null, sourceControl);
        }
      },
      function(err, results) {
        if (err) {
          console.error(err);
        }
        callback(results);
      });
  });
};

/*
 var repo = new Repository
 repo.readConfig(function(result) {
 console.log(result);
 });
 */
    
