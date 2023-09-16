const db = require("../db/db");

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
  console.log(req.body);
  return res.json({ hi: "hi" });
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
