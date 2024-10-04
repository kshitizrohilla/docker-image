const fs = require('fs');
const path = require('path');

const http = require('http');
const cors = require('cors');

const pty = require('node-pty');
const { Server : SocketServer } = require('socket.io');

const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);

const io = new SocketServer({ cors: '*' });
io.attach(httpServer);

const ptyProcess = pty.spawn('bash', [], {
  name: 'xterm-color',
  cols: 80,
  rows: 20,
  cwd: process.env.INIT_CWD,
  env: process.env
});

ptyProcess.onData(data => {
  io.emit('terminal:data', data);
});

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('terminal:write', (data) => {
    ptyProcess.write(data);
  });
});

app.get('/', (req, res) => {
  res.send('Hello from the container server');
});

const getFiles = require('./routes/getFiles.js');
app.use('/api', getFiles);

app.post('/get-file', (req, res) => {
	const { fileName } = req.body;
	const filePath = path.join('/app/', fileName);
	fs.readFile(filePath, 'utf-8', (err, data) => {
		if (err) return res.status(500).send('Error reading file');
		res.send(data);
	});
});

app.post('/write-file', (req, res) => {
	const { fileName, code } = req.body;
	const filePath = path.join('/app/', fileName);

	fs.writeFile(filePath, code, 'utf-8', (err) => {
		if (err) {
      console.log(err);
      return res.send('Error writing file');
    } else {
		  res.send('File written successfully');
    }
	});
});

httpServer.listen(5002, () => {
  console.log(`Server running on port 5002`);
});
