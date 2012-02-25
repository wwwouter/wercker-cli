var Repository = require('../lib/repository.js').Repository;

exports.testGitConfigAvailable = function(test) {
  'use strict';
    test.expect(1);

    var repo = new Repository();
    
    repo.readConfig( function(result) {

        test.notEqual( result, null, 'Config should not be null');
        
        test.done();
    });
};


