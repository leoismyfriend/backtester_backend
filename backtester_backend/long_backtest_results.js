//1. pass initial_active_order and remaining market_data into long_backtester(market_data, order_set)
//2. within backtester, check each new market data price and time for add or exit events
//3. if add or exit event occurs, create {trades} object and add to trade_record
//4. run order_request() -> add_backtester_orders -> exit_backtester_orders again
//5. return entire trade_record 

var trade_logic_qualification = require("./trade_logic_qualification")
var set_add_or_exit_trade_object = require("./set_add_or_exit_trade_object")
var create_order_request = require("./create_order_request")
var long_add_trade_engine = require("./long_add_trade_engine")
var long_exit_backtest_trade_engine = require("./long_exit_trade_engine")

async function long_backtest_results(data, initial_orders_set, initial_trade_object){
    //console.log('')
    //console.log('LONG_BACKTEST_RESULTS')
    //console.log('')

    let filled_trades = []
    let active_orders_set = []
    let trade_obj = {}
    let order_request = {}
    let add_backtester_orders = []
    let exit_backtester_orders = []
    let matched_order_result = {}

    filled_trades.push(initial_trade_object)
    active_orders_set = initial_orders_set

    for (var i = 1; i < data.length; i++){
        const current_price = data[i].price
        const current_time = data[i].time
        const time_exp = data[i].time - data[i-1].time

        // this is where the actual trade orders get checked vs price/time data to see if a trade 'could' be made
        // most matched_order_result will be 'No Matched Order'

        matched_order_result = trade_logic_qualification(current_price, time_exp, active_orders_set)
        //console.log('i %s for data[i]: ', i, data[i])

        // 'LONG_ADD' or 'LONG_EXIT' trade event occured
        if (matched_order_result != 'No Matched Order'){
            //console.log('filled_trades: ', filled_trades)
            trade_obj = set_add_or_exit_trade_object(filled_trades, current_time, matched_order_result)
            //console.log('')
            //console.log('Trade Occured: ', trade_obj)
            //console.log('')
            //console.log('matched_order_result: ', matched_order_result)

            filled_trades.push(trade_obj)
            
            order_request = await create_order_request(trade_obj)
            add_backtester_orders = await long_add_trade_engine(order_request)
            exit_backtester_orders = await long_exit_trade_engine(order_request)
            active_orders_set = []
            active_orders_set = active_orders_set.concat(add_backtester_orders, exit_backtester_orders)
        }
    }

    return filled_trades
}

function print_backtest_event_status(type, trade_number, qty, trade_price){
    console.log('Trade Type: ', type)
    console.log('')                
    console.log('Trade Number %s: Added Qty %s at Price %s: ', trade_number, qty, trade_price)
}

module.exports = long_backtest_results
