const profileContainer = document.getElementById('profile-container');
const usernameInput = document.getElementById('username');
const startButton = document.getElementById('start-button');
const questionContainer = document.getElementById('quiz-container');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');
const reviewButton = document.getElementById('review-button');
const timerCount = document.getElementById('timer-count');
const scoreElement = document.getElementById('score');
const scoreContainer = document.getElementById('score-container');
const highScoreElement = document.getElementById('high-score');
const categoryElement = document.getElementById('category');
const progressElement = document.getElementById('progress');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const difficultySelect = document.getElementById('difficulty');
const timerLengthSelect = document.getElementById('timer-length');
const profileNameElement = document.getElementById('profile-name');
const reviewContainer = document.getElementById('review-container');
const answerReviewList = document.getElementById('answer-review-list');
const leaderboardContainer = document.getElementById('leaderboard-container');
const leaderboardList = document.getElementById('leaderboard-list');
const hintButton = document.getElementById('hint-button');
const hintElement = document.getElementById('hint');
const difficultyFilter = document.getElementById('difficulty-filter');
const categorySelect = document.getElementById('category-select');
const performanceMetrics = document.getElementById('performance-metrics');
const avgResponseTimeElement = document.getElementById('avg-response-time');
const accuracyElement = document.getElementById('accuracy');

const questions = {
    Geography: {
        easy: [
            {
                question: 'What is the capital of France?',
                hint: 'It is also known as the City of Lights.',
                answers: [
                    { text: 'Berlin', correct: false },
                    { text: 'Madrid', correct: false },
                    { text: 'Paris', correct: true },
                    { text: 'Rome', correct: false }
                ]
            }
        ],
        medium: [
            {
                question: 'Which is the largest continent?',
                hint: 'It is home to the Great Wall of China.',
                answers: [
                    { text: 'Africa', correct: false },
                    { text: 'Asia', correct: true },
                    { text: 'Europe', correct: false },
                    { text: 'Australia', correct: false }
                ]
            }
        ]
    },
    Literature: {
        easy: [
            {
                question: 'Is "To Kill a Mockingbird" written by Harper Lee?',
                hint: 'The author is known for this classic novel.',
                answers: [
                    { text: 'True', correct: true },
                    { text: 'False', correct: false }
                ]
            }
        ]
    },
    // Add other categories and difficulties similarly...
};

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft;
let highScore = localStorage.getItem('highScore') || 0;
let username = 'Guest';
let answerHistory = [];
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let currentDifficulty = 'easy';
let currentCategory = '';

function startGame() {
    username = usernameInput.value || 'Guest';
    profileNameElement.innerText = username;

    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = score;
    highScoreElement.innerText = highScore;

    currentDifficulty = difficultySelect.value;
    currentCategory = categorySelect.value;

    const questionsArray = getQuestionsForCategoryAndDifficulty();
    totalQuestionsElement.innerText = questionsArray.length;

    nextButton.classList.add('hide');
    reviewButton.classList.add('hide');
    scoreContainer.classList.add('hide');
    reviewContainer.classList.add('hide');
    leaderboardContainer.classList.add('hide');
    profileContainer.classList.add('hide');
    questionContainer.classList.remove('hide');
    hintElement.classList.add('hide');
    performanceMetrics.classList.add('hide');

    answerHistory = [];
    showQuestion(questionsArray[currentQuestionIndex]);

    // Load saved progress if any
    const savedProgress = JSON.parse(localStorage.getItem('savedProgress'));
    if (savedProgress && savedProgress.username === username) {
        currentQuestionIndex = savedProgress.questionIndex;
        score = savedProgress.score;
        scoreElement.innerText = score;
        showQuestion(getQuestionsForCategoryAndDifficulty()[currentQuestionIndex]);
    }
}

function showQuestion(question) {
    categoryElement.innerText = `Category: ${question.category || 'All'}`;
    questionContainer.querySelector('#question').innerText = question.question;
    hintElement.innerText = question.hint;
    answerButtons.innerHTML = '';
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer));
        answerButtons.appendChild(button);
    });
    startTimer();
    currentQuestionElement.innerText = currentQuestionIndex + 1;
    updateProgressBar();
}

function selectAnswer(answer) {
    clearInterval(timer);
    const correct = answer.correct;
    if (correct) {
        alert('Correct!');
        score++;
        scoreElement.innerText = score;
    } else {
        alert('Wrong!');
        if (answerHistory.length < 5) {
            answerHistory.push({
                question: document.getElementById('question').innerText,
                selectedAnswer: answer.text,
                correct: correct
            });
        }
    }
    nextButton.classList.remove('hide');
}

