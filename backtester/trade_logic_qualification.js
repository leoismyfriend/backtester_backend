// per each price and time, f() checks to see if it qualifies the parameters of a trade or not
function trade_logic_qualification(price, time_expire, order_set){
    for (var i = 0; i < order_set.length; i++){
        const matched_order = order_set[i]
        const type = order_set[i].type
        if (type == 'LONG_ADD' && time_expire <= order_set[i].add_time_expire_offset && price >= order_set[i].add_price){
            return matched_order}
        else if (type == 'LONG_EXIT' && price <= order_set[i].exit_price){
            return matched_order}
        }

    return 'No Matched Order'
}

module.exports = trade_logic_qualification
