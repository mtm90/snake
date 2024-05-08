const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const snakeColor = '#808080';
const foodColor = '#FF0000';
const obstacleColor = '#000000';

let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
let food = { x: 15, y: 15 };
let obstacles = [];
let dx = 1;
let dy = 0;
let score = 0;
let level = 1;
let speedMultiplier = 1;

function drawSnake() {
  ctx.fillStyle = snakeColor;
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function drawObstacles() {
  ctx.fillStyle = obstacleColor;
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize, gridSize);
  });
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    if (score % 10 === 0) {
      level++;
      if (level === 2) {
        speedMultiplier = 0.85; // Speed increase by 15% in level 2
      } else if (level === 3) {
        speedMultiplier = 0.75; // Speed increase by 10% in level 3
      } else if (level === 4) {
        speedMultiplier = 0.65; // Speed increase by 10% in level 4
        generateObstacles(2);
      } else if (level === 5) {
        speedMultiplier = 0.55; // Speed increase by 10% in level 5
        generateObstacles(6);
      } else if (level === 6) {
        speedMultiplier = 0.50; // Speed increase by 5% in level 6
        generateObstacles(6);
      }
    }
    generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize))
  };
}

function generateObstacles(numObstacles) {
  obstacles = [];
  for (let i = 0; i < numObstacles; i++) {
    let obstacleX = Math.floor(Math.random() * (canvas.width / gridSize));
    let obstacleY = Math.floor(Math.random() * (canvas.height / gridSize));
    obstacles.push({ x: obstacleX, y: obstacleY });
  }
}

function checkCollision() {
  const head = snake[0];
  // Check collision with boundaries
  if (
    head.x < 0 ||
    head.x >= canvas.width / gridSize ||
    head.y < 0 ||
    head.y >= canvas.height / gridSize
  ) {
    return true;
  }
  // Check collision with obstacles
  if (obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)) {
    return true;
  }
  // Check collision with itself
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function gameLoop() {
  if (checkCollision()) {
    // Game over logic
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("Game over. Try again. Score: " + score, 50, canvas.height / 2);
    console.log("Game over! Score: " + score);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSnake();
  drawFood();
  if (level >= 4) {
    drawObstacles();
  }
  moveSnake();

  drawScore();

  // Calculate speed based on level and speed multiplier
  const speed = 100 * speedMultiplier;

  setTimeout(gameLoop, speed); // Loop with adjusted speed
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "28px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Level: " + level, 10, 60);
}

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
      if (dy === 0) {
        dx = 0;
        dy = -1;
      }
      break;
    case 'ArrowDown':
      if (dy === 0) {
        dx = 0;
        dy = 1;
      }
      break;
    case 'ArrowLeft':
      if (dx === 0) {
        dx = -1;
        dy = 0;
      }
      break;
    case 'ArrowRight':
      if (dx === 0) {
        dx = 1;
        dy = 0;
      }
      break;
  }
});

// Touch controls
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', e => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && dy === 0) {
      // Right swipe
      if (dx === 0) return;
      if (dy === 0) {
        dx = 1;
        dy = 0;
      }
    } else if (dx < 0 && dy === 0) {
      // Left swipe
      if (dx === 0) return;
      if (dy === 0) {
        dx = -1;
        dy = 0;
      }
    }
  } else {
    if (dy > 0 && dx === 0) {
      // Down swipe
      if (dy === 0) return;
      if (dx === 0) {
        dx = 0;
        dy = 1;
      }
    } else if (dy < 0 && dx === 0) {
      // Up swipe
      if (dy === 0) return;
      if (dx === 0) {
        dx = 0;
        dy = -1;
      }
    }
  }
});

generateFood();
gameLoop();
