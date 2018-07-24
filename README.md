# backtester_backend
backend for backtester (logic)

risk_buffer = market - profit_protect_price (or protect_buffer + exit_buffer)
exit_buffer = exit_price - profit_protect_price
protect_buffer = market - exit_price

file(s) structure

app.js -> command_routes.js -> trade_model_results.js ->
                                    initial_create_order_request.js, long_add_backtest_trade_engine.js,
                                    long_backtest_results.js,
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

      
- create form in front_end to create initial_trading_object
- initial_trading_object should include small 'runway' for protect_buffer (distance between profit_protect_price and trade_price) so that it's not 0