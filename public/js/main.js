const chatForm = document.getElementById('chat-form');
const chatMessages  =document.querySelector('.chat-messages');

// Get Username and room from URL

const{username, room} = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

console.log(username, room);


// Socket Setup
const socket = io();



// Emit event to join chatroom

socket.emit('joinRoom', {username, room});


// Get users

socket.on('roomUsers', ({ room, users})=>{
	outputRoom(room);
	outputUsers(users);
})

socket.on('message', (message)=>{
	console.log(message);
	outputMessage(message);

	chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e)=>{
	e.preventDefault();
	const msg = e.target.elements.msg.value;

	// Emitting Message to Server
	socket.emit('chatMessage', msg);

	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});


function outputMessage(msg){
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `<p class="meta">${msg.username}<span>${msg.time}</span></p>
						<p class="text">
							${msg.text}
						</p>`;
	document.querySelector('.chat-messages').appendChild(div);
}

function outputRoom(room){

	const roomName = document.getElementById('room-name');
	roomName.innerText = room;
}

function outputUsers(users){
	const userList = document.getElementById('users');

	userList.innerHTML = `
		${users.map(user => `<li>${user.username}</li>`).join('')}
	`;
}