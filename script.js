const test1Button = document.getElementById('test1-btn');
const test2Button = document.getElementById('test2-btn');
const hardButton = document.getElementById('hard-btn');
const nextButton = document.getElementById('next-btn');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const progressText = document.getElementById('question-progress');
const congratsSound = new Audio('congrats.mp3');

const WRONG_THRESHOLD = 2;
const RIGHT_THRESHOLD = 2;

let shuffledQuestions, currentQuestionIndex, score;
let questionStats = JSON.parse(localStorage.getItem('questionStats')) || {};
let hardQuestions = JSON.parse(localStorage.getItem('hardQuestions')) || [];

// Replace the current questions array with this complete one
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
        question: 'Hvilket parti tilhørte Lars Løkke Rasmussen, da han var statsminister i perioderne 2009–11 og 2015–19?',
        answers: [
            { text: 'Det Konservative Folkeparti', correct: false },
            { text: 'Socialdemokratiet', correct: false },
            { text: 'Venstre', correct: true }
        ]
    },
    {
        question: 'Hvad var resultatet af, at Danmark i 1864 tabte krigen mod Preussen (Tyskland) og Østrig?',
        answers: [
            { text: 'Tysk var i en periode det officielle sprog i Danmark', correct: false },
            { text: 'Danmark mistede Bornholm', correct: false },
            { text: 'Danmark mistede hertugdømmerne Slesvig, Holsten og Lauenburg', correct: true }
        ]
    },
    {
        question: 'Hvilket parti var Poul Nyrup Rasmussen formand for, da han var statsminister 1993–2001?',
        answers: [
            { text: 'Det Konservative Folkeparti', correct: false },
            { text: 'Socialdemokratiet', correct: true },
            { text: 'Venstre', correct: false }
        ]
    },
    {
        question: 'Hvilket parti var Poul Schlüter formand for, da han var statsminister i perioden 1982–1993?',
        answers: [
            { text: 'Venstre', correct: false },
            { text: 'Socialdemokratiet', correct: false },
            { text: 'Det Konservative Folkeparti', correct: true }
        ]
    },
    {
        question: 'Hvorfor er magten i Danmark tredelt?',
        answers: [
            { text: 'For at give borgerne mere gennemsigtighed i de forskellige processer', correct: false },
            { text: 'For at gøre det lettere at administrere hvor ansvaret skal placeres', correct: false },
            { text: 'Sådan at de forskellige dele kan kontrollere og begrænse hinanden', correct: true }
        ]
    },
    {
        question: 'Folketingets Ombudsmand er?',
        answers: [
            { text: 'Valgt og kontrolleret af Folketinget', correct: false },
            { text: 'Valgt af men ikke kontrolleret af Folketinget', correct: true },
            { text: 'Hverken valgt eller kontrolleret af Folketinget', correct: false }
        ]
    },
    {
        question: 'Danmark er et repræsentativt demokrati, men i nogle tilfælde suppleres dette af?',
        answers: [
            { text: 'Monarkiet', correct: false },
            { text: 'Internationale samarbejder', correct: false },
            { text: 'Direkte demokrati', correct: true }
        ]
    },
    {
        question: 'Hvad er et eksempel på en dansk interesseorganisation?',
        answers: [
            { text: 'Dansk Folkeparti', correct: false },
            { text: 'Berlingske', correct: false },
            { text: 'Fagbevægelsens Hovedorganisation', correct: true }
        ]
    },
    {
        question: 'Hvad spiller en betydelig rolle i magtbalancen mellem regeringen og oppositionen?',
        answers: [
            { text: 'Muligheden for et fælles ministersamarbejde', correct: false },
            { text: 'Muligheden for at få kaldt ministre i samråd', correct: false },
            { text: 'Muligheden for et mistillidsvotum', correct: true }
        ]
    },
    {
        question: 'Hvordan kan Folketinget kontrollere, at en regering fører de vedtagende love, som de har tillid til?',
        answers: [
            { text: 'Ved at støtte en regering som de har tillid til', correct: false },
            { text: 'Ved at nedsætte undersøgende udvalg', correct: false },
            { text: 'Ved at stille spørgsmål til ministrene', correct: true }
        ]
    },
    {
        question: 'Hvad er ikke et eksempel på et udvalg?',
        answers: [
            { text: 'Det danske udvalg', correct: true },
            { text: 'Skatteudvalg', correct: false },
            { text: 'Finansudvalg', correct: false }
        ]
    },
    {
        question: 'Anklagemyndigheden skal��',
        answers: [
            { text: 'skaffe de nødvendige beviser gennem efterforskning', correct: false },
            { text: 'overbevise dommerne om, at den anklagede er skyldig', correct: false },
            { text: 'afgøre om en borger er skyldig og skal straffes', correct: true }
        ]
    },
    {
        question: 'I hvilke af følgende scenarier er valgdeltagelsen typisk lavest?',
        answers: [
            { text: 'Når der er Folketingsvalg', correct: false },
            { text: 'Når der er kommunalvalg', correct: false },
            { text: 'Når der stemmes til Europa-Parlamentet', correct: true }
        ]
    },
    {
        question: 'Hvilke parti har også gode muligheder for at blive valgt ind (pga. det danske valgsystem)?',
        answers: [
            { text: 'Store partier', correct: false },
            { text: 'Alle partier', correct: false },
            { text: 'Små partier', correct: true }
        ]
    },
    {
        question: 'Hvem var statsminister fra 1968 til 1971 fra Det Radikale Venstre, selvom hans parti var det mindste i regeringen?',
        answers: [
            { text: 'Lars Løkke Rasmussen', correct: false },
            { text: 'Anders Fogh Rasmussen', correct: false },
            { text: 'Hilmar Baunsgaard', correct: true }
        ]
    },
    {
        question: 'Hvornår trådte loven om hjemmestyre i Grønland i kraft?',
        answers: [
            { text: '1979', correct: false },
            { text: '1949', correct: false },
            { text: '1979', correct: true }
        ]
    },
    {
        question: 'Hvilket politisk parti opstod i 1870\'erne som en del af arbejderbevægelsen?',
        answers: [
            { text: 'Venstre', correct: false },
            { text: 'Det Radikale Venstre', correct: false },
            { text: 'Socialdemokratiet', correct: true }
        ]
    },
    {
        question: 'Hvilken kendt dansker fandt i 1600-tallet ud af at måle lysets hastighed?',
        answers: [
            { text: 'Ole Rømer', correct: true },
            { text: 'H.C. Ørsted', correct: false },
            { text: 'Niels Bohr', correct: false }
        ]
    },
    {
        question: 'Hvad hedder formanden for Det Konservative Folkeparti?',
        answers: [
            { text: 'Lene Espersen', correct: false },
            { text: 'Tom Behnke', correct: false },
            { text: 'Mona Juul', correct: true }
        ]
    },
    {
        question: 'Hvem har designet "Your rainbow panorama" (Din regnbueudsigt), der er placeret oven på kunstmuseet ARoS i Aarhus?',
        answers: [
            { text: 'Jørn Utzon', correct: false },
            { text: 'Arne Jacobsen', correct: false },
            { text: 'Olafur Eliasson', correct: true }
        ]
    },
    {
        question: 'Hvad er formålet med Folketingets spørgetime?',
        answers: [
            { text: 'At diskutere nye lovforslag', correct: false },
            { text: 'At stille spørgsmål direkte til ministrene', correct: true },
            { text: 'At holde afstemninger', correct: false }
        ]
    },
    {
        question: 'Hvad er en af Højesterets vigtigste opgaver?',
        answers: [
            { text: 'At sikre en ensartet retstilstand i hele landet', correct: true },
            { text: 'At dømme i alle straffesager', correct: false },
            { text: 'At rådgive regeringen', correct: false }
        ]
    },
    {
        question: 'Hvad er et karakteristisk træk ved det danske demokrati?',
        answers: [
            { text: 'Det er kun direkte demokrati', correct: false },
            { text: 'Det er repræsentativt med elementer af direkte demokrati', correct: true },
            { text: 'Det er kun indirekte demokrati', correct: false }
        ]
    },
    {
        question: 'Hvad kendetegner en retsstat?',
        answers: [
            { text: 'At alle er lige for loven', correct: true },
            { text: 'At kun dommere kan vedtage love', correct: false },
            { text: 'At politiet bestemmer lovene', correct: false }
        ]
    },
    {
        question: 'Hvad er en konsekvens af magtens tredeling?',
        answers: [
            { text: 'Regeringen kan ikke samtidig være dommer', correct: true },
            { text: 'Folketinget kan ikke vedtage love', correct: false },
            { text: 'Domstolene kan ikke dømme politikere', correct: false }
        ]
    },
    {
        question: 'Hvad er en af mediernes vigtigste opgaver i et demokrati?',
        answers: [
            { text: 'At støtte regeringen', correct: false },
            { text: 'At være vagthund over for magthaverne', correct: true },
            { text: 'At underholde befolkningen', correct: false }
        ]
    },
    {
        question: 'Hvad er et centralt princip i den danske grundlov?',
        answers: [
            { text: 'Ytringsfrihed', correct: true },
            { text: 'Ret til arbejde', correct: false },
            { text: 'Ret til bolig', correct: false }
        ]
    },
    {
        question: 'Hvad er en vigtig funktion for interesseorganisationer?',
        answers: [
            { text: 'At vedtage love', correct: false },
            { text: 'At varetage medlemmernes interesser', correct: true },
            { text: 'At udpege ministre', correct: false }
        ]
    },
    {
        question: 'Hvad er formålet med kommunalt selvstyre?',
        answers: [
            { text: 'At sikre lokalt demokrati', correct: true },
            { text: 'At spare staten for penge', correct: false },
            { text: 'At give mere magt til borgmesteren', correct: false }
        ]
    },
    {
        question: 'Hvad er en af Folketingets vigtigste opgaver?',
        answers: [
            { text: 'At vedtage love', correct: true },
            { text: 'At dømme i retssager', correct: false },
            { text: 'At lede politiet', correct: false }
        ]
    }
];

