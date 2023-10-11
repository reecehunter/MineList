/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




// declare a new express app
const express = require('express')
// const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const fs = require('fs');
const https = require('https');
const http = require('http');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config/config");
const port = config.port;
const app = express()

app.use(awsServerlessExpressMiddleware.eventContext(), express.json(), express.urlencoded({ extended: true }), cookieParser(), cors({ origin: "http://localhost:3000", credentials: true }));

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// Enable routes
require("./routes/users.route")(app);
require("./routes/plugins.route")(app);

// Try https, default to  http
try {
  const privateKey  = fs.readFileSync('~/openssl/key.pem', 'utf8');
  const certificate = fs.readFileSync('~/openssl/cert.pem', 'utf8');
  const options = { key: privateKey, cert: certificate };
  https.createServer(options, app).listen(5050);
  console.log(`Listening on https port ${port}`);
} catch(err) {
  http.createServer(app).listen(5050);
  console.log(`Listening on http port ${port}`);
}


// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
