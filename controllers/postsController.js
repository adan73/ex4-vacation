const { dbConnection } = require('../models/db');

exports.postsController = {
    // GET localhost:8081/posts
    async getPosts() {
        const connection = await dbConnection.createConnection();
        const [rows] = await connection.execute('SELECT * from dbShnkr24stud.tbl_49_users');
        connection.end();
        return rows;
    }
};