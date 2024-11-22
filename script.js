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
const potentialButton = document.getElementById('potential-btn');
const vaerdierButton = document.getElementById('vaerdier-btn');

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
        question: 'Anklagemyndigheden skal',
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
    },
    {
        question: 'Hvad er "Folkekirken"?',
        answers: [
            { text: 'Danmarks nationale kirke', correct: true },
            { text: 'En politisk organisation', correct: false },
            { text: 'En folkemusikgruppe', correct: false }
        ]
    },
    {
        question: 'Hvilken dansk ø er kendt for sine klipper og rundkirker?',
        answers: [
            { text: 'Lolland', correct: false },
            { text: 'Bornholm', correct: true },
            { text: 'Samsø', correct: false }
        ]
    },
    {
        question: 'Hvad er "Smørrebrød"?',
        answers: [
            { text: 'En type ost', correct: false },
            { text: 'En traditionel dansk åben sandwich', correct: true },
            { text: 'En dansk kage', correct: false }
        ]
    }
];

// Then the split happens
const test1Questions = questions.slice(0, 26);
const test2Questions = questions.slice(26, 52);

// Replace the entire potentialQuestions array with just one question
const potentialQuestions = [
    {
        question: 'Hvem var Danmarks første kvindelige statsminister?',
        answers: [
            { text: 'Helle Thorning-Schmidt', correct: true },
            { text: 'Pia Kjærsgaard', correct: false },
            { text: 'Margrethe Vestager', correct: false }
        ]
    },
    {
        question: 'Hvornår blev Grundloven første gang indført i Danmark?',
        answers: [
            { text: '1849', correct: true },
            { text: '1864', correct: false },
            { text: '1901', correct: false }
        ]
    },
    {
        question: 'Hvilket år blev Danmark medlem af EU?',
        answers: [
            { text: '1972', correct: false },
            { text: '1973', correct: true },
            { text: '1986', correct: false }
        ]
    },
    {
        question: 'Hvad hedder den nuværende danske monark?',
        answers: [
            { text: 'Dronning Margrethe II', correct: false },
            { text: 'Kong Frederik X', correct: true },
            { text: 'Dronning Ingrid', correct: false }
        ]
    },
    {
        question: 'Hvilken dansk forfatter skrev "Den grimme ælling"?',
        answers: [
            { text: 'Hans Christian Andersen', correct: true },
            { text: 'Karen Blixen', correct: false },
            { text: 'Søren Kierkegaard', correct: false }
        ]
    },
    {
        question: 'Hvad er Danmarks nationaldag?',
        answers: [
            { text: '5. juni', correct: true },
            { text: '15. april', correct: false },
            { text: '25. december', correct: false }
        ]
    },
    {
        question: 'Hvilken by er Danmarks næststørste?',
        answers: [
            { text: 'Odense', correct: false },
            { text: 'Aarhus', correct: true },
            { text: 'Aalborg', correct: false }
        ]
    },
    {
        question: 'Hvad er Folketinget?',
        answers: [
            { text: 'Danmarks parlament', correct: true },
            { text: 'Danmarks højesteret', correct: false },
            { text: 'Danmarks regering', correct: false }
        ]
    },
    {
        question: 'Hvilket parti tilhører Mette Frederiksen?',
        answers: [
            { text: 'Venstre', correct: false },
            { text: 'Socialdemokratiet', correct: true },
            { text: 'Det Konservative Folkeparti', correct: false }
        ]
    },
    {
        question: 'Hvad er Danmarks officielle sprog?',
        answers: [
            { text: 'Engelsk', correct: false },
            { text: 'Tysk', correct: false },
            { text: 'Dansk', correct: true }
        ]
    },
    {
        question: 'Hvilken religion er den mest udbredte i Danmark?',
        answers: [
            { text: 'Islam', correct: false },
            { text: 'Protestantisk kristendom', correct: true },
            { text: 'Katolicisme', correct: false }
        ]
    },
    {
        question: 'Hvad er Danmarks valuta?',
        answers: [
            { text: 'Euro', correct: false },
            { text: 'Dansk krone', correct: true },
            { text: 'Svensk krone', correct: false }
        ]
    },
    {
        question: 'Hvilket år blev kvinder stemmeberettigede i Danmark?',
        answers: [
            { text: '1915', correct: true },
            { text: '1921', correct: false },
            { text: '1945', correct: false }
        ]
    },
    {
        question: 'Hvad er Danmarks højeste punkt?',
        answers: [
            { text: 'Himmelbjerget', correct: false },
            { text: 'Møllehøj', correct: true },
            { text: 'Yding Skovhøj', correct: false }
        ]
    },
    {
        question: 'Hvilken dansk film vandt en Oscar i 2021?',
        answers: [
            { text: 'Druk', correct: true },
            { text: 'Jagten', correct: false },
            { text: 'Hævnen', correct: false }
        ]
    },
    {
        question: 'Hvad er Danmarks største eksportvare?',
        answers: [
            { text: 'Landbrugsprodukter', correct: false },
            { text: 'Medicinalprodukter', correct: true },
            { text: 'Maskiner', correct: false }
        ]
    },
    {
        question: 'Hvilken dansk ø er den største?',
        answers: [
            { text: 'Fyn', correct: false },
            { text: 'Sjælland', correct: true },
            { text: 'Bornholm', correct: false }
        ]
    },
    {
        question: 'Hvad hedder Danmarks nationalfugl?',
        answers: [
            { text: 'Svanen', correct: true },
            { text: 'Storken', correct: false },
            { text: 'Spurven', correct: false }
        ]
    },
    {
        question: 'Hvilken dansk virksomhed er kendt for at producere legetøjsklodser?',
        answers: [
            { text: 'Carlsberg', correct: false },
            { text: 'LEGO', correct: true },
            { text: 'Bang & Olufsen', correct: false }
        ]
    },
    {
        question: 'Hvad er "hygge" i dansk kultur?',
        answers: [
            { text: 'En type mad', correct: false },
            { text: 'En følelse af komfort og velvære', correct: true },
            { text: 'En traditionel dans', correct: false }
        ]
    },
    {
        question: 'Hvilken dansk by er kendt for Tivoli?',
        answers: [
            { text: 'København', correct: true },
            { text: 'Odense', correct: false },
            { text: 'Aarhus', correct: false }
        ]
    },
    {
        question: 'Hvad er Danmarks største sø?',
        answers: [
            { text: 'Arresø', correct: true },
            { text: 'Esrum Sø', correct: false },
            { text: 'Furesø', correct: false }
        ]
    },
    {
        question: 'Hvilken dansk komponist skrev musikken til balletten "Napoli"?',
        answers: [
            { text: 'Carl Nielsen', correct: false },
            { text: 'Niels W. Gade', correct: false },
            { text: 'August Bournonville', correct: true }
        ]
    },
    {
        question: 'Hvad er Danmarks ældste by?',
        answers: [
            { text: 'Ribe', correct: true },
            { text: 'Roskilde', correct: false },
            { text: 'Aalborg', correct: false }
        ]
    },
    {
        question: 'Hvilken dansk videnskabsmand opdagede elektromagnetismen?',
        answers: [
            { text: 'Niels Bohr', correct: false },
            { text: 'H.C. Ørsted', correct: true },
            { text: 'Tycho Brahe', correct: false }
        ]
    },
    {
        question: 'Hvad er "Folkekirken"?',
        answers: [
            { text: 'Danmarks nationale kirke', correct: true },
            { text: 'En politisk organisation', correct: false },
            { text: 'En folkemusikgruppe', correct: false }
        ]
    },
    {
        question: 'Hvilken dansk ø er kendt for sine klipper og rundkirker?',
        answers: [
            { text: 'Lolland', correct: false },
            { text: 'Bornholm', correct: true },
            { text: 'Samsø', correct: false }
        ]
    },
    {
        question: 'Hvad er "Smørrebrød"?',
        answers: [
            { text: 'En type ost', correct: false },
            { text: 'En traditionel dansk åben sandwich', correct: true },
            { text: 'En dansk kage', correct: false }
        ]
    },
    {
        question: 'Hvilken dansk forfatter modtog Nobelprisen i litteratur i 1944?',
        answers: [
            { text: 'Hans Christian Andersen', correct: false },
            { text: 'Karen Blixen', correct: false },
            { text: 'Johannes V. Jensen', correct: true }
        ]
    },
    {
        question: 'Hvad er "J-dag" i Danmark?',
        answers: [
            { text: 'Dagen hvor julebryggen frigives', correct: true },
            { text: 'Dagen hvor juletræet tændes', correct: false },
            { text: 'Dagen hvor julegaver gives', correct: false }
        ]
    },
    {
        question: 'Hvilken dansk by er kendt for sin domkirke og vikingskibsmuseum?',
        answers: [
            { text: 'Roskilde', correct: true },
            { text: 'Esbjerg', correct: false },
            { text: 'Kolding', correct: false }
        ]
    },
    {
        question: 'Hvad er "Fastelavn" i Danmark?',
        answers: [
            { text: 'En høstfest', correct: false },
            { text: 'En forårsfestival', correct: false },
            { text: 'En karnevalslignende tradition før fasten', correct: true }
        ]
    },
    {
        question: 'Hvilken dansk ø er kendt for sine mange slotte og herregårde?',
        answers: [
            { text: 'Fyn', correct: true },
            { text: 'Lolland', correct: false },
            { text: 'Møn', correct: false }
        ]
    },
    {
        question: 'Hvad er "Folketingets Ombudsmand"?',
        answers: [
            { text: 'En person der overvåger regeringens arbejde', correct: false },
            { text: 'En person der hjælper borgere med klager over offentlige myndigheder', correct: true },
            { text: 'En person der repræsenterer Danmark i udlandet', correct: false }
        ]
    },
    {
        question: 'Hvad er "Grundtvigskolen" i Danmark?',
        answers: [
            { text: 'En type folkeskole', correct: false },
            { text: 'En type højskole', correct: true },
            { text: 'En type universitet', correct: false }
        ]
    },
    {
        question: 'Hvilken dansk maler er kendt for sine skildringer af Skagensmalerne?',
        answers: [
            { text: 'P.S. Krøyer', correct: true },
            { text: 'Vilhelm Hammershøi', correct: false },
            { text: 'Anna Ancher', correct: false }
        ]
    },
    {
        question: 'Hvad hedder Danmarks største lufthavn?',
        answers: [
            { text: 'Aalborg Lufthavn', correct: false },
            { text: 'Billund Lufthavn', correct: false },
            { text: 'Københavns Lufthavn', correct: true }
        ]
    },
    {
        question: 'Hvornår blev Danmark en del af NATO?',
        answers: [
            { text: '1949', correct: true },
            { text: '1955', correct: false },
            { text: '1961', correct: false }
        ]
    },
    {
        question: 'Hvilket dansk band er kendt for sangen "Barbie Girl"?',
        answers: [
            { text: 'D-A-D', correct: false },
            { text: 'Aqua', correct: true },
            { text: 'Alphabeat', correct: false }
        ]
    },
    {
        question: 'Hvad er Danmarks største nationalpark?',
        answers: [
            { text: 'Nationalpark Mols Bjerge', correct: false },
            { text: 'Nationalpark Vadehavet', correct: true },
            { text: 'Nationalpark Thy', correct: false }
        ]
    },
    {
        question: 'Hvad er Danmarks officielle motto?',
        answers: [
            { text: 'Med lov skal land bygges', correct: true },
            { text: 'Frihed, lighed, broderskab', correct: false },
            { text: 'Enighed gør stærk', correct: false }
        ]
    },
    {
        question: 'Hvad hedder den danske troldmand, der er kendt for sine illusioner?',
        answers: [
            { text: 'Anders Matthesen', correct: false },
            { text: 'Rune Klan', correct: false },
            { text: 'Jesper Grønkjær', correct: true }
        ]
    },
    {
        question: 'Hvad er en folkeskole i Danmark?',
        answers: [
            { text: 'En skole for voksne', correct: false },
            { text: 'En offentlig grundskole for børn', correct: true },
            { text: 'En skole for højere uddannelse', correct: false }
        ]
    },
    {
        question: 'Hvornår fandt slaget ved Dybbøl sted?',
        answers: [
            { text: '1864', correct: true },
            { text: '1848', correct: false },
            { text: '1870', correct: false }
        ]
    },
    {
        question: 'Hvilken by er kendt for sine historiske bindingsværkshuse og en af verdens ældste rådhuse?',
        answers: [
            { text: 'Odense', correct: false },
            { text: 'Ribe', correct: true },
            { text: 'Aalborg', correct: false }
        ]
    },
    {
        question: 'Hvem var designeren af Operahuset i København?',
        answers: [
            { text: 'Henning Larsen', correct: true },
            { text: 'Bjarke Ingels', correct: false },
            { text: 'Arne Jacobsen', correct: false }
        ]
    },
    {
        question: 'Hvad er Danmarks ældste universitet?',
        answers: [
            { text: 'Aarhus Universitet', correct: false },
            { text: 'Københavns Universitet', correct: true },
            { text: 'Syddansk Universitet', correct: false }
        ]
    },
    {
        question: 'Hvilken dansk konge blev kendt som "den evige konge"?',
        answers: [
            { text: 'Christian IV', correct: false },
            { text: 'Gorm den Gamle', correct: false },
            { text: 'Knud den Hellige', correct: true }
        ]
    },
    {
        question: 'Hvad symboliserer de tre løver i Danmarks rigsvåben?'
    }
];

