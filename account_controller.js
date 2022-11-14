const { MainClient,USDMClient } = require('binance');

const connect = (market,account_) => {
    if(market == "spot"){
        return new MainClient({
          api_key: account_.API_KEY,
          api_secret: account_.API_SECRET,
        });

    }
    if(market == "usdm"){
        return new USDMClient({
            api_key: account_.API_KEY,
            api_secret: account_.API_SECRET,
          });
    }
}
const orders = (account_,cb) => {
    account_.getAllOpenOrders().then((data) => {
        cb(data);
    }).catch((err) => {
        console.log(err);
    });
}
const positions = (account_,cb) => {
    account_.getPositions().then((data) => {
        const filtered = data.filter((position) => {
            return position.positionAmt != 0;
        });
        cb(filtered);
    }).catch((err) => {
        console.log(err);
    });
}
const place_ = (order,account_,cb) => {
    const market = order.market;
    const account = connect(market,account_);
    const new_order = {
        symbol: order.symbol,
        type: order.type,
        quantity: order.quantity,
        price: order.price,
        reduceOnly: order.reduceOnly,
        positionSide: order.postionSide,
    }
    account.submitNewOrder(new_order).then((data) => {
        cb(data);
    }).catch((err) => {
        console.log(err);
    });
}
const cancel_ = (order,account_,cb) => {
    const market = order.market;
    const account = connect(market,account_);
    orders(account,(data)=>{
        const the_order = data.filter((order_)=>{
            let the_price = order_.type == "TAKE_PROFIT_MARKET" || order_.type == "STOP_MARKET" ? order_.stopPrice : order_.price;
            return order_.symbol == order.symbol && order_.side == order.side && order_.type == order.type && order_.reduceOnly == order.reduceOnly && order_.positionSide == order.positionSide && the_price == order.price;
        });
        if(the_order.length > 0){
        account.cancelOrder({
            symbol: order.symbol,
            orderId: the_order[0].orderId,
        }).then((data_) => {
        cb(data_)
        }).catch((err) => {
            console.log(err);
        });
    }else{
        console.log("No order found");
    }
    })
    
}

module.exports = {
    place_,
    cancel_,
}