var iniparser = require('iniparser');
iniparser.parse('./.git/config', function(err,data){
  'use strict';
    if (err) {
        console.log(err);
    }
    console.log(data);
        
});
