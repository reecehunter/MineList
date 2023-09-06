const db = require("../db/db");

module.exports.getOne = async (req, res) => {
    const id = req.params.id;
    const result = await db.query(`
        SELECT

        plugins.name, plugins.description, plugins.downloads, plugins.views, plugins.stars, plugins.imgSrc, plugins.date_created,
        pluginSections.title AS section_title, pluginSections.text AS section_text,
        users.username, users.pfpImgSrc,
        tags.name AS tag_name

        FROM plugins

        LEFT JOIN pluginSections ON plugins.id=pluginSections.pluginID
    
        LEFT JOIN plugin_authors ON plugins.id=plugin_authors.plugin_id
        LEFT JOIN users ON users.id=plugin_authors.user_id

        LEFT JOIN plugin_tags ON plugins.id=plugin_tags.plugin_id
        LEFT JOIN tags ON tags.id=plugin_tags.tag_id

        WHERE plugins.id=${id};
    `);
    return res.json( result );
}