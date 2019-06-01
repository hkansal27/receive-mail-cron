// index.js
const cron = require("node-cron");
const express = require("express");
const imaps = require('imap-simple');

app = express();


var config = {
    imap: {
        user: 'himanshukansal.jiit@gmail.com',
        // have to enter the respective password
        password: '*********',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        authTimeout: 3000
    }
};

// schedule tasks to be run on the server on every 30   
cron.schedule('*/30 * * * * *', function () {
    imaps.connect(config).then(function (connection) {
        return connection.openBox('INBOX').then(function () {
            var searchCriteria = [
                'UNSEEN'
            ];

            var fetchOptions = {
                bodies: ['HEADER', 'TEXT'],
                markSeen: true
            };

            return connection.search(searchCriteria, fetchOptions).then(function (results) {
                var mailList = results.map(function (res) {
                    return res.parts.filter(function (part) {
                        return part.which === 'HEADER';
                    })[0].body;
                });

                console.log(mailList);
            });
        });
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
