const express = require("express");

const app = express();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`your server is conncted to prot ${port}`);
});
 