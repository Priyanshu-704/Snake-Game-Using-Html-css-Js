const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let foodX, foodY;
let snakeX = 5,
  snakeY = 10;

let snakeBody = [];
let velocityX = 0,
  velocityY = 0;
let setIntervalValid;
let gameOver = false;
let score = 0;

//Getting high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
  //passing the random value from 0 to 30 for the food position
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  //clear the interval and reloading the page on game over
  clearInterval(setIntervalValid);
  alert("Game over! press OK to replay....");
  window.location.reload();
};

const changeDirection = (e) => {
  //changing the velocity value according to key press

  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

controls.forEach(key =>{
  //calling changedirection method on each key click and passing key dataset value as an object
  key.addEventListener("click", ()=> changeDirection({ key: key.dataset.key }))
})
const initGame = () => {
  if (gameOver) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX} "> </div>`;

  //checking if the snake hit the food
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.unshift([foodX, foodY]); //pushing food position in the snake body array
    score++; // increment score by 1

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    //shifting forward the values of the element in the snake body by one
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY]; //Setting first element of the snake body to current position

  //updating the snake's head position on the basis of the current velocity
  snakeX += velocityX;
  snakeY += velocityY;

  //checking if the snake hit the wall , if so setting gameOver to true
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    //Adding a div for each part of the snake body
    htmlMarkup += `<div class="snake-head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}  "> </div>`;
    //checking if the snake hit the body , if so setting gameOver to true
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();

setIntervalValid = setInterval(initGame, 125);

document.addEventListener("keydown", changeDirection);
