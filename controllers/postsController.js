const { dbConnection } = require('../modules/db');

exports.postsController = {
    async getPosts() {
        const connection = await dbConnection.createConnection();
        const [rows] = await connection.execute('SELECT * FROM dbShnkr24stud.tbl_49_users');
        connection.end();
        return rows;
    }
};
