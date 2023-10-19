const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config/config");
let port = config.port;

const app = express();

app.use(express.json(), express.urlencoded({ extended: true }), cookieParser(), cors({ origin: "http://localhost:3000", credentials: true }));

require("./routes/users.route")(app);
require("./routes/plugins.route")(app);

let server;
try {
    const options = {
        key: fs.readFileSync("./certs/key.pem"),
        cert: fs.readFileSync("./certs/cert.pem"),
    };
    server =  https.createServer(options, app);
    port = 443;
} catch(err) {
    server = http.createServer(app);
}

server.listen(port, () => console.log(`Listening on port ${port}`));
