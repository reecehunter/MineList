const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const config = require("./config/config");
const port = config.port;

app.use(express.json(), express.urlencoded({ extended: true }), cookieParser(),
    cors({ origin: "http://localhost:3000", credentials: true }));

require("./routes/users.route")(app);
require("./routes/plugins.route")(app);
require("./routes/sections.route")(app);

app.listen(port, () => console.log(`Listening on port ${port}`));