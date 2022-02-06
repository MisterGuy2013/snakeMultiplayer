const express = require("express");
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function resetApple(){
  var apple = {};
  var grid = 10;
  apple.x = getRandomInt(0, 25) * grid;
  apple.y = getRandomInt(0, 25) * grid;
  return apple;
}


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log(socket.id);
  var username = "";
  socket.on('join', msg => {
    username = msg;
    io.emit('join', msg);
  });
  socket.on('position', msg => {
    io.emit('position', msg);
  });
  socket.on('update', msg => {
    io.emit('update', msg);
  });
  socket.on("apple", msg => {
    io.emit("apple", msg + "|" + JSON.stringify(resetApple()));
  });
  socket.on("score", msg =>{
    io.emit("score", msg);
  });
  socket.on("disconnect", ()=>{
    io.emit("disconnected", username);
  });
});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
