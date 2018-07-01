'use strict'
var Strategy = require("./strategy_model").Strategy
var set_protect_price_offset = require("./set_profit_protect_price")

//1. determine reference price 
//2. what risk buffer (exit + protect) do you want? 
//3. with that exit_to_protect_buffer, what's the exit price? 
//4. how much to you have to exit? 
//5. what is the add price offset you want this trade to trigger? 

function long_exit_backtest_trade_engine(order_info){
    var strategy = new Strategy()
    //if initial_trade, market_price != order_info.trade_price
    const market_price = order_info.trade_price 

    const market_speed = order_info.market_speed 
    const volatility = order_info.volatility

    const long_exit_orders = []    

    const size = order_info.size 
    const basis_price = order_info.basis
    const pnl_chg = order_info.pnl_chg
    const profit_protect_price = order_info.profit_protect_price

    const buffer_pct_splits = strategy.protect_to_exit_buffer_pct_splits
    const event_to_next_risk_buffer = strategy.event_to_next_risk_buffer
    const exit_buffer_expansion = strategy.exit_buffer_expansion
    const exit_offset = strategy.exit_offset

    //const long_exit_backtest_trade_engine_results = exit_offset.forEach((offset) => {
    //console.log('***********************************************')
    // console.log('LONG EXIT BACKTEST TRADE ENGINE RESULTS()')
    // console.log('')
    // console.log('Trade Number: ', order_info.trade_number)
    // console.log('')

    const x = {}
    x.type = 'LONG_EXIT'
    //x.exit_offset = offset 
    x.current_risk_buffer = market_price - profit_protect_price
    //console.log('current_risk_buffer: ', x.current_risk_buffer)
    //step 1 - Determine whether profit protect level/price should be adjusted up/closer to market
    x.profit_protect_offset = set_protect_price_offset(size, profit_protect_price, basis_price, x.current_risk_buffer, pnl_chg)
    //console.log('***********************************************')

    x.profit_protect_price_at_exit_event = profit_protect_price + x.profit_protect_offset
    //console.log('***********************************************')

    x.protect_buffer = Math.floor(buffer_pct_splits[market_speed][0] * x.current_risk_buffer)
    //console.log('x.proftect_buffer: ', x.protect_buffer)
    //console.log('***********************************************')

    x.exit_price = x.profit_protect_price_at_exit_event + x.protect_buffer
    //console.log('asdfasdf***********************************************')

    //step 2 - Get next_risk_buffer from current_risk_buffer
    x.risk_buffer_post_exit = get_next_risk_buffer_on_exit(x.protect_buffer, volatility, exit_buffer_expansion)
    //console.log('x.risk_buffer_post_exit: ', x.risk_buffer_post_exit)
    //console.log('fsff***********************************************')

    x.post_exit_profit_protect_price = x.exit_price - x.risk_buffer_post_exit    
 
    //console.log('***********************************************')
    x.protect_buffer_post_exit = x.exit_price - x.post_exit_profit_protect_price
    x.exit_qty = calcSubSizePerBuffer(size, x.risk_buffer_post_exit, x.protect_buffer) 

    long_exit_orders.push(x)
    //console.log('x: ', x)
    //console.log('Protect_Buffer: ', x.protect_buffer)
    //console.log('Profit_Protect_Offset: ', x.profit_protect_offset)
    //console.log('Profit_Protect_Price_at_Exit_Event: ', x.profit_protect_price_at_exit_event)              
    //console.log('Market_Price: ', market_price)  
    //console.log('Profit_Protect_Price: ', profit_protect_price)
    //console.log('Current_Risk_Buffer: ', x.current_risk_buffer)
    //console.log('Next_Exit_Price: ', x.exit_price)
    //console.log('Risk_Buffer_Post_Exit: ', x.risk_buffer_post_exit)
    //console.log('Post_Exit_Profit_Protect_Price: ', x.post_exit_profit_protect_price)
    //console.log('Protect_Buffer_Post_Exit: ', x.protect_buffer_post_exit)        
    // console.log('Exit_Qty: ', x.exit_qty)
    // console.log('')
        
    return long_exit_orders
}

//try...catch (error) Negative buffers
function get_next_risk_buffer_on_exit(protect_buffer, volatility, exit_buffer_expansion){
    //console.log('')
    //console.log('Protect_Buffer -> get_next_risk_buffer_on_exit(): ', protect_buffer)
    //console.log('')    
    //filter the vol and return the array (matched_array)
    const matched_array = exit_buffer_expansion.filter((x) => {
    if (x.vol === volatility){
        const expansion_rate_array = x.expansion_rate
        //console.log('expansion rate array: ', expansion_rate_array)
        return expansion_rate_array}
    })

    const j = matched_array[0].expansion_rate
    for (var i = 0; i <  j.length; i++){
        if (protect_buffer < j[i][0]){
            //console.log('FOUND KEY %s and VALUE %s: ', j[i][0], j[i][1])
            return j[i-1][1]}
        }
        
    return 'No Protect Buffer Found!'
}

//Subtract Size Logic
function calcSubSizePerBuffer(current_size, new_buffer, old_buffer) {
    const buffer_expansion_factor = new_buffer / old_buffer;
    const subtract_size = current_size - Math.round(current_size * 1 / buffer_expansion_factor);
    return subtract_size;
}

module.exports = long_exit_backtest_trade_engine