class Levels {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.currentLevel = 1;
        this.levels = this.createLevels();
    }

    createLevels() {
        return {
            1: {
                platforms: [
                    { x: 0, y: 500, width: this.canvasWidth, height: 20 }, // Ground
                    { x: 300, y: 400, width: 200, height: 20 },
                    { x: 600, y: 300, width: 200, height: 20 }
                ],
                questionBlocks: [
                    { x: 400, y: 300, width: 40, height: 40, answered: false, type: 'bonus' },
                    { x: 700, y: 200, width: 40, height: 40, answered: false, type: 'bonus' }
                ],
                checkpoints: [
                    { x: 500, y: 460, width: 40, height: 40, answered: false, type: 'checkpoint' }
                ]
            },
            2: {
                platforms: [
                    { x: 0, y: 500, width: this.canvasWidth, height: 20 },
                    { x: 200, y: 400, width: 150, height: 20 },
                    { x: 450, y: 350, width: 150, height: 20 },
                    { x: 700, y: 300, width: 150, height: 20 }
                ],
                questionBlocks: [
                    { x: 250, y: 300, width: 40, height: 40, answered: false },
                    { x: 500, y: 250, width: 40, height: 40, answered: false },
                    { x: 750, y: 200, width: 40, height: 40, answered: false }
                ]
            },
            3: {
                platforms: [
                    { x: 0, y: 500, width: this.canvasWidth, height: 20 },
                    { x: 150, y: 420, width: 100, height: 20 },
                    { x: 350, y: 350, width: 100, height: 20 },
                    { x: 550, y: 280, width: 100, height: 20 },
                    { x: 750, y: 210, width: 100, height: 20 }
                ],
                questionBlocks: [
                    { x: 200, y: 320, width: 40, height: 40, answered: false },
                    { x: 400, y: 250, width: 40, height: 40, answered: false },
                    { x: 600, y: 180, width: 40, height: 40, answered: false },
                    { x: 800, y: 110, width: 40, height: 40, answered: false }
                ]
            }
        };
    }

    getCurrentLevel() {
        return {
            platforms: this.levels[this.currentLevel].platforms,
            questionBlocks: this.levels[this.currentLevel].questionBlocks,
            draw: (ctx) => this.drawLevel(ctx)
        };
    }

    loadLevel(levelNumber) {
        if (this.levels[levelNumber]) {
            this.currentLevel = levelNumber;
            document.getElementById('level').textContent = `Level: ${this.currentLevel}`;
        }
    }

    drawLevel(ctx) {
        const level = this.levels[this.currentLevel];
        
        // Draw platforms
        ctx.fillStyle = '#666';
        level.platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
        
        // Draw question blocks
        ctx.fillStyle = '#ffd700';
        level.questionBlocks.forEach(block => {
            if (!block.answered) {
                ctx.fillRect(block.x, block.y, block.width, block.height);
                ctx.fillStyle = '#000';
                ctx.font = '20px Arial';
                ctx.fillText('?', block.x + 15, block.y + 25);
                ctx.fillStyle = '#ffd700';
            }
        });
    }
}