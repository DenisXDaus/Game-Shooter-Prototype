const canvas = document.getElementById("GL_Canvas");
const ctx = canvas.getContext("2d");

const characterSize = 50;
const characterPos = { x: 50, y: canvas.height / 2 - characterSize / 2 };
const characterSpeed = 5;

const bulletSize = 10;
const bullets = [];

const targetSize = 50;
const targets = [];
const targetSpeed = 3;

let score = 0;
let gameRunning = true;
let lastTargetSpawnTime = Date.now();
const targetSpawnInterval = 3000; // Interval kemunculan target dalam milidetik

function drawCharacter() {
    ctx.beginPath();
    ctx.moveTo(characterPos.x, characterPos.y + characterSize / 2);
    ctx.lineTo(characterPos.x + characterSize, characterPos.y);
    ctx.lineTo(characterPos.x + characterSize, characterPos.y + characterSize);
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();
}

function drawBullet(bullet) {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bulletSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
}

function drawTarget(target) {
    const angle = Math.PI * 2 / 5;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        ctx.lineTo(target.x + targetSize * Math.cos(angle * i - Math.PI / 2), target.y + targetSize * Math.sin(angle * i - Math.PI / 2));
    }
    ctx.closePath();
    ctx.fillStyle = "purple";
    ctx.fill();
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function checkCollision(pos1, size1, pos2, size2) {
    return (
        pos1.x < pos2.x + size2 &&
        pos1.x + size1 > pos2.x &&
        pos1.y < pos2.y + size2 &&
        pos1.y + size1 > pos2.y
    );
}

function gameOver() {
    gameRunning = false;
    setTimeout(() => {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "orange";
        ctx.font = "35px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    }, 100); // Tambahkan sedikit penundaan untuk memastikan layar dibersihkan
}

function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Periksa interval kemunculan target
    if (Date.now() - lastTargetSpawnTime > targetSpawnInterval) {
        const targetPos = { x: canvas.width, y: Math.random() * (canvas.height - targetSize) };
        targets.push(targetPos);
        lastTargetSpawnTime = Date.now();
    }

    for (let i = 0; i < bullets.length; i++) {
        bullets[i].x += 10;
        if (bullets[i].x > canvas.width) {
            bullets.splice(i, 1);
            i--;
        }
    }

    for (let i = 0; i < targets.length; i++) {
        targets[i].x -= targetSpeed;
        if (targets[i].x < 0) {
            targets.splice(i, 1);
            i--;
        }

        if (checkCollision(characterPos, characterSize, targets[i], targetSize)) {
            gameOver();
            return;
        }
    }

    // Periksa tabrakan antara peluru dan target
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < targets.length; j++) {
            if (checkCollision(bullets[i], bulletSize, targets[j], targetSize)) {
                bullets.splice(i, 1);
                targets.splice(j, 1);
                i--;
                score += 10; // Tambahkan skor
                break;
            }
        }
    }

    drawCharacter();
    bullets.forEach(drawBullet);
    targets.forEach(drawTarget);
    drawScore(); // Gambar skor

    requestAnimationFrame(update);
}

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowUp" && characterPos.y > 0) {
        characterPos.y -= characterSpeed;
    } else if (event.code === "ArrowDown" && characterPos.y < canvas.height - characterSize) {
        characterPos.y += characterSpeed;
    } else if (event.code === "Space") {
        bullets.push({ x: characterPos.x + characterSize, y: characterPos.y + characterSize / 2 });
    }
});

update();