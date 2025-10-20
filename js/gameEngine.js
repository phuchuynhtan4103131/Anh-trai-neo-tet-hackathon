const CONGRATS_FUN_FACTS = Object.freeze([
    'Australia’s remote First Nations communities often travel hundreds of kilometres for essential health services, making mobile clinics vital.',
    'Rising living costs in major Australian cities push many young people into shared housing, sparking new community-led support networks.',
    'Vietnam has cut its national poverty rate dramatically since the 1990s, yet rural minorities still face limited access to education resources.',
    'Fast urbanisation in Vietnam strains public transport, so cities like Ho Chi Minh City are investing in metro lines to ease congestion.',
    'Australia’s bushfire seasons highlight how climate events can disrupt schooling and community services for months at a time.',
    'Vietnam’s Mekong Delta communities are adapting to saltwater intrusion by piloting climate-resilient farming cooperatives.'
]);

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.player = null;
        this.questions = null;
        this.levels = null;
        this.currentLevel = 1;
        this.gameState = 'menu'; // menu, playing, paused
        this.funFacts = CONGRATS_FUN_FACTS;
        this.score = 0;
        this.bestScore = 0;

        this.baseCanvasSize = this.calculateBaseCanvasSize();
        this.applyCanvasSize(this.baseCanvasSize);
        window.addEventListener('resize', () => this.lockCanvasSize());

        this.bestScore = this.loadBestScore();
        this.updateScoreUI();
        this.updateBestScoreUI();

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

    loadBestScore() {
        try {
            const stored = localStorage.getItem('ecoquestBestScore');
            const parsed = parseInt(stored, 10);
            return Number.isFinite(parsed) ? parsed : 0;
        } catch (error) {
            return 0;
        }
    }

    saveBestScore() {
        try {
            localStorage.setItem('ecoquestBestScore', String(this.bestScore));
        } catch (error) {
            // Ignore storage failures (for example private browsing)
        }
    }

    updateScoreUI() {
        const scoreEl = document.getElementById('score');
        if (scoreEl) {
            scoreEl.textContent = `Score: ${this.score}`;
        }
    }

    updateBestScoreUI() {
        const mainBest = document.getElementById('best-score');
        if (mainBest) {
            mainBest.textContent = `Best Score: ${this.bestScore}`;
        }
        const summaryBest = document.getElementById('best-score-summary');
        if (summaryBest) {
            summaryBest.textContent = `Best Score: ${this.bestScore}`;
        }
    }

    updateFinalScoreUI() {
        const finalScoreEl = document.getElementById('final-score');
        if (finalScoreEl) {
            finalScoreEl.textContent = `Final Score: ${this.score}`;
        }
    }

    resetScore() {
        this.score = 0;
        this.updateScoreUI();
        this.updateFinalScoreUI();
    }

    addScore(amount = 0) {
        const value = Number(amount);
        if (!Number.isFinite(value) || value === 0) {
            return;
        }
        this.score = Math.max(0, this.score + Math.trunc(value));
        this.updateScoreUI();

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
            this.updateBestScoreUI();
        }
    }

    init() {
        this.player = new Player(50, this.canvas.height - 60);  // Account for player height
        this.questions = new Questions();
        this.levels = new Levels(this.canvas.width, this.canvas.height);
        this.applyEntranceBackground();
        this.preparePlayerForCurrentLevel({ resetHealth: true, resetGold: true });
        this.resetScore();
        this.updateFinalScoreUI();
        this.updateBestScoreUI();
        
        // Setup event listeners
        this.setupEventListeners();
        this.gameLoop();
    }

    setupEventListeners() {
        const playBtn = document.getElementById('play-btn');
        const instructionsBtn = document.getElementById('instructions-btn');
        const backToMenuBtn = document.getElementById('back-to-menu-btn');
        const backBtn = document.getElementById('back-btn');
        const congratsMenuBtn = document.getElementById('congrats-menu-btn');
        const levelMenuBtn = document.getElementById('level-menu-btn');
        const levelSelectClose = document.getElementById('level-select-close');

        if (playBtn) playBtn.addEventListener('click', () => this.startGame());
        if (instructionsBtn) instructionsBtn.addEventListener('click', () => this.showInstructions());
        if (backToMenuBtn) backToMenuBtn.addEventListener('click', () => this.showMainMenu());
        if (backBtn) backBtn.addEventListener('click', () => this.showMainMenu());
        if (congratsMenuBtn) congratsMenuBtn.addEventListener('click', () => this.showMainMenu());
        if (levelMenuBtn) levelMenuBtn.addEventListener('click', () => this.openLevelSelect());
        if (levelSelectClose) levelSelectClose.addEventListener('click', () => this.closeLevelSelect());

        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    applyEntranceBackground() {
        if (typeof Levels !== 'undefined' && typeof Levels.setBackgroundVariant === 'function') {
            Levels.setBackgroundVariant(1);
        }
    }

    applyLevelBackground() {
        if (this.levels && typeof this.levels.updateBackgroundClass === 'function') {
            this.levels.updateBackgroundClass();
        }
    }

    preparePlayerForCurrentLevel(options = {}) {
        if (!this.player) {
            return;
        }

        const { resetHealth = false, resetGold = false } = options;
        const startX = Math.max(0, Math.min(50, this.canvas.width - this.player.width));
        const startY = this.canvas.height - this.player.height;

        this.player.setLevelStartPosition(startX, startY);
        this.player.respawnAtLevelStart({ useCheckpoint: false });

        if (resetHealth) {
            this.player.health = this.player.maxHealth;
            this.player.updateHeartsUI();
        }

        if (resetGold) {
            this.player.gold = 0;
            document.getElementById('gold').textContent = `Gold: ${this.player.gold}`;
        }
    }

    handlePlayerRespawn(options = {}) {
        if (!this.player) {
            return;
        }
        const { useCheckpoint = true } = options;
        this.player.respawnAtLevelStart({ useCheckpoint });
    }

    handlePlayerOutOfLives() {
        if (!this.player || !this.levels) {
            return;
        }

        this.levels = new Levels(this.canvas.width, this.canvas.height);
        this.currentLevel = this.levels.currentLevel;
        this.applyLevelBackground();
        this.preparePlayerForCurrentLevel({ resetHealth: true, resetGold: true });
        this.resetScore();
        this.updateFinalScoreUI();

        if (this.questions) {
            if (typeof this.questions.forceClose === 'function') {
                this.questions.forceClose();
            }
            if (typeof this.questions.resetAvailableQuestions === 'function') {
                this.questions.resetAvailableQuestions();
            }
        }

        this.closeLevelSelect(false);
    }

    populateLevelButtons() {
        const buttonsWrap = document.getElementById('level-select-buttons');
        if (!buttonsWrap || !this.levels) {
            return;
        }

        buttonsWrap.innerHTML = '';
        const maxLevel = this.levels.getMaxLevel ? this.levels.getMaxLevel() : 1;

        for (let i = 1; i <= maxLevel; i += 1) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = `Level ${i}`;
            if (i === this.currentLevel) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', () => this.jumpToLevel(i));
            buttonsWrap.appendChild(btn);
        }
    }

    openLevelSelect() {
        if (this.gameState !== 'playing' && this.gameState !== 'paused') {
            return;
        }

        if (this.questions && this.questions.isActive && this.questions.isActive()) {
            return;
        }

        this.gameState = 'paused';
        if (this.player) {
            this.player.stopMoving();
            this.player.velocityX = 0;
        }

        const modal = document.getElementById('level-select-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }

        this.populateLevelButtons();
    }

    closeLevelSelect(resumeGame = true) {
        const modal = document.getElementById('level-select-modal');
        if (modal) {
            modal.classList.add('hidden');
        }

        if (resumeGame && this.gameState !== 'finished') {
            this.gameState = 'playing';
        }
    }

    jumpToLevel(levelNumber) {
        if (!this.levels) {
            return;
        }

        const loaded = this.levels.loadLevel(levelNumber);
        if (!loaded) {
            return;
        }

        this.currentLevel = levelNumber;
        this.applyLevelBackground();

        const resetToStart = levelNumber === 1;
        this.preparePlayerForCurrentLevel({
            resetHealth: resetToStart,
            resetGold: resetToStart
        });
        if (resetToStart) {
            this.resetScore();
            this.updateFinalScoreUI();
        }

        if (this.questions) {
            if (typeof this.questions.forceClose === 'function') {
                this.questions.forceClose();
            }
            if (typeof this.questions.resetAvailableQuestions === 'function') {
                this.questions.resetAvailableQuestions();
            }
        }

        this.closeLevelSelect();
    }

    getRandomFunFact() {
        if (!Array.isArray(this.funFacts) || this.funFacts.length === 0) {
            return 'Thanks for playing!';
        }
        const index = Math.floor(Math.random() * this.funFacts.length);
        return this.funFacts[index];
    }

    completeGame() {
        this.gameState = 'finished';
        if (this.questions && typeof this.questions.forceClose === 'function') {
            this.questions.forceClose();
        }
        this.closeLevelSelect(false);

        if (this.player) {
            this.player.stopMoving();
            this.player.velocityX = 0;
            this.player.velocityY = 0;
        }

        const factElement = document.getElementById('congrats-fact');
        if (factElement) {
            factElement.textContent = this.getRandomFunFact();
        }

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
        }
        this.updateFinalScoreUI();
        this.updateBestScoreUI();

        this.hideAllScreens();
        const congratsScreen = document.getElementById('congrats-screen');
        if (congratsScreen) {
            congratsScreen.classList.remove('hidden');
        }
    }

    startGame() {
        this.gameState = 'playing';
        this.hideAllScreens();
        document.getElementById('game-area').classList.remove('hidden');
        document.getElementById('game-ui').classList.remove('hidden');
        document.getElementById('back-btn').classList.remove('hidden');
        document.getElementById('level-menu-btn')?.classList.remove('hidden');
        if (this.player) {
            this.resetScore();
            this.preparePlayerForCurrentLevel({ resetHealth: true, resetGold: true });
        }
        this.updateFinalScoreUI();
        this.closeLevelSelect(false);
        // Resize canvas after showing area
        this.resizeCanvas();
        this.applyLevelBackground();
    }

    showInstructions() {
        this.hideAllScreens();
        document.getElementById('instructions-screen')?.classList.remove('hidden');
        this.applyEntranceBackground();
        this.closeLevelSelect(false);
    }

    showMainMenu() {
        this.gameState = 'menu';
        this.hideAllScreens();
        document.getElementById('main-menu')?.classList.remove('hidden');
        this.closeLevelSelect(false);

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
            this.preparePlayerForCurrentLevel({ resetHealth: true, resetGold: true });
        }

        this.applyEntranceBackground();
        this.updateBestScoreUI();
    }

    hideAllScreens() {
        const screens = [
            'main-menu',
            'instructions-screen',
            'game-area',
            'game-ui',
            'back-btn',
            'level-select-modal',
            'level-menu-btn',
            'congrats-screen'
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
                    if (checkpoint.type === 'final') {
                        checkpoint.answered = true;
                        this.completeGame();
                    } else {
                        this.openQuestion(checkpoint);
                    }
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
                this.preparePlayerForCurrentLevel();
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























