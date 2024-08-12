
const profileSelect = document.getElementById('profile-select');
const usernameInput = document.getElementById('username');
const createProfileButton = document.getElementById('create-profile-button');
const startButton = document.getElementById('start-button');
const quizContainer = document.getElementById('quiz-container');
const categorySpan = document.getElementById('selected-category');
const questionElement = document.getElementById('question');
const hintButton = document.getElementById('hint-button');
const hintElement = document.getElementById('hint');
const answerButtons = document.getElementById('answer-buttons');
const timerElement = document.getElementById('timer-count');
const progressElement = document.getElementById('progress');
const progressFill = document.getElementById('progress-fill');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const leaderboardContainer = document.getElementById('leaderboard-container');
const leaderboardList = document.getElementById('leaderboard-list');
const categorySelect = document.getElementById('category-select');
const difficultySelect = document.getElementById('difficulty');
const timerLengthSelect = document.getElementById('timer-length');
const questionBankContainer = document.getElementById('question-bank-container');
const newQuestionInput = document.getElementById('new-question');
const newHintInput = document.getElementById('new-hint');
const newCategorySelect = document.getElementById('new-category');
const newDifficultySelect = document.getElementById('new-difficulty');
const newAnswersInput = document.getElementById('new-answers');
const addQuestionButton = document.getElementById('add-question-button');
const editQuestionIdInput = document.getElementById('edit-question-id');
const editQuestionButton = document.getElementById('edit-question-button');
const achievementsContainer = document.getElementById('achievements-container');
const achievementsList = document.getElementById('achievements-list');
const multiplayerContainer = document.getElementById('multiplayer-container');
const multiplayerRoomInput = document.getElementById('multiplayer-room');
const joinRoomButton = document.getElementById('join-room-button');
const createRoomButton = document.getElementById('create-room-button');
const chatContainer = document.getElementById('chat-container');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendMessageButton = document.getElementById('send-message-button');
const multiplayerQuestionsContainer = document.getElementById('multiplayer-questions-container');
const multiplayerAnswerButtons = document.getElementById('multiplayer-answer-buttons');
const multiplayerTimerElement = document.getElementById('multiplayer-timer-count');
const multiplayerProgressElement = document.getElementById('multiplayer-progress');
const multiplayerProgressFill = document.getElementById('multiplayer-progress-fill');
const multiplayerScoreElement = document.getElementById('multiplayer-score-value');
const feedbackElement = document.getElementById('feedback');
const analyticsContainer = document.getElementById('analytics-container');
const questionPerformanceList = document.getElementById('question-performance-list');

let currentQuestionIndex = 0;
let score = 0;
let highScore = 0;
let questions = [];
let currentCategory = '';
let currentDifficulty = '';
let currentTimerLength = 30;
let leaderboard = [];
let profiles = [];
let currentProfile = '';
let multiplayerRoom = '';
let multiplayerScore = 0;
let questionPerformance = [];

function loadProfiles() {
    const profilesFromStorage = JSON.parse(localStorage.getItem('profiles')) || [];
    profiles = profilesFromStorage;
    profileSelect.innerHTML = profiles.map(profile => `<option value="${profile.name}">${profile.name}</option>`).join('');
}

function switchProfile() {
    currentProfile = profileSelect.value;
}

function createProfile() {
    const username = usernameInput.value;
    if (username) {
        profiles.push({ name: username, highScore: 0 });
        localStorage.setItem('profiles', JSON.stringify(profiles));
        loadProfiles();
        profileSelect.value = username;
        currentProfile = username;
    }
}

function startGame() {
    quizContainer.classList.remove('hide');
    loadQuestions();
    startTimer();
}

function loadQuestions() {
    // Simulate loading questions from a question bank
    questions = [
        { question: 'What is the capital of France?', answers: ['Paris', 'London', 'Berlin', 'Rome'], correct: 'Paris', hint: 'It\'s known as the city of lights.' },
        { question: 'What is 2 + 2?', answers: ['3', '4', '5', '6'], correct: '4', hint: 'It\'s an even number.' }
    ];
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(questionObj) {
    questionElement.textContent = questionObj.question;
    hintElement.textContent = questionObj.hint;
    answerButtons.innerHTML = questionObj.answers.map(answer => 
        `<button class="btn" onclick="submitAnswer('${answer}')">${answer}</button>`
    ).join('');
    hintElement.classList.add('hide');
    feedbackElement.classList.add('hide');
}

function showHint() {
    hintElement.classList.remove('hide');
}

function submitAnswer(answer) {
    const questionObj = questions[currentQuestionIndex];
    if (answer === questionObj.correct) {
        score += 10;
        feedbackElement.textContent = 'Correct!';
        updateQuestionPerformance(questionObj.question, true);
    } else {
        feedbackElement.textContent = `Incorrect! The correct answer was ${questionObj.correct}.`;
        updateQuestionPerformance(questionObj.question, false);
    }
    feedbackElement.classList.remove('hide');
    nextQuestion();
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        endGame();
    }
}

