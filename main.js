const master_ = require('./account_listener.js');
const slave_ = require('./account_controller.js');
const master = require('./account_data.js');

const process_order = (order) => {
    var toDo = [];
    if(order.status == "CANCEL"){
        toDo = master.data.slaves.map((account) => {
            if(account.markets.includes(order.market) && account.symbols.includes(order.symbol)) {
                return slave_.cancel_(order,account);
            }
        });
    }
    if(order.status == "NEW" || (order.status == "FILLED" && order.type == "MARKET")){
        toDo = master.data.slaves.map((account) => {
            if(account.markets.includes(order.market) && account.symbols.includes(order.symbol)) {
                return slave_.place_(order,account);
            }
        });
    }
    Promise.all(toDo).then((result) => {
        console.log(result);
    });
}
const loader = (data) => {
    //console.log(data);
    const market = data.wsKey.split("_")[0];
    if(data.eventType == "ORDER_TRADE_UPDATE") {
        let order = {
            market : market,
            symbol: data.order.symbol,
            side: data.order.orderSide,
            type: data.order.orderType,
            status: data.order.orderStatus,
            positionSide: data.order.positionSide,
            reduceOnly: data.order.isReduceOnly,
            quantity: data.order.originalQuantity,
            price: data.order.orderType=="TAKE_PROFIT_MARKET" || "STOP_MARKET" ? data.order.stopPrice : data.order.originalPrice,
        }
        console.log(order)
        process_order(order);
    }
}
master_.listen(loader);