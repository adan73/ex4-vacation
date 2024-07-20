dotenv.config()
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConnection = {
    createConnection: () => {
        return mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
    }
};

module.exports = { dbConnection };