function endGame() {
    quizContainer.classList.add('hide');
    scoreContainer.classList.remove('hide');
    scoreElement.textContent = score;
    highScore = Math.max(score, highScore);
    highScoreElement.textContent = highScore;
    updateLeaderboard();
    showAnalytics();
}

function updateLeaderboard() {
    leaderboard.push({ name: currentProfile, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboardList.innerHTML = leaderboard.map(entry => 
        `<li>${entry.name}: ${entry.score}</li>`
    ).join('');
}

function filterLeaderboard() {
    // Filtering logic for leaderboard
}

function changeCategory() {
    currentCategory = categorySelect.value;
    loadQuestions();
}

function addQuestion() {
    const question = newQuestionInput.value;
    const hint = newHintInput.value;
    const category = newCategorySelect.value;
    const difficulty = newDifficultySelect.value;
    const answers = newAnswersInput.value.split(',').map(a => a.trim());
    const correct = answers.shift();
    questions.push({ question, hint, category, difficulty, answers, correct });
    alert('Question added!');
}

function editQuestion() {
    const id = parseInt(editQuestionIdInput.value);
    if (id >= 0 && id < questions.length) {
        const question = newQuestionInput.value;
        const hint = newHintInput.value;
        const category = newCategorySelect.value;
        const difficulty = newDifficultySelect.value;
        const answers = newAnswersInput.value.split(',').map(a => a.trim());
        const correct = answers.shift();
        questions[id] = { question, hint, category, difficulty, answers, correct };
        alert('Question edited!');
    }
}

function updateAchievements() {
    // Update the achievements list
}

function createRoom() {
    multiplayerRoom = 'ROOM' + Math.floor(Math.random() * 10000);
    multiplayerRoomInput.value = multiplayerRoom;
    multiplayerContainer.classList.remove('hide');
}

function joinRoom() {
    multiplayerRoom = multiplayerRoomInput.value;
    if (multiplayerRoom) {
        multiplayerContainer.classList.remove('hide');
    }
}

function sendMessage() {
    const message = chatInput.value;
    if (message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `You: ${message}`;
        chatMessages.appendChild(messageElement);
        chatInput.value = '';
    }
}

function startMultiplayerGame() {
    multiplayerQuestionsContainer.classList.remove('hide');
    // Initialize multiplayer game state here
}

function updateMultiplayerQuestion(question, answers) {
    document.getElementById('multiplayer-question').textContent = question;
    const buttonsHtml = answers.map(answer => 
        `<button class="btn" onclick="submitMultiplayerAnswer('${answer}')">${answer}</button>`
    ).join('');
    multiplayerAnswerButtons.innerHTML = buttonsHtml;
}

function submitMultiplayerAnswer(answer) {
    // Handle multiplayer answer submission
}

function updateMultiplayerScore(score) {
    multiplayerScoreElement.textContent = score;
}

function updateMultiplayerTimer(time) {
    multiplayerTimerElement.textContent = time;
    // Implement multiplayer timer logic
}

function updateMultiplayerProgress(questionNumber, totalQuestions) {
    document.getElementById('multiplayer-current-question').textContent = questionNumber;
    document.getElementById('multiplayer-total-questions').textContent = totalQuestions;
    // Update multiplayer progress bar here
}

function updateQuestionPerformance(question, correct) {
    const performance = {
        question: question,
        correct: correct,
        timestamp: new Date().toLocaleString()
    };
    questionPerformance.push(performance);
    localStorage.setItem('questionPerformance', JSON.stringify(questionPerformance));
}

function showAnalytics() {
    analyticsContainer.classList.remove('hide');
    const performanceData = JSON.parse(localStorage.getItem('questionPerformance')) || [];
    questionPerformanceList.innerHTML = performanceData.map(data => 
        `<li>${data.question}: ${data.correct ? 'Correct' : 'Incorrect'} (${data.timestamp})</li>`
    ).join('');
}

// Initialize game
loadProfiles();



function loadProfiles() {
    const profilesFromStorage = JSON.parse(localStorage.getItem('profiles')) || [];
    profiles = profilesFromStorage;
    profileSelect.innerHTML = profiles.map(profile => `<option value="${profile.name}">${profile.name}</option>`).join('');
}

function switchProfile() {
    currentProfile = profileSelect.value;
}

function createProfile() {
    const username = usernameInput.value;
    if (username) {
        profiles.push({ name: username, highScore: 0 });
        localStorage.setItem('profiles', JSON.stringify(profiles));
        loadProfiles();
        profileSelect.value = username;
        currentProfile = username;
    }
}

function startGame() {
    quizContainer.classList.remove('hide');
    loadQuestions();
    startTimer();
}

function loadQuestions() {
    // Simulate loading questions from a question bank
    questions = [
        { question: 'What is the capital of France?', answers: ['Paris', 'London', 'Berlin', 'Rome'], correct: 'Paris', hint: 'It\'s known as the city of lights.' },
        { question: 'What is 2 + 2?', answers: ['3', '4', '5', '6'], correct: '4', hint: 'It\'s an even number.' }
    ];
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(questionObj) {
    questionElement.textContent = questionObj.question;
    hintElement.textContent = questionObj.hint;
    answerButtons.innerHTML = questionObj.answers.map(answer => 
        `<button class="btn" onclick="submitAnswer('${answer}')">${answer}</button>`
    ).join('');
    hintElement.classList.add('hide');
}

function showHint() {
    hintElement.classList.remove('hide');
}

function submitAnswer(answer) {
    const questionObj = questions[currentQuestionIndex];
    if (answer === questionObj.correct) {
        score += 10;
    }
    nextQuestion();
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        endGame();
    }
}

function endGame() {
    quizContainer.classList.add('hide');
    scoreContainer.classList.remove('hide');
    scoreElement.textContent = score;
    highScore = Math.max(score, highScore);
    highScoreElement.textContent = highScore;
    updateLeaderboard();
}

function updateLeaderboard() {
    leaderboard.push({ name: currentProfile, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboardList.innerHTML = leaderboard.map(entry => 
        `<li>${entry.name}: ${entry.score}</li>`
    ).join('');
}

function filterLeaderboard() {
    // Filtering logic for leaderboard
}

function changeCategory() {
    currentCategory = categorySelect.value;
    loadQuestions();
}

function addQuestion() {
    const question = newQuestionInput.value;
    const hint = newHintInput.value;
    const category = newCategorySelect.value;
    const difficulty = newDifficultySelect.value;
    const answers = newAnswersInput.value.split(',').map(a => a.trim());
    const correct = answers.shift();
    questions.push({ question, hint, category, difficulty, answers, correct });
    alert('Question added!');
}

function editQuestion() {
    const id = parseInt(editQuestionIdInput.value);
    if (id >= 0 && id < questions.length) {
        const question = newQuestionInput.value;
        const hint = newHintInput.value;
        const category = newCategorySelect.value;
        const difficulty = newDifficultySelect.value;
        const answers = newAnswersInput.value.split(',').map(a => a.trim());
        const correct = answers.shift();
        questions[id] = { question, hint, category, difficulty, answers, correct };
        alert('Question edited!');
    }
}

function updateAchievements() {
    // Update the achievements list
}

function createRoom() {
    multiplayerRoom = 'ROOM' + Math.floor(Math.random() * 10000);
    multiplayerRoomInput.value = multiplayerRoom;
    multiplayerContainer.classList.remove('hide');
}

function joinRoom() {
    multiplayerRoom = multiplayerRoomInput.value;
    if (multiplayerRoom) {
        multiplayerContainer.classList.remove('hide');
    }
}

function sendMessage() {
    const message = chatInput.value;
    if (message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `You: ${message}`;
        chatMessages.appendChild(messageElement);
        chatInput.value = '';
    }
}

function startMultiplayerGame() {
    multiplayerQuestionsContainer.classList.remove('hide');
    // Initialize multiplayer game state here
}

function updateMultiplayerQuestion(question, answers) {
    document.getElementById('multiplayer-question').textContent = question;
    const buttonsHtml = answers.map(answer => 
        `<button class="btn" onclick="submitMultiplayerAnswer('${answer}')">${answer}</button>`
    ).join('');
    multiplayerAnswerButtons.innerHTML = buttonsHtml;
}

function submitMultiplayerAnswer(answer) {
    // Handle multiplayer answer submission
}

function updateMultiplayerScore(score) {
    multiplayerScoreElement.textContent = score;
}

function updateMultiplayerTimer(time) {
    multiplayerTimerElement.textContent = time;
    // Implement multiplayer timer logic
}

function updateMultiplayerProgress(questionNumber, totalQuestions) {
    document.getElementById('multiplayer-current-question').textContent = questionNumber;
    document.getElementById('multiplayer-total-questions').textContent = totalQuestions;
    // Update multiplayer progress bar here
}

// Initialize game
loadProfiles();

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
