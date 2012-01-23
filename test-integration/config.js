var iniparser = require('iniparser');
iniparser.parse('./.git/config', function(err,data){
    if (err) {
        console.log(err);
    }
    console.log(data);
        
});
