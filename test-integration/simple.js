var git = require( 'nodegit' );
var path = require('path');

console.log(path.resolve('.git'));

git.repo( path.resolve('../.git'), function() {
  'use strict';
  console.log( 'Repo opened' );

  console.log(this);
  

  this.branch( 'master', function() {
    console.log( 'Branch opened' );

    this.history().on( 'commit', function( i, commit ) {
      console.log( commit.id.toString(40) );
    });

  });
});

