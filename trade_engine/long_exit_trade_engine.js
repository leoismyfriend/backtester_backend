//create potential long exit trade orders based on strategy (ie add_offset and time expiration)

//1. determine reference price 
//2. what risk buffer (exit + protect) do you want? 
//3. with that exit_to_protect_buffer, what's the exit price? 
//4. how much to you have to exit? 
//5. what is the add price offset you want this trade to trigger? 

var Strategy = require("./strategy_model").Strategy
var strategy = new Strategy()
var adjust_protect_price_offset = require("./adjust_protect_price_offset")

function long_exit_trade_engine(order_req){
    const long_exit_orders = []    
    // no need to translate order_info into another variable 'wordy'
    const market_price = order_req.trade_price 
    const market_speed = order_req.market_speed 
    const volatility = order_req.volatility
    const size = order_req.size 
    const basis_price = order_req.basis
    const pnl_chg = order_req.pnl_chg
    const profit_protect_price = order_req.profit_protect_price

    //const exit_buffer_expansion = strategy.risk_buffer_expansion_post_exit

    const x = {}
    x.type = 'LONG_EXIT'
    x.current_risk_buffer = market_price - profit_protect_price
    //1. Determine whether profit protect level/price should be adjusted up/closer to market
    x.profit_protect_offset = adjust_protect_price_offset(size, profit_protect_price, basis_price, x.current_risk_buffer, pnl_chg)
    x.profit_protect_price_at_exit_event = profit_protect_price + x.profit_protect_offset
    x.protect_buffer_at_exit_event = Math.floor(strategy.protect_buffer_based_on_market_speed[market_speed] * x.current_risk_buffer)
    x.exit_price = x.profit_protect_price_at_exit_event + x.protect_buffer_at_exit_event
    
    //2. Get next_risk_buffer from current_risk_buffer
    x.risk_buffer_post_exit = get_next_risk_buffer_on_exit(x.protect_buffer_at_exit_event, volatility, strategy.risk_buffer_expansion_post_exit)
    x.post_exit_profit_protect_price = x.exit_price - x.risk_buffer_post_exit    
    x.exit_qty = calcSubSizePerBuffer(size, x.risk_buffer_post_exit, x.protect_buffer_at_exit_event) 

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
    //console.log('Exit_Qty: ', x.exit_qty)
    //console.log('')
        
    return long_exit_orders
}

function get_next_risk_buffer_on_exit(protect_buffer, volatility, risk_buffer_expansion){    
    //filter the vol and return the array (matched_array)
    const matched_array = risk_buffer_expansion.filter((x) => {
    if (x.vol === volatility){
        const expansion_rate_array = x.expansion_rate
        //console.log('expansion rate array: ', expansion_rate_array)
        return expansion_rate_array}
    })

    //console.log('matched_array: ', matched_array)

    const j = matched_array[0].expansion_rate
    for (var i = 0; i <  j.length; i++){
        if (protect_buffer < j[i][0]){
            //console.log('protect_buffer: ', protect_buffer)
            //console.log('j: ', j)
            //console.log('FOUND KEY %s and VALUE %s: ', j[i][0], j[i][1])
            //account for '0' in strategy.js like with [-1, 10]
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

module.exports = long_exit_trade_engine
