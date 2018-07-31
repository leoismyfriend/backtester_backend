'use_strict'

var Strategy = require("./../model/strategy_model").Strategy
var strategy = new Strategy()

const strategy_profit_protect_offset = strategy.profit_protect_tick_offset

let min_size = 10
let min_pnl_chg = 1
let elegible_check = false
let profit_protect_price_offset = 0

function adjust_protect_price_offset(size, profit_protect_price, basis_price, event_risk_buffer, pnl_change){
    //what is the min/max of PPP based on f(size and risk_buffer) (1. current_risk_buffer, 2. @_event_risk_buffer, 3. post_add_risk_buffer, 4. post_exit_risk_buffer)?
    // max(risk_buffer) = mix(size) * event_risk_buffer
    //console.log('event_risk_buffer: ', event_risk_buffer)

    if (profit_protect_price < basis_price){
        profit_protect_price_offset = 0
        return profit_protect_price_offset
    }
    else if (profit_protect_price >= basis_price){
        elegible_check = check_profit_protect_price_eligibility(event_risk_buffer, size, pnl_change)
        if (elegible_check) {
            profit_protect_price_offset = get_profit_protect_tick_offset(event_risk_buffer)
            return profit_protect_price_offset}
        else 
            //console.log('elegible check false: ', elegible_check)
            return 0 //no ppp change
    } 
}

function check_profit_protect_price_eligibility(risk_buffer_at_event, size, pnl_chg){
    let enough_event_buffer = false
    let enough_size = false
    let enough_pnl_chg = false
    //console.log('strategy_profit_protect_offset[0][0]: ', strategy_profit_protect_offset[0][0])
    // is there enough risk buffer 'budget' to 'steal' before add
     if (risk_buffer_at_event >= strategy_profit_protect_offset[0][0]){
        enough_event_buffer = true}
    // is there enough size(ie pnl) to make it even worthwhile?
    if (size >= min_size){
        enough_size = true}    
    // is the pnl_chg 'enough' to make it worthwhile
    //if (pnl_chg >= min_pnl_chg){
        //enough_pnl_chg = true}
    //console.log('Elegibility Check(Enough): Event Buffer %s , Size %s , PnL Chg %s ', enough_event_buffer,enough_size)//,enough_pnl_chg)
    return enough_event_buffer * enough_size //* enough_pnl_chg
}

function get_profit_protect_tick_offset(risk_buffer_at_event){
    // [risk_buffer_at_event: profit_protect_level_offset_amt]
    for (var i = 0; i <  strategy_profit_protect_offset.length; i++){
        if (risk_buffer_at_event < strategy_profit_protect_offset[i][0]){
            return strategy_profit_protect_offset[i-1][1]}
        }
}

module.exports = adjust_protect_price_offset

