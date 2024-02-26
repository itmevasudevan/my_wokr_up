//ExpressJS 
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

//Server Configurations 
const serverConfig = require("./Config/ServerConfig");
const databaseConfig = require("./Config/dbConfig");

const port = process.env.PORT || serverConfig.ServerPort;

//Routers
const session = require("./src/route/session");

// app 
const app = express();


//Database connection status
mongoose
  .connect(databaseConfig.dbURL)
  .then(() => { console.log("Connected to MongoDB"); })
  .catch((err) => { console.error("MongoDB connection error:", err); });


//MIDDLEWARE
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({
	extended: true,
	limit: '10mb',
	parameterLimit: 50000
}));

const measureExecutionTime = (req, res, next) => {
	const start = Date.now();
	res.on('finish', () => { const duration = Date.now() - start; console.log(`${req.method} ${req.originalUrl} - ${duration}ms`); });
	next();
  };
app.use(measureExecutionTime);




//List of APIs
app.use(session);



//public API's for health status
app.get('/', (req, res) =>
	res.json({ message: "Welcome!!!" })
);
app.get('/api/v1/health', (req, res) => {
	res.json({ health: "API Server is up & running." })
});

//Server Status
app.listen(port, () => {
	console.log("Server is up and running on Port:"  + port);
});
