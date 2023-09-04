const usersController = require("../controllers/users.controller");

module.exports = (app) => {
    app.post("/api/users", usersController.createOne);
    app.post("/api/users/login", usersController.login);
    app.get("/api/users/:username", usersController.getOneByUsername);
};