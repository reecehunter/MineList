const db = require("../db/db");

const cache = new Map();

module.exports.getAll = (req, res) => {
    const obj = Object.fromEntries(cache);
    const values = Object.values(obj);
    res.json( values );
}

module.exports.getOne = async (req, res) => {
    const id = req.params.id;
    const data = cache.get(parseInt(id));
    res.json( data );
}

const fetchAll = async () => {
    const result = await db.query(`SELECT * FROM plugins;`);
    for(const plugin of result) {
        cache.set(plugin.id, plugin);
    }
}

// Update cache on start
fetchAll();
// Update the cache every so often
setInterval(() => {
    cache.clear();
    fetchAll();
}, (30 * 60) * 1000);