const db = require("../db/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.createOne = (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds)
    .then(hashedPassword => {
        console.log(hashedPassword);
        db.query(`INSERT INTO users (email, username, password) VALUES ("${email}", "${username}", "${hashedPassword}");`)
        .then((idk, queryRes) => {
            res.json( queryRes );
        })
        .catch(err => {
            const errMessage = err.sqlMessage;
            res.statusMessage = errMessage;
            res.status(400).end();
        });
    })
    .catch(err => {
        const errMessage = err.sqlMessage;
        res.status(400).json({ errMessage });
    });
}

module.exports.login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(`SELECT * FROM users WHERE username="${username}";`)
    .then(queryRes => {
        const user = {
            id: queryRes[0].id,
            email: queryRes[0].email,
            username: queryRes[0].username,
            coins: queryRes[0].coins,
        };
        const savedPassword = queryRes[0].password;
        bcrypt.compare(password, savedPassword, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) return res.status(401).json("Invalid login credentials.");
            res.json({ user });
            //const token = jwt.sign(user, jwtSecret, { expiresIn: "1d" });
            //return res.json({ token: token, user: result });
        });
    })
    .catch(err => {
        const errMessage = err.sqlMessage;
        res.statusMessage = errMessage;
        res.status(400).end();
    });
}

module.exports.getOneByUsername = (req, res) => {
    const username = req.params.username;
    db.query(`SELECT * FROM users WHERE username="${username}";`)
    .then(queryRes => {
        const user = {
            id: queryRes[0].id,
            email: queryRes[0].email,
            username: queryRes[0].username,
            coins: queryRes[0].coins,
            votes: queryRes[0].votes
        };
        res.json(queryRes[0]);
    })
    .catch(err => {
        const errMessage = err.sqlMessage;
        res.statusMessage = errMessage;
        res.status(400).end();
    });
}