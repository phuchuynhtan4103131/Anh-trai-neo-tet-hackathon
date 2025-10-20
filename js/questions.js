class Questions {
    constructor() {
        this.questions = [
            {
                question: "What is the primary cause of global warming?",
                answers: [
                    "Greenhouse gas emissions from human activities",
                    "Natural climate cycles",
                    "Solar radiation changes",
                    "Volcanic eruptions"
                ],
                correct: 0
            },
            {
                question: "Which action helps reduce your carbon footprint?",
                answers: [
                    "Using disposable products",
                    "Taking longer showers",
                    "Using public transportation",
                    "Leaving lights on when not in use"
                ],
                correct: 2
            },
            {
                question: "What is a renewable energy source?",
                answers: [
                    "Coal",
                    "Natural gas",
                    "Solar power",
                    "Oil"
                ],
                correct: 2
            },
            {
                question: "Which of these is NOT a consequence of deforestation?",
                answers: [
                    "Increased oxygen production",
                    "Loss of biodiversity",
                    "Soil erosion",
                    "Climate change"
                ],
                correct: 0
            },
            {
                question: "What can you do to reduce plastic pollution?",
                answers: [
                    "Use single-use plastic bags",
                    "Buy products with minimal packaging",
                    "Dispose of plastics in water bodies",
                    "Increase plastic consumption"
                ],
                correct: 1
            }
        ];
        this.currentQuestion = null;
        this.modal = document.getElementById('question-modal');
        this.questionText = document.getElementById('question-text');
        this.answersDiv = document.getElementById('answers');
    }

    getRandomQuestion() {
        return this.questions[Math.floor(Math.random() * this.questions.length)];
    }

    showQuestion() {
        this.currentQuestion = this.getRandomQuestion();
        this.questionText.textContent = this.currentQuestion.question;
        
        // Clear previous answers
        this.answersDiv.innerHTML = '';
        
        // Create answer buttons
        this.currentQuestion.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.addEventListener('click', () => this.checkAnswer(index));
            this.answersDiv.appendChild(button);
        });
        
        this.modal.classList.remove('hidden');
    }

    checkAnswer(answerIndex, questionType = 'bonus') {
        const isCorrect = answerIndex === this.currentQuestion.correct;
        
        if (isCorrect) {
            if (questionType === 'bonus') {
                // Bonus question rewards
                const rewards = [
                    { type: 'health', amount: 20 },
                    { type: 'gold', amount: 50 }
                ];
                const reward = rewards[Math.floor(Math.random() * rewards.length)];
                
                if (reward.type === 'health') {
                    window.gameEngine.player.health += reward.amount;
                    document.getElementById('health').textContent = `Health: ${window.gameEngine.player.health}`;
                } else {
                    window.gameEngine.player.collectGold(reward.amount);
                }
            }
            // For checkpoints, just let them pass
        } else {
            // Incorrect answer
            window.gameEngine.player.takeDamage(questionType === 'checkpoint' ? 30 : 20);
            
            if (questionType === 'checkpoint') {
                // Reset player to before checkpoint
                window.gameEngine.player.x -= 100;
            }
        }
        
        this.hideQuestion();
        return isCorrect;
    }

    hideQuestion() {
        this.modal.classList.add('hidden');
    }
}