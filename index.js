// index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8080;
const usersData = require('./data/Users.json');
const userRoutes = require('./routes/userRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.set('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE");
    res.set('Content-Type', 'application/json');
    next();
});

app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/preferences', preferenceRoutes);

app.get("/Users", (req, res) => {
    res.json(usersData);
});

app.get('/test', (req, res) => {
    res.send('Server is working!');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
