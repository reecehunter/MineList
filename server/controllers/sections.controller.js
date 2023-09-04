const db = require("../db/db");

module.exports.getOne = async (req, res) => {
    const id = req.params.id;
    const result = await db.query(`
        SELECT * FROM listings LEFT JOIN serverDescriptionSections ON listings.id=serverDescriptionSections.userID WHERE listings.id=${id};
    `);
    return res.json( result );
}