//create 'potential' long ADD trade orders based on strategy model(ie add_offset and time expiration)

//1. determine reference price 
//2. what risk buffer (exit + protect) do you want? 
//3. with that exit_to_protect_buffer, what's the exit price? 
//4. how much to you have to exit? 
//5. what is the add price offset you want this trade to trigger? 

var Strategy = require("./strategy_model").Strategy
var strategy = new Strategy()
var adjust_protect_price_offset = require("./adjust_protect_price_offset")

function long_add_trade_engine(order_req){
    const long_add_orders = []

    const market_price = order_req.trade_price 
    const volatility = order_req.volatility 
    const size = order_req.size 
    const basis_price = order_req.basis
    const pnl_chg = order_req.pnl_chg
    const profit_protect_price = order_req.profit_protect_price    
    
    const add_event_risk_buffer_to_next_risk_buffer = strategy.add_event_risk_buffer_to_next_risk_buffer
    const add_offset = strategy.add_offset

    //forEach add_offset in strategy_model.js CREATE a set of potential Add Orders
    const long_add_order_results = add_offset.forEach((addOffset) => {
        const x = {}

        x.type = 'LONG_ADD'
        x.add_price_offset = addOffset[0]
        x.add_time_expire_offset = addOffset[1]

        //step 1a - Determine what the risk_buffer is when ADD occurs
        x.current_risk_buffer = market_price - profit_protect_price
        x.risk_buffer_at_add_event = x.current_risk_buffer + x.add_price_offset
        
        //step 1b - Determine whether profit protect level/price should be adjusted up/closer to market
        x.profit_protect_offset = adjust_protect_price_offset(size, profit_protect_price, basis_price, x.risk_buffer_at_add_event, pnl_chg)
        x.profit_protect_price_at_add_event = profit_protect_price + x.profit_protect_offset
        x.add_price = x.profit_protect_price_at_add_event + x.risk_buffer_at_add_event

        //step 2 - Get next_risk_buffer from current_risk_buffer
        x.post_add_risk_buffer = get_post_add_risk_buffer(x.risk_buffer_at_add_event, volatility, add_event_risk_buffer_to_next_risk_buffer)
        x.add_qty = calcAddSizePerBuffer(size, x.post_add_risk_buffer, x.risk_buffer_at_add_event)

        //step 3 - derive next_protect_buffer
        x.post_add_profit_protect_price = x.add_price - x.post_add_risk_buffer  

        long_add_orders.push(x)
        //console.log('long_add_orders: ', long_add_orders)
        //console.log('x.profit_protect_offset: ', x.profit_protect_offset)
        //console.log('x.profit_protect_price_at_add_event: ', x.profit_protect_price_at_add_event)      
        // console.log('Add_Price: ', x.add_price)
        // console.log('Add_Offset_Price: ', x.add_price_offset)
        // console.log('Add_Offset_Time_Expire: ', x.add_offset_time_expire)
        // console.log('Basis: ', basis_price)
        // console.log('Market_Price: ', market_price)  
        //console.log('Profit_Protect_Price: ', profit_protect_price)
        // console.log('Current_Risk_Buffer: ', x.current_risk_buffer)
        // console.log('Risk_Ruffer @ Add_Event: ', x.risk_buffer_at_add_event)
        // console.log('Post_Add_Risk_Buffer: ', x.post_add_risk_buffer)
        // console.log('Add_Qty: ', x.add_qty)
        //console.log('Post_Add_Profit_Protect_Price: ', x.post_add_profit_protect_price)
    })

    return long_add_orders
}

//Support Functions

// get next_risk_buffer from the risk_buffer_at_add_event where risk_buffer = market_price - profit_protect_price
function get_post_add_risk_buffer(risk_buffer, volatility, add_event_to_next_risk_buffer){
    //filter the vol from event_to_next_risk_buffer and return the matched_array
    const matched_array = add_event_to_next_risk_buffer.filter((x) => {
    if (x.vol === volatility){
        const compression_rate_array = x.compression_rate
        //console.log('compression_rate_array: ', compression_rate_array)
        return compression_rate_array}
    })

    const k = matched_array[0].compression_rate
    //console.log('k: ', k)
    // scan through matched_array to find value
    for (var i = 0; i <  k.length; i++){
        if (risk_buffer < k[i][0]){
            //console.log('FOUND KEY %s and VALUE %s: ', k[i][0], k[i][1])
            return k[i-1][1]}
        }
        return 'No Next Risk Buffer Found from Event Risk Buffer!'
}

//Add Size Logic
function calcAddSizePerBuffer(current_size, new_buffer, old_buffer) {
    const buffer_pct_decrease = 1 - new_buffer/old_buffer;
    const add_size = Math.round(current_size / (1 - buffer_pct_decrease) - current_size);
    return add_size;
}

module.exports = long_add_trade_engine