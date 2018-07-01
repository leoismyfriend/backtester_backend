
function trade_logic_qualification(price, time_expire, order_set){
    //const price = data.price
    //const time_exp = data.time_exp
    //console.log('data: ', data)
    //console.log('order_set: ', order_set)
    for (var i = 0; i < order_set.length; i++){
        //console.log('i: ', i)
        //console.log('order_set[i]: ', order_set[i])
        //console.log('')
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
