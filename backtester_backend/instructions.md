From client via POST

{"size": 100,
 "market_speed": 6,
 "volatility": "high",
	"market_data": [{"price":4,"time":4},{"price":5,"time":6},{"price":4,"time":16},{"price":5,"time":21},{"price":6,"time":24},{"price":7,"time":32},{"price":6,"time":36},{"price":5,"time":40},{"price":4,"time":46},{"price":5,"time":51},{"price":6,"time":60},{"price":7,"time":65},{"price":6,"time":69},{"price":7,"time":74},{"price":8,"time":78},{"price":9,"time":81},{"price":10,"time":83},{"price":11,"time":84},{"price":12,"time":92},{"price":11,"time":99},{"price":12,"time":100},{"price":13,"time":109},{"price":14,"time":110},{"price":15,"time":111},{"price":14,"time":112},{"price":15,"time":113},{"price":16,"time":113},{"price":15,"time":114},{"price":16,"time":114},{"price":15,"time":115},{"price":14,"time":115},{"price":15,"time":116},{"price":16,"time":116},{"price":17,"time":125},{"price":16,"time":128},{"price":15,"time":136},{"price":14,"time":144},{"price":13,"time":147},{"price":12,"time":148},{"price":11,"time":149},{"price":10,"time":150},{"price":11,"time":151},{"price":10,"time":151},{"price":9,"time":152},{"price":10,"time":152},{"price":9,"time":153},{"price":10,"time":153},{"price":9,"time":154},{"price":8,"time":154},{"price":9,"time":157},{"price":8,"time":162},{"price":7,"time":165},{"price":6,"time":170},{"price":7,"time":177},{"price":6,"time":179},{"price":5,"time":184},{"price":6,"time":187},{"price":7,"time":191},{"price":8,"time":193},{"price":7,"time":197},{"price":8,"time":200},{"price":7,"time":205},{"price":6,"time":212},{"price":5,"time":212},{"price":6,"time":213},{"price":7,"time":213},{"price":8,"time":214},{"price":9,"time":214},{"price":8,"time":214},{"price":9,"time":215},{"price":10,"time":215},{"price":11,"time":215},{"price":12,"time":216},{"price":13,"time":216},{"price":12,"time":225},{"price":11,"time":232},{"price":12,"time":240},{"price":11,"time":244},{"price":10,"time":251},{"price":11,"time":252},{"price":10,"time":260},{"price":9,"time":264},{"price":10,"time":270},{"price":9,"time":273},{"price":10,"time":279},{"price":11,"time":281},{"price":12,"time":288},{"price":11,"time":295},{"price":10,"time":298},{"price":9,"time":300},{"price":8,"time":310},{"price":9,"time":319},{"price":10,"time":321},{"price":9,"time":324},{"price":8,"time":334},{"price":9,"time":336},{"price":8,"time":345},{"price":9,"time":351},{"price":8,"time":358},{"price":7,"time":368}]}
# market_generator_backtester_frontend
generates random market data for charting (d3) according to probability parameters and sends to backtester server

sample POST to backtest server:

{"size": 100,
 "market_speed": 6,
 "volatility": "high",
	"market_data": [{"price":0,"time":4},{"price":5,"time":6},{"price":4,"time":16},{"price":5,"time":21},{"price":6,"time":24},{"price":7,"time":32},{"price":6,"time":36},{"price":5,"time":40},{"price":4,"time":46},{"price":5,"time":51},{"price":6,"time":60},{"price":7,"time":65},{"price":6,"time":69},{"price":7,"time":74},{"price":8,"time":78},{"price":9,"time":81},{"price":10,"time":83},{"price":11,"time":84},{"price":12,"time":92},{"price":11,"time":99},{"price":12,"time":100},{"price":13,"time":109},{"price":14,"time":110},{"price":15,"time":111},{"price":14,"time":112},{"price":15,"time":113},{"price":16,"time":113},{"price":15,"time":114},{"price":16,"time":114},{"price":15,"time":115},{"price":14,"time":115},{"price":15,"time":116},{"price":16,"time":116},{"price":17,"time":125},{"price":16,"time":128},{"price":15,"time":136},{"price":14,"time":144},{"price":13,"time":147},{"price":12,"time":148},{"price":11,"time":149},{"price":10,"time":150},{"price":11,"time":151},{"price":10,"time":151},{"price":9,"time":152},{"price":10,"time":152},{"price":9,"time":153},{"price":10,"time":153},{"price":9,"time":154},{"price":8,"time":154},{"price":9,"time":157},{"price":8,"time":162},{"price":7,"time":165},{"price":6,"time":170},{"price":7,"time":177},{"price":6,"time":179},{"price":5,"time":184},{"price":6,"time":187},{"price":7,"time":191},{"price":8,"time":193},{"price":7,"time":197},{"price":8,"time":200},{"price":7,"time":205},{"price":6,"time":212},{"price":5,"time":212},{"price":6,"time":213},{"price":7,"time":213},{"price":8,"time":214},{"price":9,"time":214},{"price":8,"time":214},{"price":9,"time":215},{"price":10,"time":215},{"price":11,"time":215},{"price":12,"time":216},{"price":13,"time":216},{"price":12,"time":225},{"price":11,"time":232},{"price":12,"time":240},{"price":11,"time":244},{"price":10,"time":251},{"price":11,"time":252},{"price":10,"time":260},{"price":9,"time":264},{"price":10,"time":270},{"price":9,"time":273},{"price":10,"time":279},{"price":11,"time":281},{"price":12,"time":288},{"price":11,"time":295},{"price":10,"time":298},{"price":9,"time":300},{"price":8,"time":310},{"price":9,"time":319},{"price":10,"time":321},{"price":9,"time":324},{"price":8,"time":334},{"price":9,"time":336},{"price":8,"time":345},{"price":9,"time":351},{"price":8,"time":358},{"price":7,"time":368}]}

    Sample Response from server:

    [
  {
    "trade_number": 1,
    "type": "INITIAL_TRADE",
    "trade_price": 0,
    "time": 0,
    "size": 100,
    "basis": 0,
    "profit_protect_price": 0,
    "pnl_chg": 0,
    "sum_pnl": 0,
    "profit_protect_pnl_level": 0,
    "market_speed": 6,
    "volatility": "high"
  },
  {
    "type": "LONG_ADD",
    "trade_number": 2,
    "trade_price": 16,
    "trade_time": 113,
    "add_qty": 200,
    "size": 300,
    "profit_protect_price": 11,
    "pnl_chg": 1600,
    "sum_pnl": 1600,
    "basis": 10.666666666666668,
    "profit_protect_pnl_level": 100,
    "market_speed": 4,
    "volatility": "med"
  },
  {
    "type": "LONG_EXIT",
    "trade_number": 3,
    "trade_price": 13,
    "exit_qty": 240,
    "size": 60,
    "profit_protect_price": 3,
    "pnl_chg": -900,
    "sum_pnl": 700,
    "basis": 1.333333333333334,
    "profit_protect_pnl_level": 100,
    "market_speed": 4,
    "volatility": "med"
  },
  {
    "type": "LONG_EXIT",
    "trade_number": 4,
    "trade_price": 9,
    "exit_qty": 45,
    "size": 15,
    "profit_protect_price": -11,
    "pnl_chg": -240,
    "sum_pnl": 460,
    "basis": -21.666666666666668,
    "profit_protect_pnl_level": 160,
    "market_speed": 4,
    "volatility": "med"
  }
]
