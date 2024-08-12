const profileContainer = document.getElementById('profile-container');
const profileSelect = document.getElementById('profile-select');
const usernameInput = document.getElementById('username');
const createProfileButton = document.getElementById('create-profile-button');
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
const avgResponseTimeElement = document.getElementById('avg-response-time');
const accuracyElement = document.getElementById('accuracy');
const totalQuestionsAnsweredElement = document.getElementById('total-questions-answered');
const avgScoreElement = document.getElementById('avg-score');
const reviewContainer = document.getElementById('review-container');
const answerReviewList = document.getElementById('answer-review-list');
const leaderboardContainer = document.getElementById('leaderboard-container');
const leaderboardList = document.getElementById('leaderboard-list');
const hintButton = document.getElementById('hint-button');
const hintElement = document.getElementById('hint');
const difficultyFilter = document.getElementById('difficulty-filter');
const categorySelect = document.getElementById('category-select');
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

let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let questions = JSON.parse(localStorage.getItem('questions')) || {};
let currentProfile;
let currentQuestionIndex = 0;
let score = 0;
let highScore = 0;
let currentDifficulty;
let currentCategory;
let timer;
let timeLeft;
let answerHistory = [];
let achievements = JSON.parse(localStorage.getItem('achievements')) || [];

function loadProfiles() {
    profileSelect.innerHTML = '<option value="">Select Profile</option>';
    profiles.forEach(profile => {
        const option = document.createElement('option');
        option.value = profile.name;
        option.innerText = profile.name;
        profileSelect.appendChild(option);
    });
    if (profiles.length > 0) {
        profileSelect.value = profiles[0].name;
        currentProfile = profiles[0];
        usernameInput.value = currentProfile.name;
        loadProfile();
    }
}

function switchProfile() {
    const selectedProfileName = profileSelect.value;
    currentProfile = profiles.find(profile => profile.name === selectedProfileName);
    usernameInput.value = currentProfile.name;
    loadProfile();
}

function createProfile() {
    const name = usernameInput.value;
    if (name && !profiles.some(profile => profile.name === name)) {
        profiles.push({ name, highScore: 0 });
        localStorage.setItem('profiles', JSON.stringify(profiles));
        loadProfiles();
    }
}

function loadProfile() {
    username = currentProfile.name;
    profileNameElement.innerText = username;
    highScore = currentProfile.highScore;
    highScoreElement.innerText = highScore;
    startGame();
}

function startGame() {
    if (!currentProfile) {
        alert('Please select or create a profile first.');
        return;
    }
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = score;
    totalQuestionsAnsweredElement.innerText = 0;
    avgScoreElement.innerText = 0;

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
    performanceMetrics.classList.remove('hide');

    answerHistory = [];
    showQuestion(questionsArray[currentQuestionIndex]);
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
    totalQuestionsAnsweredElement.innerText = currentQuestionIndex + 1;
    avgScoreElement.innerText = (score / (currentQuestionIndex + 1)).toFixed(2);
    nextButton.classList.remove('hide');
}

function nextQuestion() {
    currentQuestionIndex++;
    const questionsArray = getQuestionsForCategoryAndDifficulty();
    if (currentQuestionIndex < questionsArray.length) {
        showQuestion(questionsArray[currentQuestionIndex]);
        nextButton.classList.add('hide');
    } else {
        if (score > highScore) {
            currentProfile.highScore = score;
            localStorage.setItem('profiles', JSON.stringify(profiles));
            highScore = score;
            highScoreElement.innerText = highScore;
        }
        leaderboard.push({ username, score, difficulty: currentDifficulty, category: currentCategory });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        showLeaderboard();
        questionContainer.classList.add('hide');
        scoreContainer.classList.remove('hide');
        reviewButton.classList.remove('hide');
        calculatePerformanceMetrics();
        checkAchievements();
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

function addQuestion() {
    const questionText = newQuestionInput.value;
    const hintText = newHintInput.value;
    const category = newCategorySelect.value;
    const difficulty = newDifficultySelect.value;
    const answers = newAnswersInput.value.split(',').map(text => text.trim());
    const correctAnswer = answers.shift();

    if (questionText && hintText && category && difficulty && answers.length) {
        const question = {
            question: questionText,
            hint: hintText,
            answers: answers.map(answer => ({ text: answer, correct: answer === correctAnswer }))
        };

        if (!questions[category]) {
            questions[category] = { easy: [], medium: [], hard: [] };
        }
        questions[category][difficulty].push(question);
        localStorage.setItem('questions', JSON.stringify(questions));
        alert('Question added successfully!');
        newQuestionInput.value = '';
        newHintInput.value = '';
        newAnswersInput.value = '';
    } else {
        alert('Please fill in all fields.');
    }
}

function editQuestion() {
    const questionId = parseInt(editQuestionIdInput.value, 10);
    const questionText = newQuestionInput.value;
    const hintText = newHintInput.value;
    const category = newCategorySelect.value;
    const difficulty = newDifficultySelect.value;
    const answers = newAnswersInput.value.split(',').map(text => text.trim());
    const correctAnswer = answers.shift();

    if (questionId && questionText && hintText && category && difficulty && answers.length) {
        let questionToEdit;
        Object.values(questions).forEach(cat => {
            if (cat[difficulty]) {
                questionToEdit = cat[difficulty].find((_, index) => index === questionId);
            }
        });

        if (questionToEdit) {
            questionToEdit.question = questionText;
            questionToEdit.hint = hintText;
            questionToEdit.answers = answers.map(answer => ({ text: answer, correct: answer === correctAnswer }));

            localStorage.setItem('questions', JSON.stringify(questions));
            alert('Question edited successfully!');
            newQuestionInput.value = '';
            newHintInput.value = '';
            newAnswersInput.value = '';
            editQuestionIdInput.value = '';
        } else {
            alert('Question not found.');
        }
    } else {
        alert('Please fill in all fields.');
    }
}

function checkAchievements() {
    const achievementsUnlocked = [];
    
    if (score >= 10) {
        achievementsUnlocked.push('Score of 10 or more');
    }
    if (score >= 50) {
        achievementsUnlocked.push('Score of 50 or more');
    }

    achievementsUnlocked.forEach(achievement => {
        if (!achievements.includes(achievement)) {
            achievements.push(achievement);
        }
    });

    localStorage.setItem('achievements', JSON.stringify(achievements));
    updateAchievements();
}

function updateAchievements() {
    achievementsList.innerHTML = '';
    achievements.forEach(achievement => {
        const listItem = document.createElement('li');
        listItem.innerText = achievement;
        achievementsList.appendChild(listItem);
    });
}

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
