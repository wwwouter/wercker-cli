var async = require('async');
var rl = require('readline');
var Repository = require('./repository.js').Repository;
var Client = require('../lib/client.js').Client;

var Wercker = exports.Wercker = function() {

  this.isAuthenticated= function(){
    //find .wercker/settings file
    return false;
  };

  this.getUserDataPath = function(){
    return '';
  };
};



Wercker.prototype.login= function(callback) {
  var i = rl.createInterface(process.stdin, process.stdout, null);
  console.log("Enter your Wercker credentials.");
  i.question("Username:", function(username) {
    i.question("Password:", function(password) {

      var client = new Client();
      client.getOAuthToken(username,password, 'cli', function(err, result){
          if(err){
            console.log('Authentication failed');

            console.log(err);
            callback(err)
          }
          else{
            if(result && result.result.token){

              console.log('Authentication successful');

            }
            else{
              console.log('Authentication failed');
            }
            callback();
          }

        i.close();
            process.stdin.destroy();


    });
    // These two lines together allow the program to terminate. Without
    // them, it would run forever.

  });
  });
  //ask username
  //ask password
  //get token
  // if none: report and repeat un/pw
  //save token

};

Wercker.prototype.create = function() {
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
          console.log(3);
         callback(null);
        }
      },

        function(callback){
          console.log(2);
            Repository.getConfig(function(config) {
                callback(null, config);
            });
        },

    
        function(result, callback){
          console.log('result');
          console.log(result);
            callback(null);
        }
    ],
    function(error, result){
      if(error){

      }
    }
    );
    
};
