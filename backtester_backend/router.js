'use strict'
var express = require("express")
var router = express.Router()
const trade_model_results = require("./trade_model_results")

// initialize backtester
router.post("/backtest", (req, res, next) => {
        var client_data = req.body
        const handler_response = async() => {
            const response = await trade_model_results(client_data)
            await console.log('')
            await console.log('Command Handler Response: ', response)
            await res.json(response)}

        handler_response()
    })

module.exports = router