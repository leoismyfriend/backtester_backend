// strategy model that powers long_trade_order_engines
var mongoose = require("mongoose");
var Schema = mongoose.Schema

var StrategySchema = new Schema({
    //protect_buffer_based_on_market_speed[market_speed] = [percentage of risk_buffer]
    //rank market speed on a scale of 0 - 8
    protect_buffer_based_on_market_speed: {type: Array, default: [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90]
},
    // volatility based risk_buffer_expansion pre and post exit [before_exit_event, after_exit_event] 
    //first index is negative to appease initial trade when protect_buffer = 0 and returns error 
    risk_buffer_expansion_post_exit: {type: Array, default: [
    {'vol': 'low',
    'expansion_rate': [[-1,10], [5,20], [40,50], [50,70], [100,125], [200,300]]
    }, //expansion rate should be approx 25% greater than original
    {'vol': 'med',
    'expansion_rate': [[-1,10], [5,20], [40,80], [50,100], [100,150], [200,400]]
    }, //50%
    {'vol': 'high',
    'expansion_rate': [[-1,10], [5,20], [40,100], [50,120], [100,200], [200,500]]}
    ]
},  
    //[pre_trade_risk_buffer, post_trade_risk_buffer]
    add_event_risk_buffer_to_next_risk_buffer: {type: Array, default: [
    {'vol': 'low',
    'compression_rate': [[3,1], [10,5], [20,10], [30,15], [40,30], [50,40], [100,80], [500,300]] //compression rate should be approx 80% of original
    }, 
    {'vol': 'med',
    'compression_rate': [[3,1], [10,5], [20,10], [30,15], [40,20], [50,30], [100,50], [500,250]] //60%
    }, 
    {'vol': 'high',
    'compression_rate': [[3,1], [10,5], [20,10], [30,15], [40,10], [50,20], [100,30], [500,100]]
    }]
},
    //used by long_add_engine for each element to create an order
    //{add_offset: [tick_offset, X seconds expire]}
    add_offset: {type: Array, default: [[15, 5], [25, 45000000000000000000000]]
},
    //adjust profit_protect_price (ticks offset) [risk_buffer_at_event: profit_protect_level_offset_amt]
    profit_protect_tick_offset: {type: Array, default: [[10,1],[20,5],[30,8],[40,10],[60,15],[100,35]]}
})

var Strategy = mongoose.model("Strategy", StrategySchema)

module.exports.Strategy = Strategy
