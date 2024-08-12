const questionContainer = document.getElementById('quiz-container');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');
const timerCount = document.getElementById('timer-count');
const scoreElement = document.getElementById('score');
const scoreContainer = document.getElementById('score-container');
const highScoreElement = document.getElementById('high-score');
const categoryElement = document.getElementById('category');
const progressElement = document.getElementById('progress');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const difficultySelect = document.getElementById('difficulty');

const questions = {
    easy: [
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
            question: 'Is "To Kill a Mockingbird" written by Harper Lee?',
            answers: [
                { text: 'True', correct: true },
                { text: 'False', correct: false }
            ]
        }
    ],
    medium: [
        {
            category: 'Science',
            question: 'What is the chemical symbol for Gold?',
            answers: [
                { text: 'Au', correct: true },
                { text: 'Ag', correct: false },
                { text: 'Pb', correct: false },
                { text: 'Fe', correct: false }
            ]
        },
        {
            category: 'History',
            question: 'Who was the first President of the United States?',
            answers: [
                { text: 'George Washington', correct: true },
                { text: 'Thomas Jefferson', correct: false },
                { text: 'Abraham Lincoln', correct: false },
                { text: 'John Adams', correct: false }
            ]
        }
    ],
    hard: [
        {
            category: 'Mathematics',
            question: 'What is the integral of e^x?',
            answers: [
                { text: 'e^x + C', correct: true },
                { text: 'e^x', correct: false },
                { text: 'x^e + C', correct: false },
                { text: '1/x', correct: false }
            ]
        },
        {
            category: 'Technology',
            question: 'Who is known as the father of the computer?',
            answers: [
                { text: 'Charles Babbage', correct: true },
                { text: 'Alan Turing', correct: false },
                { text: 'Ada Lovelace', correct: false },
                { text: 'Bill Gates', correct: false }
            ]
        }
    ]
};

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let highScore = localStorage.getItem('highScore') || 0;

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = score;
    highScoreElement.innerText = highScore;
    totalQuestionsElement.innerText = getQuestions().length;
    nextButton.classList.add('hide');
    scoreContainer.classList.add('hide');
    questionContainer.classList.remove('hide');
    showQuestion(getQuestions()[currentQuestionIndex]);
}

function getQuestions() {
    const difficulty = difficultySelect.value;
    const questionsArray = questions[difficulty];
    return shuffleArray(questionsArray);
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
    if (currentQuestionIndex < getQuestions().length) {
        showQuestion(getQuestions()[currentQuestionIndex]);
        nextButton.classList.add('hide');
    } else {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreElement.innerText = highScore;
        }
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

startGame();
