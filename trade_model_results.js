// Accept user_input/client data for initialization into backtester
// Takes the price and time data and user input (INPUT) -> creates initial_order_request -> places it into the trade_engine -> processes add(s)/exit(s) trade orders
// return final filled trades if they meet strategy requirements
var long_add_trade_engine = require("./long_add_trade_engine")
var long_exit_trade_engine = require("./long_exit_trade_engine")

var set_initial_trade_object = require("./set_initial_trade_object")
var create_order_request = require("./create_order_request")
var long_backtest_results = require("./long_backtest_results")

async function trade_model_results(user_input){
    //1. initialize variables here for set_trade_object () or first trade
    const initial_trade_info_obj = await set_initial_trade_object(user_input)
    //2. create order_request to send to trade_engine
    let order_request = await create_order_request(initial_trade_info_obj)
    //3. pass order_request Trade Engine
    let add_backtester_orders = await long_add_trade_engine(order_request)
    let exit_backtester_orders = await long_exit_trade_engine(order_request)
    //4. Combine and Format Add and Exit Trade Engine Results 
    let initial_order_set = []
    initial_order_set = initial_order_set.concat(add_backtester_orders, exit_backtester_orders)
    //5. get backtester results after initialization
    let backtester_results = await long_backtest_results(user_input.market_data, initial_order_set, initial_trade_info_obj)

    return backtester_results
}

module.exports = trade_model_results