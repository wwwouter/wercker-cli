var Client = require('../lib/client.js').Client;

exports.test1= function(test) {
  'use strict';
    test.expect(0);



    var client = new Client();

  client.callPriv();

  client.werckerUrl = 'http://localhost:3000';


  client.getOAuthToken('1','1', 'cli', function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log('done');
    }

    test.done();
  });




};


