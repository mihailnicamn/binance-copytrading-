const master_ = {
    //master account object
    slaves : [
        {
            //slave account object
            API_KEY : "",
            API_SECRET : "",
            markets : ["spot", "usdm"],
            symbols : ["BTCUSDT", "ETHUSDT","ATAUSDT"],
            info : {
                //account info
            }
        }
    ]
}

module.exports = {
    data : master_
}