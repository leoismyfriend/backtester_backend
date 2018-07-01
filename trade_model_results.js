
var initial_create_order_request = require("./initial_create_order_request")
var long_add_backtest_trade_engine = require("./long_add_backtest_trade_engine")
var long_exit_backtest_trade_engine = require("./long_exit_backtest_trade_engine")
var long_backtest_results = require("./long_backtest_results")

async function trade_model_results(user_input){
    //console.log('hello world')
    const getPrice = (p) => p.price
    console.log('user_input.market_data: ', user_input.market_data)
    console.log("user_input.size: ", user_input.size)
    //console.log('market_data.data[0].price: ', market_data.data[0].price)
    const getPrices = (k) => k.map(getPrice)
    const price_data = await getPrices(user_input.market_data)

    const start_price = price_data[0]
    const target_price = price_data[price_data.length - 1]
    const high_price = Math.max(...price_data)
    const low_price = Math.min(...price_data)

    //2. initialize variables here for set_trade_object () or first trade
    const init_price_headstart = 10
    const init_trade_price = start_price - init_price_headstart
    const init_trade_time = 0

    const trade_info = {}
    trade_info.trade_number = 1
    trade_info.type = 'INITIAL_TRADE'
    trade_info.trade_price = init_trade_price 
    trade_info.time = init_trade_time
    //user input
    trade_info.size = user_input.size

    trade_info.basis = trade_info.trade_price 
    trade_info.profit_protect_price = trade_info.basis 
    trade_info.pnl_chg = 0 
    trade_info.sum_pnl = 0 
    trade_info.profit_protect_pnl_level = trade_info.sum_pnl - trade_info.size * (trade_info.trade_price - trade_info.profit_protect_price)      
    //user input
    trade_info.market_speed = user_input.market_speed
    //user input
    trade_info.volatility = user_input.volatility

    const initial_trade_obj = trade_info 

    //3. create order_request to send to trade_engine
    let order_request = await initial_create_order_request(initial_trade_obj, start_price) 
    await console.log('order_request: ', order_request)
    //4. pass order_request Trade Engine
    let add_backtester_orders = await long_add_backtest_trade_engine(order_request)
    let exit_backtester_orders = await long_exit_backtest_trade_engine(order_request)
    //5. Format Add and Exit Trade Engine Results 
    let initial_order_set = []
    initial_order_set = initial_order_set.concat(add_backtester_orders, exit_backtester_orders)
    //6. pass initial_active_order and remaining market_data into long_backtester(market_data, order_set)
        //a. within backtester, check each new market data price and time for add or exit events
        //b. if add or exit event occurs, create {trades} object and add to trade_record
        //c. run order_request() -> add_backtester_orders -> exit_backtester_orders again
        //d. return trade_record into this test_script.js
    
    let long_add_backtest_trade_engine_results = await long_backtest_results(user_input.market_data, initial_order_set, initial_trade_obj)
    //console.log('')
    //console.log('***************************************************')
    //console.log('long_add_backtest_trade_engine_results: ', long_add_backtest_trade_engine_results)
    //console.log('')
    return long_add_backtest_trade_engine_results
}

module.exports = trade_model_results