const mysql = require("mysql2/promise");
const config = require("../config/config");

const query = async (sql, params) => {
    const connection = await mysql.createConnection(config.db);
    const [results, ] = await connection.execute(sql, params);
    connection.destroy();
    return results;
}

module.exports = {
    query
}