const questions = [
    { 
        question: 'Valinta_haluat_jotain.png',
        questionAudio: 'Valinta_haluat_jotain.mp3',
        questionText: 'MITÄ SANOT, JOS HALUAT JOTAIN?',
        correct: 'saisinko.png',
        wrong: 'nakemiin.png',
        correctAudio: 'saisinko.mp3',
        wrongAudio: 'nakemiin.mp3'
    },
    {
        question: 'Valinta_lahdet.png',
        questionAudio: 'Valinta_lahdet.mp3',
        questionText: 'MITÄ SANOT, KUN LÄHDET?',
        correct: 'nakemiin.png',
        wrong: 'anteeksi.png',
        correctAudio: 'nakemiin.mp3',
        wrongAudio: 'anteeksi.mp3'
    },
    {
        question: 'Valinta_saat_lahjan.png',
        questionAudio: 'Valinta_saat_lahjan.mp3',
        questionText: 'MITÄ SANOT, KUN SAAT LAHJAN?',
        correct: 'kiitos.png',
        wrong: 'huomenta.png',
        correctAudio: 'kiitos.mp3',
        wrongAudio: 'huomenta.mp3'
    },
    {
        question: 'Valinta_satutat_kaveria.png',
        questionAudio: 'Valinta_satutat_kaveria.mp3',
        questionText: 'MITÄ SANOT, JOS SATUTAT KAVERIA?',
        correct: 'anteeksi.png',
        wrong: 'kiitos.png',
        correctAudio: 'anteeksi.mp3',
        wrongAudio: 'kiitos.mp3'
    },
    {
        question: 'Valinta_tapaat_aamulla_kaverin.png',
        questionAudio: 'Valinta_tapaat_aamulla_kaverin.mp3',
        questionText: 'MITÄ SANOT, KUN TAPAAT AAMULLA KAVERIN?',
        correct: 'huomenta.png',
        wrong: 'nakemiin.png',
        correctAudio: 'huomenta.mp3',
        wrongAudio: 'nakemiin.mp3'
    }
];

