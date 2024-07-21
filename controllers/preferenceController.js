const { dbConnection } = require('../modules/db');
const { tripType } = require('../data/trip_type.json');
const { trip_destinations } = require('../data/trip_destination.json');


function checkPreferenceData(res, start_date, end_date, vacationType, destination) {
    if (isNaN(Date.parse(start_date)) || isNaN(Date.parse(end_date))) {
        return res.status(400).json({ error: "incorrect start date or end date format, try again", format: "YYYY/MM/DD" });
    }
    if (Date.parse(start_date) > Date.parse(end_date)) {
        return res.status(400).send("can't put the end date before the start");
    }
    if ((Date.parse(end_date) - Date.parse(start_date)) / (1000 * 60 * 60 * 24) > 7) {
        return res.status(400).send("the vacation length should be less than a week, change the date");
    }
    if (!tripType.includes(vacationType)) {
        return res.status(400).json({ error: "invalid vacation type, try again", "vacation-type": tripType });
    }
    if (!trip_destinations.includes(destination)) {
        return res.status(400).json({ error: "invalid destination, try again", "vacation-destination": trip_destinations });
    }
    return false;
}

async function userHasExistingPreference(connection, userId) {
    const [rows] = await connection.execute(
        `SELECT * FROM dbShnkr24stud.tbl_49_preferences WHERE userId = ?`,
        [userId]
    );
    return rows.length > 0;
}
async function userPreferenceExisting(connection, userId) {
    const [rows] = await connection.execute(
        `SELECT * FROM dbShnkr24stud.tbl_49_preferences WHERE userId = ?`,
        [userId]
    );
    return rows.length === 0;
}

