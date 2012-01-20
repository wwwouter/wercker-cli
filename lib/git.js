var iniparser = require('iniparser');

var Git = exports.Git = function() {
};


Git.prototype.readConfig = function(callback) {
    iniparser.parse('./.git/config', function(err,data){
        if (err) {
            console.log(err);
        }

        console.log(data.core['remote "origin"'].url);
        callback(data.core['remote "origin"'].url);
    });
}

Git.prototype.getRemote = function(callback) {
    callback();
};