let currentQuestions = [];
let currentQuestion = 0;
let selectedOption = 0;
let correctAnswers = 0;
let checkButtonClicked = false;
let currentAudio = null;
let isQuestionAudioPlaying = false;
let clicksEnabled = false;

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('stars-container').style.display = 'block';
    currentQuestions = [...questions]; // Use all questions
    shuffleArray(currentQuestions); // But shuffle them
    loadQuestion();
    // Enable clicks right away since audio might not work
    clicksEnabled = true;
    // Try to play intro audio, but proceed even if it fails
    try {
        playQuestionAudio();
    } catch (error) {
        console.log("Failed to play intro audio, continuing without audio");
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadQuestion() {
    const question = currentQuestions[currentQuestion];
    const questionImage = document.getElementById('question-image');
    questionImage.src = question.question;
    document.getElementById('question-text').textContent = question.questionText;
    
    // Add click handler for main image
    questionImage.onclick = () => {
        if (clicksEnabled) {
            playQuestionAudio();
        }
    };
    
    const options = [question.correct, question.wrong];
    shuffleArray(options);

    document.getElementById('option1').src = options[0];
    document.getElementById('option2').src = options[1];
    document.getElementById('check-button').style.display = 'block';
    document.getElementById('next-arrow').style.display = 'none';
    checkButtonClicked = false;
    selectedOption = 0;
    clicksEnabled = false;
    
    setupOptionAudioListeners();
    
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    updateCheckButtonState();
}

function setupOptionAudioListeners() {
    const question = currentQuestions[currentQuestion];
    const option1 = document.getElementById('option1');
    const option2 = document.getElementById('option2');
    
    option1.onclick = (e) => {
        if (clicksEnabled) {  // Only handle clicks if enabled
            const audioFile = option1.src.includes(question.correct.split('.')[0]) ? 
                question.correctAudio : question.wrongAudio;
            playOptionAudio(audioFile);
            selectOption(1);
        }
    };
    
    option2.onclick = (e) => {
        if (clicksEnabled) {  // Only handle clicks if enabled
            const audioFile = option2.src.includes(question.correct.split('.')[0]) ? 
                question.correctAudio : question.wrongAudio;
            playOptionAudio(audioFile);
            selectOption(2);
        }
    };
}

function playOptionAudio(audioFile) {
    if (clicksEnabled) {
        playAudio(audioFile);
    }
}

function selectOption(option) {
    selectedOption = option;
    const options = document.querySelectorAll('.option');
    options.forEach(optionElement => {
        optionElement.classList.remove('selected');
    });
    document.getElementById(`option${option}`).classList.add('selected');
    updateCheckButtonState();
}

function updateCheckButtonState() {
    const checkButton = document.getElementById('check-button');
    checkButton.disabled = selectedOption === 0;
    checkButton.classList.toggle('disabled', selectedOption === 0);
}

function checkAnswer() {
    if (checkButtonClicked || selectedOption === 0) return;
    
    checkButtonClicked = true;
    const question = currentQuestions[currentQuestion];
    const selectedElement = document.getElementById(`option${selectedOption}`);
    
    // Check if selected option contains the correct answer filename
    const selectedSrc = selectedElement.src;
    const correctOptionNum = document.getElementById('option1').src.includes(question.correct.split('.')[0]) ? 1 : 2;
    
    if (selectedOption === correctOptionNum) {
        selectedElement.classList.add('correct');
        correctAnswers++;
        updateStars();
        try {
            playAudio('oikein.mp3');
        } catch (error) {
            console.log("Could not play success audio");
        }
    } else {
        selectedElement.classList.add('incorrect');
        document.getElementById(`option${correctOptionNum}`).classList.add('correct');
        try {
            playAudio('vaarin.mp3');
        } catch (error) {
            console.log("Could not play error audio");
        }
    }
    
    document.getElementById('check-button').style.display = 'none';
    document.getElementById('next-arrow').style.display = 'block';
}

function updateStars() {
    const starsContainer = document.getElementById('stars-container');
    starsContainer.innerHTML = '<img src="tahti.png" alt="Star" class="star-icon">'.repeat(correctAnswers);
}

function playQuestionAudio() {
    try {
        const question = currentQuestions[currentQuestion];
        isQuestionAudioPlaying = true;
        // Try to play audio but don't block interaction if it fails
        playAudio(question.questionAudio, () => {
            isQuestionAudioPlaying = false;
            clicksEnabled = true;
        });
        // Enable clicks after a short delay even if audio doesn't play
        setTimeout(() => {
            clicksEnabled = true;
        }, 1000);
    } catch (error) {
        console.log("Error in playQuestionAudio:", error);
        // Make sure clicks are enabled even if audio fails
        clicksEnabled = true;
        isQuestionAudioPlaying = false;
    }
}

function nextQuestion() {
    stopAllAudio();
    clicksEnabled = false;  // Disable clicks when moving to next question
    currentQuestion++;
    if (currentQuestion >= currentQuestions.length) {
        showResult();
    } else {
        loadQuestion();
        playQuestionAudio();
    }
}

function showResult() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h1>HIENOJA SANOJA ON PALJON</h1>
        <p id="result">Sait ${correctAnswers} / ${currentQuestions.length} oikein</p>
        <div id="final-stars-container">${'<img src="tahti.png" alt="Star" class="star-icon">'.repeat(correctAnswers)}</div>
        <button onclick="restartGame()">PELAA UUDELLEEN</button>
    `;
    document.getElementById('stars-container').style.display = 'none';
}

function restartGame() {
    stopAllAudio();
    currentQuestion = 0;
    selectedOption = 0;
    correctAnswers = 0;
    checkButtonClicked = false;
    shuffleArray(currentQuestions);
    
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h2 id="question-text">MITÄ SANOT?</h2>
        <img id="question-image" class="question-image">
        <div class="options">
            <img id="option1" class="option">
            <img id="option2" class="option">
        </div>
        <div id="game-controls">
            <button id="check-button" onclick="checkAnswer()">TARKISTA</button>
            <img id="next-arrow" src="nuoli.png" onclick="nextQuestion()">
        </div>
    `;
    
    document.getElementById('stars-container').innerHTML = '';
    document.getElementById('stars-container').style.display = 'block';
    
    loadQuestion();
    // Enable clicks right away
    clicksEnabled = true;
    try {
        playQuestionAudio();
    } catch (error) {
        console.log("Failed to play restart audio, continuing without audio");
    }
}

function stopAllAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    isQuestionAudioPlaying = false;
}

function playAudio(src, callback) {
    stopAllAudio();
    try {
        currentAudio = new Audio(src);
        currentAudio.onerror = (e) => {
            console.log(`Audio file not found: ${src} - continuing without audio`);
            if (callback) {
                // Still call the callback even if audio fails
                setTimeout(callback, 500);
            }
        };
        currentAudio.play().catch(error => {
            console.log(`Error playing audio ${src}: ${error.message}`);
            if (callback) {
                // Still call the callback even if audio fails
                setTimeout(callback, 500);
            }
        });
        if (callback) {
            currentAudio.onended = callback;
        }
    } catch (error) {
        console.log(`General error with audio ${src}: ${error.message}`);
        if (callback) {
            // Still call the callback even if audio completely fails
            setTimeout(callback, 500);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', startGame);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' && document.getElementById('next-arrow').style.display !== 'none') {
            nextQuestion();
        }
    });
});
