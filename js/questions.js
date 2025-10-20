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
        this.currentQuestion = null;
        this.modal = document.getElementById('question-modal');
        this.questionText = document.getElementById('question-text');
        this.answersDiv = document.getElementById('answers');
        this.currentBlock = null; // The block that triggered the question
    }

    getRandomQuestion() {
        return this.questions[Math.floor(Math.random() * this.questions.length)];
    }

    showQuestion(block = null) {
        this.currentQuestion = this.getRandomQuestion();
        this.currentBlock = block;
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

    checkAnswer(answerIndex) {
        const isCorrect = answerIndex === this.currentQuestion.correct;

        if (isCorrect) {
            // If this question was triggered by a block, and it's a bonus, grant reward
            if (this.currentBlock && this.currentBlock.type === 'bonus') {
                const rewards = [
                    { type: 'health', amount: 1 },
                    { type: 'gold', amount: 50 }
                ];
                const reward = rewards[Math.floor(Math.random() * rewards.length)];

                if (reward.type === 'health') {
                    window.gameEngine.player.health = Math.min(3, window.gameEngine.player.health + reward.amount);
                    window.gameEngine.player.updateHeartsUI();
                } else {
                    window.gameEngine.player.collectGold(reward.amount);
                }
            }
        } else {
            // Incorrect answer: deduct one heart
            window.gameEngine.player.takeDamage(1);
        }

        // If a block triggered this question, mark it answered and clear reference
        if (this.currentBlock) {
            this.currentBlock.answered = true;
            // Special handling for checkpoint-type blocks: nudge player back a bit
            if (this.currentBlock.type === 'checkpoint') {
                window.gameEngine.player.x = Math.max(0, window.gameEngine.player.x - 100);
            }
            this.currentBlock = null;
        }

        this.hideQuestion();
        return isCorrect;
    }

    hideQuestion() {
        this.modal.classList.add('hidden');
    }
}