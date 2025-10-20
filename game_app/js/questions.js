class Questions {
    constructor() {
        this.questions = [
            { question: "What gas is the main contributor to the greenhouse effect?", answers: ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"], correct: 1 },
            { question: "Which energy source is renewable?", answers: ["Coal", "Natural gas", "Solar", "Petroleum"], correct: 2 },
            { question: "Which of these is a greenhouse gas?", answers: ["Helium", "Methane", "Neon", "Krypton"], correct: 1 },
            { question: "What is the primary cause of recent global warming?", answers: ["Volcanic activity", "Human greenhouse gas emissions", "Changes in Earth's orbit", "Solar flares"], correct: 1 },
            { question: "Which action reduces household energy use?", answers: ["Leaving lights on", "Using LED bulbs", "Keeping windows open in winter", "Overcharging appliances"], correct: 1 },
            { question: "What does 'renewable' mean for an energy source?", answers: ["It never costs money", "It naturally replenishes", "It is easy to store", "It produces no waste"], correct: 1 },
            { question: "Which of these is NOT renewable?", answers: ["Wind", "Solar", "Coal", "Hydro"], correct: 2 },
            { question: "What is biodiversity?", answers: ["Variety of life in an area", "Amount of rainfall", "Soil fertility", "Air pollution level"], correct: 0 },
            { question: "Which practice helps protect biodiversity?", answers: ["Deforestation", "Habitat restoration", "Overfishing", "Polluting rivers"], correct: 1 },
            { question: "Which human activity is a major cause of deforestation?", answers: ["Urban gardening", "Industrial agriculture and logging", "Reforestation", "Sustainable forestry"], correct: 1 },
            { question: "What is composting?", answers: ["Burning waste", "Turning organic waste into soil amendment", "Dumping plastics in landfills", "Mixing chemicals"], correct: 1 },
            { question: "Which material is commonly recyclable?", answers: ["Glass bottles", "Used tissues", "Greasy pizza boxes (always)", "Wet cardboard in all cases"], correct: 0 },
            { question: "What should you do with used batteries?", answers: ["Throw them in the trash", "Recycle at designated drop-off", "Burn them", "Dump in water"], correct: 1 },
            { question: "Which of these helps reduce plastic waste?", answers: ["Single-use plastic bags", "Refillable containers", "Buying more bottled water", "Using plastic straws"], correct: 1 },
            { question: "What is a carbon sink?", answers: ["A device that emits CO2", "A system that absorbs more CO2 than it emits", "A fossil fuel", "A source of methane"], correct: 1 },
            { question: "Which sector produces a large share of methane emissions?", answers: ["Livestock agriculture", "Solar farms", "Hydropower", "Wind turbines"], correct: 0 },
            { question: "What causes coral bleaching?", answers: ["Cold water", "Warm water and stress", "Increased oxygen", "More fish"], correct: 1 },
            { question: "Which practice conserves water at home?", answers: ["Letting tap run while brushing", "Fixing leaks promptly", "Overwatering lawns", "Washing cars with hose"], correct: 1 },
            { question: "What is sustainable fishing?", answers: ["Catching all available fish", "Harvesting at rates that maintain populations", "Using explosives", "Removing all bycatch"], correct: 1 },
            { question: "Which energy source produces NO direct CO2 emissions?", answers: ["Natural gas", "Coal", "Wind", "Diesel"], correct: 2 },
            { question: "What does 'reduce, reuse, recycle' prioritize first?", answers: ["Recycle", "Reuse", "Reduce", "Replant"], correct: 2 },
            { question: "Why are wetlands important?", answers: ["They increase urban sprawl", "They act as natural water filters and habitats", "They are ideal dumping grounds", "They always need draining"], correct: 1 },
            { question: "Which practice helps soil health?", answers: ["Monoculture farming without rest", "Crop rotation and cover crops", "Overuse of chemical fertilizers", "Excessive tilling"], correct: 1 },
            { question: "What is an example of a nonpoint source of water pollution?", answers: ["A single factory discharge", "Runoff from many farms", "A leaking oil tanker", "A sewage pipe"], correct: 1 },
            { question: "Which product uses the least energy over its life?", answers: ["Disposable single-use items", "Durable reusable items", "Cheap plastic goods", "Products with planned obsolescence"], correct: 1 },
            { question: "What is 'circular economy'?", answers: ["Throw away and buy new", "Design systems to reuse and recycle materials", "Use more virgin resources", "Avoid repairability"], correct: 1 },
            { question: "Which household change reduces electricity use most?", answers: ["Switching to LED bulbs", "Painting walls white", "Using larger TVs", "Leaving appliances on standby"], correct: 0 },
            { question: "What is an effect of air pollution on health?", answers: ["Improved lung function", "Respiratory illnesses", "Stronger immune systems", "No effect"], correct: 1 },
            { question: "Which action reduces food waste?", answers: ["Buying more than needed", "Meal planning and proper storage", "Ignoring expiration dates", "Throwing leftovers away"], correct: 1 },
            { question: "What is a benefit of planting trees in cities?", answers: ["Reduced shade", "Increased heat island effect", "Improved air quality and cooling", "More flooding"], correct: 2 },
            { question: "Which is a consequence of melting glaciers?", answers: ["Rising sea levels", "Decreased ocean levels", "More polar ice", "Lower temperatures"], correct: 0 },
            { question: "What is used to measure air quality?", answers: ["pH", "AQI (Air Quality Index)", "Decibels", "Lux"], correct: 1 },
            { question: "Which is a renewable transport option?", answers: ["Electric vehicle charged by coal only", "Walking and cycling", "Idling a car", "Driving alone long distances"], correct: 1 },
            { question: "What does 'biodegradable' mean?", answers: ["Never breaks down", "Breaks down naturally by organisms", "Always toxic", "Melts in sunlight"], correct: 1 },
            { question: "Which action helps reduce plastic microbeads entering waterways?", answers: ["Using products with microbeads", "Choosing products labeled 'microbead-free'", "Washing microbeads down the drain", "Using more exfoliating beads"], correct: 1 },
            { question: "What is desalination used for?", answers: ["Making seawater drinkable by removing salt", "Adding salt to freshwater", "Cleaning oil spills", "Generating wind power"], correct: 0 },
            { question: "Which farming method can reduce pesticide use?", answers: ["Monoculture without controls", "Integrated pest management (IPM)", "Blanket pesticide application", "Removing beneficial insects"], correct: 1 },
            { question: "What is 'carbon footprint'?", answers: ["The size of a carbon atom", "Total greenhouse gases caused by an activity", "A footprint left in coal", "A measurement of oxygen"], correct: 1 },
            { question: "Which is an example of renewable heating?", answers: ["Gas boiler only", "Heat pump using renewable electricity", "Coal furnace", "Diesel heater"], correct: 1 },
            { question: "What does 'sustainable' generally mean?", answers: ["Beneficial only short-term", "Meets present needs without compromising future generations", "Uses maximum resources now", "Avoids efficiency"], correct: 1 },
            { question: "Which is a major cause of ocean plastic pollution?", answers: ["Proper recycling", "Single-use plastics and littering", "Banning plastics", "Using reusable bags"], correct: 1 },
            { question: "What practice supports pollinators like bees?", answers: ["Removing wildflowers", "Planting diverse native flowers", "Using broad-spectrum pesticides", "Eliminating hedgerows"], correct: 1 }
        ];
        this.currentBlock = null;
        this.activeContext = null;

        this.currentQuestion = null;
        this.modal = document.getElementById('question-modal');
        this.questionText = document.getElementById('question-text');
        this.answersDiv = document.getElementById('answers');
        this.currentQuestion = null;
        this.activeContext = null;
        this.isShowing = false;
        this.currentBlock = null;

        this.buildPools();
    }

    buildPools() {
        this.pools = new Map();
        this.questions.forEach((question) => {
            const difficulty = question.difficulty || 1;
            if (!this.pools.has(difficulty)) {
                this.pools.set(difficulty, []);
            }
            this.pools.get(difficulty).push(question);
        });
        this.resetAvailableQuestions();
    }

    resetAvailableQuestions() {
        this.availableQuestions = new Map();
        this.pools.forEach((questions, difficulty) => {
            this.availableQuestions.set(difficulty, [...questions]);
        });
    }

    getAvailablePool(difficulty) {
        if (!this.availableQuestions.has(difficulty)) {
            this.availableQuestions.set(difficulty, []);
        }

        const pool = this.availableQuestions.get(difficulty);
        if (pool.length === 0 && this.pools.has(difficulty)) {
            this.availableQuestions.set(difficulty, [...this.pools.get(difficulty)]);
        }
        return this.availableQuestions.get(difficulty);
    }

    drawFromPool(difficulty) {
        const pool = this.getAvailablePool(difficulty);
        if (!pool || pool.length === 0) {
            return null;
        }
        const index = Math.floor(Math.random() * pool.length);
        return pool.splice(index, 1)[0];
    }

    getRandomQuestion(difficulty = 1) {
        let question = this.drawFromPool(difficulty);
        if (question) {
            return question;
        }

        const alternatives = Array.from(this.availableQuestions.entries())
            .filter(([, questions]) => questions.length > 0)
            .sort((a, b) => Math.abs(a[0] - difficulty) - Math.abs(b[0] - difficulty));

        if (alternatives.length === 0) {
            this.resetAvailableQuestions();
            question = this.drawFromPool(difficulty);
        } else {
            question = this.drawFromPool(alternatives[0][0]);
        }

        return question;
    }

    shuffleAnswers(question) {
        const choices = question.answers.map((text, index) => ({ text, index }));
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }
        return choices;
    }

    showQuestion({ block = null, type = 'bonus', difficulty = 1 } = {}) {
        if (this.isShowing) {
            return;
        }

        this.activeContext = { block, type };
        this.currentQuestion = this.getRandomQuestion(difficulty);

        if (!this.currentQuestion) {
            return;
        }

        this.questionText.textContent = this.currentQuestion.question;
        this.answersDiv.innerHTML = '';

        const answerOptions = this.shuffleAnswers(this.currentQuestion);
        answerOptions.forEach((option) => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.addEventListener('click', () => this.checkAnswer(option.index));
            this.answersDiv.appendChild(button);
        });

        this.currentBlock = block;
        this.modal.classList.remove('hidden');
        this.isShowing = true;
    }

    isActive() {
        return this.isShowing;
    }

    checkAnswer(selectedIndex) {
        if (!this.currentQuestion) {
            return false;
        }

        Array.from(this.answersDiv.querySelectorAll('button')).forEach((button) => {
            button.disabled = true;
        });

        const { block, type } = this.activeContext || {};
        const difficulty = this.currentQuestion.difficulty || 1;
        const isCorrect = selectedIndex === this.currentQuestion.correct;
        const isCheckpoint = type === 'checkpoint';

        if (isCorrect) {
            if (window.gameEngine && typeof window.gameEngine.addScore === 'function') {
                window.gameEngine.addScore(100);
            }

            if (block) {
                block.answered = true;
                if (isCheckpoint && window.gameEngine?.player) {
                    window.gameEngine.player.setCheckpointFromBlock(block);
                    if (typeof window.gameEngine.addScore === 'function') {
                        window.gameEngine.addScore(20);
                    }
                }
            }
            if (block && block.type === 'bonus') {
                const rewards = [
                    { type: 'health', amount: 1 },
                    { type: 'gold', amount: 50 }
                ];
                const reward = rewards[Math.floor(Math.random() * rewards.length)];

                if (reward.type === 'health') {
                    window.gameEngine.player.health = Math.min(window.gameEngine.player.maxHealth, window.gameEngine.player.health + reward.amount);
                    window.gameEngine.player.updateHeartsUI();
                } else {
                    window.gameEngine.player.collectGold(reward.amount);
                }
            }
        } else {
            // Incorrect answer: deduct one heart
            window.gameEngine.player.takeDamage(1);
            if (block && isCheckpoint) {
                block.answered = false;
            } else if (block) {
                block.answered = true;
            }
        }

        // If a block triggered this question, mark it answered and clear reference
        if (this.currentBlock) {
            if (!isCheckpoint) {
                this.currentBlock.answered = true;
            }
            if (isCheckpoint && !isCorrect) {
                window.gameEngine.player.x = Math.max(0, window.gameEngine.player.x - 100);
            }
        }

        this.currentBlock = null;
        this.hideQuestion();
        return isCorrect;
    }

    handleCorrectAnswer(type, difficulty) {
        const player = window.gameEngine?.player;
        if (!player) {
            return;
        }

        if (type === 'checkpoint') {
            const goldReward = 30 + difficulty * 15;
            player.collectGold(goldReward);
            return;
        }

        const rewards = [
            { type: 'health', min: 10, max: 20 },
            { type: 'gold', min: 35, max: 60 }
        ];

        if (difficulty >= 2) {
            rewards.push({ type: 'gold', min: 55, max: 85 });
        }
        if (difficulty >= 3) {
            rewards.push({ type: 'health', min: 18, max: 32 });
        }

        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        const amount = Math.round(reward.min + Math.random() * (reward.max - reward.min));

        if (reward.type === 'health') {
            player.health = Math.min(player.health + amount, 150);
            document.getElementById('health').textContent = `Health: ${player.health}`;
        } else {
            player.collectGold(amount);
        }
    }

    handleIncorrectAnswer(type, difficulty) {
        const player = window.gameEngine?.player;
        if (!player) {
            return;
        }

        const baseDamage = type === 'checkpoint' ? 25 : 18;
        const damage = baseDamage + (difficulty - 1) * 5;
        player.takeDamage(damage);

        if (type === 'checkpoint') {
            player.x = Math.max(0, player.x - 120);
        }
    }

    hideQuestion() {
        this.modal.classList.add('hidden');
        this.answersDiv.innerHTML = '';
        this.currentQuestion = null;
        this.activeContext = null;
        this.isShowing = false;
        this.currentBlock = null;
    }

    forceClose() {
        if (!this.isShowing) {
            return;
        }
        this.hideQuestion();
    }
}