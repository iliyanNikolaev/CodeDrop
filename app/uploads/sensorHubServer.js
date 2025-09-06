const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const port = new SerialPort({ path: 'COM7', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    parser.on('data', (data) => {
        io.emit('sensorHubData', data);
    });
});

server.listen(3000, () => {
    console.log('The application is up and running! Open http://localhost:3000 to monitor the data from the sensor hub.');
});