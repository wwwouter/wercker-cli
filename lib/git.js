var iniparser = require('iniparser');

var Git = exports.Git = function() {
};


Git.prototype.readConfig = function(callback) {
    iniparser.parse('./.git/config', function(err, config){
        if (err) {
            console.log(err);
        }
        callback(config);
    });
}

Git.prototype.getRemote = function(config, callback) {
    callback(config['remote "origin"'].url);
};

/*
var git = new Git();
git.readConfig(function(result) {
    console.log(result);
});
*/
    
