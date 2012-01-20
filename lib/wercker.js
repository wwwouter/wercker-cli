var async = require('async');

var Repository = require('./repository.js').Repository

var Wercker = exports.Wercker = function() {
}

Wercker.prototype.create = function() {
    async.waterfall([
    
        function(callback){
            Repository.getConfig(function(config) {
                callback(null, config);
            });
        },
    
        function(argument callback){
            callback(null, argument);
        },
    
        function(result, callback){
            callback(null, result);
        }
    ]);
    
}