// Add the new questions array
const vaerdierQuestions = [
    {
        question: 'Hvad betyder ytringsfrihed i Danmark?',
        answers: [
            { text: 'At man kan sige hvad som helst uden konsekvenser', correct: false },
            { text: 'At man kan udtrykke sine meninger frit, så længe det ikke krænker andres rettigheder eller overtræder loven', correct: true },
            { text: 'At man kun kan ytre sig frit i private sammenhænge', correct: false }
        ]
    },
    {
        question: 'Hvordan praktiseres ligestilling mellem kønnene i Danmark?',
        answers: [
            { text: 'Mænd og kvinder har lige rettigheder og muligheder inden for uddannelse, arbejde og politik', correct: true },
            { text: 'Kun kvinder har adgang til bestemte erhverv', correct: false },
            { text: 'Mænd har fortrinsret til lederstillinger', correct: false }
        ]
    },
    {
        question: 'Hvad betyder religionsfrihed i Danmark?',
        answers: [
            { text: 'At alle har ret til at praktisere deres religion eller vælge ikke at have en religion', correct: true },
            { text: 'At kun kristendommen er tilladt', correct: false },
            { text: 'At man ikke må skifte religion', correct: false }
        ]
    },
    {
        question: 'Hvad forstås ved princippet om lighed for loven i Danmark?',
        answers: [
            { text: 'At alle behandles ens af retssystemet uanset social status, køn eller etnicitet', correct: true },
            { text: 'At kun danske statsborgere har ret til en retfærdig rettergang', correct: false },
            { text: 'At loven kun gælder for personer over 18 år', correct: false }
        ]
    },
    {
        question: 'Hvordan sikres forsamlingsfrihed i Danmark?',
        answers: [
            { text: 'Borgere har ret til at samles fredeligt og uden våben til møder og demonstrationer', correct: true },
            { text: 'Man skal have tilladelse fra myndighederne for at mødes mere end fem personer', correct: false },
            { text: 'Forsamlinger er kun tilladt indendørs', correct: false }
        ]
    },
    {
        question: 'Hvad er betydningen af pressefrihed i Danmark?',
        answers: [
            { text: 'Medierne kan rapportere og udtrykke meninger uden censur fra staten', correct: true },
            { text: 'Kun statslige medier har ret til at udgive nyheder', correct: false },
            { text: 'Journalister skal godkende deres artikler hos myndighederne før udgivelse', correct: false }
        ]
    },
    {
        question: 'Hvad indebærer princippet om privat ejendomsret i Danmark?',
        answers: [
            { text: 'At individer har ret til at eje og disponere over ejendom, så længe det ikke strider mod loven', correct: true },
            { text: 'At al ejendom ejes af staten', correct: false },
            { text: 'At man kun kan eje ejendom gennem arv', correct: false }
        ]
    },
    {
        question: 'Hvordan forstås demokrati som en dansk værdi?',
        answers: [
            { text: 'At borgerne har ret til at deltage i frie og fair valg samt ytre deres meninger om politiske forhold', correct: true },
            { text: 'At kun udvalgte grupper har stemmeret', correct: false },
            { text: 'At regeringen udpeges uden folkelig deltagelse', correct: false }
        ]
    },
    {
        question: 'Hvad betyder princippet om retssikkerhed i Danmark?',
        answers: [
            { text: 'At borgerne er beskyttet mod vilkårlige indgreb fra myndighederne og har ret til en retfærdig rettergang', correct: true },
            { text: 'At myndighederne kan tilbageholde personer uden grund', correct: false },
            { text: 'At kun personer med høj indkomst har adgang til retssystemet', correct: false }
        ]
    },
    {
        question: 'Hvordan praktiseres tolerance som en dansk værdi?',
        answers: [
            { text: 'Ved at acceptere og respektere andres forskelligheder, herunder kultur, religion og livsstil', correct: true },
            { text: 'Ved at undgå kontakt med personer fra andre kulturer', correct: false },
            { text: 'Ved at påtvinge andre ens egne værdier', correct: false }
        ]
    },
    {
        question: 'Hvad menes der med forsamlingsfrihed i Danmark?',
        answers: [
            { text: 'At man frit kan samles og demonstrere, så længe det er fredeligt', correct: true },
            { text: 'At man kun kan samles, hvis man har tilladelse fra myndighederne', correct: false },
            { text: 'At man kun kan samles indendørs', correct: false }
        ]
    },
    {
        question: 'Hvad betyder princippet om magtens tredeling?',
        answers: [
            { text: 'At Folketinget, domstolene og politiet arbejder sammen', correct: false },
            { text: 'At magten er fordelt mellem den lovgivende, udøvende og dømmende magt', correct: true },
            { text: 'At regeringen alene har den fulde magt', correct: false }
        ]
    },
    {
        question: 'Hvordan praktiseres lighed for loven i Danmark?',
        answers: [
            { text: 'Alle borgere er lige for loven uanset deres sociale status, køn eller etnicitet', correct: true },
            { text: 'Kun statsborgere har fuld adgang til retssystemet', correct: false },
            { text: 'Loven gælder kun for dem, der betaler skat', correct: false }
        ]
    },
    {
        question: 'Hvad betyder det, at Danmark er et konstitutionelt monarki?',
        answers: [
            { text: 'At monarken har absolut magt', correct: false },
            { text: 'At monarken har symbolsk magt og arbejder inden for rammerne af Grundloven', correct: true },
            { text: 'At monarken kun er ansvarlig for udenrigspolitik', correct: false }
        ]
    },
    {
        question: 'Hvad indebærer princippet om ligestilling i Danmark?',
        answers: [
            { text: 'At kvinder og mænd har lige muligheder inden for uddannelse og arbejdsmarkedet', correct: true },
            { text: 'At kvinder får bedre rettigheder end mænd', correct: false },
            { text: 'At kun kvinder kan få adgang til bestemte erhverv', correct: false }
        ]
    },
    {
        question: 'Hvad er Folkekirken i Danmark?',
        answers: [
            { text: 'En statskirke, som er grundlagt på evangelisk-luthersk tro', correct: true },
            { text: 'En religiøs organisation for alle trosretninger', correct: false },
            { text: 'En politisk organisation, der støtter regeringen', correct: false }
        ]
    },
    {
        question: 'Hvordan sikres demokratiet i Danmark?',
        answers: [
            { text: 'Gennem frie og fair valg, hvor borgerne kan stemme på deres repræsentanter', correct: true },
            { text: 'Gennem kongen eller dronningen, der udpeger Folketingets medlemmer', correct: false },
            { text: 'Gennem en national rådslagning', correct: false }
        ]
    },
    {
        question: 'Må man stifte en forening i Danmark, der går imod regeringens politik?',
        answers: [
            { text: 'Ja, så længe foreningen ikke bruger vold', correct: true },
            { text: 'Nej, kun politisk neutrale foreninger er tilladt', correct: false },
            { text: 'Kun med regeringens godkendelse', correct: false }
        ]
    },
    {
        question: 'Hvad betyder princippet om privatlivets fred i Danmark?',
        answers: [
            { text: 'At myndighederne ikke må overvåge borgerne uden en dommerkendelse', correct: true },
            { text: 'At borgerne skal dele deres personlige data med staten', correct: false },
            { text: 'At medierne kan offentliggøre borgernes private oplysninger', correct: false }
        ]
    },
    {
        question: 'Hvad indebærer trykkefrihed i Danmark?',
        answers: [
            { text: 'At medierne kan offentliggøre nyheder uden censur fra myndighederne', correct: true },
            { text: 'At kun statslige medier må publicere politiske emner', correct: false },
            { text: 'At pressen skal godkende deres artikler hos regeringen', correct: false }
        ]
    }
];

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
potentialButton.addEventListener('click', () => startGame('potential'));
vaerdierButton.addEventListener('click', () => startGame('vaerdier'));
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

