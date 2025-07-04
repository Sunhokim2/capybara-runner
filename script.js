const capybara = document.getElementById('capybara');
const obstacle = document.getElementById('obstacle');
const bird = document.getElementById('bird');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');

let score = 0;
let isJumping = false;
let isGameOver = false;
let obstacleInterval;
let birdInterval;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

document.addEventListener('click', () => {
    jump();
});

function jump() {
    if (!isJumping && !isGameOver) {
        isJumping = true;
        let jumpHeight = 0;
        const jumpInterval = setInterval(() => {
            if (jumpHeight < 100) {
                jumpHeight += 5;
                capybara.style.bottom = `${jumpHeight}px`;
            } else {
                clearInterval(jumpInterval);
                fall();
            }
        }, 20);
    }
}

function fall() {
    let jumpHeight = 100;
    const fallInterval = setInterval(() => {
        if (jumpHeight > 0) {
            jumpHeight -= 5;
            capybara.style.bottom = `${jumpHeight}px`;
        } else {
            clearInterval(fallInterval);
            isJumping = false;
        }
    }, 20);
}

function moveObstacles() {
    if (!isGameOver) {
        // Move ground obstacle
        let obstaclePosition = -20; // Start off-screen to the right
        obstacleInterval = setInterval(() => {
            const obstacleSpeed = Math.floor(Math.random() * (10 - 6 + 1)) + 6; // Random speed between 6 and 10
            if (obstaclePosition < 600) { // Move until it's off-screen to the left
                obstaclePosition += obstacleSpeed; // Increase 'right' value to move left with random speed
                obstacle.style.right = `${obstaclePosition}px`;
                checkCollision();
            } else {
                obstaclePosition = -20; // Reset to off-screen right
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
            }
        }, 20);

        // Move bird obstacle
        let birdPosition = -20; // Start off-screen to the right
        birdInterval = setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance to spawn a bird
                const birdSpeed = Math.floor(Math.random() * (12 - 8 + 1)) + 8; // Random speed between 8 and 12
                if (birdPosition < 600) { // Move until it's off-screen to the left
                    birdPosition += birdSpeed; // Bird moves faster, increase 'right' value with random speed
                    bird.style.right = `${birdPosition}px`;
                    checkCollision();
                } else {
                    birdPosition = -20; // Reset to off-screen right
                    score++;
                    scoreDisplay.textContent = `Score: ${score}`;
                }
            }
        }, 20);
    }
}


function checkCollision() {
    const capybaraRect = capybara.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    const birdRect = bird.getBoundingClientRect();

    if (
        (capybaraRect.right > obstacleRect.left &&
        capybaraRect.left < obstacleRect.right &&
        capybaraRect.bottom > obstacleRect.top) ||
        (capybaraRect.right > birdRect.left &&
        capybaraRect.left < birdRect.right &&
        capybaraRect.top < birdRect.bottom &&
        capybaraRect.bottom > birdRect.top)
    ) {
        gameOver();
    }
}

function gameOver() {
    isGameOver = true;
    clearInterval(obstacleInterval);
    clearInterval(birdInterval);
    gameOverDisplay.classList.remove('hidden');
    
    setTimeout(() => {
        if (confirm('Game Over! Play again?')) {
            restartGame();
        }
    }, 100);
}

function restartGame() {
    isGameOver = false;
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    gameOverDisplay.classList.add('hidden');
    obstacle.style.right = '-20px';
    bird.style.right = '-20px';
    moveObstacles();
}

moveObstacles();
