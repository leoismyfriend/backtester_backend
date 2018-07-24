'use strict'
// entry point for app via command_routes (cqrs)
var express = require('express')
var app = express()
var command_routes = require("./router")
var jsonParser = require("body-parser").json
var logger = require('morgan')

app.use(logger("dev"))
app.use(jsonParser());
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
