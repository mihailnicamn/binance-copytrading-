const { WebsocketClient } = require('binance');
const { DefaultLogger } = require('binance');

const API_KEY = '';
const API_SECRET = '';

// optionally override the logger
const logger = {
  ...DefaultLogger,
  silly: (...params) => {},
};

const account_listener = (cb) => {
const wsClient = new WebsocketClient(
  {
    api_key: API_KEY,
    api_secret: API_SECRET,
    beautify: true,
    // Disable ping/pong ws heartbeat mechanism (not recommended)
    // disableHeartbeat: true
  },
  logger
);

// notification when a connection is opened
wsClient.on('open', (data) => {
  console.log('connection opened open:', data.wsKey.split("_")[0]);
});

// receive formatted events with beautified keys. Any "known" floats stored in strings as parsed as floats.
wsClient.on('formattedMessage', (data) => {
  cb(data);
});

// receive notification when a ws connection is reconnecting automatically
wsClient.on('reconnecting', (data) => {
  console.log('ws automatically reconnecting.... ', data?.wsKey);
});

// receive notification that a reconnection completed successfully (e.g use REST to check for missing data)
wsClient.on('reconnected', (data) => {
  console.log('ws has reconnected ', data?.wsKey);
});

// Recommended: receive error events (e.g. first reconnection failed)
wsClient.on('error', (data) => {
 // console.log('ws saw error ', data?.wsKey);
});
    wsClient.subscribeSpotUserDataStream();
    wsClient.subscribeMarginUserDataStream();
    wsClient.subscribeUsdFuturesUserDataStream();
}

module.exports = {
    listen : account_listener
}