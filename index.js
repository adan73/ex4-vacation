const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const usersData = require('./data/Users.json');

/*
const { postsController } = require('./controllers/postsController.js');
app.use((req, res, next) => {
 res.set({
 'Access-Control-Allow-Origin': '*',
 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
 'Access-Control-Allow-Methods': "GET, POST, PUT, DELETE",
 'Content-Type': 'application/json'
 });
 next();
});

app.get("/posts", async (req, res) => {
    res.status(200).send(await postsController.getPosts());
});
*/
app.get("/Users", (req, res) => {
    res.json(usersData);
   });

app.listen(port);
console.log(`listening on port ${port}`);