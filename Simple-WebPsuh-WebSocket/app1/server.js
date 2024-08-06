const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const publicVapidKey = 'BI94FmVQGdmr_o3yL6_BISdiNXXC-WdSnm9jHeEzCYFY-YYnOKuWVlKrR57_b1szPHQqKzh2BADWCqihqYIsGS0';
const privateVapidKey = 'bVZpMQA_ST-VOYHtcEk_8eSPVClg7a1M-5Fpuxnxqog';

webpush.setVapidDetails('mailto:example@app1.com', publicVapidKey, privateVapidKey);

let subscription;

app.post('/subscribe', (req, res) => {
  subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: 'App1 Notification', body: 'This is from App1' });
  webpush.sendNotification(subscription, payload).catch(error => console.error(error));
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('notify-app2', (data) => {
    io.emit('notification', data);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`App1 running on port ${PORT}`);
});
