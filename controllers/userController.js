const UserData = require('../data/Users.json');

const getUser = (req, res) => {
    res.json(UserData);
};

module.exports = { getUser };