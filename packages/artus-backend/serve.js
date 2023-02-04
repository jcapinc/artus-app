const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");

const app = express();

const args = {
  port: process.env.PORT || 8080
};
const argIndex = 2;
while(process.argv[argIndex]) {
  switch(process.argv[argIndex]) {
    case "-p":
    case "--port":
      args.port = process.argv[++argIndex];
      break;
  }
}

app.use(cors());
app.use("/api", proxy("https://api.smsturbo.com"));

app.listen(args.port, () => {
  console.log("Listening on port " + port);
});
