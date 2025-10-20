class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpForce = -12;
        this.gravity = 0.5;
        this.onGround = true;
        this.health = 100;
        this.gold = 0;
        this.isJumping = false;  // Track if player is currently in a jump
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
        if (this.onGround && !this.isJumping) {
            this.velocityY = this.jumpForce;
            this.onGround = false;
            this.isJumping = true;
        }
    }

    update() {
        // Apply gravity
        this.velocityY += this.gravity;

        // Update position with boundary checks
        const nextX = this.x + this.velocityX;
        const nextY = this.y + this.velocityY;

        // Check horizontal boundaries
        if (nextX >= 0 && nextX <= window.gameEngine.canvas.width - this.width) {
            this.x = nextX;
        }

        this.y = nextY;

        // Basic ground collision
        if (this.y > window.gameEngine.canvas.height - this.height) {
            this.y = window.gameEngine.canvas.height - this.height;
            this.velocityY = 0;
            this.onGround = true;
            this.isJumping = false;  // Reset jump state when hitting ground
        }

        // Apply terminal velocity
        if (!this.onGround) {
            this.velocityY = Math.min(this.velocityY, 15); // Terminal velocity
        }

        // Debug information
        console.log({
            onGround: this.onGround,
            isJumping: this.isJumping,
            velocityY: this.velocityY,
            y: this.y
        });
    }

    checkPlatformCollision(platform) {
        // Get the player's bounds after movement
        const nextY = this.y + this.velocityY;
        const wasAbove = this.y + this.height <= platform.y;
        
        // Check for collision
        const collision = (
            this.x < platform.x + platform.width &&
            this.x + this.width > platform.x &&
            nextY < platform.y + platform.height &&
            nextY + this.height > platform.y
        );

        if (collision) {
            if (wasAbove && this.velocityY >= 0) {
                // Landing on top of platform
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.onGround = true;
                this.isJumping = false;  // Reset jump state when landing
                return true;
            } else if (this.y > platform.y + platform.height) {
                // Hitting platform from below
                this.y = platform.y + platform.height;
                this.velocityY = 0;
            } else {
                // Side collision
                if (this.x < platform.x) {
                    this.x = platform.x - this.width;
                } else {
                    this.x = platform.x + platform.width;
                }
                this.velocityX = 0;
            }
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
        this.y = 500 - this.height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.health = 100;
        document.getElementById('health').textContent = `Health: ${this.health}`;
    }

    draw(ctx) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}