const capybara = document.getElementById('capybara');
const obstacle = document.getElementById('obstacle');
const bird = document.getElementById('bird');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const gameContainer = document.getElementById('game-container');
const congratulationsMessage = document.getElementById('congratulations-message');

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
            const obstacleSpeed = Math.floor(Math.random() * (15 - 9 + 1)) + 9; // Random speed between 9 and 15 (1.5x faster)
            if (obstaclePosition < 600) { // Move until it's off-screen to the left
                obstaclePosition += obstacleSpeed; // Increase 'right' value to move left with random speed
                obstacle.style.right = `${obstaclePosition}px`;
                checkCollision();
            } else {
                obstaclePosition = -20; // Reset to off-screen right
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
                if (score > 0 && score % 5 === 0) { // Changed to every 5 points
                    showCongratulations();
                }
            }
        }, 20);

        // Move bird obstacle
        let birdPosition = -20; // Start off-screen to the right
        birdInterval = setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance to spawn a bird
                const birdSpeed = Math.floor(Math.random() * (24 - 16 + 1)) + 16; // Random speed between 16 and 24 (approx. 2x faster)
                if (birdPosition < 600) { // Move until it's off-screen to the left
                    birdPosition += birdSpeed; // Bird moves faster, increase 'right' value with random speed
                    bird.style.right = `${birdPosition}px`;
                    checkCollision();
                } else {
                    birdPosition = -20; // Reset to off-screen right
                    score++;
                    scoreDisplay.textContent = `Score: ${score}`;
                    if (score > 0 && score % 5 === 0) { // Changed to every 5 points
                        showCongratulations();
                    }
                }
            }
        }, 20);
    }
}

function showCongratulations() {
    congratulationsMessage.classList.remove('hidden');
    triggerConfetti(); // Trigger confetti when congratulations message is shown
    setTimeout(() => {
        congratulationsMessage.classList.add('hidden');
    }, 2000); // Hide after 2 seconds
}

function triggerConfetti() {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];
    const numParticles = 100; // More particles for confetti effect

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('confetti-particle');
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Start particles randomly across the top of the viewport
        const startX = Math.random() * window.innerWidth;
        const startY = -20; // Start slightly above the viewport

        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;

        // Randomize animation delay and duration for a more natural look
        const delay = Math.random() * 2; // 0 to 2 seconds
        const duration = 3 + Math.random() * 2; // 3 to 5 seconds for falling
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;

        document.body.appendChild(particle); // Append to body for full screen

        // Remove particle after animation ends
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
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
