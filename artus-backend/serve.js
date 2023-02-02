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

import("node-fetch").then(async (fetch) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "jeffs.linux@gmail.com",
      password: "Cw6$4*kLF9",
      customerNumber: "0002",
      rememberMe: true,
    }),
  };

  try {
    const result = await fetch.default(
      "https://api.smsturbo.com/authenticate",
      options
    );
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});
