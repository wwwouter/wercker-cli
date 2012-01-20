var iniparser = require('iniparser');

var Repository = exports.Repository = function() {
};


Repository.prototype.readConfig = function(callback) {
    iniparser.parse('./.git/config', function(err, config){
        if (err) {
            console.log(err);
        }
        callback(config);
    });
}


Repository.prototype


Repository.prototype.getRemote = function(config, callback) {
    callback(config['remote "origin"'].url);
};

/*
var git = new Git();
git.readConfig(function(result) {
    console.log(result);
});
*/
    
