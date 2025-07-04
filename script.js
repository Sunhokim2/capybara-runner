const capybara = document.getElementById('capybara');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');

let score = 0;
let isJumping = false;
let isGameOver = false;

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

function moveObstacle() {
    if (!isGameOver) {
        let obstaclePosition = 600;
        const obstacleInterval = setInterval(() => {
            if (obstaclePosition > -20) {
                obstaclePosition -= 5;
                obstacle.style.right = `${obstaclePosition}px`;
                checkCollision();
            } else {
                obstaclePosition = 600;
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
            }
        }, 20);
    }
}

function checkCollision() {
    const capybaraRect = capybara.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
        capybaraRect.right > obstacleRect.left &&
        capybaraRect.left < obstacleRect.right &&
        capybaraRect.bottom > obstacleRect.top
    ) {
        gameOver();
    }
}

function gameOver() {
    isGameOver = true;
    gameOverDisplay.classList.remove('hidden');
}

moveObstacle();