exports.preferenceController = {
    async addPreference(req, res) {
        const { username, userPassword } = req.body;

        if (!username || !userPassword) {
            return res.status(400).json({ error: "need to insert a username and password" });
        }

        const { accessToken, start_date, end_date, destination, vacationType } = req.body;

        if (!accessToken || !start_date || !end_date || !destination || !vacationType) {
            return res.status(400).json({ error: "something wrong, please check what you insert again" });
        }
        if (checkPreferenceData(res, start_date, end_date, vacationType, destination)) {
            return;
        }

        const connection = await dbConnection.createConnection();
        try {
            let [rows] = await connection.execute(`SELECT * FROM dbShnkr24stud.tbl_49_users WHERE accessToken = '${accessToken}'`);
            if (rows.length === 0) {
                return res.status(404).send("User not found, try again");
            }

            const userId = rows[0].id;
            if (await userHasExistingPreference(connection, userId)) {
                return res.status(400).json({ error: "Preference already exists for this user" });
            }
            const [result] = await connection.execute(
                `INSERT INTO dbShnkr24stud.tbl_49_preferences (userId, start_date, end_date, destination, vacationType) VALUES ('${userId}', '${start_date}', '${end_date}', '${destination}', '${vacationType}')`,
            );
            if (result.affectedRows !== 0) {
                res.status(200).json({ message: "Preference added successfully" });
            }
        } catch (err) {
            await connection.rollback();
            console.error('Error inserting data into the database:', err.message);
            res.status(500).json({ error: "Error inserting data into the database" });
        } finally {
            connection.end();
        }
    },

    async updatePreference(req, res) {
        const { username, userPassword } = req.body;

        if (!username || !userPassword) {
            return res.status(400).json({ error: "need to insert a username and password" });
        }

        const { accessToken, start_date, end_date, destination, vacationType } = req.body;

        if (!accessToken || !start_date || !end_date || !destination || !vacationType) {
            return res.status(400).json({ error: "something wrong, please check what you insert again" });
        }
        if (checkPreferenceData(res, start_date, end_date, vacationType, destination)) {
            return;
        }

        const connection = await dbConnection.createConnection();
        try {
            let [rows] = await connection.execute(`SELECT * FROM dbShnkr24stud.tbl_49_users WHERE accessToken ='${accessToken}'`);
            if (rows.length === 0) {
                return res.status(404).send("User not found, try again");
            }

            const userId = rows[0].id;
            if (await userPreferenceExisting(connection, userId)) {
                return res.status(400).json({ error: "user don't have a vacation preference" });
            }
            const [result] = await connection.execute(`UPDATE dbShnkr24stud.tbl_49_preferences SET start_date='${start_date}', end_date='${end_date}', destination='${destination}', vacationType='${vacationType}' WHERE userId='${userId}'`);
            if (result.affectedRows !== 0) {
                res.status(200).json({ message: "Preference update successfully" });
            }
        } catch (err) {
            await connection.rollback();
            console.error('Error inserting data into the database:', err.message);
            res.status(500).json({ error: "Error inserting data into the database" });
        } finally {
            connection.end();
        }
    },

    
    async deletePreference(req, res) {
        const { username, userPassword, accessToken, start_date, end_date, destination, vacationType } = req.body;

        if (!username || !userPassword) {
            return res.status(400).json({ error: "need to insert a username and password" });
        }

        if (!accessToken || !start_date || !end_date || !destination || !vacationType) {
            return res.status(400).json({ error: "something wrong, please check what you insert again" });
        }
        if (checkPreferenceData(res, start_date, end_date, vacationType, destination)) {
            return;
        }

        const connection = await dbConnection.createConnection();
        try {
            let [rows] = await connection.execute(`SELECT * FROM dbShnkr24stud.tbl_49_users WHERE accessToken = '${accessToken}'`);
            if (rows.length === 0) {
                return res.status(404).send("User not found, try again");
            }

            const userId = rows[0].id;
            if (!(await userHasExistingPreference(connection, userId))) {
                return res.status(400).json({ error: "user doesn't have a vacation preference" });
            }

            const [result] = await connection.execute( `DELETE FROM dbShnkr24stud.tbl_49_preferences WHERE userId = '${userId}'`);

            if (result.affectedRows !== 0) {
                res.status(200).json({ message: "Preference deleted successfully" });
            } else {
                res.status(400).json({ error: "Failed to delete preference" });
            }
        } catch (err) {
            console.error('Error deleting data from the database:', err.message);
            res.status(500).json({ error: "Error deleting data from the database" });
        } finally {
            connection.end();
        }
    },

    async getAllPreference(req, res) {
        const connection = await dbConnection.createConnection();
        try {
            const [rows] = await connection.execute(`SELECT * FROM dbShnkr24stud.tbl_49_preferences`);
            if (rows.length === 0) {
                return res.status(404).json({ error: "No preferences found" });
            }
            res.status(200).json(rows);
        } catch (err) {
            res.status(500).json({ error: "Error retrieving data from the database" });
        } finally {
            connection.end();
        }
    },

    async getSpecificPreference(req, res) {
        const connection = await dbConnection.createConnection();
        try {
            const {username} = req.body;
            const [user] = await connection.execute(`SELECT * FROM dbShnkr24stud.tbl_49_users WHERE username = '${username}'`);
            if(user.length === 0)
               return res.status(400).json({ error: "User not found" });
            const [row] = await connection.execute(`SELECT * FROM dbShnkr24stud.tbl_49_preferences WHERE userId = ${user[0].id}`);
            if(row.length === 0)
                return res.status(400).json({ error: "User doesn't have a preference" });
            
            res.status(200).json(row);
            await connection.end();
        } catch (err) {
            res.status(500).json({ error: "Error inserting data from the database" });
        } finally {
            connection.end();
        }
    },
    async getPreferenceResult(req, res) {
        const connection = await dbConnection.createConnection();
        try {
            const [row] = await connection.execute(`SELECT * FROM dbShnkr24stud.tbl_49_preferences`);
            if(row.length < 5)
                return res.status(400).json({ error: "we dont have the 5 users preferences" });
            

            const [destinationRows] = await connection.execute(`
                SELECT destination, COUNT(destination) AS destination_count 
                FROM dbShnkr24stud.tbl_49_preferences 
                GROUP BY destination 
                ORDER BY destination_count DESC, id ASC 
                LIMIT 1
            `);
            const vacationDestination = destinationRows[0].destination;
    
            const [typeRows] = await connection.execute(`
                SELECT vacationType, COUNT(vacationType) AS type_count 
                FROM dbShnkr24stud.tbl_49_preferences 
                GROUP BY vacationType 
                ORDER BY type_count DESC, id ASC 
                LIMIT 1
            `);
            const vacationType = typeRows[0].vacationType;
    
            const [startDateRows] = await connection.execute(`
                SELECT start_date 
                FROM dbShnkr24stud.tbl_49_preferences 
                ORDER BY start_date DESC 
                LIMIT 1
            `);
            const startDate = startDateRows[0].start_date;
    
            const [endDateRows] = await connection.execute(`
                SELECT end_date 
                FROM dbShnkr24stud.tbl_49_preferences 
                ORDER BY end_date ASC 
                LIMIT 1
            `);
            const endDate = endDateRows[0].end_date;
    
            const duration = (Date.parse(endDate) - Date.parse(startDate)) / (1000 * 60 * 60 * 24);
            if (duration > 7 || duration < 0) {
                return res.status(400).json({ error: "There is no suitable vacation date for everyone" });
            }
    
            res.status(200).json({message: "Vacation final Result are:", destination: vacationDestination,
                "vacation-type": vacationType,"start-date": startDate,"end-date": endDate
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        } finally {
            await connection.end();
        }
    }



};
