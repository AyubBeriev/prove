const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const progressText = document.getElementById('question-progress');

let shuffledQuestions, currentQuestionIndex, score;

const questions = [
    {
        question: 'Hvilket af følgende partier er ældst?',
        answers: [
            { text: 'Socialistisk Folkeparti', correct: false },
            { text: 'Det Konservative Folkeparti', correct: true },
            { text: 'Dansk Folkeparti', correct: false }
        ]
    },
    {
        question: 'Hvilket af følgende partier er nyest?',
        answers: [
            { text: 'Liberal Alliance', correct: true },
            { text: 'Enhedslisten', correct: false },
            { text: 'Det Konservative Folkeparti', correct: false }
        ]
    },
    {
        question: 'Hvilket af følgende politiske partier er ældst?',
        answers: [
            { text: 'Socialistisk Folkeparti', correct: false },
            { text: 'Radikale Venstre', correct: true },
            { text: 'Liberal Alliance', correct: false }
        ]
    },
    {
        question: 'Hvem er kendt for at have beskrevet, hvordan man skal opføre sig i \'Takt og Tone – Hvordan Vi Omgås\' fra 1918?',
        answers: [
            { text: 'Karen Blixen', correct: false },
            { text: 'Herman Bang', correct: false },
            { text: 'Emma Gad', correct: true }
        ]
    },
    {
        question: 'Hvem af følgende personer er en kendt balletkoreograf fra 1800-tallet?',
        answers: [
            { text: 'Adam Oehlenschläger', correct: false },
            { text: 'Vilhelm Hammershøi', correct: false },
            { text: 'August Bournonville', correct: true }
        ]
    },
    {
        question: 'I hvilket parlament blev Socialdemokratiets Christel Schaldemose valgt som næstformand i juli 2024?',
        answers: [
            { text: 'NATO', correct: false },
            { text: 'UN-Parlamentet', correct: false },
            { text: 'EU-Parlamentet', correct: true }
        ]
    },
    {
        question: 'For hvilket parti bliver Anne Heeager ny landsforperson, efter meddelelse i september 2024?',
        answers: [
            { text: 'Moderaterne', correct: false },
            { text: 'De Radikale Venstre', correct: true },
            { text: 'Socialdemokratiet', correct: false }
        ]
    },
    {
        question: 'Hvilken dansk bank er i Juli 2024, tiltalt for hvidvask af 26 millioner?',
        answers: [
            { text: 'Danske Bank', correct: false },
            { text: 'Sydbank', correct: false },
            { text: 'Nordea', correct: true }
        ]
    },
    {
        question: 'Er det lovligt at demonstrere for afskaffelsen af demokratiet?',
        answers: [
            { text: 'Ja', correct: true },
            { text: 'Nej', correct: false }
        ]
    },
    {
        question: 'Hvad står der som motto på Københavns Byret?',
        answers: [
            { text: 'Med lov skal retfærdigheden sejre', correct: false },
            { text: 'Med lov skal folket trives', correct: false },
            { text: 'Med lov skal man land bygge', correct: true }
        ]
    },
    {
        question: 'Må man fornærme et andet menneske groft offentligt?',
        answers: [
            { text: 'Ja', correct: false },
            { text: 'Nej', correct: true },
            { text: 'Kun hvis de har fortjent det', correct: false }
        ]
    },
    {
        question: 'I hvilken by lå den første grundtvigske højskole?',
        answers: [
            { text: 'Rødding', correct: true },
            { text: 'Ribe', correct: false },
            { text: 'Haderslev', correct: false }
        ]
    },
    {
        question: 'Hvad er indbyggertallet cirka i Grønlands hovedstad?',
        answers: [
            { text: '50,000', correct: false },
            { text: '5,000', correct: false },
            { text: '18,000', correct: true }
        ]
    },
    {
        question: 'Hvor meget modtager Grønland i økonomisk tilskud fra den danske stat om året?',
        answers: [
            { text: 'Knap 1.4 milliarder kroner', correct: false },
            { text: 'Knap 14 milliarder kroner', correct: false },
            { text: 'Knap 4 milliarder kroner', correct: true }
        ]
    },
    {
        question: 'Hvor ofte kan man normalt appellere en sag, uden særlig tilladelse?',
        answers: [
            { text: 'Én gang', correct: true },
            { text: 'Det kan man ikke', correct: false },
            { text: 'To gange', correct: false }
        ]
    },
    {
        question: 'Hvor stor en procentdel af danskerne stemte JA ved afstemningen om EF-pakken?',
        answers: [
            { text: '66.2', correct: false },
            { text: '56.2', correct: true },
            { text: '52.6', correct: false }
        ]
    },
    {
        question: 'Hvad sker der i efterkrigstiden?',
        answers: [
            { text: 'Regelbaseret internationalt samarbejde', correct: true },
            { text: 'Verdens krise', correct: false },
            { text: 'Konflikt', correct: false }
        ]
    },
    {
        question: 'Adgang til Folketinget er begrænset:',
        answers: [
            { text: 'Forkert. Enhver kan komme og overvære møderne.', correct: true },
            { text: 'Rigtigt, kun medlemmer af Folketinget kan deltage i møderne.', correct: false },
            { text: 'Rigtigt, men i nogle tilfælde kan den almindelige borger opnå adgang.', correct: false }
        ]
    },
    {
        question: 'Hvad var ikke en del af Septemberforliget?',
        answers: [
            { text: 'Arbejdsgiveren fastlægger løn- og arbejdsvilkår', correct: false },
            { text: 'Arbejdsgiverorganisationer og fagforeninger forhandler på deres medlemmers vegne', correct: false },
            { text: 'Kriterier for hvornår strejke og lockout er tilladt', correct: true }
        ]
    },
    {
        question: 'Hvad var Warszawa-pagten?',
        answers: [
            { text: 'En forsvarsalliance ledet af Sovjetunionen', correct: true },
            { text: 'En ordning hvor USA hjalp Vesteuropa med genopbygningen efter 2. Verdenskrig', correct: false },
            { text: 'En alliance mellem Danmark og en række andre lande', correct: false }
        ]
    },
    {
        question: 'I hvilket hav ligger Færøerne?',
        answers: [
            { text: 'Middelhavet', correct: false },
            { text: 'Nordsøen', correct: false },
            { text: 'Atlanterhavet', correct: true }
        ]
    },
    {
        question: 'Hvornår blev borgen Hammershus bygget?',
        answers: [
            { text: 'I 1800-tallet', correct: false },
            { text: 'I 1200-tallet', correct: true },
            { text: 'I 1743', correct: false }
        ]
    },
    {
        question: 'Hvad er den dominerende trosretning i Norden i dag?',
        answers: [
            { text: 'Ateisme', correct: false },
            { text: 'Protestantisme (luthersk-evangelisk)', correct: true },
            { text: 'Katolicisme', correct: false }
        ]
    },
    {
        question: 'Hvem rejser normalt tiltale i alvorligere straffesager i Danmark?',
        answers: [
            { text: 'Anklagemyndigheden', correct: true },
            { text: 'Domstolene', correct: false },
            { text: 'De privatpersoner, som er ofre for forbrydelsen', correct: false }
        ]
    },
    {
        question: 'Hvilken myndighed kan opløse (forbyde) en forening, der søger at opnå sine mål med vold?',
        answers: [
            { text: 'Domstolene', correct: true },
            { text: 'Politiet', correct: false }
        ]
    },
    {
        question: 'Hvornår faldt Dannebrog ifølge legenden ned fra himlen under et militært slag i Estland?',
        answers: [
            { text: 'År 1219', correct: true },
            { text: 'År 1660', correct: false },
            { text: 'År 1536', correct: false }
        ]
    },
    {
        question: 'Hvilket parti tilhørte Poul Schlüter, som var statsminister i perioden 1982-93?',
        answers: [
            { text: 'Socialdemokratiet', correct: false },
            { text: 'Radikale Venstre', correct: false },
            { text: 'Det Konservative Folkeparti', correct: true }
        ]
    },
    {
        question: 'I 1814 blev der indført en reform om skolepligt i Danmark. Hvor mange år skulle børn ifølge denne reform gå i skole?',
        answers: [
            { text: '10 år', correct: false },
            { text: '12 år', correct: false },
            { text: '7 år', correct: true }
        ]
    },
    {
        question: 'Hvilken rettighed er sikret i den danske grundlov?',
        answers: [
            { text: 'Retten til selv at vælge sin ægtefælle', correct: false },
            { text: 'Retten til at udtrykke sine holdninger', correct: true },
            { text: 'Retten til dobbelt statsborgerskab', correct: false }
        ]
    },
    {
        question: 'Hvad hedder den ordbog, som Dansk Sprognævn udarbejder?',
        answers: [
            { text: 'Den komplette ordbog', correct: false },
            { text: 'Danmarks ordbog', correct: false },
            { text: 'Retskrivningsordbogen', correct: true }
        ]
    },
    {
        question: 'Hvilket af de danske EU-forbehold var der folkeafstemning om i 2022?',
        answers: [
            { text: 'EU\'s fælles valuta (euroen)', correct: false },
            { text: 'EU\'s forsvars- og sikkerhedspolitik', correct: true },
            { text: 'EU\'s fælles rets- og udlændingepolitik', correct: false }
        ]
    },
    {
        question: 'Skal der være tilslutning fra både Folketinget og befolkningen, hvis grundloven skal ændres?',
        answers: [
            { text: 'Ja', correct: true },
            { text: 'Nej', correct: false }
        ]
    }
];

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

