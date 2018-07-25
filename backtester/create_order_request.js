//uses trade_info (from filled trade) to format an order request to send to add/exit_trade_engines
function createOrderRequest(trade_info){
    const order_info = {}

    order_info.trade_price = trade_info.trade_price
    order_info.basis = trade_info.basis
    order_info.trade_number = trade_info.trade_number
    order_info.profit_protect_price = trade_info.profit_protect_price
    order_info.size = trade_info.size
    order_info.pnl_chg = trade_info.pnl_chg
    order_info.market_speed = trade_info.market_speed
    order_info.volatility = trade_info.volatility

    //console.log('')
    //console.log('order_info: ', order_info)
    //console.log('')

    return order_info
}

module.exports = createOrderRequest
