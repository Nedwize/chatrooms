const http = require('http');
const path = require('path');
const express = require('express');
const app = express();
const formatMessage = require('./utils/formatMessage');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);


const PORT = 3000 || process.env.PORT;

// Static Folder 
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'KeyNote Bot ';

//When Client connects
io.on('connection', (socket)=>{

	socket.on('joinRoom', ({username, room})=>{

		// Make a user
		const user = userJoin(socket.id, username, room);

		// Join the room
		socket.join(user.room)

		// Welcome current user
		socket.emit('message', formatMessage(botName,'Welcome to ChatRoom'));

		// Broadcast emit
		socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chatroom`));

		// Send all users and room info
		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room)
		});
	})

	console.log(`Connection with ${socket.id}`);



	// Listen for Chat Message
	socket.on('chatMessage', (msg)=>{
		// Get current user
		const user = getCurrentUser(socket.id);

		io.to(user.room).emit('message', formatMessage(user.username, msg));
	});

	// Disconnect
	socket.on('disconnect', ()=>{

		// Get user
		const user = userLeave(socket.id);

		if(user){
			io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chatroom`));

			// Send all users and room info
			io.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomUsers(user.room)
			});
		}		
	});
});


server.listen(PORT, ()=>{
	console.log(`Server running on PORT: ${PORT}`);
})