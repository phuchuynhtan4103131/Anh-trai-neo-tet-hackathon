class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.player = null;
        this.questions = null;
        this.levels = null;
        this.currentLevel = 1;
        this.gameState = 'menu'; // menu, playing, paused

        this.baseCanvasSize = this.calculateBaseCanvasSize();
        this.applyCanvasSize(this.baseCanvasSize);
        window.addEventListener('resize', () => this.lockCanvasSize());

        this.init();
    }

    calculateBaseCanvasSize() {
        const widthTarget = Math.round(window.innerWidth * 0.8);
        const heightTarget = Math.round(window.innerHeight * 0.7);

        const maxWidth = Math.max(window.innerWidth - 20, 360);
        const maxHeight = Math.max(window.innerHeight - 40, 300);
        const minWidth = Math.min(window.innerWidth - 40, 720);
        const minHeight = Math.min(window.innerHeight - 80, 480);

        const width = Math.min(Math.max(widthTarget, minWidth), maxWidth);
        const height = Math.min(Math.max(heightTarget, minHeight), maxHeight);

        return { width, height };
    }

    applyCanvasSize(size) {
        this.canvas.width = size.width;
        this.canvas.height = size.height;
    }

    lockCanvasSize() {
        this.applyCanvasSize(this.baseCanvasSize);
    }

    init() {
        this.player = new Player(50, this.canvas.height - 60);  // Account for player height
        this.questions = new Questions();
        this.levels = new Levels(this.canvas.width, this.canvas.height);
        // Ensure hearts UI reflects player's health
        if (this.player && typeof this.player.updateHeartsUI === 'function') {
            this.player.updateHeartsUI();
        }
        
        // Setup event listeners
        this.setupEventListeners();
        this.gameLoop();
    }

    setupEventListeners() {
        const playBtn = document.getElementById('play-btn');
        const instructionsBtn = document.getElementById('instructions-btn');
        const backToMenuBtn = document.getElementById('back-to-menu-btn');
        const backBtn = document.getElementById('back-btn');

        if (playBtn) playBtn.addEventListener('click', () => this.startGame());
        if (instructionsBtn) instructionsBtn.addEventListener('click', () => this.showInstructions());
        if (backToMenuBtn) backToMenuBtn.addEventListener('click', () => this.showMainMenu());
        if (backBtn) backBtn.addEventListener('click', () => this.showMainMenu());

        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    startGame() {
        this.gameState = 'playing';
        this.hideAllScreens();
        document.getElementById('game-area').classList.remove('hidden');
        document.getElementById('game-ui').classList.remove('hidden');
        document.getElementById('back-btn').classList.remove('hidden');
        // Resize canvas after showing area
        this.resizeCanvas();
    }

    showInstructions() {
        this.hideAllScreens();
        document.getElementById('instructions-screen')?.classList.remove('hidden');
    }

    showMainMenu() {
        this.gameState = 'menu';
        this.hideAllScreens();
        document.getElementById('main-menu')?.classList.remove('hidden');

        if (this.questions) {
            this.questions.forceClose();
            this.questions.resetAvailableQuestions();
        }

        if (this.player) {
            this.player.reset();
        }

        if (this.levels) {
            this.levels = new Levels(this.canvas.width, this.canvas.height);
            this.currentLevel = this.levels.currentLevel;
        }
    }

    hideAllScreens() {
        const screens = [
            'main-menu',
            'instructions-screen',
            'game-area',
            'game-ui',
            'back-btn'
        ];

        screens.forEach((screenId) => {
            const el = document.getElementById(screenId);
            if (el) {
                el.classList.add('hidden');
            }
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
                e.preventDefault();
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

    openQuestion(block) {
        const type = block.type || 'bonus';
        const difficulty = this.getDifficultyForLevel(this.currentLevel, type);

        this.questions.showQuestion({
            block,
            type,
            difficulty
        });
    }

    getDifficultyForLevel(level, type) {
        if (type === 'checkpoint') {
            return Math.min(3, Math.max(2, level - 1));
        }

        if (level <= 2) return 1;
        if (level <= 4) return 2;
        return 3;
    }

    checkCollisions() {
        const currentLevelData = this.levels.getCurrentLevel();
        if (!currentLevelData) {
            return;
        }

        const groundThreshold = this.canvas.height - this.player.height - 0.5;
        let isGrounded = this.player.y >= groundThreshold;

        for (const platform of currentLevelData.platforms) {
            if (this.player.checkPlatformCollision(platform)) {
                isGrounded = true;
            }
        }

        this.player.onGround = isGrounded;
        if (isGrounded) {
            this.player.isJumping = false;
        }

        if (!this.questions.isActive() && currentLevelData.questionBlocks) {
            for (const block of currentLevelData.questionBlocks) {
                if (!block.answered && this.player.checkQuestionBlockCollision(block)) {
                    this.openQuestion(block);
                    break;
                }
            }
        }

        if (!this.questions.isActive() && currentLevelData.checkpoints) {
            for (const checkpoint of currentLevelData.checkpoints) {
                if (!checkpoint.answered && this.player.checkQuestionBlockCollision(checkpoint)) {
                    this.openQuestion(checkpoint);
                    break;
                }
            }
        }

        if (currentLevelData.hazards) {
            currentLevelData.hazards.forEach((hazard) => {
                if (this.player.collidesWithRect(hazard)) {
                    this.player.applyHazardDamage(hazard.damage || 20, hazard);
                }
            });
        }
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.player.update();
        this.checkCollisions();

        const goalLine = this.canvas.width - this.player.width - 10;
        if (this.player.x >= goalLine) {
            const nextLevel = this.currentLevel + 1;
            if (this.levels.loadLevel(nextLevel)) {
                this.currentLevel = nextLevel;
                this.player.reset();
            } else {
                this.player.x = goalLine - 5;
                this.player.velocityX = 0;
            }
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameState === 'playing') {
            this.levels.drawCurrentLevel(this.ctx);
            this.player.draw(this.ctx);
        }
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}
