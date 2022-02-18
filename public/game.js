var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var grid = 10;
var count = 0;
var running = false;

var score = 0;
var otherScore = 0;


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
  if(msg != username){
  if(snakeTwo.user == undefined){
    socket.emit("join", username);
    reset(msg);
    snakeTwo.user = msg;
    resetTwo();
    running = true;
    socket.emit("apple", "???")
    
  }}
  console.log(msg);
});
socket.on("disconnected", function(msg){
  if(msg == snakeTwo.user){
    snakeTwo.user = undefined;
    running = false;
    reset();
    resetTwo();
    score = 0;
    otherScore = 0;
    $("#score")[0].innerHTML = `${score}:${otherScore}`;
  }
  else{
    //console.log(`${msg}:${snakeTwo.user}`);
  }
  
});
socket.on("update", function(msg){
  var split = msg.split("|");
  if(split[0] == snakeTwo.user){
  snakeTwo = JSON.parse(split[1]);
  snakeTwo.user = split[0];
  apple = JSON.parse(split[2]);
  }
  else{
    //console.log(`${split[0]}:${snakeTwo.user}`);
  }
});
socket.on("apple", function(msg){
  var split = msg.split("|");
  if(split[0] == username){
    console.log("we got it");
  }
  else if(split[0] == snakeTwo.user){
    console.log("they got it");
  }
  apple = JSON.parse(split[1]);
});
socket.on("score", function(msg){
  console.log(msg)
  var split = msg.split("|");
  if(split[0] == username){
    if(split[1] == "mybad"){
      otherScore += 1;
    }
    else if(split[1] == "mygood"){
      score += 1;
    }
    else if(split[1] == "tie"){
      score += 1;
      otherScore += 1;
    }
  }
  else if(split[0] == snakeTwo.user){
    if(split[1] == "mybad"){
      score += 1;
    }
    else if(split[1] == "mygood"){
      otherScore += 1;
    }
    else if(split[1] == "tie"){
      score += 1;
      otherScore += 1;
    }
  }
  $("#score")[0].innerHTML = `${score}:${otherScore}`;
});
//socket.emit('chat message', "e");

socket.emit("join", username);


var snake = {};
var snakeTwo = {};


function reset(user){
        snake.x = getRandomInt(0,40)*grid;
        snake.y = getRandomInt(0,40)*grid;
        snake.cells = [];
        snake.maxCells = 10;
        snake.dx = grid;
        snake.dy = 0;
        resetApple();
}
function resetTwo(user){
        snakeTwo.x = getRandomInt(0,40)*grid;
        snakeTwo.y = getRandomInt(0,40)*grid;
        snakeTwo.cells = [];
        snakeTwo.maxCells = 10;
        snakeTwo.dx = grid;
        snakeTwo.dy = 0;
}
function resetApple(){
  apple.x = getRandomInt(0, 25) * grid;
  apple.y = getRandomInt(0, 25) * grid;
  if(apple.x<10){
    apple.x += 10;
  }
  if(apple.y < 10) {
    apple.y += 10;
  }
  
  apple.cells = [{"x":apple.x, "y": apple.y},{"x":apple.x - grid, "y": apple.y},{"x":apple.x, "y": apple.y-grid},{"x":apple.x - grid, "y": apple.y-grid}];
}
function update(){
  var stringSnake = JSON.stringify(snake);
  socket.emit("update", `${username}|${stringSnake}`)
}

reset();
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
  if(running == true){
  snake.x += snake.dx;
  snake.y += snake.dy;
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  snake.cells.unshift({x: snake.x, y: snake.y});
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }



  snakeTwo.x += snakeTwo.dx;
  snakeTwo.y += snakeTwo.dy;
  if (snakeTwo.x < 0) {
    snakeTwo.x = canvas.width - grid;
  }
  else if (snakeTwo.x >= canvas.width) {
    snakeTwo.x = 0;
  }
  

  if (snakeTwo.y < 0) {
    snakeTwo.y = canvas.height - grid;
  }
  else if (snakeTwo.y >= canvas.height) {
    snakeTwo.y = 0;
  }
  snakeTwo.cells.unshift({x: snakeTwo.x, y: snakeTwo.y});
  if (snakeTwo.cells.length > snakeTwo.maxCells) {
    snakeTwo.cells.pop();
  }


  context.fillStyle = "Green";
  /*apple.cells.forEach(function(cell, index){
    context.fillRect(cell.x, cell.y, grid-1, grid-1);
  });*/
  context.fillRect(apple.cells[0].x+grid-0.5 , apple.cells[0].y + grid-0.5, 0.5-grid*2, 0.5-grid*2); 





context.fillStyle = "Red";
  snakeTwo.cells.forEach(function(cell, index) {

    if(index ==0){
      context.fillStyle = "Black";
      context.fillRect(cell.x, cell.y, grid-1, grid-1);
    }
    else{
      context.fillStyle = "Red";
      context.fillRect(cell.x, cell.y, grid-1, grid-1);
    }
    if (cell.x == apple.x && cell.y == apple.y) {
      snakeTwo.maxCells += 3;
      resetApple();
    }
    for (var i = index + 1; i < snakeTwo.cells.length; i++) {
      if (cell.x === snakeTwo.cells[i].x && cell.y === snakeTwo.cells[i].y) {
        resetTwo();
      }
    }
  });




var scored = false;
  context.fillStyle = "Blue";
  snake.cells.forEach(function(cell, index) {
    if(index ==0){
      context.fillStyle = "Black";
      context.fillRect(cell.x, cell.y, grid-1, grid-1);
    }
    else{
      context.fillStyle = "Blue";
      context.fillRect(cell.x, cell.y, grid-1, grid-1);
    }

    apple.cells.forEach(function(apple, index){
      if (cell.x == apple.x && cell.y == apple.y) {
            snake.maxCells += 3;
            resetApple();
            socket.emit("apple", username);
      }
    });
    


    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        socket.emit("score", username + "|" + "mybad");
        reset();
      }
    }

    if(index == 0){
      for (var i = index + 1; i < snakeTwo.cells.length; i++) {
      if (cell.x === snakeTwo.cells[i].x && cell.y === snakeTwo.cells[i].y) {
        if(scored == false){
        socket.emit("score", username + "|" + "mybad");
        reset();
        scored = true;
        }
      }
    }
    
    }
    else{
      for (var i = 0; i < snakeTwo.cells.length; i++) {
      if (cell.x === snakeTwo.cells[i].x && cell.y === snakeTwo.cells[i].y) {
        if(scored == false && i != 0){
        socket.emit("score", username + "|" + "tie");
        reset();
        scored = true;
        }
      }
      else{
       // console.log(`${cell.x == snakeTwo.cells[i].x}   ${cell.y ==snakeTwo.cells[i].y } `)
      }
      }
    }
    
  });



  
  update();
  }
  else{
    context.font = "30px Ubuntu";
    context.fillText("Waiting For Opponent...", 50, 50)
  }
}
document.addEventListener("keydown", function(e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});
    requestAnimationFrame(loop);