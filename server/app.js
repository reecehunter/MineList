const express = require("express");
const fs = require('fs');
const https = require('https');
const http = require('http');
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config/config");
const port = config.port;

app.use(express.json(), express.urlencoded({ extended: true }), cookieParser(), cors({ origin: "http://localhost:3000", credentials: true }));

require("./routes/users.route")(app);
require("./routes/plugins.route")(app);

// app.listen(port, () => console.log(`Listening on port ${port}`));

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