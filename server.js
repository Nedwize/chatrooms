const http = require('http');
const path = require('path');
const express = require('express');
const app = express();
const formatMessage = require('./utils/formatMessage');

const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);


const PORT = 3000 || process.env.PORT;

// Static Folder 
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'KeyNote Bot ';

//When Client connects
io.on('connection', (socket)=>{
	console.log(`Connection with ${socket.id}`);

	// Welcome current user
	socket.emit('message', formatMessage(botName,'Welcome to ChatRoom'));

	// Broadcast emit
	socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chatroom'));

	// Disconnect
	socket.on('disconnect', ()=>{
		io.emit('message', formatMessage(botName, 'A user has left the chatroom'));
	});

	// Listen for Chat Message
	socket.on('chatMessage', (msg)=>{
		io.emit('message', formatMessage('USER ', msg));
	});
});


server.listen(PORT, ()=>{
	console.log(`Server running on PORT: ${PORT}`);
})