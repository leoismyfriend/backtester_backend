'use strict'

var mongoose = require("mongoose");

var Schema = mongoose.Schema

var StrategySchema = new Schema({
    //profit_protect_price: {type: Number, default: 20}, // () => default is basis_price + current_risk_buffer
    // STRATEGY / STATE  (in Position DB) INFO.................

    //split of protect_buffer and exit_buffer
    //rank market speed on a scale of 0 - 8
    //buffer_pct_splits[protect_buffer, exit_buffer]
    protect_to_exit_buffer_pct_splits: {type: Array, default: [
    // slow
    [0.10,0.90],[0.20,0.80],[0.30,0.70], 
    // medium
    [0.40,0.60],[0.50,0.50],[0.60,0.40],
    // fast
    [0.70,0.30],[0.80,0.20],[0.90,0.10]
    ]
},  
    exit_buffer_expansion: {type: Array, default: [
    {'vol': 'low',
    'expansion_rate': [[1,10], [5,20], [40,50], [50,70], [100,125], [200,300]]
    }, //expansion rate should be approx 25% greater than original
    {'vol': 'med',
    'expansion_rate': [[1,10], [5,20], [40,80], [50,100], [100,150], [200,400]]
    }, //50%
    {'vol': 'high',
    'expansion_rate': [[1,10], [5,20], [40,100], [50,120], [100,200], [200,500]]}
    ]
},
    add_event_risk_buffer_to_next_risk_buffer: {type: Array, default: [
    {'vol': 'low',
    'compression_rate': [[3,1], [10,5], [20,10], [30,15], [40,30], [50,40], [100,80], [500,300]] //compression rate should be approx 80% of original
    }, 
    {'vol': 'med',
    'compression_rate': [[3,1], [10,5], [20,10], [30,15], [40,20], [50,30], [100,50], [500,250]] //60%
    }, 
    {'vol': 'high',
    'compression_rate': [[3,1], [10,5], [20,10], [30,15], [40,10], [50,20], [100,30], [500,100]]
    }
    ]
},
    //{'add_offset': [offset_@_1s, offset_@_5s, offset_30s, offset_60s, offset_indef]}
    add_offset: {type: Array, default: [[15, 5], [25, 45000000000000000000000]]
},
    exit_offset: {type: Array, default: [15,25,40]
},
    profit_protect_tick_offset: {type: Array, default: [[10,1],[20,5],[30,8],[40,10],[60,15],[100,35]]
},
    add_recalc_offset: {type: Array, default: [5, 30, 50, 75, 100]}
})

var Strategy = mongoose.model("Strategy", StrategySchema)

module.exports.Strategy = Strategy

// instead of this, just take the protect to market buffer and base it in the protect to market buffer + offset
    
    // NEW MODEL: every compression rate includes an 'next_add_offset' for when the price is falling
    // next add price can change dynamically 
    // create a function of current to matched[i+1] where add_offset is the upper of current_risk_buffer
    // 'compression_rate': [[risk_buffer_at_add_event, risk_buffer_post_add, min_add_offset]]
    // can reset when current_buffer is less than next_risk_buffer
    // offset should be somewhere close to compression_rate difference (ie if CB = 39, offset = 10)?
    // get your current_risk_buffer -> jump up to the next level and that range to the next next one can be your offset
    // what is the 'next_risk_buffer' you want and when? 
    // (ie what are your reasons?) decrease buffer, growth, speed etc ----> Different types of ADD programs with defined begin/expire/end boundaries
    // some Expire/End conditions could be....ADD on higher price OR recalculate ADD on lower market price above exit price
    // FILL OR KILL (RECALC)

    // 1. get_current_risk_buffer
    // 2. dig through event_to_next_risk_buffer{} for the [1] and find the [0] and use
    //    the difference for offset to get next_add_price
    // next_desired_risk_buffer = f(current_risk_buffer +/- offset)
    // [30: [10: [7, -5], -8]] / [CRB: [time(sec), add_offset (ie add at 37 or 65), next_risk_buffer(32), kill @ current_buffer(recalc f(24)]]