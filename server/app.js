const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./config/config");
const port = config.port;

app.use(express.json(), express.urlencoded({ extended: true }), cors());

require("./routes/users.route")(app);
require("./routes/listings.route")(app);
require("./routes/status.route")(app);
require("./routes/sections.route")(app);

app.listen(port, () => console.log(`Listening on port ${port}`));