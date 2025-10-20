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
    this.health = 3; // Use 3 hearts
        this.gold = 0;
        this.jumpsLeft = 2;          // Allow double jump
        this.maxJumps = 2;           // Maximum number of jumps allowed
        this.jumpCooldown = 0;       // Cooldown between jumps
        this.coyoteTime = 0;         // Time window after leaving platform where jump is still allowed
        this.maxCoyoteTime = 6;      // Maximum frames for coyote time
        this.prevX = x;              // Previous frame X (for collision detection)
        this.prevY = y;              // Previous frame Y (for collision detection)
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

        // Store previous position for collision checks
        this.prevX = this.x;
        this.prevY = this.y;

        // If we're on the ground but about to move, check if we should start coyote time
        if (this.onGround && this.velocityY !== 0) {
            this.onGround = false;
            this.coyoteTime = 0;
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

    takeDamage(amount) {
        this.health -= amount;
        this.updateHeartsUI();
        if (this.health <= 0) {
            // Reset to beginning of current stage/level
            if (window.gameEngine && window.gameEngine.levels) {
                // Reset player position only
                this.resetPositionToLevelStart();
                // Restore full health for the retry
                this.health = 3;
                this.updateHeartsUI();
            } else {
                this.die();
            }
        }
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

    resetPositionToLevelStart() {
        // Move player to level start (x=50) and ground y
        this.x = 50;
        this.y = window.gameEngine.canvas.height - this.height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = true;
        this.jumpsLeft = this.maxJumps;
        this.coyoteTime = 0;
    }

    collectGold(amount) {
        this.gold += amount;
        document.getElementById('gold').textContent = `Gold: ${this.gold}`;
    }

    die() {
        // Reset player position and health
        this.reset();
    }

    reset() {
        this.x = 50;
        this.y = window.gameEngine.canvas.height - this.height;  // Use canvas height for proper positioning
        this.velocityX = 0;
        this.velocityY = 0;
        this.health = 3;
        this.onGround = true;  // Reset ground state
        this.isJumping = false;  // Reset jumping state
        this.updateHeartsUI();
    }

    draw(ctx) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}