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
    tags.name AS tag_name,
    versions.name AS version_name,
    platforms.name AS platform_name
    FROM plugins
    
    LEFT JOIN users ON users.id = plugins.userID
    
    LEFT JOIN plugin_followers ON plugin_followers.plugin_id = plugins.id
    
    LEFT JOIN plugin_tags ON plugins.id=plugin_tags.plugin_id
    LEFT JOIN tags ON tags.id=plugin_tags.tag_id
    
    LEFT JOIN plugin_versions ON plugins.id=plugin_versions.plugin_id
    LEFT JOIN versions ON versions.id=plugin_versions.version_id
    
    LEFT JOIN plugin_platforms ON plugins.id=plugin_platforms.plugin_id
    LEFT JOIN platforms ON platforms.id=plugin_platforms.platform_id
    
    GROUP BY plugins.id, tags.name, versions.name, platforms.name;
  `);
  for (const plugin of results) {
    if (!output[plugin.id]) {
      plugin.imgSrc = getCloudfrontSignedUrl(plugin.imgSrc);
      plugin.tags = [plugin.tag_name];
      plugin.versions = [plugin.version_name];
      plugin.platforms = [plugin.platform_name];
      output[plugin.id] = plugin;
    } else {
      if (!output[plugin.id].tags.includes(plugin.tag_name)) {
        output[plugin.id].tags.push(plugin.tag_name);
      }
      if (!output[plugin.id].versions.includes(plugin.version_name)) {
        output[plugin.id].versions.push(plugin.version_name);
      }
      if (!output[plugin.id].platforms.includes(plugin.platform_name)) {
        output[plugin.id].platforms.push(plugin.platform_name);
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
  const results = await db.query(`
        SELECT

        plugins.id, plugins.name, plugins.description, plugins.longDescription, plugins.downloads, plugins.jarURL, plugins.imgSrc, plugins.date_created,
        users.id AS author_id, users.username AS author_username, users.pfpImgSrc AS author_pfpImgSrc,
        tags.name AS tag_name,
        links.title AS link_title, links.url AS link_url,
        versions.name AS version_name,
        platforms.name AS platform_name,
        updates.updateList, updates.download AS updateDownload, updates.versionMajor, updates.versionMinor, updates.versionPatch, updates.title AS updateTitle

        FROM plugins
    
        LEFT JOIN plugin_authors ON plugins.id=plugin_authors.plugin_id
        LEFT JOIN users ON users.id=plugin_authors.user_id

        LEFT JOIN links ON plugins.id=links.plugin_id

        LEFT JOIN plugin_tags ON plugins.id=plugin_tags.plugin_id
        LEFT JOIN tags ON tags.id=plugin_tags.tag_id

        LEFT JOIN plugin_updates ON plugins.id=plugin_updates.plugin_id
        LEFT JOIN updates ON updates.id=plugin_updates.update_id
    
        LEFT JOIN plugin_versions ON plugins.id=plugin_versions.plugin_id
        LEFT JOIN versions ON versions.id=plugin_versions.version_id
    
        LEFT JOIN plugin_platforms ON plugins.id=plugin_platforms.plugin_id
        LEFT JOIN platforms ON platforms.id=plugin_platforms.platform_id

        WHERE plugins.vanity_url="${req.params.vanityURL}";
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

    if (req.body.platforms) {
      const platforms = [];
      for (const platform of req.body.platforms) platforms.push([pluginID, parseInt(platform)]);
      await connection.query(`INSERT INTO plugin_platforms (plugin_id, platform_id) VALUES ?;`, [platforms]);
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
  const connection = await mysql.createConnection(config.db);

  try {
    await connection.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
    await connection.beginTransaction();

    // Update the plugin
    if (req.files.image) {
      await connection.query("UPDATE plugins SET name=?, description=?, longDescription=?, imgSrc=? WHERE id=?;", [
        req.body.title,
        req.body.summary,
        req.body.description,
        req.files.image[0].key,
        req.params.id,
      ]);
    } else {
      await connection.query("UPDATE plugins SET name=?, description=?, longDescription=? WHERE vanity_url=?;", [req.body.title, req.body.summary, req.body.description, req.params.id]);
    }

    // Update the plugin tags
    if (req.body.tags) {
      const tags = [];
      for (const tag of req.body.tags) tags.push([parseInt(tag) + 1, req.params.id]);
      await connection.query(`DELETE FROM plugin_tags WHERE plugin_id=?;`, [req.params.id]);
      await connection.query(`INSERT IGNORE INTO plugin_tags (tag_id, plugin_id) VALUES ?;`, [tags]);
    }

    // Update the plugin platforms
    if (req.body.platforms) {
      const platforms = [];
      for (const platform of req.body.platforms) platforms.push([req.params.id, parseInt(platform) + 1]);
      await connection.query(`DELETE FROM plugin_platforms WHERE plugin_id=?;`, [req.params.id]);
      await connection.query(`INSERT IGNORE INTO plugin_platforms (plugin_id, platform_id) VALUES ?;`, [platforms]);
    }

    // Update the plugin versions
    if (req.body.versions) {
      const versions = [];
      for (const version of req.body.versions) versions.push([req.params.id, parseInt(version) + 1]);
      await connection.query(`DELETE FROM plugin_versions WHERE plugin_id=?;`, [req.params.id]);
      await connection.query(`INSERT IGNORE INTO plugin_versions (plugin_id, version_id) VALUES ?;`, [versions]);
    }

    // Update the plugin links
    if (req.body.links) {
      const links = [];
      for (const link of req.body.links) links.push([link.title, link.url, req.params.id]);
      await connection.query(`DELETE FROM links WHERE plugin_id=?;`, [req.params.id]);
      await connection.query(`INSERT INTO links (title, url, plugin_id) VALUES ?;`, [links]);
    }

    await connection.commit();

    return res.json("ok");
  } catch (err) {
    await connection.rollback();
    console.error(`Error occurred while updating plugin: ${err.message}`, err);
    res.status(500).send({ message: err.message });
  }
};

module.exports.addDownload = async (req, res) => {
  const id = req.params.id;
  const result = await db.query(`UPDATE plugins SET downloads=downloads+1 WHERE id=${id};`);
  return res.json(result);
};
