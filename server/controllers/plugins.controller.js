const db = require("../db/db");
const mysql = require("mysql2/promise");
const config = require("../config/config");

const cache = new Map();

module.exports.getAll = (req, res) => {
  const obj = Object.fromEntries(cache);
  const values = Object.values(obj);
  res.json(values);
};

module.exports.getOne = async (req, res) => {
  const id = req.params.id;
  const data = cache.get(parseInt(id));
  res.json(data);
};

module.exports.getAllByUserID = async (req, res) => {
  const userID = parseInt(req.params.userID);
  const output = [];
  for (const plugin of cache.values()) {
    if (plugin.userID === userID) output.push(plugin);
  }
  res.json(output);
};

const fetchAll = async () => {
  const result = await db.query(`
    SELECT
    COUNT(plugin_followers.plugin_id) AS followers, plugins.*, users.username
    FROM plugins
    LEFT JOIN users ON users.id = plugins.userID
    LEFT JOIN plugin_followers ON plugin_followers.plugin_id = plugins.id
    GROUP BY plugins.id;
  `);
  for (const plugin of result) {
    cache.set(plugin.id, plugin);
  }
};

module.exports.createOne = async (req, res) => {
  const userID = res.locals.userID;

  const connection = await mysql.createConnection(config.db);
  await connection.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
  await connection.beginTransaction();

  try {
    const insertPlugin = await connection.query(
      `INSERT INTO plugins (userID, name, description, longDescription, imgSrc, vanity_url)
      VALUES (?, ?, ?, ?, ?, ?);`,
      [userID, req.body.title, req.body.summary, req.body.description, req.body.image, req.body.url]
    );

    const pluginID = insertPlugin[0].insertId;

    const tags = [];
    for (const tag of req.body.tags) tags.push([parseInt(tag), pluginID]);
    const insertTags = await connection.query(`INSERT INTO plugin_tags (tag_id, plugin_id) VALUES ?;`, [tags]);

    const versions = [];
    for (const version of req.body.versions) versions.push([pluginID, parseInt(version)]);
    const insertVersions = await connection.query(`INSERT INTO plugin_versions (plugin_id, version_id) VALUES ?;`, [versions]);

    const links = [];
    for (const link of Object.values(req.body.links)) links.push([link.title, link.url]);
    const insertLinks = await connection.query(`INSERT INTO links (title, url) VALUES ?;`, [links]);
    console.log(insertLinks);

    await connection.commit();
    res.send("Success");
  } catch (err) {
    await connection.rollback();
    console.error(`Error occurred while creating plugin: ${err.message}`, err);
    res.status(400).send({ err });
  }

  connection.destroy();
};

module.exports.addView = async (req, res) => {
  const id = req.params.id;
  const result = await db.query(`UPDATE plugins SET views=views+1 WHERE id=${id};`);
  return res.json(result);
};

module.exports.addDownload = async (req, res) => {
  const id = req.params.id;
  const result = await db.query(`UPDATE plugins SET downloads=downloads+1 WHERE id=${id};`);
  return res.json(result);
};

// Update cache on start
fetchAll();
// Update the cache every so often
setInterval(() => {
  cache.clear();
  fetchAll();
}, 30 * 60 * 1000);
