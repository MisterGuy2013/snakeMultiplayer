var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var grid = 10;
var count = 0;
  

var apple = {
  x: 320,
  y: 320
};
var sleepTime = 20;
var superHard = false;

var socket = io();
var username = getRandomInt(0,1000);
//socket.emit("position", "e");
socket.on("join", function(msg){
  if(snake[msg] != undefined){
    socket.emit("join", username);
    reset(msg);
  }
  console.log(msg + 'eee');
});
//socket.emit('chat message', "e");

socket.emit("join", username);


var snake = {who};
snake[username] = "";



function reset(user){
        snake[user].x = getRandomInt(0,40)*grid;
        snake[user].y = getRandomInt(0,40)*grid;
        snake[user].cells = [];
        snake[user].maxCells = 10;
        snake[user].dx = grid;
        snake[user].dy = 0;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
}
reset("username");
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
function loop() {
  sleep(sleepTime);
grid = 10;
  requestAnimationFrame(loop);
  if (++count < 4) {
    return;
  }
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);
  snake[username].x += snake[username].dx;
  snake[username].y += snake[username].dy;
  if (snake[username].x < 0) {
    snake[username].x = canvas.width - grid;
  }
  else if (snake[username].x >= canvas.width) {
    snake[username].x = 0;
  }
  

  if (snake[username].y < 0) {
    snake[username].y = canvas.height - grid;
  }
  else if (snake[username].y >= canvas.height) {
    snake[username].y = 0;
  }
  snake[username].cells.unshift({x: snake[username].x, y: snake[username].y});
  if (snake[username].cells.length > snake[username].maxCells) {
    snake[username].cells.pop();
  }
  context.fillStyle = "Yellow";
  context.fillRect(apple.x, apple.y, grid-1, grid-1);
  context.fillStyle = "Blue";
  snake[username].cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid-1, grid-1);
    if (cell.x == apple.x && cell.y == apple.y) {
      snake[username].maxCells += 3;
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }
    for (var i = index + 1; i < snake[username].cells.length; i++) {
      if (cell.x === snake[username].cells[i].x && cell.y === snake[username].cells[i].y) {
        reset(username);
      }
    }
  });
}
document.addEventListener("keydown", function(e) {
  if (e.which === 37 && snake[username].dx === 0) {
    snake[username].dx = -grid;
    snake[username].dy = 0;
  }
  else if (e.which === 38 && snake.dy === 0) {
    snake[username].dy = -grid;
    snake[username].dx = 0;
  }
  else if (e.which === 39 && snake[username].dx === 0) {
    snake[username].dx = grid;
    snake[username].dy = 0;
  }
  else if (e.which === 40 && snake[username].dy === 0) {
    snake[username].dy = grid;
    snake[username].dx = 0;
  }
});
requestAnimationFrame(loop);