const db = require("../db/db");

module.exports.getOne = async (req, res) => {
    const id = req.params.id;
    const result = await db.query(`
        SELECT * FROM plugins
        LEFT JOIN pluginSections ON plugins.id=pluginSections.pluginID
        LEFT JOIN users ON plugins.userID=users.id
        WHERE plugins.id=${id};
    `);
    return res.json( result );
}