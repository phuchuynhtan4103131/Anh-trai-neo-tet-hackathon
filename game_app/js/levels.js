class Levels {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.levels = this.createLevels();
        this.maxLevel = Object.keys(this.levels).length;
        this.currentLevel = 1;
        this.updateHud();
        this.updateBackgroundClass();
    }

    createLevels() {
        const groundHeight = Math.max(Math.round(this.canvasHeight * 0.04), 18);
        const groundY = this.canvasHeight - groundHeight;
        const platformHeight = Math.max(Math.round(this.canvasHeight * 0.03), 16);
        const blockSize = 40;

        const clampRectX = (value, width) => {
            return Math.min(Math.max(Math.round(value), 0), this.canvasWidth - width);
        };

        const createGround = () => ({
            x: 0,
            y: groundY,
            width: this.canvasWidth,
            height: groundHeight
        });

        const makePlatform = (xPercent, heightAboveGround, widthPercent, height = platformHeight) => {
            const width = Math.max(Math.round(this.canvasWidth * widthPercent), 90);
            const x = clampRectX(this.canvasWidth * xPercent, width);
            return {
                x,
                y: Math.round(groundY - heightAboveGround),
                width,
                height
            };
        };

        const blockFromPlatform = (platform, overrides = {}) => ({
            x: clampRectX(platform.x + platform.width / 2 - blockSize / 2, blockSize),
            y: Math.round(platform.y - blockSize),
            width: blockSize,
            height: blockSize,
            answered: false,
            type: 'bonus',
            ...overrides
        });

        const blockAtGround = (xPercent, overrides = {}) => ({
            x: clampRectX(this.canvasWidth * xPercent, blockSize),
            y: Math.round(groundY - blockSize),
            width: blockSize,
            height: blockSize,
            answered: false,
            type: 'bonus',
            ...overrides
        });

        const createGroundHazard = (xPercent, widthPercent, height, damage = 20) => {
            const width = Math.max(Math.round(this.canvasWidth * widthPercent), 40);
            const x = clampRectX(this.canvasWidth * xPercent, width);
            return {
                x,
                y: Math.round(groundY - height),
                width,
                height,
                damage
            };
        };

        const createFloatingHazard = (xPercent, heightAboveGround, widthPercent, height, damage = 20) => {
            const width = Math.max(Math.round(this.canvasWidth * widthPercent), 30);
            const x = clampRectX(this.canvasWidth * xPercent, width);
            return {
                x,
                y: Math.round(groundY - heightAboveGround),
                width,
                height,
                damage
            };
        };

        const levels = {};

        // Level 1 - gentle introduction
        const level1Platforms = [
            createGround(),
            makePlatform(0.18, 120, 0.22),
            makePlatform(0.5, 210, 0.2)
        ];

        levels[1] = {
            platforms: level1Platforms,
            questionBlocks: [
                blockFromPlatform(level1Platforms[1]),
                blockFromPlatform(level1Platforms[2])
            ],
            checkpoints: [
                blockAtGround(0.78, { type: 'checkpoint' })
            ],
            hazards: []
        };

        // Level 2 - split paths and first hazards
        const level2Platforms = [
            createGround(),
            makePlatform(0.08, 140, 0.18),
            makePlatform(0.34, 220, 0.18),
            makePlatform(0.6, 150, 0.16),
            makePlatform(0.78, 260, 0.16)
        ];

        levels[2] = {
            platforms: level2Platforms,
            questionBlocks: [
                blockFromPlatform(level2Platforms[1]),
                blockFromPlatform(level2Platforms[2]),
                blockFromPlatform(level2Platforms[4])
            ],
            checkpoints: [
                blockAtGround(0.5, { type: 'checkpoint' })
            ],
            hazards: [
                createGroundHazard(0.45, 0.08, groundHeight + 12, 16)
            ]
        };

        // Level 3 - vertical challenge with multiple hazards
        const level3Platforms = [
            createGround(),
            makePlatform(0.1, 180, 0.16),
            makePlatform(0.3, 280, 0.14),
            makePlatform(0.5, 220, 0.14),
            makePlatform(0.7, 320, 0.18)
        ];

        levels[3] = {
            platforms: level3Platforms,
            questionBlocks: [
                blockFromPlatform(level3Platforms[1]),
                blockFromPlatform(level3Platforms[2]),
                blockFromPlatform(level3Platforms[4])
            ],
            checkpoints: [
                blockAtGround(0.35, { type: 'checkpoint' }),
                blockAtGround(0.68, { type: 'checkpoint' })
            ],
            hazards: [
                createGroundHazard(0.25, 0.06, groundHeight + 18, 20),
                createGroundHazard(0.58, 0.07, groundHeight + 16, 22)
            ]
        };

        // Level 4 - tight jumps with vertical hazards
        const level4Platforms = [
            createGround(),
            makePlatform(0.05, 160, 0.14),
            makePlatform(0.22, 240, 0.12),
            makePlatform(0.38, 320, 0.12),
            makePlatform(0.56, 240, 0.12),
            makePlatform(0.72, 160, 0.16),
            makePlatform(0.58, 380, 0.1)
        ];

        levels[4] = {
            platforms: level4Platforms,
            questionBlocks: [
                blockFromPlatform(level4Platforms[1]),
                blockFromPlatform(level4Platforms[3]),
                blockFromPlatform(level4Platforms[5])
            ],
            checkpoints: [
                blockFromPlatform(level4Platforms[2], { type: 'checkpoint' }),
                blockAtGround(0.82, { type: 'checkpoint' })
            ],
            hazards: [
                createGroundHazard(0.32, 0.05, groundHeight + 20, 22),
                createFloatingHazard(0.46, 260, 0.03, 200, 24),
                createGroundHazard(0.64, 0.05, groundHeight + 24, 24)
            ]
        };

        // Level 5 - gauntlet with alternating platforms and hazards
        const level5Platforms = [
            createGround(),
            makePlatform(0.08, 220, 0.12),
            makePlatform(0.22, 320, 0.1),
            makePlatform(0.35, 260, 0.1),
            makePlatform(0.48, 360, 0.12),
            makePlatform(0.62, 260, 0.12),
            makePlatform(0.76, 180, 0.14),
            makePlatform(0.58, 420, 0.08),
            makePlatform(0.86, 320, 0.09)
        ];

        levels[5] = {
            platforms: level5Platforms,
            questionBlocks: [
                blockFromPlatform(level5Platforms[1]),
                blockFromPlatform(level5Platforms[3]),
                blockFromPlatform(level5Platforms[4]),
                blockFromPlatform(level5Platforms[7])
            ],
            checkpoints: [
                blockAtGround(0.42, { type: 'checkpoint' }),
                blockFromPlatform(level5Platforms[6], { type: 'checkpoint' }),
                blockAtGround(0.92, { type: 'final' })
            ],
            hazards: [
                createGroundHazard(0.3, 0.06, groundHeight + 24, 26),
                createFloatingHazard(0.52, 300, 0.022, 210, 28),
                createFloatingHazard(0.7, 210, 0.02, 140, 26),
                createGroundHazard(0.82, 0.05, groundHeight + 18, 28)
            ]
        };

        return levels;
    }

    getCurrentLevel() {
        return this.levels[this.currentLevel];
    }

    loadLevel(levelNumber) {
        if (!this.levels[levelNumber]) {
            return false;
        }

        this.currentLevel = levelNumber;
        this.updateHud();
        this.updateBackgroundClass();
        return true;
    }

    updateHud() {
        const levelDisplay = document.getElementById('level');
        if (levelDisplay) {
            levelDisplay.textContent = `Level: ${this.currentLevel}`;
        }
    }

    updateBackgroundClass() {
        if (typeof Levels.setBackgroundVariant !== 'function') {
            return;
        }

        const totalVariants = Levels.BACKGROUND_VARIANT_COUNT || 1;
        const normalizedIndex = ((this.currentLevel - 1) % totalVariants) + 1;
        Levels.setBackgroundVariant(normalizedIndex);
    }

    getMaxLevel() {
        return this.maxLevel;
    }

    drawCurrentLevel(ctx) {
        const level = this.getCurrentLevel();
        if (!level) {
            return;
        }

        ctx.save();

        // Draw platforms
        level.platforms.forEach((platform) => {
            // Fill
            ctx.fillStyle = '#666';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            // Border
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        });

        // Draw hazards
        if (level.hazards && level.hazards.length > 0) {
            level.hazards.forEach((hazard) => {
                ctx.save();

                // Fill hazard
                ctx.fillStyle = '#ff6b6b';
                ctx.fillRect(hazard.x, hazard.y, hazard.width, hazard.height);

                // Add black border
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.strokeRect(hazard.x, hazard.y, hazard.width, hazard.height);

                ctx.restore();
            });
        }

        // Draw question blocks
        level.questionBlocks.forEach((block) => {
            if (block.answered) {
                return;
            }
            ctx.save();
            ctx.fillStyle = '#ffe066';
            ctx.fillRect(block.x, block.y, block.width, block.height);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeRect(block.x, block.y, block.width, block.height);

            const symbolSize = Math.max(16, block.width * 0.4);
            ctx.font = `${symbolSize}px "Press Start 2P", cursive`;
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', block.x + block.width / 2, block.y + block.height / 2 + symbolSize * 0.05);
            ctx.restore();
        });

        // Draw checkpoints
        if (level.checkpoints) {
            level.checkpoints.forEach((checkpoint) => {
                ctx.save();

                const baseColor = checkpoint.type === 'final' ? '#9b5de5' : '#74b9ff';
                if (checkpoint.answered) {
                    ctx.restore();
                    return;
                }
                ctx.fillStyle = checkpoint.answered ? 'rgba(116, 185, 255, 0.3)' : baseColor;
                ctx.fillRect(checkpoint.x, checkpoint.y, checkpoint.width, checkpoint.height);
                ctx.strokeStyle = '#0c2461';
                ctx.lineWidth = 3;
                ctx.strokeRect(checkpoint.x, checkpoint.y, checkpoint.width, checkpoint.height);

                if (!checkpoint.answered) {
                    const label = checkpoint.type === 'final' ? 'GO' : 'C';
                    const size = Math.max(14, checkpoint.width * 0.32);
                    ctx.font = `${size}px "Press Start 2P", cursive`;
                    ctx.fillStyle = '#0c2461';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(label, checkpoint.x + checkpoint.width / 2, checkpoint.y + checkpoint.height / 2 + size * 0.05);
                }

                ctx.restore();
            });
        }

        ctx.restore();
    }
}

Levels.BACKGROUND_VARIANT_COUNT = 5;

Levels.setBackgroundVariant = function setBackgroundVariant(variantIndex) {
    const container = document.getElementById('game-container');
    if (!container || typeof variantIndex !== 'number') {
        return;
    }

    if (!container.classList.contains('clouds-bg')) {
        container.classList.add('clouds-bg');
    }

    const classesToRemove = Array.from(container.classList).filter((cls) => cls.startsWith('clouds-bg-'));
    classesToRemove.forEach((cls) => container.classList.remove(cls));

    const legacyClasses = Array.from(container.classList).filter((cls) => cls.startsWith('level-') && cls.endsWith('-bg'));
    legacyClasses.forEach((cls) => container.classList.remove(cls));

    const totalVariants = Levels.BACKGROUND_VARIANT_COUNT || 1;
    const normalizedIndex = ((variantIndex - 1) % totalVariants + totalVariants) % totalVariants + 1;

    container.classList.add(`clouds-bg-${normalizedIndex}`);
};