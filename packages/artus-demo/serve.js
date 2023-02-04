#!/usr/bin/env node
// const express = require("express");
// const proxy = require("express-http-proxy");
// const cors = require("cors");
import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";


const app = express();

const args = {
  port: process.env.PORT || 8080
};
let argIndex = 2;
while(process.argv[argIndex]) {
  switch(process.argv[argIndex]) {
    case "-p":
    case "--port":
      args.port = process.argv[++argIndex];
      break;
  }
  argIndex++;
}

app.use(cors());
app.use(express.static("dist"));
app.use("/api", proxy("https://api.smsturbo.com"));

app.listen(args.port, () => {
  console.log("Listening on port " + args.port);
});
