'use strict'

var express = require('express')
var app = express()
var command_routes = require("./command_routes")
var jsonParser = require("body-parser").json
var logger = require('morgan')

app.use(logger("dev"))
app.use(jsonParser());

// var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/command_events");

// var commander_events_db = mongoose.connection;

// commander_events_db.on("error", (err) => {
// 	console.error("connection error:", err);
// });

// commander_events_db.once("open", () => {
// 	console.log("commander_events_db connection successful");
// })

app.use("/", command_routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error("Not Found")
    err.status = 404
    next(err)
})

// Error Handler for 500 errors
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: {
            message: err.message
        }
    })
})

var port = process.env.PORT || 3001
app.listen(port, () => console.log('Express server w/ commander_events_db is listening on port', port)) 
