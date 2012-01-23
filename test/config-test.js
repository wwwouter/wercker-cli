var Repository = require('../lib/repository.js').Repository;

exports.testGitConfigAvailable = function(test) {
    var repo = new Repository();
    repo.readConfig(function(result){
        test.expect(1);
        test.notEqual(result, null, 'Config should not be null');
        test.done();
    });
};

