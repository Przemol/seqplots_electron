electron = require('electron').remote;

const {app, session} = electron;

let currentSession = null;

app.on('ready', function() {
    'use strict';

    currentSession = session.fromPartition('persist:seqplots').cookies;

    currentSession.get({}, function(error, cookies) {
        console.dir(cookies);
        if (error) {
            console.dir(error);
        }
    });

    var expiration = new Date();
    expiration.setHours(expiration.getHours() + (24*365*3));

    var fs = require('fs');
    var cnf = JSON.parse(fs.readFileSync(path.resolve(path.join(__dirname, 'seqplots.json')), 'utf8'));

    var array = $.map(cnf, function(value, index) {
      currentSession.set({
          name: index,
          url: 'http://www.example.com',
          value: value,
          expirationDate: expiration.getTime()
      }, function(error) {
          console.log('Cookie set');
          if (error) {
              console.dir(error);
          }
      });
      console.log(index, '-', value);
    });



    currentSession.get({}, function(error, cookies) {
        console.dir(cookies);
        cc=cookies;
        if (error) {

            console.dir(error);
        }
    });
});
