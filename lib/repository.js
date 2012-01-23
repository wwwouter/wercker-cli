var iniparser = require('iniparser');
var async = require('async');

/*
git@bitbucket.org:mies/wercker-cli.git
*/

var Repository = exports.Repository = function() {
};


Repository.prototype.readConfig = function(callback) {

    iniparser.parse('./.git/config', function(err, config){
        var gitUrl = config['remote "origin"'].url;
        var details = gitUrl.split(':');

        if (err) {
            console.log(err);
        }

        async.parallel({
            gitUrl : function(callback) {
                callback(null, gitUrl);
            },
            userName : function(callback) {
                var username = details[1].split('/')[0];
                callback(null, username);
            },
            projectName : function(callback) {
                var project = details[1].split('/')[1].split('.')[0];
                callback(null, project);
            },
            sourceControl : function(callback) {
                var type = details[0].split('@')[1].split('.')[0];
                callback(null, type);
            }
        },
        function(err, results) {
            if (err) {
                console.error(err);
            }
            callback(results);
        });

    });
}
Repository.prototype.getRemote = function(config, callback) {
    callback(config['remote "origin"'].url);
};


var repo = new Repository
repo.readConfig(function(result) {
    console.log(result);
});

    
