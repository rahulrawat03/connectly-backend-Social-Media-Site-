const app = require("express")();
const dotenv = require("dotenv");
const database = require("./start/database");
const routes = require("./start/routes");
const socket = require("./start/socket");

dotenv.config();
database();
routes(app);
socket(app);