function startGame() {
    startButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    questionContainer.classList.remove('hide');
    scoreContainer.classList.add('hide');
    updateProgress();
    setNextQuestion();
}

function updateProgress() {
    progressText.textContent = `${currentQuestionIndex + 1}/${questions.length}`;
}

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    updateProgress();
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    
    // Add initial feedback message
    const feedbackMessage = document.createElement('div');
    feedbackMessage.classList.add('feedback-message');
    feedbackMessage.id = 'feedback-message';
    feedbackMessage.textContent = '...';
    questionContainer.appendChild(feedbackMessage);
    
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add('hide');
    const feedbackMessage = document.getElementById('feedback-message');
    if (feedbackMessage) {
        feedbackMessage.remove();
    }
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    
    // Add selected class to clicked button
    selectedButton.classList.add('selected');
    
    const feedbackMessage = document.getElementById('feedback-message');
    
    if (correct) {
        score++;
        feedbackMessage.textContent = 'Korrekt! ✅';
        feedbackMessage.classList.add('correct-message');
    } else {
        feedbackMessage.textContent = 'Forkert! ❌';
        feedbackMessage.classList.add('wrong-message');
    }
    
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button === selectedButton) {
            // Keep the selected button's styling
            setStatusClass(button, button.dataset.correct);
        } else if (button.dataset.correct) {
            // Show correct answer if user selected wrong
            button.classList.add('correct');
        }
        button.disabled = true;
    });
    
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        startButton.innerText = 'Start forfra';
        startButton.classList.remove('hide');
        showScore();
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('selected');
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function showScore() {
    questionContainer.classList.add('hide');
    scoreContainer.classList.remove('hide');
    progressText.textContent = 'Afsluttet';
    scoreElement.textContent = `${score} ud af ${questions.length}`;
} 