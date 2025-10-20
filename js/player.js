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
        this.health = 100;
        this.gold = 0;
        this.jumpsLeft = 2;          // Allow double jump
        this.maxJumps = 2;           // Maximum number of jumps allowed
        this.jumpCooldown = 0;       // Cooldown between jumps
        this.coyoteTime = 0;         // Time window after leaving platform where jump is still allowed
        this.maxCoyoteTime = 6;      // Maximum frames for coyote time
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
        // Get the player's bounds
        const nextX = this.x + this.velocityX;
        const nextY = this.y + this.velocityY;
        const wasAbove = this.y + this.height <= platform.y;
        const wasBelow = this.y >= platform.y + platform.height;
        const wasLeft = this.x + this.width <= platform.x;
        const wasRight = this.x >= platform.x + platform.width;

        // Projected position collision check
        const willCollide = (
            nextX < platform.x + platform.width &&
            nextX + this.width > platform.x &&
            nextY < platform.y + platform.height &&
            nextY + this.height > platform.y
        );

        if (!willCollide) {
            // If we were standing on this platform and now we're not
            if (wasAbove && this.onGround && 
                this.x + this.width > platform.x && 
                this.x < platform.x + platform.width) {
                this.onGround = false;
                this.coyoteTime = 0;
            }
            return false;
        }

        // Handle collisions based on approach direction
        if (wasAbove) {
            // Landing on top of platform
            if (this.velocityY >= 0) {
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.onGround = true;
                this.jumpsLeft = this.maxJumps;
                this.coyoteTime = 0;
                return true;
            }
        } else if (wasBelow) {
            // Hitting from below
            this.y = platform.y + platform.height;
            this.velocityY = 0;
        } else if (wasLeft) {
            // Hitting from left
            this.x = platform.x - this.width;
            this.velocityX = 0;
        } else if (wasRight) {
            // Hitting from right
            this.x = platform.x + platform.width;
            this.velocityX = 0;
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
        document.getElementById('health').textContent = `Health: ${this.health}`;
        if (this.health <= 0) {
            this.die();
        }
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
        this.health = 100;
        this.onGround = true;  // Reset ground state
        this.isJumping = false;  // Reset jumping state
        document.getElementById('health').textContent = `Health: ${this.health}`;
    }

    draw(ctx) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}