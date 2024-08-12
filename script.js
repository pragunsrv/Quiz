let profiles = [];
let currentProfile = null;
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let streak = 0;
let hintsUsed = 0;
let adaptiveDifficultyEnabled = false;
let difficulty = "medium";
let leaderboard = [];
let achievements = [];
let multiplayerRoom = null;
let multiplayerQuestions = [];
let multiplayerCurrentQuestionIndex = 0;
let multiplayerTimer;
let multiplayerTimeLeft = 30;
let multiplayerStreak = 0;
let multiplayerHintsUsed = 0;
let chatMessages = [];
let chatNotificationsEnabled = false;

function createProfile() {
    const username = document.getElementById("username").value;
    if (username) {
        const profile = { id: profiles.length + 1, name: username, highScore: 0 };
        profiles.push(profile);
        currentProfile = profile;
        updateProfileSelect();
    }
}

function updateProfileSelect() {
    const select = document.getElementById("profile-select");
    select.innerHTML = "";
    profiles.forEach(profile => {
        const option = document.createElement("option");
        option.value = profile.id;
        option.textContent = profile.name;
        select.appendChild(option);
    });
}

function startGame() {
    if (!currentProfile) {
        alert("Please select or create a profile to start the game.");
        return;
    }
    document.getElementById("profile-container").classList.add("hide");
    document.getElementById("quiz-container").classList.remove("hide");
    selectCategory();
    loadQuestion();
    startTimer();
}

function selectCategory() {
    const categories = ["General", "Math", "Science", "History"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    document.getElementById("selected-category").textContent = randomCategory;
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }
    const question = questions[currentQuestionIndex];
    document.getElementById("question").textContent = question.text;
    document.getElementById("hint").textContent = question.hint;
    updateAnswerButtons(question.answers);
}

function updateAnswerButtons(answers) {
    const buttonsContainer = document.getElementById("answer-buttons");
    buttonsContainer.innerHTML = "";
    answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.onclick = () => checkAnswer(answer.isCorrect);
        buttonsContainer.appendChild(button);
    });
}

function checkAnswer(isCorrect) {
    if (isCorrect) {
        score++;
        streak++;
        updateProgress();
    } else {
        streak = 0;
        updateProgress();
    }
    currentQuestionIndex++;
    loadQuestion();
}

function updateProgress() {
    const progressFill = document.getElementById("progress-fill");
    const progressPercent = (currentQuestionIndex / questions.length) * 100;
    progressFill.style.width = `${progressPercent}%`;

    document.getElementById("streak").textContent = `Streak: ${streak}`;
}

function startTimer() {
    timeLeft = 30;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer-count").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    document.getElementById("quiz-container").classList.add("hide");
    document.getElementById("score-container").classList.remove("hide");
    document.getElementById("score").textContent = score;
    updateHighScore();
}

function updateHighScore() {
    if (score > currentProfile.highScore) {
        currentProfile.highScore = score;
        updateProfileSelect();
    }
    document.getElementById("high-score").textContent = currentProfile.highScore;
}

function restartGame() {
    score = 0;
    currentQuestionIndex = 0;
    document.getElementById("score-container").classList.add("hide");
    document.getElementById("quiz-container").classList.remove("hide");
    loadQuestion();
    startTimer();
}

function saveScore() {
    leaderboard.push({ profile: currentProfile.name, score });
    updateLeaderboard();
}

function updateLeaderboard() {
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = "";
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.forEach(entry => {
        const listItem = document.createElement("li");
        listItem.textContent = `${entry.profile}: ${entry.score}`;
        leaderboardList.appendChild(listItem);
    });
}

function addQuestion() {
    const newQuestionText = document.getElementById("new-question").value;
    const newHint = document.getElementById("new-hint").value;
    const newCategory = document.getElementById("new-category").value;
    const newDifficulty = document.getElementById("new-difficulty").value;
    const newAnswersText = document.getElementById("new-answers").value;
    const newAnswersArray = newAnswersText.split(",").map((text, index) => ({
        text: text.trim(),
        isCorrect: index === 0
    }));
    const newQuestion = {
        id: questions.length + 1,
        text: newQuestionText,
        hint: newHint,
        category: newCategory,
        difficulty: newDifficulty,
        answers: newAnswersArray
    };
    questions.push(newQuestion);
    updateQuestionBank();
}

