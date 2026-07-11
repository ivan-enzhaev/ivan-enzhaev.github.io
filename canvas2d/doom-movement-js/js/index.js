const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let isStarted = false; // Состояние игры
let player = { x: 3.5, y: 3.5, angle: 0 };
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Управление
const keys = {};
window.onkeydown = (e) => (keys[e.code] = true);
window.onkeyup = (e) => (keys[e.code] = false);

// Рисуем кнопку, если игра не запущена
function drawStartButton() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, 600, 400); // Затемнение
    ctx.fillStyle = "#fff";
    ctx.font = "20px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Нажми здесь, чтобы начать!", 300, 180);
    ctx.fillText("Управление: W, A, S, D", 300, 220);
}

// Слушаем клик по canvas
canvas.addEventListener("click", () => {
    if (!isStarted) {
        isStarted = true;
    }
});

function update() {
    if (keys['KeyW']) {
        player.x += Math.cos(player.angle) * 0.05;
        player.y += Math.sin(player.angle) * 0.05;
    }
    if (keys['KeyA']) {
        player.angle -= 0.05;
    }
    if (keys['KeyS']) {
        player.x -= Math.cos(player.angle) * 0.05;
        player.y -= Math.sin(player.angle) * 0.05;
    }
    if (keys['KeyD']) {
        player.angle += 0.05;
    }
}

function draw() {
    ctx.clearRect(0, 0, 600, 400);

    if (!isStarted) {
        drawStartButton();
    } else {
        // Проходим по ширине экрана
        for (let x = 0; x < 600; x += 5) {
            let rayAngle = player.angle - 0.5 + x / 600;
            let dist = 0;
            let hit = false;

            while (!hit && dist < 16) {
                dist += 0.05;
                let tx = Math.floor(player.x + Math.cos(rayAngle) * dist);
                let ty = Math.floor(player.y + Math.sin(rayAngle) * dist);
                if (map[ty] && map[ty][tx] === 1) hit = true;
            }

            // Рисуем стену
            let wallHeight = 400 / dist;
            ctx.fillStyle = `rgb(${255 / dist}, ${255 / dist}, ${255 / dist})`;
            ctx.fillRect(x, 200 - wallHeight / 2, 5, wallHeight);
        }
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Первый вызов для отрисовки кнопки
loop();
