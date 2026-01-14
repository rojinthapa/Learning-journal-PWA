document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const highEl = document.getElementById('high-score');
    const startOverlay = document.getElementById('start-overlay');
    const startBtn = document.getElementById('start-btn');

    // --- GAME STATE ---
    let gameLoop;
    let score = 0;
    let frames = 0;
    let isGameOver = false;
    let highScore = localStorage.getItem('shooterHighScore') || 0;
    if(highEl) highEl.textContent = highScore;

    // --- PLAYER ---
    const player = {
        x: canvas.width / 2 - 20,
        y: canvas.height - 50,
        w: 40,
        h: 40,
        speed: 5,
        color: '#58a6ff'
    };

    let bullets = [];
    let enemies = [];
    let particles = [];

    // --- INPUT HANDLER ---
    const keys = { Right: false, Left: false };

    // 1. Keyboard Controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') keys.Right = true;
        if (e.key === 'ArrowLeft') keys.Left = true;
        if (e.code === 'Space') shoot();
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowRight') keys.Right = false;
        if (e.key === 'ArrowLeft') keys.Left = false;
    });

    // 2. Mobile SWIPE Controls (New!)
    let touchStartX = null;

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Stop scrolling
        touchStartX = e.touches[0].clientX;

        // Optional: Tap screen to shoot
        shoot();
    }, {passive: false});

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Stop scrolling
        if (!touchStartX) return;

        let touchCurrentX = e.touches[0].clientX;
        let diffX = touchCurrentX - touchStartX;

        // Move player by the difference (1:1 tracking)
        player.x += diffX;

        // Clamp to screen bounds
        if (player.x < 0) player.x = 0;
        if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

        // Reset start for continuous movement
        touchStartX = touchCurrentX;
    }, {passive: false});

    canvas.addEventListener('touchend', () => {
        touchStartX = null;
    });


    // 3. Mega D-Pad Controls
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnFire = document.getElementById('btn-fire');

    function attachTouch(btn, key) {
        if(!btn) return;
        // Use 'touchstart' for instant reaction
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keys[key] = true;
            btn.classList.add('active');
        }, {passive: false});

        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            keys[key] = false;
            btn.classList.remove('active');
        });
    }

    attachTouch(btnLeft, 'Left');
    attachTouch(btnRight, 'Right');

    if(btnFire) {
        btnFire.addEventListener('touchstart', (e) => {
            e.preventDefault();
            shoot();
            btnFire.classList.add('active');
        }, {passive: false});

        btnFire.addEventListener('touchend', (e) => {
            e.preventDefault();
            btnFire.classList.remove('active');
        });

        // Keep mouse support for desktop testing
        btnFire.addEventListener('mousedown', shoot);
    }

    // GAME LOGIC
    function shoot() {
        if(isGameOver) return;
        bullets.push({
            x: player.x + player.w / 2 - 2,
            y: player.y,
            w: 4,
            h: 10,
            speed: 7,
            color: '#f0883e'
        });
    }

    function createExplosion(x, y, color) {
        for(let i=0; i<8; i++) {
            particles.push({
                x: x, y: y,
                dx: (Math.random() - 0.5) * 4,
                dy: (Math.random() - 0.5) * 4,
                radius: Math.random() * 3,
                life: 20,
                color: color
            });
        }
    }

    function update() {
        frames++;

        // Keyboard Movement (Swipe handled in event listener)
        if (keys.Right && player.x + player.w < canvas.width) player.x += player.speed;
        if (keys.Left && player.x > 0) player.x -= player.speed;

        // Move Bullets
        bullets.forEach((b, index) => {
            b.y -= b.speed;
            if (b.y < 0) bullets.splice(index, 1);
        });

        // Spawn Enemies
        if (frames % 60 === 0) {
            enemies.push({
                x: Math.random() * (canvas.width - 30),
                y: -30,
                w: 30,
                h: 30,
                speed: 2 + Math.random() * 1.5,
                color: '#da3633'
            });
        }

        // Move Enemies & Collisions
        enemies.forEach((enemy, eIndex) => {
            enemy.y += enemy.speed;

            // Player Hit
            if (
                player.x < enemy.x + enemy.w &&
                player.x + player.w > enemy.x &&
                player.y < enemy.y + enemy.h &&
                player.y + player.h > enemy.y
            ) {
                endGame();
            }

            // Bullet Hit
            bullets.forEach((bullet, bIndex) => {
                if (
                    bullet.x < enemy.x + enemy.w &&
                    bullet.x + bullet.w > enemy.x &&
                    bullet.y < enemy.y + enemy.h &&
                    bullet.y + bullet.h > enemy.y
                ) {
                    createExplosion(enemy.x + enemy.w/2, enemy.y + enemy.h/2, enemy.color);
                    enemies.splice(eIndex, 1);
                    bullets.splice(bIndex, 1);
                    score += 10;
                    scoreEl.textContent = score;
                }
            });

            if (enemy.y > canvas.height) enemies.splice(eIndex, 1);
        });

        // Particles
        particles.forEach((p, i) => {
            p.x += p.dx;
            p.y += p.dy;
            p.life--;
            if(p.life <= 0) particles.splice(i, 1);
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Player
        ctx.fillStyle = player.color;
        ctx.beginPath();
        ctx.moveTo(player.x + player.w/2, player.y);
        ctx.lineTo(player.x + player.w, player.y + player.h);
        ctx.lineTo(player.x, player.y + player.h);
        ctx.fill();

        // Bullets
        bullets.forEach(b => {
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, b.w, b.h);
        });

        // Enemies
        enemies.forEach(e => {
            ctx.fillStyle = e.color;
            ctx.fillRect(e.x, e.y, e.w, e.h);
            // Eyes
            ctx.fillStyle = "black";
            ctx.fillRect(e.x + 5, e.y + 10, 5, 5);
            ctx.fillRect(e.x + 20, e.y + 10, 5, 5);
        });

        // Particles
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
            ctx.fill();
        });
    }

    function loop() {
        if(isGameOver) return;
        update();
        draw();
        gameLoop = requestAnimationFrame(loop);
    }

    function startGame() {
        isGameOver = false;
        score = 0;
        frames = 0;
        scoreEl.textContent = score;
        bullets = [];
        enemies = [];
        particles = [];
        player.x = canvas.width / 2 - 20;

        startOverlay.style.display = 'none';
        loop();
    }

    function endGame() {
        isGameOver = true;
        cancelAnimationFrame(gameLoop);
        startOverlay.style.display = 'flex';
        startBtn.textContent = `💥 GAME OVER (${score}) - RESTART`;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('shooterHighScore', highScore);
            if(highEl) highEl.textContent = highScore;
        }
    }

    if(startBtn) startBtn.addEventListener('click', startGame);
});
                   
