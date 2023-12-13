const quizData = [
    {
        question: 'What is a Newton fractal?',
        options: ['A mathematical fractal', 'A type of fruit', 'An art technique'],
        answer: 'A mathematical fractal',
    },
    {
        question: 'What is a Vicsek fractal?',
        options: ['A pattern used in computer graphics', 'A type of dance', 'A programming language'],
        answer: 'A pattern used in computer graphics',
    },
    {
        question: 'Which color model uses Red, Green, and Blue?',
        options: ['RGB', 'HSL', 'CMYK'],
        answer: 'RGB',
    },
    {
        question: 'What do the initials HSL stand for in color models?',
        options: ['High Saturation Lightness', 'Hue Saturation Lightness', 'Heavy Saturation Luminosity'],
        answer: 'Hue Saturation Lightness',
    },
    {
        question: 'Which transformation is used in computer graphics to scale, rotate, or translate objects?',
        options: ['Affine transformation', 'Homogeneous coordinates', 'Cartesian transformation'],
        answer: 'Affine transformation',
    },
    // {
    //     question: 'What are homogeneous coordinates used for?',
    //     options: ['Representing points in projective geometry', 'Measuring distances in 3D space', 'Color representation in graphics'],
    //     answer: 'Representing points in projective geometry',
    // },
    // {
    //     question: 'Who introduced the concept of homogenous coordinates?',
    //     options: ['Isaac Newton', 'Blaise Pascal', 'August Ferdinand Möbius', 'David Hilbert'],
    //     answer: 'August Ferdinand Möbius',
    // },
    // {
    //     question: 'What is the RGB value for pure red color?',
    //     options: ['(255, 0, 0)', '(0, 255, 0)', '(0, 0, 255)', '(128, 0, 0)'],
    //     answer: '(255, 0, 0)',
    // },
    // {
    //     question: 'Which formula represents an affine transformation in 2D space?',
    //     options: ['x\' = a * x + b', 'y\' = c * y + d', 'x\' = ax + by + c', 'y\' = dx + ey + f'],
    //     answer: 'x\' = ax + by + c',
    // },
    // {
    //     question: 'What is the primary purpose of the CMYK color model?',
    //     options: ['Digital image compression', 'Printing and color reproduction', 'Web design and development'],
    //     answer: 'Printing and color reproduction',
    // },
    // {
    //     question: 'Who developed the concept of the Mandelbrot set?',
    //     options: ['Benoit B. Mandelbrot', 'Alan Turing', 'John von Neumann', 'Ada Lovelace'],
    //     answer: 'Benoit B. Mandelbrot',
    // },
    // {
    //     question: 'What is the additive primary color in the RGB color model?',
    //     options: ['Red', 'Green', 'Blue', 'Yellow'],
    //     answer: 'Red',
    // },
    // {
    //     question: 'In 3D graphics, what is the purpose of a projection matrix?',
    //     options: ['Scaling objects', 'Applying textures', 'Creating shadows', 'Mapping 3D coordinates to 2D'],
    //     answer: 'Mapping 3D coordinates to 2D',
    // },
    // {
    //     question: 'Which trigonometric function is commonly used in rotation matrices?',
    //     options: ['Sine', 'Cosine', 'Tangent', 'Secant'],
    //     answer: 'Sine',
    // },
    // {
    //     question: 'What is the primary advantage of using homogeneous coordinates in computer graphics?',
    //     options: ['Simplifies matrix operations', 'Enhances color accuracy', 'Reduces file size', 'Improves rendering speed'],
    //     answer: 'Simplifies matrix operations',
    // }
];

const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const submitButton = document.getElementById('submit');
const retryButton = document.getElementById('retry');
const showAnswerButton = document.getElementById('showAnswer');

let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function displayQuestion() {
  const questionData = quizData[currentQuestion];

  const questionElement = document.createElement('div');
  questionElement.className = 'question';
  questionElement.innerHTML = questionData.question;

  const optionsElement = document.createElement('div');
  optionsElement.className = 'options';

  const shuffledOptions = [...questionData.options];
  shuffleArray(shuffledOptions);

  for (let i = 0; i < shuffledOptions.length; i++) {
    const option = document.createElement('label');
    option.className = 'option';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'quiz';
    radio.value = shuffledOptions[i];

    const optionText = document.createTextNode(shuffledOptions[i]);

    option.appendChild(radio);
    option.appendChild(optionText);
    optionsElement.appendChild(option);
  }

  quizContainer.innerHTML = '';
  quizContainer.appendChild(questionElement);
  quizContainer.appendChild(optionsElement);
}

function checkAnswer() {
  const selectedOption = document.querySelector('input[name="quiz"]:checked');
  if (selectedOption) {
    const answer = selectedOption.value;
    if (answer === quizData[currentQuestion].answer) {
      score++;
    } else {
      incorrectAnswers.push({
        question: quizData[currentQuestion].question,
        incorrectAnswer: answer,
        correctAnswer: quizData[currentQuestion].answer,
      });
    }
    currentQuestion++;
    selectedOption.checked = false;
    if (currentQuestion < quizData.length) {
      displayQuestion();
    } else {
      displayResult();
    }
  }
}

function displayResult() {
  quizContainer.style.display = 'none';
  submitButton.style.display = 'none';
  retryButton.style.display = 'inline-block';
  showAnswerButton.style.display = 'inline-block';
  resultContainer.innerHTML = `You scored ${score} out of ${quizData.length}!`;
}

function retryQuiz() {
  currentQuestion = 0;
  score = 0;
  incorrectAnswers = [];
  quizContainer.style.display = 'block';
  submitButton.style.display = 'inline-block';
  retryButton.style.display = 'none';
  showAnswerButton.style.display = 'none';
  resultContainer.innerHTML = '';
  displayQuestion();
  resultContainer.style.backgroundColor = '';
  resultContainer.style.color = '';
  resultContainer.style.padding = '';
  resultContainer.style.borderRadius = '';
  resultContainer.style.border = '';
}

function showAnswer() {
  quizContainer.style.display = 'none';
  submitButton.style.display = 'none';
  retryButton.style.display = 'inline-block';
  showAnswerButton.style.display = 'none';

  let incorrectAnswersHtml = '';
  for (let i = 0; i < incorrectAnswers.length; i++) {
    incorrectAnswersHtml += `
      <p>
        <strong>Question:</strong> ${incorrectAnswers[i].question}<br>
        <strong>Your Answer:</strong> ${incorrectAnswers[i].incorrectAnswer}<br>
        <strong style="color: #00c843">Correct Answer:</strong> ${incorrectAnswers[i].correctAnswer}
      </p>
    `;
  }

  resultContainer.innerHTML = `
    <p style="color: #028090">You scored ${score} out of ${quizData.length}!</p>
    <p style="color: #ff0000">Incorrect Answers:</p>
    ${incorrectAnswersHtml == 0 ? "none" : incorrectAnswersHtml}
  `;
  resultContainer.style.backgroundColor = 'white';
  resultContainer.style.color = 'black';
  resultContainer.style.padding = '50px 40px';
  resultContainer.style.borderRadius = '20px';
  resultContainer.style.border = 'solid black 2px';
}

submitButton.addEventListener('click', checkAnswer);
retryButton.addEventListener('click', retryQuiz);
showAnswerButton.addEventListener('click', showAnswer);

shuffleArray(quizData);
displayQuestion();