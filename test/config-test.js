var Git = require('../lib/git.js').Git;

exports.testGitConfigAvailable = function(test) {
    var git = new Git();
    git.readConfig(function(result){
        test.notEqual(result, null, 'Config should not be null');
        test.done();
    });
};

