var Git = require('./git.js').Git

var Wercker = exports.Wercker = function() {
}

Wercker.prototype.create = function() {
    async.waterfall([
    
        function(callback){
            Git.getConfig(function(config) {
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
