const db = require("../db/db");

module.exports.getOne = async (req, res) => {
  const id = req.params.id;
  const result = await db.query(`
        SELECT

        plugins.name, plugins.description, plugins.longDescription, plugins.downloads, plugins.views, plugins.imgSrc, plugins.date_created,
        users.username, users.pfpImgSrc,
        tags.name AS tag_name,
        updates.updateList, updates.download AS updateDownload, updates.versionMajor, updates.versionMinor, updates.versionPatch, updates.title AS updateTitle

        FROM plugins
    
        LEFT JOIN plugin_authors ON plugins.id=plugin_authors.plugin_id
        LEFT JOIN users ON users.id=plugin_authors.user_id

        LEFT JOIN plugin_tags ON plugins.id=plugin_tags.plugin_id
        LEFT JOIN tags ON tags.id=plugin_tags.tag_id

        LEFT JOIN plugin_updates ON plugins.id=plugin_updates.plugin_id
        LEFT JOIN updates ON updates.id=plugin_updates.update_id

        WHERE plugins.id=${id};
    `);
  return res.json(result);
};
