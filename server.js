const { WebSocketServer, WebSocket } = require('ws');

const wss = new WebSocketServer({ port: 4000 });

const heartbeat = () => {
  this.isAlive = true;
};


wss.on('connection', function(ws) {
  ws.isAlive = true;
  //ws.on('pong', heartbeat);
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();

      //ws.isAlive = false;
      //ws.ping();
    });
  }, 30000);
  wss.on('close', () => {
    clearInterval(interval);
  });
  ws.on('error', console.error);

  ws.on('message', (data, isBinary) => {
    console.log('isBinary:',isBinary);
    console.log('get data:',data.toString());
    try {
      const json = JSON.parse(data.toString());
      wss.clients.forEach(function(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data, { binary: isBinary });
        }
      });
    } catch(e) {
      console.error('OnMessage JSON exception:', e);
      console.error('OnMessage JSON data:', data.toString());
    }
  });
});
