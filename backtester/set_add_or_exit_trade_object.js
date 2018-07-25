//trade_qualifications met
//create trade record object for filled trades

function set_add_or_exit_trade_object (trade_record, current_time, active_order) {
    let last_trade = trade_record[trade_record.length - 1]
    const type = active_order.type

    let trades = {}

    if (type == 'LONG_ADD'){
        trades.type = active_order.type
        trades.trade_number = last_trade.trade_number + 1
        trades.trade_price = active_order.add_price 
        trades.trade_time = current_time
        trades.add_qty = active_order.add_qty
        trades.size = last_trade.size + trades.add_qty
        trades.profit_protect_price = active_order.post_add_profit_protect_price 

        trades.pnl_chg = set_pnl_chg(trades.trade_number, trades.trade_price, last_trade.basis, last_trade.size, last_trade.trade_price)
        trades.sum_pnl = set_sum_pnl(last_trade.sum_pnl, trades.pnl_chg)
        trades.basis = set_basis_price(trades.size, trades.trade_price, trades.sum_pnl)
        trades.profit_protect_pnl_level = set_profit_protect_pnl_level(trades.sum_pnl, trades.size, trades.trade_price, trades.profit_protect_price)            
        
        trades.market_speed = 4 //TEMP: get_market_speed()
        trades.volatility = 'med' //TEMP: get_market_volatility()

    } else if (type == 'LONG_EXIT'){
        trades.type = active_order.type
        trades.trade_number = last_trade.trade_number + 1
        trades.trade_price = active_order.exit_price 
        trades.exit_qty = active_order.exit_qty
        trades.size = last_trade.size - trades.exit_qty
        trades.profit_protect_price = active_order.post_exit_profit_protect_price 

        trades.pnl_chg = set_pnl_chg(trades.trade_number, trades.trade_price, last_trade.basis, last_trade.size, last_trade.trade_price)
        trades.sum_pnl = set_sum_pnl(last_trade.sum_pnl, trades.pnl_chg)
        trades.basis = set_basis_price(trades.size, trades.trade_price, trades.sum_pnl)
        trades.profit_protect_pnl_level = set_profit_protect_pnl_level(trades.sum_pnl, trades.size, trades.trade_price, trades.profit_protect_price)            

        trades.market_speed = 4 //TEMP: get_market_speed() from client
        trades.volatility = 'med' //TEMP: get_market_volatility() from client
    }
    return trades
}

function set_profit_protect_pnl_level(sum_pnl, size, trade_price, profit_protect_price){
    return sum_pnl - size * (trade_price - profit_protect_price)
}

function set_pnl_chg (trade_number, current_price, prev_basis, prev_size, prev_trade_price){
    if (trade_number == 1){
        return (current_price - prev_basis) * prev_size}
    else if (trade_number > 1){
        return (current_price - prev_trade_price) * prev_size}
    else 
        return 'ERROR'
}

function set_sum_pnl(sum_pnl, pnl_chg){
    return sum_pnl + pnl_chg
}

function set_basis_price(size, price, sum_pnl){
    if (size != 0){ 
        return price - (sum_pnl / size)}
    else 
        return sum_pnl
}

module.exports = set_add_or_exit_trade_object
