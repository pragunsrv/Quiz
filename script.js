const questionContainer = document.getElementById('quiz-container');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');
const timerCount = document.getElementById('timer-count');
const scoreElement = document.getElementById('score');
const scoreContainer = document.getElementById('score-container');
const categoryElement = document.getElementById('category');

const questions = [
    {
        category: 'Geography',
        question: 'What is the capital of France?',
        answers: [
            { text: 'Berlin', correct: false },
            { text: 'Madrid', correct: false },
            { text: 'Paris', correct: true },
            { text: 'Rome', correct: false }
        ]
    },
    {
        category: 'Literature',
        question: 'Who wrote "To Kill a Mockingbird"?',
        answers: [
            { text: 'Harper Lee', correct: true },
            { text: 'J.K. Rowling', correct: false },
            { text: 'Ernest Hemingway', correct: false },
            { text: 'Mark Twain', correct: false }
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
    nextButton.classList.add('hide');
    scoreContainer.classList.add('hide');
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
        scoreContainer.classList.remove('hide');
        questionContainer.classList.add('hide');
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
