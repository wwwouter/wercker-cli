var iniparser = require('iniparser');
var async = require('async');

var Repository = exports.Repository = function() {
};


Repository.prototype.readConfig = function(callback) {
    iniparser.parse('./.git/config', function(err, config){
        if (err) {
            console.log(err);
        }

        async.parallel({
            gitUrl : function(callback) {
                callback(null, config['remote "origin"'].url);
            },
            userName : function(callback) {

                callback(null);
            },
            projectName : function(callback) {
                callback(null);
            }
        },
        function(err, results) {
            if (err) {
                console.error(err);
            }
        });

    });
}
Repository.prototype.getRemote = function(config, callback) {
    callback(config['remote "origin"'].url);
};

/*
var git = new Git();
git.readConfig(function(result) {
    console.log(result);
});
*/
    
