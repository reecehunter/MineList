const axios = require("axios");

const cache = new Map();

module.exports.getStatus = async (req, res) => {
    const ip = req.params.ip;
    let result = cache.get(ip);
    if(!result) result = await fetchStatus(ip);
    return res.json( result.data );
}

const fetchStatus = async (ip) => {
    const result = await axios.get(`https://api.mcsrvstat.us/3/${ip}`);
    cache.set(ip, result);
    return result;
}

// Clear the cache every so often
setInterval(() => {
    cache.clear();
}, (30 * 60) * 1000);