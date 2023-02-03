const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use("/api", proxy("https://api.smsturbo.com"));

app.listen(port, () => {
  console.log("Listening on port " + port);
});
