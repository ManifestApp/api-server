const { Pool } = require("pg");

let activePool;

exports.initialize = () => {
    let options;
    if (process.env.DATABASE_URL) {
        console.info("[Database] Found DATABASE_URL, using it to setup database connection.");
        options = { connectionString: process.env.DATABASE_URL };
    }
    activePool = new Pool(options);
};

exports.pool = () => activePool;