function startGame(mode) {
    test1Button.classList.add('hide');
    test2Button.classList.add('hide');
    potentialButton.classList.add('hide');
    hardButton.classList.add('hide');
    vaerdierButton.classList.add('hide');
    document.getElementById('quiz').classList.add('quiz-active');
    
    if (mode === 'hard') {
        if (hardQuestions.length > 0) {
            shuffledQuestions = [...hardQuestions].sort(() => Math.random() - 0.5);
        } else {
            return;
        }
    } else if (mode === 'test1') {
        shuffledQuestions = [...test1Questions].sort(() => Math.random() - 0.5);
    } else if (mode === 'test2') {
        shuffledQuestions = [...test2Questions].sort(() => Math.random() - 0.5);
    } else if (mode === 'potential') {
        shuffledQuestions = [...potentialQuestions].sort(() => Math.random() - 0.5);
    } else if (mode === 'vaerdier') {
        shuffledQuestions = [...vaerdierQuestions].sort(() => Math.random() - 0.5);
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
    
    // Randomize the order of answers
    const shuffledAnswers = [...question.answers].sort(() => Math.random() - 0.5);
    
    shuffledAnswers.forEach(answer => {
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
    potentialButton.classList.remove('hide');
    hardButton.classList.remove('hide');
    vaerdierButton.classList.remove('hide');
    document.getElementById('quiz').classList.remove('quiz-active');
    updateHardButton();
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