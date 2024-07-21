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
            let [rows] = await connection.execute(`SELECT * FROM dbShnkr24stud.tbl_49_users WHERE accessToken = ?`, [accessToken]);
            if (rows.length === 0) {
                return res.status(404).send("User not found, try again");
            }

            const userId = rows[0].id;
            if (await userHasExistingPreference(connection, userId)) {
                return res.status(400).json({ error: "Preference already exists for this user" });
            }
            const [result] = await connection.execute(
                `INSERT INTO dbShnkr24stud.tbl_49_preferences (userId, start_date, end_date, destination, vacationType) VALUES (?, ?, ?, ?, ?)`,
                [userId, start_date, end_date, destination, vacationType]
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
            let [rows] = await connection.execute(`SELECT * FROM dbShnkr24stud.tbl_49_users WHERE accessToken = ?`, [accessToken]);
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
    }
};
