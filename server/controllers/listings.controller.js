const db = require("../db/db");
const config = require("../config/config");

module.exports.getOne = async (req, res) => {
    const id = req.params.id;
    const result = await db.query(`SELECT * FROM listings WHERE id=${id};`);
    return res.json( result[0] );
}

module.exports.getMultiple = async (req, res) => {
    const listPerPage = config.listPerPage;
    const limit = listPerPage;
    const results = await db.query(`SELECT * FROM listings LIMIT ${limit};`);
    return res.json({ results });
}