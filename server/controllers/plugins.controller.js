const db = require("../db/db");
const mysql = require("mysql2/promise");
const config = require("../config/config");
const { getCloudfrontSignedUrl } = require("../helper/cloudfront");

module.exports.getAll = async (req, res) => {
  const output = {};
  const results = await db.query(`
    SELECT

    COUNT(plugin_followers.plugin_id) AS followers,
    plugins.*,
    users.username,
    tags.name AS tag_name
    FROM plugins
    
    LEFT JOIN users ON users.id = plugins.userID
    
    LEFT JOIN plugin_followers ON plugin_followers.plugin_id = plugins.id
    
    LEFT JOIN plugin_tags ON plugins.id=plugin_tags.plugin_id
    LEFT JOIN tags ON tags.id=plugin_tags.tag_id
    
    GROUP BY plugins.id, tags.name;
  `);
  for (const plugin of results) {
    if (!output[plugin.id]) {
      plugin.imgSrc = getCloudfrontSignedUrl(plugin.imgSrc);
      plugin.tags = [plugin.tag_name];
      output[plugin.id] = plugin;
    } else {
      if (!output[plugin.id].tags.includes(plugin.tag_name)) {
        output[plugin.id].tags.push(plugin.tag_name);
      }
    }
  }
  res.json(Object.values(output));
};

module.exports.getOne = async (req, res) => {
  const id = req.params.id;
  const data = cache.get(parseInt(id));
  res.json(data);
};

module.exports.getAllByUserID = async (req, res) => {
  const output = {};
  try {
    const results = await db.query(`
      SELECT
  
      COUNT(plugin_followers.plugin_id) AS followers,
      plugins.*,
      users.username,
      tags.name AS tag_name
      FROM plugins
      
      LEFT JOIN users ON users.id = plugins.userID
      
      LEFT JOIN plugin_followers ON plugin_followers.plugin_id = plugins.id
      
      LEFT JOIN plugin_tags ON plugins.id=plugin_tags.plugin_id
      LEFT JOIN tags ON tags.id=plugin_tags.tag_id
  
      WHERE users.id = ${req.params.userID}
      
      GROUP BY plugins.id, tags.name;
    `);
    for (const plugin of results) {
      if (!output[plugin.id]) {
        plugin.imgSrc = getCloudfrontSignedUrl(plugin.imgSrc);
        plugin.tags = [plugin.tag_name];
        output[plugin.id] = plugin;
      } else {
        if (!output[plugin.id].tags.includes(plugin.tag_name)) {
          output[plugin.id].tags.push(plugin.tag_name);
        }
      }
    }
    res.json(Object.values(output));
  } catch (err) {
    res.status(400).send({ err });
  }
};

module.exports.getOneWithRelatedData = async (req, res) => {
  const id = req.params.id;
  const results = await db.query(`
        SELECT

        plugins.name, plugins.description, plugins.longDescription, plugins.downloads, plugins.jarURL, plugins.imgSrc, plugins.date_created,
        users.id AS author_id, users.username AS author_username, users.pfpImgSrc AS author_pfpImgSrc,
        tags.name AS tag_name,
        links.title AS link_title, links.url AS link_url,
        updates.updateList, updates.download AS updateDownload, updates.versionMajor, updates.versionMinor, updates.versionPatch, updates.title AS updateTitle

        FROM plugins
    
        LEFT JOIN plugin_authors ON plugins.id=plugin_authors.plugin_id
        LEFT JOIN users ON users.id=plugin_authors.user_id

        LEFT JOIN links ON plugins.id=links.plugin_id

        LEFT JOIN plugin_tags ON plugins.id=plugin_tags.plugin_id
        LEFT JOIN tags ON tags.id=plugin_tags.tag_id

        LEFT JOIN plugin_updates ON plugins.id=plugin_updates.plugin_id
        LEFT JOIN updates ON updates.id=plugin_updates.update_id

        WHERE plugins.id=${id};
    `);
  for (const result of results) {
    result.imgSrc = getCloudfrontSignedUrl(result.imgSrc);
  }
  return res.json(results);
};

module.exports.createOne = async (req, res) => {
  const userID = res.locals.userID;

  const connection = await mysql.createConnection(config.db);

  try {
    await connection.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
    await connection.beginTransaction();

    const insertPlugin = await connection.query(
      `INSERT INTO plugins (userID, name, description, longDescription, imgSrc, jarURL, vanity_url, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [userID, req.body.title, req.body.summary, req.body.description, req.files.image[0].key, req.files.jar[0].key, req.body.url, req.body.price]
    );

    const pluginID = insertPlugin[0].insertId;

    await connection.query(`INSERT INTO plugin_authors (plugin_id, user_id) VALUES (?, ?);`, [pluginID, userID]);

    if (req.body.tags) {
      const tags = [];
      for (const tag of req.body.tags) tags.push([parseInt(tag), pluginID]);
      await connection.query(`INSERT INTO plugin_tags (tag_id, plugin_id) VALUES ?;`, [tags]);
    }

    if (req.body.versions) {
      const versions = [];
      for (const version of req.body.versions) versions.push([pluginID, parseInt(version)]);
      await connection.query(`INSERT INTO plugin_versions (plugin_id, version_id) VALUES ?;`, [versions]);
    }

    if (req.body.links) {
      const links = [];
      for (const link of Object.values(req.body.links)) links.push([link.title, link.url, pluginID]);
      await connection.query(`INSERT INTO links (title, url, plugin_id) VALUES ?;`, [links]);
    }

    await connection.commit();

    res.send({ vanity_url: req.body.url });
  } catch (err) {
    await connection.rollback();
    console.error(`Error occurred while creating plugin: ${err.message}`, err);
    res.status(400).send({ message: err.message });
  }

  connection.destroy();
};

module.exports.editOne = async (req, res) => {
  try {
    const result = await db.query(`
    UPDATE plugins
    SET name="${req.body.title}",
      description="${req.body.summary}",
      longDescription="${req.body.description}"
      ${req.files.image ? `, imgSrc="${req.files.image[0].key}"` : ""}
    WHERE id=${req.params.id};`);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

module.exports.addDownload = async (req, res) => {
  const id = req.params.id;
  const result = await db.query(`UPDATE plugins SET downloads=downloads+1 WHERE id=${id};`);
  return res.json(result);
};
