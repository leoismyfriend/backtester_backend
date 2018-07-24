async function set_initial_trade_object(user_input){
    //1. get start_price from client pricing data
    const getPrice = (p) => p.price
    const getPrices = (k) => k.map(getPrice)
    const price_data = getPrices(user_input.market_data)
    const start_price = price_data[0]

    //2. initialize variables here for set_trade_object () or first trade
    const trade_info = {}
    trade_info.trade_number = 1
    trade_info.type = 'INITIAL_TRADE'
    trade_info.trade_price = start_price 
    trade_info.time = 0
    trade_info.size = user_input.size
    trade_info.basis = trade_info.trade_price 
    trade_info.profit_protect_price = trade_info.basis - user_input.profit_protect_price_offset
    trade_info.pnl_chg = 0 
    trade_info.sum_pnl = 0 
    trade_info.profit_protect_pnl_level = trade_info.sum_pnl - trade_info.size * (trade_info.trade_price - trade_info.profit_protect_price)      
    trade_info.market_speed = user_input.market_speed
    trade_info.volatility = user_input.volatility

    //pass initial trade_info on to create_order_request(trade_info)
    return trade_info 
}

module.exports = set_initial_trade_object