function nextQuestion() {
    currentQuestionIndex++;
    const questionsArray = getQuestionsForCategoryAndDifficulty();
    if (currentQuestionIndex < questionsArray.length) {
        showQuestion(questionsArray[currentQuestionIndex]);
        nextButton.classList.add('hide');
        saveProgress();
    } else {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreElement.innerText = highScore;
        }
        leaderboard.push({ username, score, difficulty: currentDifficulty, category: currentCategory });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        showLeaderboard();
        questionContainer.classList.add('hide');
        scoreContainer.classList.remove('hide');
        reviewButton.classList.remove('hide');
        performanceMetrics.classList.remove('hide');
        calculatePerformanceMetrics();
    }
}

function startTimer() {
    timeLeft = parseInt(timerLengthSelect.value, 10);
    timerCount.innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerCount.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            selectAnswer({ correct: false }); // Time's up, mark as incorrect
        }
    }, 1000);
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / (totalQuestionsElement.innerText - 1)) * 100;
    progressFill.style.width = `${progress}%`;
}

function showHint() {
    hintElement.classList.remove('hide');
}

function reviewAnswers() {
    reviewContainer.classList.remove('hide');
    answerReviewList.innerHTML = '';
    answerHistory.forEach(answer => {
        const listItem = document.createElement('li');
        listItem.innerText = `${answer.question} - Your Answer: ${answer.selectedAnswer} - ${answer.correct ? 'Correct' : 'Incorrect'}`;
        answerReviewList.appendChild(listItem);
    });
}

function showLeaderboard() {
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboardContainer.classList.remove('hide');
    leaderboardList.innerHTML = '';
    filterLeaderboard();
}

function filterLeaderboard() {
    const filterValue = difficultyFilter.value;
    leaderboardList.innerHTML = '';
    leaderboard
        .filter(entry => (!filterValue || entry.difficulty === filterValue) && (!currentCategory || entry.category === currentCategory))
        .forEach(entry => {
            const listItem = document.createElement('li');
            listItem.innerText = `${entry.username} (${entry.difficulty}, ${entry.category}): ${entry.score}`;
            leaderboardList.appendChild(listItem);
        });
}

function changeCategory() {
    currentCategory = categorySelect.value;
    startGame();
}

function getQuestionsForCategoryAndDifficulty() {
    if (currentCategory) {
        return questions[currentCategory][currentDifficulty] || [];
    } else {
        return Object.values(questions).flatMap(cat => cat[currentDifficulty] || []);
    }
}

function saveProgress() {
    const progress = {
        username,
        questionIndex: currentQuestionIndex,
        score
    };
    localStorage.setItem('savedProgress', JSON.stringify(progress));
}

function calculatePerformanceMetrics() {
    const totalAnswers = answerHistory.length;
    const correctAnswers = answerHistory.filter(answer => answer.correct).length;
    const avgResponseTime = timeLeft > 0 ? (parseInt(timerLengthSelect.value, 10) - timeLeft) / totalAnswers : 0;
    avgResponseTimeElement.innerText = avgResponseTime.toFixed(2);
    accuracyElement.innerText = ((correctAnswers / totalAnswers) * 100).toFixed(2) + '%';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function Mockgame() {
    username = usernameInput.value || 'Guest';
    profileNameElement.innerText = username;

    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = score;
    highScoreElement.innerText = highScore;

    currentDifficulty = difficultySelect.value;
    const questionsArray = shuffleArray(questions[currentDifficulty]);
    totalQuestionsElement.innerText = questionsArray.length;

    nextButton.classList.add('hide');
    reviewButton.classList.add('hide');
    scoreContainer.classList.add('hide');
    reviewContainer.classList.add('hide');
    leaderboardContainer.classList.add('hide');
    profileContainer.classList.add('hide');
    questionContainer.classList.remove('hide');
    hintElement.classList.add('hide');

    answerHistory = [];
    showQuestion(questionsArray[currentQuestionIndex]);
}

function showQuest(question) {
    categoryElement.innerText = `Category: ${question.category}`;
    questionContainer.querySelector('#question').innerText = question.question;
    hintElement.innerText = question.hint;
    answerButtons.innerHTML = '';
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer));
        answerButtons.appendChild(button);
    });
    startTimer();
    currentQuestionElement.innerText = currentQuestionIndex + 1;
    updateProgressBar();
}
function endTimer() {
    timeLeft = parseInt(timerLengthSelect.value, 10);
    timerCount.innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerCount.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            selectAnswer({ correct: false }); // Time's up, mark as incorrect
        }
    }, 1000);
}

function swgrateProgressBar() {
    const progress = (currentQuestionIndex / (totalQuestionsElement.innerText - 1)) * 100;
    progressFill.style.width = `${progress}%`;
}

function shownone() {
    hintElement.classList.remove('hide');
}

function WrongAnswers() {
    reviewContainer.classList.remove('hide');
    answerReviewList.innerHTML = '';
    answerHistory.forEach(answer => {
        const listItem = document.createElement('li');
        listItem.innerText = `${answer.question} - Your Answer: ${answer.selectedAnswer} - ${answer.correct ? 'Correct' : 'Incorrect'}`;
        answerReviewList.appendChild(listItem);
    });
}
