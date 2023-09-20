const db = require("../db/db");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const generateToken = (data) => {
  const expiresIn = config.jwt.expiresIn;
  const token = jwt.sign(data, config.jwt.secret, { expiresIn: expiresIn + "m" });
  res.cookie("token", token, { httpOnly: true, secure: true, SameSite: "strict", expires: new Date(Number(new Date()) + expiresIn * 60 * 1000) }); // add 'secure: true', when using https
};

module.exports.createOne = (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  console.log(email);

  bcrypt
    .hash(password, saltRounds)
    .then((hashedPassword) => {
      db.query(`INSERT INTO users (email, username, password) VALUES ("${email}", "${username}", "${hashedPassword}");`)
        .then((queryRes, err) => {
          const token = generateToken({ user_id: queryRes.insertId });
          res.json(token);
        })
        .catch((err) => {
          const errMessage = err.sqlMessage;
          res.statusMessage = errMessage;
          res.status(400).end();
        });
    })
    .catch((err) => {
      const errMessage = err.sqlMessage;
      res.status(400).json({ errMessage });
    });
};

module.exports.login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(`SELECT * FROM users WHERE username="${username}";`)
    .then((queryRes) => {
      const user = {
        id: queryRes[0].id,
        email: queryRes[0].email,
        username: queryRes[0].username,
        pfpImgSrc: queryRes[0].pfpImgSrc,
        dateCreated: queryRes[0].dateCreated,
        dateModified: queryRes[0].dateModified,
      };
      const savedPassword = queryRes[0].password;
      bcrypt.compare(password, savedPassword, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) return res.status(401).json("Invalid login credentials.");
        // Create token
        const expiresIn = config.jwt.expiresIn;
        const token = jwt.sign(user, config.jwt.secret, { expiresIn: expiresIn + "d" });
        req.user = user;
        res.cookie("token", token, { httpOnly: true, secure: true, SameSite: "strict", expires: new Date(Number(new Date()) + expiresIn * 60 * 1000) }); // add 'secure: true', when using https

        res.json({ token });
      });
    })
    .catch((err) => {
      const errMessage = err.sqlMessage;
      console.log(err);
      res.status(400).json({ errMessage });
    });
};

module.exports.getOneByUsername = (req, res) => {
  const username = req.params.username;
  db.query(`SELECT * FROM users WHERE username="${username}";`)
    .then((queryRes) => {
      const user = {
        id: queryRes[0].id,
        username: queryRes[0].username,
      };
      res.json(queryRes[0]);
    })
    .catch((err) => {
      const errMessage = err.sqlMessage;
      res.statusMessage = errMessage;
      res.status(400).end();
    });
};

module.exports.parseJWT = (token) => {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
};

module.exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      message: "Access Denied! Unauthorized User",
    });
  }
  const token = authHeader.split("token=")[1];

  if (token === undefined) {
    return res.status(401).json({
      message: "Access Denied! Unauthorized User",
    });
  } else {
    jwt.verify(token, config.jwt.secret, (err, authData) => {
      if (err) return res.status(403).end();
      else {
        const parsedToken = this.parseJWT(token);
        return res.json(parsedToken);
      }
    });
  }
};

module.exports.verifyTokenMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      message: "Access Denied! Unauthorized User",
    });
  }
  const token = authHeader.split("token=")[1];

  if (token === undefined) {
    return res.status(401).json({
      message: "Access Denied! Unauthorized User",
    });
  } else {
    jwt.verify(token, config.jwt.secret, (err, authData) => {
      if (err) return res.status(403).end();
      else {
        const parsedToken = this.parseJWT(token);
        // res.json(parsedToken); // REMOVED BECAUSE YOU CAN'T SEND THE RES TWICE (WHEN USING NEXT())
        res.locals.userID = parsedToken.id;
        return next();
      }
    });
  }
};