// Then the split happens
const test1Questions = questions.slice(0, 26);
const test2Questions = questions.slice(26, 52);

function updateHardButton() {
    if (hardQuestions.length === 0) {
        hardButton.disabled = true;
        hardButton.style.opacity = '0.5';
        hardButton.style.cursor = 'not-allowed';
    } else {
        hardButton.disabled = false;
        hardButton.style.opacity = '1';
        hardButton.style.cursor = 'pointer';
    }
}

updateHardButton();

test1Button.addEventListener('click', () => startGame('test1'));
test2Button.addEventListener('click', () => startGame('test2'));
hardButton.addEventListener('click', () => startGame('hard'));
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

function startGame(mode) {
    test1Button.classList.add('hide');
    test2Button.classList.add('hide');
    hardButton.classList.add('hide');
    document.getElementById('quiz').classList.add('quiz-active');
    
    if (mode === 'hard') {
        if (hardQuestions.length > 0) {
            shuffledQuestions = [...hardQuestions].sort(() => Math.random() - 0.5);
        } else {
            return;
        }
    } else if (mode === 'test1') {
        shuffledQuestions = [...test1Questions].sort(() => Math.random() - 0.5);
    } else {
        shuffledQuestions = [...test2Questions].sort(() => Math.random() - 0.5);
    }
    
    currentQuestionIndex = 0;
    score = 0;
    questionContainer.classList.remove('hide');
    scoreContainer.classList.add('hide');
    updateProgress();
    setNextQuestion();
}