function updateQuestionBank() {
    const questionBankList = document.getElementById("question-performance-list");
    questionBankList.innerHTML = "";
    questions.forEach(question => {
        const listItem = document.createElement("li");
        listItem.textContent = `Q${question.id}: ${question.text} (${question.difficulty})`;
        questionBankList.appendChild(listItem);
    });
}

function editQuestion() {
    const questionIdToEdit = parseInt(document.getElementById("edit-question-id").value);
    const questionToEdit = questions.find(q => q.id === questionIdToEdit);
    if (questionToEdit) {
        const newQuestionText = document.getElementById("new-question").value;
        const newHint = document.getElementById("new-hint").value;
        const newCategory = document.getElementById("new-category").value;
        const newDifficulty = document.getElementById("new-difficulty").value;
        const newAnswersText = document.getElementById("new-answers").value;
        const newAnswersArray = newAnswersText.split(",").map((text, index) => ({
            text: text.trim(),
            isCorrect: index === 0
        }));
        questionToEdit.text = newQuestionText || questionToEdit.text;
        questionToEdit.hint = newHint || questionToEdit.hint;
        questionToEdit.category = newCategory || questionToEdit.category;
        questionToEdit.difficulty = newDifficulty || questionToEdit.difficulty;
        questionToEdit.answers = newAnswersArray.length > 0 ? newAnswersArray : questionToEdit.answers;
        updateQuestionBank();
    } else {
        alert("Question not found.");
    }
}

function showHint() {
    document.getElementById("hint").classList.remove("hide");
    hintsUsed++;
    document.getElementById("hint-usage").textContent = `Hints used: ${hintsUsed}`;
}

function applyTheme(theme) {
    document.body.className = `${theme}-theme`;
}

function toggleRandomizeQuestions() {
    const randomizeQuestions = document.getElementById("randomize-questions").checked;
    if (randomizeQuestions) {
        questions.sort(() => Math.random() - 0.5);
    } else {
        questions.sort((a, b) => a.id - b.id);
    }
}

function toggleTimer() {
    const timerToggle = document.getElementById("timer-toggle").checked;
    document.getElementById("timer-container").style.display = timerToggle ? "block" : "none";
}

function toggleHints() {
    const hintToggle = document.getElementById("hint-toggle").checked;
    document.getElementById("hint-button").style.display = hintToggle ? "block" : "none";
}

function toggleAdaptiveDifficulty() {
    adaptiveDifficultyEnabled = document.getElementById("adaptive-difficulty-toggle").checked;
    document.getElementById("adaptive-difficulty").textContent = `Difficulty: ${adaptiveDifficultyEnabled ? difficulty : "Medium"}`;
}

function joinRoom() {
    const roomName = document.getElementById("multiplayer-room").value;
    if (roomName) {
        multiplayerRoom = roomName;
        document.getElementById("multiplayer-container").classList.add("hide");
        document.getElementById("quiz-container").classList.remove("hide");
        startMultiplayerGame();
    }
}

function createRoom() {
    multiplayerRoom = `Room-${Math.floor(Math.random() * 1000)}`;
    document.getElementById("multiplayer-room").value = multiplayerRoom;
    document.getElementById("multiplayer-container").classList.add("hide");
    document.getElementById("quiz-container").classList.remove("hide");
    startMultiplayerGame();
}

function startMultiplayerGame() {
    selectCategory();
    multiplayerCurrentQuestionIndex = 0;
    loadMultiplayerQuestion();
    startMultiplayerTimer();
}

function loadMultiplayerQuestion() {
    if (multiplayerCurrentQuestionIndex >= multiplayerQuestions.length) {
        endMultiplayerGame();
        return;
    }
    const question = multiplayerQuestions[multiplayerCurrentQuestionIndex];
    document.getElementById("question").textContent = question.text;
    updateMultiplayerAnswerButtons(question.answers);
}

function updateMultiplayerAnswerButtons(answers) {
    const buttonsContainer = document.getElementById("multiplayer-answer-buttons");
    buttonsContainer.innerHTML = "";
    answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.onclick = () => checkMultiplayerAnswer(answer.isCorrect);
        buttonsContainer.appendChild(button);
    });
}

