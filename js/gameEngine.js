class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.player = null;
        this.questions = null;
        this.levels = null;
        this.currentLevel = 1;
        this.gameState = 'menu'; // menu, playing, paused
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize game components
        this.init();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = window.innerHeight * 0.7;
    }

    init() {
        // Initialize game components
        this.player = new Player(50, this.canvas.height - 60);  // Account for player height
        this.questions = new Questions();
        this.levels = new Levels(this.canvas.width, this.canvas.height);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.gameLoop();
    }

    setupEventListeners() {
        // Menu buttons
        document.getElementById('play-btn').addEventListener('click', () => this.startGame());
        document.getElementById('instructions-btn').addEventListener('click', () => this.showInstructions());
        document.getElementById('back-to-menu-btn').addEventListener('click', () => this.showMainMenu());
        document.getElementById('back-btn').addEventListener('click', () => this.showMainMenu());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    startGame() {
        this.gameState = 'playing';
        this.hideAllScreens();
        this.canvas.classList.remove('hidden');
        document.getElementById('game-ui').classList.remove('hidden');
        document.getElementById('back-btn').classList.remove('hidden');
    }

    showInstructions() {
        this.hideAllScreens();
        document.getElementById('instructions-screen').classList.remove('hidden');
    }

    showMainMenu() {
        this.gameState = 'menu';
        this.hideAllScreens();
        document.getElementById('main-menu').classList.remove('hidden');
        
        // Reset game state if needed
        if (this.player) {
            this.player.reset();
        }
    }

    hideAllScreens() {
        const screens = [
            'main-menu',
            'instructions-screen',
            'gameCanvas',
            'game-ui',
            'back-btn'
        ];
        
        screens.forEach(screenId => {
            document.getElementById(screenId).classList.add('hidden');
        });
    }

    handleKeyDown(e) {
        if (this.gameState !== 'playing') return;
        
        switch (e.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.player.moveLeft();
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.player.moveRight();
                break;
            case 'Space':
            case 'ArrowUp':
            case 'KeyW':
                e.preventDefault(); // Prevent page scrolling or button activation
                this.player.jump();
                break;
        }
    }

    handleKeyUp(e) {
        if (this.gameState !== 'playing') return;
        
        switch (e.code) {
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'KeyA':
            case 'KeyD':
                this.player.stopMoving();
                break;
        }
    }

    checkCollisions() {
        // Check collisions with platforms
        const currentLevel = this.levels.getCurrentLevel();
        const groundThreshold = this.canvas.height - this.player.height - 0.5;
        let isGrounded = this.player.y >= groundThreshold;

        // Check platform collisions
        for (const platform of currentLevel.platforms) {
            if (this.player.checkPlatformCollision(platform)) {
                isGrounded = true;
            }
        }

        this.player.onGround = isGrounded;
        if (isGrounded) {
            this.player.isJumping = false;
        }

        // Check collisions with question blocks
        for (const block of currentLevel.questionBlocks) {
            if (this.player.checkQuestionBlockCollision(block) && !block.answered) {
                this.questions.showQuestion();
                // Mark as answered only for bonus blocks
                if (block.type === 'bonus') {
                    block.answered = true;
                }
            }
        }

        // Check collisions with checkpoints
        if (currentLevel.checkpoints) {
            for (const checkpoint of currentLevel.checkpoints) {
                if (this.player.checkQuestionBlockCollision(checkpoint) && !checkpoint.answered) {
                    this.questions.showQuestion('checkpoint');
                    checkpoint.answered = true;
                }
            }
        }
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.player.update();
        this.checkCollisions();
        
        // Check if level is complete
        if (this.player.x >= this.canvas.width - 50) {
            this.currentLevel++;
            this.levels.loadLevel(this.currentLevel);
            this.player.reset();
        }
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameState === 'playing') {
            // Draw current level
            this.levels.getCurrentLevel().draw(this.ctx);
            
            // Draw player
            this.player.draw(this.ctx);
        }
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}
