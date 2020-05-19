var WebSocketServer = require('ws').Server
wss = new WebSocketServer({
    port: 8181
}); //服务端口8181

var randomSpeedUpdater = function () {
    for (var item in clientSpeeds) {
        var randomizedChange = Math.random(60, 120);
        randomizedChange = Math.ceil(randomizedChange)
        clientSpeeds[item] += randomizedChange;
    }
}

var clientSpeeds = {};
wss.on('connection', function (ws) {
    //模拟车速实时变化
    setInterval(function () {
        randomSpeedUpdater();
    }, 1000)

    var sendUpDates = function (ws) {
        if (ws.readyState == 1) {
            ws.send(JSON.stringify(clientSpeeds)); //需要将对象转成字符串。WebSocket只支持文本和二进制数据,推送消息
            console.log("服务器：更新数据", JSON.stringify(clientSpeeds));
        }
    }

    //每三秒发送一次
    var clientSpeedUpdater = setInterval(function () {
        sendUpDates(ws);
    }, 3000);
    ws.on('message', function (message) {
        // { "speed": ["A11111", "A22222"] }
        var stockRequest = JSON.parse(message); //根据请求过来的数据来更新。
        console.log("服务器：收到消息", stockRequest);
        clientSpeeds = stockRequest;
        sendUpDates(ws);
    });
    ws.on('close', function () {
        if (clientSpeedUpdater > 0) {
            //断开连接清楚定时器
            clearInterval(clientSpeedUpdater);
        }
    });
});