// Configuração inicial
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajuste para 80% da largura da tela e centralização
canvas.width = window.innerWidth * 0.8;  // Largura do canvas é 80% da largura da tela
canvas.height = window.innerHeight * 0.8; // Altura do canvas é 80% da altura da tela

// Centralizar o canvas
const canvasX = (window.innerWidth - canvas.width) / 2;
const canvasY = (window.innerHeight - canvas.height) / 2;

canvas.style.position = 'absolute';
canvas.style.left = `${canvasX}px`;
canvas.style.top = `${canvasY}px`;

const GRAVITY = 0.25;
const FLAP = -6;  // Aumentando a força do salto do pássaro
const SPAWN_RATE = 90; // Taxa de aparecimento de canos
let PIPE_WIDTH = 150; // Aumentando a largura dos canos
let PIPE_SPACING = 250; // Aumentando o espaçamento entre os canos
let PIPE_SPEED = 5; // Aumentando a velocidade de movimento dos canos

// Variáveis do pássaro
let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdWidth = 80;
let birdHeight = 80;
let pipes = [];
let score = 0;
let gameOver = false;

// Carregar a imagem do pássaro da pasta "images"
const birdImage = new Image();
birdImage.src = 'image/image1.jpeg';  // Caminho para a imagem do pássaro

// Carregar a imagem do cano
const pipeImage = new Image();
pipeImage.src = 'image/imagecano.jpeg';  // Caminho para a imagem do cano

// Função para desenhar o pássaro
function drawBird() {
    ctx.drawImage(birdImage, 50, birdY, birdWidth, birdHeight);
}

// Função para desenhar os canos usando a imagem
function drawPipes() {
    pipes.forEach(pipe => {
        // Desenhar a parte superior do cano
        ctx.drawImage(pipeImage, pipe.x, 0, PIPE_WIDTH, pipe.top);

        // Desenhar a parte inferior do cano
        ctx.drawImage(pipeImage, pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom);
    });
}

// Função para mover o pássaro
function updateBird() {
    birdVelocity += GRAVITY;
    birdY += birdVelocity;

    if (birdY < 0) birdY = 0; // Limite superior
    if (birdY + birdHeight > canvas.height) {
        birdY = canvas.height - birdHeight; // Limite inferior
        if (!gameOver) {
            endGame();
        }
    }
}

// Função para adicionar canos
function createPipes() {
    if (frames % SPAWN_RATE === 0) {
        const pipeHeight = Math.random() * (canvas.height - PIPE_SPACING);
        pipes.push({
            x: canvas.width,
            top: pipeHeight,
            bottom: pipeHeight + PIPE_SPACING
        });
    }
}

// Função para mover os canos
function movePipes() {
    pipes.forEach(pipe => {
        pipe.x -= PIPE_SPEED; // Velocidade dos canos
    });
    
    // Remover canos fora da tela
    pipes = pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);
}

// Função para detectar colisões
function checkCollisions() {
    pipes.forEach(pipe => {
        if (
            50 + birdWidth > pipe.x &&
            50 < pipe.x + PIPE_WIDTH &&
            (birdY < pipe.top || birdY + birdHeight > pipe.bottom)
        ) {
            if (!gameOver) {
                endGame();
            }
        }
    });
}

// Função de fim de jogo
function endGame() {
    gameOver = true;
    alert('Game Over! Sua pontuação: ' + score);
}

// Função para atualizar a pontuação
function updateScore() {
    pipes.forEach(pipe => {
        if (pipe.x + PIPE_WIDTH < 50 && !pipe.scored) {
            score++;
            pipe.scored = true;
        }
    });
}

// Função para desenhar o placar
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Função de controle do pássaro (ao pressionar espaço)
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !gameOver) {
        birdVelocity = FLAP;
    }
});

// Função de loop do jogo
let frames = 0;
function gameLoop() {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar a tela

    if (gameOver) {
        return;
    }

    updateBird();
    createPipes();
    movePipes();
    checkCollisions();
    updateScore();

    drawBird();
    drawPipes();
    drawScore();

    requestAnimationFrame(gameLoop);
}

// Iniciar o jogo
gameLoop();
