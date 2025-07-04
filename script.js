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
        let obstaclePosition = 600; // Start off-screen to the left
        obstacleInterval = setInterval(() => {
            if (obstaclePosition > -20) { // Move until it's off-screen to the right
                obstaclePosition -= 5; // Decrease 'right' value to move right
                obstacle.style.right = `${obstaclePosition}px`;
                checkCollision();
            } else {
                obstaclePosition = 600; // Reset to off-screen left
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
            }
        }, 20);

        // Move bird obstacle
        let birdPosition = 600; // Start off-screen to the left
        birdInterval = setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance to spawn a bird
                if (birdPosition > -20) { // Move until it's off-screen to the right
                    birdPosition -= 7; // Bird moves faster, decrease 'right' value
                    bird.style.right = `${birdPosition}px`;
                    checkCollision();
                } else {
                    birdPosition = 600; // Reset to off-screen left
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