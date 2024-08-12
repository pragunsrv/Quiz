const questionContainer = document.getElementById('quiz-container');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');
const timerCount = document.getElementById('timer-count');
const scoreElement = document.getElementById('score');
const scoreContainer = document.getElementById('score-container');
const categoryElement = document.getElementById('category');
const progressElement = document.getElementById('progress');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');

const questions = [
    {
        category: 'Geography',
        question: 'What is the capital of France?',
        type: 'multiple-choice',
        answers: [
            { text: 'Berlin', correct: false },
            { text: 'Madrid', correct: false },
            { text: 'Paris', correct: true },
            { text: 'Rome', correct: false }
        ]
    },
    {
        category: 'Literature',
        question: 'Is "To Kill a Mockingbird" written by Harper Lee?',
        type: 'true-false',
        answers: [
            { text: 'True', correct: true },
            { text: 'False', correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = score;
    totalQuestionsElement.innerText = questions.length;
    nextButton.classList.add('hide');
    scoreContainer.classList.add('hide');
    questionContainer.classList.remove('hide');
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    categoryElement.innerText = `Category: ${question.category}`;
    questionContainer.querySelector('#question').innerText = question.question;
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
}

function selectAnswer(answer) {
    const correct = answer.correct;
    if (correct) {
        alert('Correct!');
        score++;
        scoreElement.innerText = score;
    } else {
        alert('Wrong!');
    }
    clearInterval(timer);
    nextButton.classList.remove('hide');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
        nextButton.classList.add('hide');
    } else {
        questionContainer.classList.add('hide');
        scoreContainer.classList.remove('hide');
        nextButton.classList.add('hide');
    }
}

function startTimer() {
    timeLeft = 30;
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

startGame();
