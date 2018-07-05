# backtester_backend
backend for backtester (logic)

file(s) structure

app.js -> command_routes.js -> trade_model_results.js ->
                                    initial_create_order_request.js, long_add_backtest_trade_engine.js,
                                    long_backtest_results.js
                                    long_exit_backtest_trade_engine.js

long_add_backtest_trade_engine.js -> 
                                strategy_model.js, set_profit_protect_price.js ->           strategy_model.js

long_exit_backtest_trade_engine.js -> 
                                strategy_model.js, set_profit_protect_price.js ->           strategy_model.js

long_backtest_results.js -> trade_logic_qualification.js,
                            set_add_or_exit_trade_object.js, create_order_request.js, long_add_backtest_trade_engine.js, long_exit_backtest_trade_engine.js

trade_model_results.js -> initial_create_order_request.js, long_add_backtest_trade_engine.js,
                          long_backtest_results.js,
                          long_exit_backtest_trade_engine.js

      