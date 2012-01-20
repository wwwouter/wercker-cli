var Git = require('../lib/git.js').Git;

exports.testGitConfigAvailable = function(test) {
    var git = new Git();
    var result = git.readConfig();
    test.ok(result, 'config should exist');
    test.done();
}
