class Questions {
    constructor() {
        this.questions = [
            {
                question: 'What is the primary driver of current climate change?',
                answers: [
                    'Greenhouse gases from human activity',
                    'Earth\'s natural cooling cycle',
                    'Solar flares from the sun',
                    'Volcanic ash in the stratosphere'
                ],
                correct: 0,
                difficulty: 1
            },
            {
                question: 'Which daily habit most effectively lowers your household electricity use?',
                answers: [
                    'Leaving devices on standby',
                    'Running the dishwasher half full',
                    'Turning off unused lights and appliances',
                    'Keeping blinds closed all day'
                ],
                correct: 2,
                difficulty: 1
            },
            {
                question: 'Which energy source is renewable and produces no direct emissions?',
                answers: [
                    'Coal',
                    'Solar power',
                    'Natural gas',
                    'Diesel'
                ],
                correct: 1,
                difficulty: 1
            },
            {
                question: 'Which item should always go in the recycling bin if it is clean and dry?',
                answers: [
                    'Greasy pizza box',
                    'Plastic shopping bag',
                    'Ceramic coffee mug',
                    'Aluminum drink can'
                ],
                correct: 3,
                difficulty: 1
            },
            {
                question: 'What simple switch helps reduce single-use plastic waste the most?',
                answers: [
                    'Buying bottled water in bulk',
                    'Carrying a reusable water bottle',
                    'Using plastic straws only on weekends',
                    'Replacing plastic bags with paper bags'
                ],
                correct: 1,
                difficulty: 1
            },
            {
                question: 'What do we call planting trees to restore a damaged forest?',
                answers: [
                    'Soil sequestration',
                    'Ocean fertilisation',
                    'Reforestation',
                    'Geoengineering'
                ],
                correct: 2,
                difficulty: 2
            },
            {
                question: 'Which farming technique delivers water directly to plant roots to minimise evaporation?',
                answers: [
                    'Flood irrigation',
                    'Sprinkler watering',
                    'Drip irrigation',
                    'Center pivot irrigation'
                ],
                correct: 2,
                difficulty: 2
            },
            {
                question: 'What is the best description of a circular economy?',
                answers: [
                    'A focus on exporting goods abroad',
                    'Materials reused and remanufactured to avoid waste',
                    'Producing more goods with cheaper materials',
                    'An economy powered entirely by fossil fuels'
                ],
                correct: 1,
                difficulty: 2
            },
            {
                question: 'Which technology stores renewable energy so it can be used when the wind or sun is unavailable?',
                answers: [
                    'Diesel generators',
                    'Grid-scale batteries',
                    'Coal stockpiles',
                    'Gasoline reserves'
                ],
                correct: 1,
                difficulty: 2
            },
            {
                question: 'What is a major benefit of restoring mangrove forests?',
                answers: [
                    'Mangroves speed up offshore drilling',
                    'Mangroves provide shade for coral bleaching',
                    'Mangroves protect coasts and store carbon',
                    'Mangroves lower ocean salinity for shipping'
                ],
                correct: 2,
                difficulty: 2
            },
            {
                question: 'Which sector currently releases the largest share of global greenhouse gases?',
                answers: [
                    'International tourism',
                    'Residential heating',
                    'Electricity and heat production',
                    'Textile manufacturing'
                ],
                correct: 2,
                difficulty: 3
            },
            {
                question: 'Which international agreement seeks to keep global warming well below 2 degrees Celsius?',
                answers: [
                    'Kyoto Protocol',
                    'Montreal Protocol',
                    'Paris Agreement',
                    'Basel Convention'
                ],
                correct: 2,
                difficulty: 3
            },
            {
                question: 'What is the process of removing carbon dioxide directly from ambient air called?',
                answers: [
                    'Smokestack scrubbing',
                    'Direct air capture',
                    'Photosynthetic offsetting',
                    'Carbon netting'
                ],
                correct: 1,
                difficulty: 3
            },
            {
                question: 'What are scope 3 emissions for a company?',
                answers: [
                    'Emissions from in-house electricity use',
                    'Emissions from employee commuting only',
                    'Indirect emissions across the full supply chain',
                    'Emissions from government regulation'
                ],
                correct: 2,
                difficulty: 3
            },
            {
                question: 'What is the biggest challenge for producing green hydrogen today?',
                answers: [
                    'Lack of global demand',
                    'High production cost due to electricity needs',
                    'No available water sources',
                    'Too much methane leakage'
                ],
                correct: 1,
                difficulty: 3
            }
        ];

        this.modal = document.getElementById('question-modal');
        this.questionText = document.getElementById('question-text');
        this.answersDiv = document.getElementById('answers');
        this.currentQuestion = null;
        this.activeContext = null;
        this.isShowing = false;

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

        if (block) {
            block.answered = true;
        }

        if (isCorrect) {
            this.handleCorrectAnswer(type, difficulty);
        } else {
            this.handleIncorrectAnswer(type, difficulty);
        }

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
    }

    forceClose() {
        if (!this.isShowing) {
            return;
        }
        this.hideQuestion();
    }
}
