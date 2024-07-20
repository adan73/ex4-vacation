const fs = require('fs');
const path = require('path');
const { dbConnection } = require('../modules/db');
const crypto = require('crypto');
const { error } = require('console');

const addUser = async (req, res) => {
    console.log('Request body:', req.body); 

    const { username, userPassword } = req.body;

    if (!username || !userPassword) {
        return res.status(400).json({error:"need to insert a username and password"});
    }

    try {
        const dataPath = path.join(__dirname, '../data', 'Users.json');
        let jsonData = fs.readFileSync(dataPath, 'utf8');
        let users = JSON.parse(jsonData).user;
        if (users.find(user => user.username === username)) {
            return res.status(400).json({error:"this username already exist"});
        }
        const accessToken = crypto.randomBytes(10).toString('hex');
        const id = (users.length + 1).toString();
        users.push({ id, username, userPassword, accessToken });
        fs.writeFileSync(dataPath, JSON.stringify({ user: users }, null, 2));

        const query = 'INSERT INTO dbShnkr24stud.tbl_49_users (id, username, userPassword, accessToken) VALUES (?, ?, ?, ?)';

        const connection = await dbConnection.createConnection();

            await connection.beginTransaction();
            await connection.execute(query, [id, username, userPassword, accessToken]);
            await connection.commit();
            res.status(200).json({error:"User added successfully"});

        } 
        catch (error) {
            res.status(500).json({error: error.message});
            await connection.end();
        } 
    
};

module.exports = { addUser };
