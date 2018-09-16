const http = require('http')
    , fs = require('fs')
    , express = require('express');

const app = express();
//const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static('./'));
var server = app.listen(port, function() {
    console.log(`Server running at http://%s:%s/`, server.address().address, server.address().port);
});
