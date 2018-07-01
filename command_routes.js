'use strict'

var express = require("express")
var router = express.Router()
//var Action = require("./command_action_model").Commander_Action
const trade_model_results = require("./trade_model_results")
//var Position = require("./position_model").Position

router.post("/backtest", (req, res, next) => {
    // save the command_action in a separate db from the main
    // document with (name, events w/action_id, position, protect etc..)
        //var action = new Action(req.body)
        console.log('hello form /backtest')
        var price_time_data = req.body
        const handler_response = async() => {
            const response = await trade_model_results(price_time_data)
            await console.log('')
            await console.log('Command Handler Response: ', response)
            await res.json(response)}

        handler_response()})


// router.param("eventID", (req, res, next, id) => {
//     Event.findById(id, (err, doc) => {
//         if(err) return next(err)
//         if(!doc) {
//             err = new Error("Not Found")
//             err.status = 404
//             return next(err)
//         }
//         req.event = doc
//         return next()
//     })
// })

// // logID parameter handler
// router.param("logID", (req, res, next, id) => {
//     // sub document id shortcut return
//     req.logs = req.event.logs.id(id)
//     if(!req.logs) {
//         err = new Error ("Not Found")
//         err.status = 404
//         return next(err)
//     }
//     next()
// })

// // GET /commander_events
// // Route for Logs collection
// router.get("/", (req, res, next) => {
//     Event.find({})
//             .sort({createdAt: -1})
//             .exec((err, events) => {
//                 if(err) return next(err)
//                 res.json(events)
//             })
// })

// POST /commander_events
// Route to create a new object to save Commander Events
// router.post("/", (req, res, next) => {
//     // save the command_action in a separate db from the main
//     // document with (name, events w/action_id, position, protect etc..)
//     var action = new Action(req.body)
//     action.save((err, action) => {
//         if(err) return next(err)
//         res.status(201)
//         console.log('commander_action_id: ', action._id)
//         console.log('action.data: ', action.data)
//         // async/await this handler_response
//         const handler_response = async() => {
//             const response = await command_handler(action)
//             //await console.log('handler response: ', response)
//             await res.json(response)}
        
//         handler_response()
//     })
// })

// GET /orders/:eventID
// Route to retrieve a specific event
// router.get("/:eventID", (req, res, next) => {
//     res.json(req.event)
//     console.log("You sent me a GET request for eventID " + req.params.eventID)
//     })

// // GET /orders/:eventID/logs
// router.get("/:eventID/logs", (req, res, next) => {
//     res.json(req.event.logs)
// })

// POST /orders/:eventID/logs
// Route to add log (events)
// req.order exists from router params preprocess above

// router.post("/:eventID/logs", (req, res, next) => {
//     // save command and process command response
//     req.event.logs.push(req.body)
//     req.event.save((err, event) => {
//         if(err) return next(err)
//             res.status(201)
//             var log_id = event.logs[event.logs.length-1]._id
//             var event_id = event._id
//             var event_log_body = event.logs[req.event.logs.length-1]
//             // Process Command Response via command_handler()
//             var strategy_add_orders = command_handler(event_log_body.event_name, event_log_body, log_id, event_id)
//             res.json({"Event_id": event_id,
//                       "Create Order Log_ID": log_id, 
//                       "Order(s) Created": strategy_add_orders})
//         })
//     })

// GET /orders/:eventID/logs/logID
// Route to retrieve a specific log in a specific event
// router.get("/:eventID/logs/:logID", (req, res, next) => {
//     res.json(req.logs)
//     console.log("You sent me a GET request for logID: " + req.params.logID)
// })

module.exports = router