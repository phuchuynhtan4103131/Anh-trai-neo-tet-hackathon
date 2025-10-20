const PLAYER_COLORS = Object.freeze({
    halo: '#f6e69d',
    haloHighlight: '#fff5ca',
    bodyLight: '#d5f3ff',
    bodyMid: '#b3e1ff',
    bodyShadow: '#8fc6f3',
    faceLight: '#f8d6cf',
    faceShadow: '#e3b5ac',
    eye: '#3f3158',
    wingLight: '#ede4ff',
    wingShadow: '#c5b8ff',
    cloudLight: '#eafbff',
    cloudShadow: '#bde9ff',
    swirl: '#c7cffd'
});

function drawRoundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpForce = -15;        // Stronger jump
        this.gravity = 0.7;          // Increased gravity for snappier feel
        this.onGround = true;
        this.maxHealth = 3;
        this.health = this.maxHealth;
        this.gold = 0;
        this.jumpsLeft = 3;          // Allow triple jump
        this.maxJumps = 3;           // Maximum number of jumps allowed
        this.jumpCooldown = 0;       // Cooldown between jumps
        this.coyoteTime = 0;         // Time window after leaving platform where jump is still allowed
        this.maxCoyoteTime = 6;      // Maximum frames for coyote time
        this.prevX = x;              // Previous frame X (for collision detection)
        this.prevY = y;              // Previous frame Y (for collision detection)
        this.hazardCooldown = 0;     // Invulnerability frames after touching a hazard
        this.startX = x;
        this.startY = y;
        this.spawnX = x;
        this.spawnY = y;
    }

    moveLeft() {
        this.velocityX = -this.speed;
    }

    moveRight() {
        this.velocityX = this.speed;
    }

    stopMoving() {
        this.velocityX = 0;
    }

    jump() {
        // Check if we can jump (either on ground, in coyote time, or have jumps left)
        if (this.jumpCooldown > 0) return; // Prevent jump spam
        
        if (this.onGround || this.coyoteTime > 0 || this.jumpsLeft > 0) {
            // If on ground or in coyote time, reset jump count first
            if (this.onGround || this.coyoteTime > 0) {
                this.jumpsLeft = this.maxJumps - 1;
            } else {
                this.jumpsLeft--;
            }
            
            this.velocityY = this.jumpForce;
            this.onGround = false;
            this.coyoteTime = 0;
        this.hazardCooldown = 0;
            this.jumpCooldown = 4; // Add a small cooldown between jumps
            
            // Slightly reduce the power of subsequent jumps
            if (this.jumpsLeft < this.maxJumps - 1) {
                this.velocityY *= 0.8;
            }
        }
    }

    update() {

        // Handle jump cooldown
        if (this.jumpCooldown > 0) {
            this.jumpCooldown--;
        }

        if (this.hazardCooldown > 0) {
            this.hazardCooldown--;
        }

        // Store previous position for collision checks
        this.prevX = this.x;
        this.prevY = this.y;

        // If we're on the ground but about to move, check if we should start coyote time
        if (this.onGround && this.velocityY !== 0) {
            this.onGround = false;
            this.coyoteTime = 0;
            this.hazardCooldown = 0;
        }

        // Update coyote time
        if (!this.onGround && this.coyoteTime < this.maxCoyoteTime) {
            this.coyoteTime++;
        }

        // Apply gravity if not on ground
        if (!this.onGround) {
            this.velocityY += this.gravity;
            // Apply terminal velocity for falling
            this.velocityY = Math.min(this.velocityY, 20);
        }

        // Update position with boundary checks
        const nextX = this.x + this.velocityX;
        const nextY = this.y + this.velocityY;

        // Check horizontal boundaries
        if (nextX >= 0 && nextX <= window.gameEngine.canvas.width - this.width) {
            this.x = nextX;
        }

        // Update vertical position
        this.y = nextY;

        // Basic ground collision
        if (this.y > window.gameEngine.canvas.height - this.height) {
            this.y = window.gameEngine.canvas.height - this.height;
            this.velocityY = 0;
            this.onGround = true;
            this.jumpsLeft = this.maxJumps;
            this.coyoteTime = 0;
        this.hazardCooldown = 0;
        }

        // Reset jumps when properly on ground
        if (this.onGround) {
            this.jumpsLeft = this.maxJumps;
            this.velocityY = 0; // Ensure we stop any downward movement
        }
    }

    checkPlatformCollision(platform) {
        // Use previous frame position to determine approach
        const nextX = this.x;
        const nextY = this.y;
        const prevX = this.prevX;
        const prevY = this.prevY;

        // A small tolerance to handle float imprecision and frame skips
        const landingTolerance = 6;

        // Basic AABB check for overlap at the new position
        // Use a small epsilon to treat touching edges as collision to avoid falling through
        const eps = 0.001;
        const overlap = (
            nextX < platform.x + platform.width - eps &&
            nextX + this.width > platform.x + eps &&
            nextY < platform.y + platform.height - eps &&
            nextY + this.height > platform.y - eps
        );

        if (!overlap) {
            // If we were standing on this platform and now we are slightly off it, start coyote
            const wasStanding = (prevY + this.height <= platform.y + 1) &&
                                (prevX + this.width > platform.x + eps) &&
                                (prevX < platform.x + platform.width - eps);
            if (wasStanding && this.onGround) {
                this.onGround = false;
                this.coyoteTime = 0;
        this.hazardCooldown = 0;
            }
            return false;
        }

        // If we overlapped, determine how we collided using previous position
        const cameFromAbove = (prevY + this.height) <= platform.y + landingTolerance;
        const cameFromBelow = prevY >= platform.y + platform.height - landingTolerance;
        const cameFromLeft = (prevX + this.width) <= platform.x;
        const cameFromRight = prevX >= platform.x + platform.width;

        if (cameFromAbove) {
            // Landing on top (use previous position check rather than velocity sign)
            this.y = platform.y - this.height;
            this.velocityY = 0;
            this.onGround = true;
            this.jumpsLeft = this.maxJumps;
            this.coyoteTime = 0;
        this.hazardCooldown = 0;
            // Freeze previous Y to the snapped position so next collision check treats us as standing
            this.prevY = this.y;
            return true;
        }

        if (cameFromBelow) {
            // Hit underside
            this.y = platform.y + platform.height;
            if (this.velocityY < 0) this.velocityY = 0;
            return true;
        }

        if (cameFromLeft) {
            this.x = platform.x - this.width;
            this.velocityX = 0;
            return true;
        }

        if (cameFromRight) {
            this.x = platform.x + platform.width;
            this.velocityX = 0;
            return true;
        }

        // Fallback: if overlapping but none of the above, try to resolve by snapping to top when moving downward
        if (this.velocityY >= 0) {
            this.y = platform.y - this.height;
            this.velocityY = 0;
            this.onGround = true;
            this.jumpsLeft = this.maxJumps;
            this.coyoteTime = 0;
        this.hazardCooldown = 0;
            this.prevY = this.y;
            return true;
        }

        return false;
    }

    checkQuestionBlockCollision(block) {
        const collision = (
            this.x < block.x + block.width &&
            this.x + this.width > block.x &&
            this.y < block.y + block.height &&
            this.y + this.height > block.y
        );
        
        if (collision && !block.answered) {
            // Question block hit from any direction
            return true;
        }
        return false;
    }

    collidesWithRect(rect) {
        return (
            this.x < rect.x + rect.width &&
            this.x + this.width > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y
        );
    }

    applyHazardDamage(amount, hazard) {
        if (this.hazardCooldown > 0) {
            return false;
        }

        this.hazardCooldown = 45; // Brief invulnerability to prevent accidental double hits
        if (window.gameEngine && typeof window.gameEngine.addScore === 'function') {
            window.gameEngine.addScore(-20);
        }
        this.takeDamage(1, {
            respawn: true,
            cause: 'hazard',
            useCheckpoint: false
        });
        return true;
    }

    takeDamage(amount, options = {}) {
        const damage = Math.max(0, Math.floor(amount));
        if (damage <= 0) {
            return false;
        }

        const { respawn = false, cause = null, useCheckpoint = true } = options;
        const previousHealth = this.health;
        this.health = Math.max(0, this.health - damage);

        if (this.health !== previousHealth) {
            this.updateHeartsUI();
        }

        if (this.health <= 0) {
            window.gameEngine?.handlePlayerOutOfLives({ cause });
        } else if (respawn) {
            window.gameEngine?.handlePlayerRespawn({ cause, useCheckpoint });
        }

        return this.health !== previousHealth;
    }

    updateHeartsUI() {
        const hearts = document.querySelectorAll('#health-hearts .heart');
        // Hearts are stored left-to-right with data-index 2..0; hide rightmost first
        for (const heart of hearts) {
            const idx = parseInt(heart.getAttribute('data-index'), 10);
            // Show heart if idx < health
            if (idx < this.health) {
                heart.classList.remove('hidden');
            } else {
                heart.classList.add('hidden');
            }
        }
    }

    collectGold(amount) {
        this.gold += amount;
        document.getElementById('gold').textContent = `Gold: ${this.gold}`;
    }

    respawnAtLevelStart(options = {}) {
        const { useCheckpoint = true } = options;
        const canvas = window.gameEngine?.canvas;
        const canvasWidth = canvas ? canvas.width : 0;
        const canvasHeight = canvas ? canvas.height : 0;

        const baseStartX = typeof this.startX === 'number' ? this.startX : 50;
        const baseStartY = typeof this.startY === 'number' ? this.startY : (canvasHeight - this.height);
        const targetX = useCheckpoint && typeof this.spawnX === 'number' ? this.spawnX : baseStartX;
        const targetY = useCheckpoint && typeof this.spawnY === 'number' ? this.spawnY : baseStartY;

        this.x = Math.max(0, Math.min(targetX, canvasWidth - this.width));
        this.y = Math.max(0, Math.min(targetY, canvasHeight - this.height));
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = true;
        this.jumpsLeft = this.maxJumps;
        this.coyoteTime = 0;
        this.hazardCooldown = 0;
    }

    resetPositionToLevelStart(options = {}) {
        this.respawnAtLevelStart(options);
    }

    resetLevelPosition() {
        this.clearCheckpoint();
        this.respawnAtLevelStart({ useCheckpoint: false });
        this.updateHeartsUI();
    }

    reset() {
        this.health = this.maxHealth;
        this.updateHeartsUI();
        this.gold = 0;
        document.getElementById('gold').textContent = `Gold: ${this.gold}`;
        this.clearCheckpoint();
        this.respawnAtLevelStart({ useCheckpoint: false });
    }

    setLevelStartPosition(x, y) {
        this.startX = x;
        this.startY = y;
        this.setDefaultSpawn();
    }

    setDefaultSpawn() {
        this.spawnX = this.startX;
        this.spawnY = this.startY;
    }

    setCheckpointFromBlock(block) {
        if (!block) {
            return;
        }
        const canvas = window.gameEngine?.canvas;
        const canvasWidth = canvas ? canvas.width : (this.spawnX + this.width);
        const canvasHeight = canvas ? canvas.height : (this.spawnY + this.height);

        const landingX = block.x + block.width / 2 - this.width / 2;
        const landingY = block.y - this.height;
        this.spawnX = Math.max(0, Math.min(landingX, canvasWidth - this.width));
        this.spawnY = Math.max(0, Math.min(landingY, canvasHeight - this.height));
    }

    clearCheckpoint() {
        this.setDefaultSpawn();
    }

    draw(ctx) {
        ctx.save();

        const drawX = this.x;
        const drawY = this.y;

        ctx.translate(drawX, drawY);
        
        const w = this.width;
        const h = this.height;

        const cloudHeight = h * 0.28;
        const bodyHeight = h * 0.58;
        const bodyWidth = w * 0.72;
        const bodyX = (w - bodyWidth) / 2;
        const bodyBottom = h - cloudHeight * 0.2;
        const bodyY = bodyBottom - bodyHeight;

        const cloudCenterX = w / 2;
        const cloudTopY = h - cloudHeight;

        ctx.fillStyle = PLAYER_COLORS.cloudShadow;
        ctx.beginPath();
        ctx.ellipse(cloudCenterX, cloudTopY + cloudHeight * 0.75, w * 0.45, cloudHeight * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = PLAYER_COLORS.cloudLight;
        ctx.beginPath();
        ctx.ellipse(cloudCenterX, cloudTopY + cloudHeight * 0.55, w * 0.4, cloudHeight * 0.45, 0, 0, Math.PI * 2);
        ctx.ellipse(cloudCenterX - w * 0.22, cloudTopY + cloudHeight * 0.7, w * 0.22, cloudHeight * 0.4, 0, 0, Math.PI * 2);
        ctx.ellipse(cloudCenterX + w * 0.22, cloudTopY + cloudHeight * 0.7, w * 0.22, cloudHeight * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        const bodyGradient = ctx.createLinearGradient(bodyX, bodyY, bodyX, bodyY + bodyHeight);
        bodyGradient.addColorStop(0, PLAYER_COLORS.bodyLight);
        bodyGradient.addColorStop(0.55, PLAYER_COLORS.bodyMid);
        bodyGradient.addColorStop(1, PLAYER_COLORS.bodyShadow);

        ctx.fillStyle = bodyGradient;
        drawRoundedRect(ctx, bodyX, bodyY, bodyWidth, bodyHeight, w * 0.12);

        ctx.strokeStyle = PLAYER_COLORS.swirl;
        ctx.lineWidth = Math.max(1, w * 0.035);
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(bodyX + bodyWidth * 0.22, bodyY + bodyHeight * 0.45);
        ctx.quadraticCurveTo(
            bodyX + bodyWidth * 0.35,
            bodyY + bodyHeight * 0.1,
            bodyX + bodyWidth * 0.58,
            bodyY + bodyHeight * 0.35
        );
        ctx.quadraticCurveTo(
            bodyX + bodyWidth * 0.75,
            bodyY + bodyHeight * 0.6,
            bodyX + bodyWidth * 0.5,
            bodyY + bodyHeight * 0.72
        );
        ctx.stroke();
        ctx.globalAlpha = 1;

        const faceWidth = bodyWidth * 0.5;
        const faceHeight = bodyHeight * 0.45;
        const faceX = (w - faceWidth) / 2;
        const faceY = bodyY + bodyHeight * 0.38;

        const faceGradient = ctx.createLinearGradient(faceX, faceY, faceX + faceWidth, faceY + faceHeight);
        faceGradient.addColorStop(0, PLAYER_COLORS.faceLight);
        faceGradient.addColorStop(1, PLAYER_COLORS.faceShadow);

        ctx.fillStyle = faceGradient;
        drawRoundedRect(ctx, faceX, faceY, faceWidth, faceHeight, w * 0.08);

        const eyeSize = Math.max(2, faceWidth * 0.12);
        const eyeY = faceY + faceHeight * 0.36;
        const eyeGap = faceWidth * 0.18;

        ctx.fillStyle = PLAYER_COLORS.eye;
        ctx.fillRect(faceX + eyeGap, eyeY, eyeSize, eyeSize * 1.1);
        ctx.fillRect(faceX + faceWidth - eyeGap - eyeSize, eyeY, eyeSize, eyeSize * 1.1);

        const mouthWidth = eyeSize * 0.8;
        const mouthHeight = Math.max(1, eyeSize * 0.25);
        const mouthX = faceX + faceWidth / 2 - mouthWidth / 2;
        const mouthY = eyeY + eyeSize * 1.25;
        ctx.fillRect(mouthX, mouthY, mouthWidth, mouthHeight);

        ctx.fillStyle = PLAYER_COLORS.faceLight;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(faceX + eyeGap - eyeSize * 0.3, eyeY + eyeSize * 0.95, eyeSize * 0.8, 0, Math.PI * 2);
        ctx.arc(faceX + faceWidth - eyeGap + eyeSize * 0.3, eyeY + eyeSize * 0.95, eyeSize * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        const drawWing = (side) => {
            const isLeft = side === 'left';
            const wingWidth = bodyWidth * 0.4;
            const wingHeight = bodyHeight * 0.5;
            const wingTop = bodyY + bodyHeight * 0.3;

            ctx.save();
            ctx.translate(isLeft ? bodyX : bodyX + bodyWidth, wingTop);
            ctx.scale(isLeft ? -1 : 1, 1);

            const wingGradient = ctx.createLinearGradient(0, 0, wingWidth, wingHeight);
            wingGradient.addColorStop(0, PLAYER_COLORS.wingLight);
            wingGradient.addColorStop(1, PLAYER_COLORS.wingShadow);

            ctx.fillStyle = wingGradient;
            ctx.beginPath();
            ctx.moveTo(0, bodyHeight * 0.1);
            ctx.quadraticCurveTo(wingWidth * 0.35, -wingHeight * 0.2, wingWidth, wingHeight * 0.15);
            ctx.quadraticCurveTo(wingWidth * 0.75, wingHeight * 0.45, wingWidth * 0.45, wingHeight * 0.7);
            ctx.quadraticCurveTo(wingWidth * 0.18, wingHeight * 0.9, 0, wingHeight * 0.6);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };

        drawWing('left');
        drawWing('right');

        const haloY = bodyY - h * 0.12;
        ctx.lineWidth = Math.max(1.2, h * 0.04);
        ctx.strokeStyle = PLAYER_COLORS.halo;
        ctx.beginPath();
        ctx.ellipse(w / 2, haloY, bodyWidth * 0.45, h * 0.08, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.lineWidth = Math.max(0.8, h * 0.02);
        ctx.strokeStyle = PLAYER_COLORS.haloHighlight;
        ctx.beginPath();
        ctx.ellipse(w / 2, haloY, bodyWidth * 0.45, h * 0.08, 0, Math.PI * 0.2, Math.PI * 1.1);
        ctx.stroke();

        ctx.restore();
    }
}