function checkMultiplayerAnswer(isCorrect) {
    if (isCorrect) {
        multiplayerStreak++;
    } else {
        multiplayerStreak = 0;
    }
    updateMultiplayerProgress();
    multiplayerCurrentQuestionIndex++;
    loadMultiplayerQuestion();
}

function updateMultiplayerProgress() {
    const progressFill = document.getElementById("multiplayer-progress-fill");
    const progressPercent = (multiplayerCurrentQuestionIndex / multiplayerQuestions.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
    document.getElementById("streak").textContent = `Streak: ${multiplayerStreak}`;
}

function startMultiplayerTimer() {
    multiplayerTimeLeft = 30;
    multiplayerTimer = setInterval(() => {
        multiplayerTimeLeft--;
        document.getElementById("multiplayer-timer-count").textContent = multiplayerTimeLeft;
        if (multiplayerTimeLeft <= 0) {
            clearInterval(multiplayerTimer);
            endMultiplayerGame();
        }
    }, 1000);
}

function endMultiplayerGame() {
    clearInterval(multiplayerTimer);
    document.getElementById("quiz-container").classList.add("hide");
    document.getElementById("score-container").classList.remove("hide");
    document.getElementById("score").textContent = multiplayerStreak;
}

function sendMessage() {
    const message = document.getElementById("chat-input").value;
    if (message) {
        chatMessages.push(message);
        updateChat();
        document.getElementById("chat-input").value = "";
        if (chatNotificationsEnabled) {
            document.getElementById("chat-notifications").textContent = "New message received!";
        }
    }
}

function updateChat() {
    const chatMessagesContainer = document.getElementById("chat-messages");
    chatMessagesContainer.innerHTML = "";
    chatMessages.forEach(msg => {
        const messageElement = document.createElement("p");
        messageElement.textContent = msg;
        chatMessagesContainer.appendChild(messageElement);
    });
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

document.getElementById("multiplayer-chat-toggle").addEventListener("change", (event) => {
    chatNotificationsEnabled = event.target.checked;
});

function calculateAverageAnswerTime() {
    let totalTime = 0;
    questions.forEach(question => {
        totalTime += question.timeSpent;
    });
    return totalTime / questions.length;
}

function showAnswerDistribution() {
    const correctAnswers = questions.filter(q => q.isCorrect).length;
    const incorrectAnswers = questions.length - correctAnswers;
    alert(`Correct Answers: ${correctAnswers}\nIncorrect Answers: ${incorrectAnswers}`);
}

function saveUserSettings() {
    localStorage.setItem("quizSettings", JSON.stringify({
        randomizeQuestions: document.getElementById("randomize-questions").checked,
        timerToggle: document.getElementById("timer-toggle").checked,
        hintToggle: document.getElementById("hint-toggle").checked,
        adaptiveDifficultyToggle: document.getElementById("adaptive-difficulty-toggle").checked
    }));
}

function loadUserSettings() {
    const settings = JSON.parse(localStorage.getItem("quizSettings"));
    if (settings) {
        document.getElementById("randomize-questions").checked = settings.randomizeQuestions;
        document.getElementById("timer-toggle").checked = settings.timerToggle;
        document.getElementById("hint-toggle").checked = settings.hintToggle;
        document.getElementById("adaptive-difficulty-toggle").checked = settings.adaptiveDifficultyToggle;
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function clearProfileData() {
    profiles = [];
    currentProfile = null;
    document.getElementById("profile-select").innerHTML = "";
}

function resetSettings() {
    localStorage.removeItem("quizSettings");
    document.getElementById("randomize-questions").checked = false;
    document.getElementById("timer-toggle").checked = true;
    document.getElementById("hint-toggle").checked = true;
    document.getElementById("adaptive-difficulty-toggle").checked = false;
}

function handleKeyboardShortcuts(event) {
    if (event.key === "F1") {
        toggleHints();
    } else if (event.key === "F2") {
        toggleTimer();
    } else if (event.key === "F3") {
        toggleAdaptiveDifficulty();
    }
}

function activateBonusRound() {
    if (score >= 10) {
        document.getElementById("bonus-round").classList.remove("hide");
        document.getElementById("quiz-container").classList.add("hide");
        loadBonusQuestion();
    }
}

function loadBonusQuestion() {
    const bonusQuestion = questions[Math.floor(Math.random() * questions.length)];
    document.getElementById("bonus-question").textContent = bonusQuestion.text;
    updateBonusAnswerButtons(bonusQuestion.answers);
}

function updateBonusAnswerButtons(answers) {
    const buttonsContainer = document.getElementById("bonus-answer-buttons");
    buttonsContainer.innerHTML = "";
    answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.onclick = () => checkBonusAnswer(answer.isCorrect);
        buttonsContainer.appendChild(button);
    });
}

function checkBonusAnswer(isCorrect) {
    if (isCorrect) {
        score += 3;
    } else {
        score--;
    }
    document.getElementById("bonus-round").classList.add("hide");
    document.getElementById("quiz-container").classList.remove("hide");
    loadQuestion();
}

function adjustDifficultyBasedOnPerformance() {
    const correctAnswers = questions.filter(q => q.isCorrect).length;
    if (correctAnswers >= questions.length * 0.8) {
        difficulty = "hard";
    } else if (correctAnswers >= questions.length * 0.5) {
        difficulty = "medium";
    } else {
        difficulty = "easy";
    }
    document.getElementById("difficulty-level").textContent = `Difficulty: ${difficulty}`;
}

function checkForAchievements() {
    if (streak >= 10 && !achievements.includes("Streak Master")) {
        achievements.push("Streak Master");
        alert("Achievement Unlocked: Streak Master");
    }
    if (hintsUsed <= 3 && !achievements.includes("Hint Saver")) {
        achievements.push("Hint Saver");
        alert("Achievement Unlocked: Hint Saver");
    }
    if (score >= 50 && !achievements.includes("Quiz Champion")) {
        achievements.push("Quiz Champion");
        alert("Achievement Unlocked: Quiz Champion");
    }
}

function checkMultiplayerAnswer(isCorrect) {
    if (isCorrect) {
        multiplayerStreak++;
    } else {
        multiplayerStreak = 0;
    }
    updateMultiplayerProgress();
    multiplayerCurrentQuestionIndex++;
    loadMultiplayerQuestion();
}

function updateMultiplayerProgress() {
    const progressFill = document.getElementById("multiplayer-progress-fill");
    const progressPercent = (multiplayerCurrentQuestionIndex / multiplayerQuestions.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
    document.getElementById("streak").textContent = `Streak: ${multiplayerStreak}`;
}

function startMultiplayerTimer() {
    multiplayerTimeLeft = 30;
    multiplayerTimer = setInterval(() => {
        multiplayerTimeLeft--;
        document.getElementById("multiplayer-timer-count").textContent = multiplayerTimeLeft;
        if (multiplayerTimeLeft <= 0) {
            clearInterval(multiplayerTimer);
            endMultiplayerGame();
        }
    }, 1000);
}

function endMultiplayerGame() {
    clearInterval(multiplayerTimer);
    document.getElementById("quiz-container").classList.add("hide");
    document.getElementById("score-container").classList.remove("hide");
    document.getElementById("score").textContent = multiplayerStreak;
}

function sendMessage() {
    const message = document.getElementById("chat-input").value;
    if (message) {
        chatMessages.push(message);
        updateChat();
        document.getElementById("chat-input").value = "";
        if (chatNotificationsEnabled) {
            document.getElementById("chat-notifications").textContent = "New message received!";
        }
    }
}

function updateChat() {
    const chatMessagesContainer = document.getElementById("chat-messages");
    chatMessagesContainer.innerHTML = "";
    chatMessages.forEach(msg => {
        const messageElement = document.createElement("p");
        messageElement.textContent = msg;
        chatMessagesContainer.appendChild(messageElement);
    });
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

document.getElementById("multiplayer-chat-toggle").addEventListener("change", (event) => {
    chatNotificationsEnabled = event.target.checked;
});

function calculateAverageAnswerTime() {
    let totalTime = 0;
    questions.forEach(question => {
        totalTime += question.timeSpent;
    });
    return totalTime / questions.length;
}

function showAnswerDistribution() {
    const correctAnswers = questions.filter(q => q.isCorrect).length;
    const incorrectAnswers = questions.length - correctAnswers;
    alert(`Correct Answers: ${correctAnswers}\nIncorrect Answers: ${incorrectAnswers}`);
}

function saveUserSettings() {
    localStorage.setItem("quizSettings", JSON.stringify({
        randomizeQuestions: document.getElementById("randomize-questions").checked,
        timerToggle: document.getElementById("timer-toggle").checked,
        hintToggle: document.getElementById("hint-toggle").checked,
        adaptiveDifficultyToggle: document.getElementById("adaptive-difficulty-toggle").checked
    }));
}

function loadUserSettings() {
    const settings = JSON.parse(localStorage.getItem("quizSettings"));
    if (settings) {
        document.getElementById("randomize-questions").checked = settings.randomizeQuestions;
        document.getElementById("timer-toggle").checked = settings.timerToggle;
        document.getElementById("hint-toggle").checked = settings.hintToggle;
        document.getElementById("adaptive-difficulty-toggle").checked = settings.adaptiveDifficultyToggle;
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function clearProfileData() {
    profiles = [];
    currentProfile = null;
    document.getElementById("profile-select").innerHTML = "";
}
function checkMultiplayerAnswer(isCorrect) {
    if (isCorrect) {
        multiplayerStreak++;
    } else {
        multiplayerStreak = 0;
    }
    updateMultiplayerProgress();
    multiplayerCurrentQuestionIndex++;
    loadMultiplayerQuestion();
}

function updateMultiplayerProgress() {
    const progressFill = document.getElementById("multiplayer-progress-fill");
    const progressPercent = (multiplayerCurrentQuestionIndex / multiplayerQuestions.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
    document.getElementById("streak").textContent = `Streak: ${multiplayerStreak}`;
}

function startMultiplayerTimer() {
    multiplayerTimeLeft = 30;
    multiplayerTimer = setInterval(() => {
        multiplayerTimeLeft--;
        document.getElementById("multiplayer-timer-count").textContent = multiplayerTimeLeft;
        if (multiplayerTimeLeft <= 0) {
            clearInterval(multiplayerTimer);
            endMultiplayerGame();
        }
    }, 1000);
}

function endMultiplayerGame() {
    clearInterval(multiplayerTimer);
    document.getElementById("quiz-container").classList.add("hide");
    document.getElementById("score-container").classList.remove("hide");
    document.getElementById("score").textContent = multiplayerStreak;
}

function sendMessage() {
    const message = document.getElementById("chat-input").value;
    if (message) {
        chatMessages.push(message);
        updateChat();
        document.getElementById("chat-input").value = "";
        if (chatNotificationsEnabled) {
            document.getElementById("chat-notifications").textContent = "New message received!";
        }
    }
}

function updateChat() {
    const chatMessagesContainer = document.getElementById("chat-messages");
    chatMessagesContainer.innerHTML = "";
    chatMessages.forEach(msg => {
        const messageElement = document.createElement("p");
        messageElement.textContent = msg;
        chatMessagesContainer.appendChild(messageElement);
    });
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

document.getElementById("multiplayer-chat-toggle").addEventListener("change", (event) => {
    chatNotificationsEnabled = event.target.checked;
});

function calculateAverageAnswerTime() {
    let totalTime = 0;
    questions.forEach(question => {
        totalTime += question.timeSpent;
    });
    return totalTime / questions.length;
}

function showAnswerDistribution() {
    const correctAnswers = questions.filter(q => q.isCorrect).length;
    const incorrectAnswers = questions.length - correctAnswers;
    alert(`Correct Answers: ${correctAnswers}\nIncorrect Answers: ${incorrectAnswers}`);
}

function saveUserSettings() {
    localStorage.setItem("quizSettings", JSON.stringify({
        randomizeQuestions: document.getElementById("randomize-questions").checked,
        timerToggle: document.getElementById("timer-toggle").checked,
        hintToggle: document.getElementById("hint-toggle").checked,
        adaptiveDifficultyToggle: document.getElementById("adaptive-difficulty-toggle").checked
    }));
}

function loadUserSettings() {
    const settings = JSON.parse(localStorage.getItem("quizSettings"));
    if (settings) {
        document.getElementById("randomize-questions").checked = settings.randomizeQuestions;
        document.getElementById("timer-toggle").checked = settings.timerToggle;
        document.getElementById("hint-toggle").checked = settings.hintToggle;
        document.getElementById("adaptive-difficulty-toggle").checked = settings.adaptiveDifficultyToggle;
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function clearProfileData() {
    profiles = [];
    currentProfile = null;
    document.getElementById("profile-select").innerHTML = "";
}