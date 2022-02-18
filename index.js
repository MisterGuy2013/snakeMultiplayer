const express = require("express");
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
  var appleOBJ = {};
function resetApple(){
  var apple = {};
  var grid = 10;
  apple.x = getRandomInt(0, 25) * grid;
  apple.y = getRandomInt(0, 25) * grid;
  if(apple.x<10){
    apple.x += 10;
  }
  if(apple.y < 10) {
    apple.y += 10;
  }
  
  apple.cells = [{"x":apple.x, "y": apple.y},{"x":apple.x - grid, "y": apple.y},{"x":apple.x, "y": apple.y-grid},{"x":apple.x - grid, "y": apple.y-grid}];
  return apple;
}


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var rooms = {
  
}

io.on('connection', (socket) => {
  console.log(socket.id);
  var username = "";
  var room = "";
  /*socket.on("create", msg=>{
    
  });*/
  socket.on('join', msg => {
    var splitM = msg;//.split('|');
    username = msg;//splitM[0];
    //io.join(splitM[1]);
    io.emit('join', msg);
  });
  socket.on('position', msg => {
    io.emit('position', msg);
  });
  socket.on('update', msg => {
    io.emit('update', msg + "|" + JSON.stringify(appleOBJ));
  });
  socket.on("apple", msg => {
    appleOBJ = resetApple();
    io.emit("apple", msg + "|" + JSON.stringify(appleOBJ));
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