function updateProgress() {
    progressText.textContent = `${currentQuestionIndex + 1}/${shuffledQuestions.length}`;
}

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    updateProgress();
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    
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
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    
    selectedButton.classList.add('selected');
    
    const feedbackMessage = document.getElementById('feedback-message');
    
    if (!questionStats[currentQuestion.question]) {
        questionStats[currentQuestion.question] = {
            timesWrong: 0,
            timesRight: 0
        };
    }
    
    if (correct) {
        score++;
        questionStats[currentQuestion.question].timesRight++;
        feedbackMessage.textContent = 'Korrekt! ✅';
        feedbackMessage.classList.add('correct-message');
        
        hardQuestions = hardQuestions.filter(q => q.question !== currentQuestion.question);
    } else {
        questionStats[currentQuestion.question].timesWrong++;
        feedbackMessage.textContent = 'Forkert! ❌';
        feedbackMessage.classList.add('wrong-message');
        
        if (questionStats[currentQuestion.question].timesWrong >= WRONG_THRESHOLD &&
            !hardQuestions.some(q => q.question === currentQuestion.question)) {
            hardQuestions.push(currentQuestion);
        }
    }
    
    localStorage.setItem('questionStats', JSON.stringify(questionStats));
    localStorage.setItem('hardQuestions', JSON.stringify(hardQuestions));
    updateHardButton();
    
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button === selectedButton) {
            setStatusClass(button, button.dataset.correct);
        } else if (button.dataset.correct) {
            button.classList.add('correct');
        }
        button.disabled = true;
    });
    
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        setTimeout(() => {
            showScore();
        }, 2000);
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
    scoreElement.textContent = `${score} ud af ${shuffledQuestions.length}`;
    
    test1Button.classList.remove('hide');
    test2Button.classList.remove('hide');
    hardButton.classList.remove('hide');
    document.getElementById('quiz').classList.remove('quiz-active');
    updateHardButton();
    
    congratsSound.play().catch(error => {
        console.log("Audio playback failed:", error);
    });
}

function showStats() {
    console.log('Hard Questions:', hardQuestions.length);
    console.log('Question Stats:', questionStats);
}

const resetStatsButton = document.createElement('button');
resetStatsButton.textContent = 'Nulstil statistik';
resetStatsButton.classList.add('btn');
resetStatsButton.style.marginTop = '10px';
resetStatsButton.onclick = function() {
    if (confirm('Er du sikker på, at du vil nulstille al statistik?')) {
        localStorage.removeItem('questionStats');
        localStorage.removeItem('hardQuestions');
        questionStats = {};
        hardQuestions = [];
        alert('Statistik er nulstillet');
    }
};
scoreContainer.appendChild(resetStatsButton); 