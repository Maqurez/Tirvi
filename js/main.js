/**
 * Created by Maqurez on 12/28/2014.
 */

$(document).ready(function() {
    initial();
});

/**
 * VARIABLES
 */

/**
 * DOM VARIABLES
 */

var startScreen = $('#start-screen'),
    endScreen = $('#end-screen'),
    mainScreen = $('#main-screen'),
    outputScreen = $('#output-screen'),

    TimerContainer = $('#timer'),

    correctCounter = $('#correct-counter'),
    incorrectCounter = $('#incorrect-counter'),
    wordsRemainsCounter = $('#words-counter'),
    pointsCounter = $('#points-counter'),

    TaskTypeButPreposition =  $('#type-prepo-but'),
    TaskTypeButTranslation =  $('#type-trans-but'),
    AppTypeButTraining = $('#type-count-but'),
    AppTypeButCompetition = $('#type-time-but'),
    AppTipAppType = $('#tip-app'),
    AppTipTaskType = $('#tip-task'),
    AppTipLanguage = $('#tip-lang'),
    AppAnswerButYes =  $('#button-y'),
    AppAnswerButNo =  $('#button-n'),
    AppButStart =  $('#button-start'),
    AppButRestart = $('#button-clear'),
    AppButShowOutput = $('#output-open-but'),

    AppTipTaskLeft =  $('#tip-task-left'),
    AppTipTaskRight =  $('#tip-task-right'),

    AppLangButEn = $('#en-but'),
    AppLangButUa = $('#ua-but'),
    AppLangButRu = $('#ru-but'),
    AppLangButDe = $('#de-but'),

    appLang = "en",
    appType = 2,
    taskType = 1,

    appTimeRemaining = 0,
    TIME_REWARD_FOR_COMPETITION = 100,

    TASK_LIMIT_FOR_TRAINING = 20,

    points = 0,
    seriaCounter = 0,

    rcurrent = "",
    currentWord = {},
    correct = [],
    cpoints = 0,
    ipoints = 0;

// TODO All strings to variables for speedy localization

/**
 *
 * LOCALIZATION
 */

//MAIN SCREEN
var LANG_OUTPUT_WORD_USES_WITH = "",
    LANG_OUTPUT_WORD_TRANSLATED_AS ="",

// END SCREEN
    LANG_RESULT_CORRECT_COUNT = "",
    LANG_RESULT_INCORRECT_COUNT = "";

// TODO Add user level functionality

var playerLvl = 1;
var maxLvl = 1000;

var verbs = [];
var task = [];

AppButStart.on('click', appStart);
AppButRestart.on('click', initial);
AppAnswerButYes.on('click', {answer : 1}, check);
AppAnswerButNo.on('click', {answer : 0}, check);
AppLangButEn.on('click', {lang : "en"}, setLang);
AppLangButUa.on('click', {lang : "ua"}, setLang);
AppLangButRu.on('click', {lang : "ru"}, setLang);
AppLangButDe.on('click', {lang : "de"}, setLang);
AppTypeButCompetition.on('click', {type : 1}, setAppType);
AppTypeButTraining.on('click', {type : 2}, setAppType);
TaskTypeButPreposition.on('click', {type : 1}, setType);
TaskTypeButTranslation.on('click', {type : 2}, setType);

AppButShowOutput.on('click', function() {outputScreen.show()});
outputScreen.on('click', function() {outputScreen.hide()});

function initial() {
    mainScreen.hide();
    TimerContainer.hide();
    endScreen.hide();
    startScreen.show();
    outputScreen.hide();
    updateInterface();
}

function appStart() {
    getVerbs();
    task = verbs.slice();
    rcurrent = "";
    currentWord = {};
    correct = [];
    points = 0;
    seriaCounter = 0;
    cpoints = 0;
    ipoints = 0;
    getTask();
    startScreen.hide();
    mainScreen.show();
    appUpdate();

    if (appType == 1) {
        appTimeRemaining = 2000;
        TimerContainer.show();
        display();
    }
    else {
        TimerContainer.hide();
    }
}

function appEnd() {
    $('#result-points').text("Points: " + points);
    $('#result-correct').text("Correct: " + cpoints);
    $('#result-incorrect').text("Incorrect: " + ipoints);
    $('#end-screen').show();
    $('#main-screen').hide();
}

/**
 * TIMER
 */

function display(){
    if (appTimeRemaining > 0) {
        appTimeRemaining -= 1;
        setTimeout("display()",10);
    }
    else {
        appEnd();
    }
    var ms = Math.round(appTimeRemaining%100);
    if (ms < 10) ms = "0" + ms;
    $('#timer').text(Math.round(appTimeRemaining/100) + "." + ms);
}

/**
 * Start & end screen
 */

function appUpdate() {
    wordsRemainsCounter.text(task.length);
    correctCounter.text(cpoints);
    incorrectCounter.text(ipoints);
    pointsCounter.text(points);
}

function setLang(event) {
    appLang = event.data.lang;
    updateInterface();
}

function setAppType(event) {
    appType = event.data.type;
    updateInterface();
}

function setType(event) {
    taskType = event.data.type;
    updateInterface();
}

function updateInterface() {

    $(".lang-button").each(function() {
        $(this).removeClass("active");
    });
    $(".type-button").each(function() {
        $(this).removeClass("active");
    });
    $(".app-button").each(function() {
        $(this).removeClass("active");
    });


    switch (taskType) {
        case 1 :
            TaskTypeButPreposition.addClass("active");
            break;
        case 2 :
            TaskTypeButTranslation.addClass("active");
            break;
        default :
            break;
    }
    var str1 = '#'+ appLang.toString() +'-but';
    $(str1).addClass("active");

    switch (appType) {
        case 1 :
            AppTypeButCompetition.addClass("active");
            break;
        case 2 :
            AppTypeButTraining.addClass("active");
            break;
        default :
            break;
    }

    switch (appLang) {
        case "ua" :
            TaskTypeButPreposition.text("дієслово - прийменник");
            TaskTypeButTranslation.text("слово - переклад");
            AppAnswerButYes.text("ТАК");
            AppAnswerButNo.text("НІ");
            AppButStart.text("ПОЧАТИ");
            AppTypeButCompetition.text("Змагання");
            AppTypeButTraining.text("Тренування");
            AppTipAppType.text("Оберіть тип: ");
            AppTipTaskType.text("Оберіть задвання: ");
            AppTipLanguage.text("Оберіть мову: ");
            if (taskType == 1) {
                AppTipTaskLeft.text("дієслово");
                AppTipTaskRight.text("використовується з");
            }
            if (taskType == 2) {
                AppTipTaskLeft.text("слово");
                AppTipTaskRight.text("перекладається як");
            }
            break;
        case "ru" :
            TaskTypeButPreposition.text("глагол - предлог");
            TaskTypeButTranslation.text("слово - перевод");
            AppAnswerButYes.text("ДА");
            AppAnswerButNo.text("НЕТ");
            AppButStart.text("НАЧАТЬ");
            AppTipTaskLeft.text("глагол");
            AppTypeButCompetition.text("Соревнование");
            AppTypeButTraining.text("Тренировка");
            AppTipAppType.text("Выберите тип: ");
            AppTipTaskType.text("Выберите задание: ");
            AppTipLanguage.text("Выберите язык: ");
            if (taskType == 1) AppTipTaskRight.text("используется с");
            if (taskType == 2) AppTipTaskRight.text("переводится как");
            break;
        case "de" :
            break;
        default :
            TaskTypeButPreposition.text("verb - preposition");
            TaskTypeButTranslation.text("word - translation");
            AppAnswerButYes.text("YES");
            AppAnswerButNo.text("NO");
            AppButStart.text("START");
            AppTipTaskLeft.text("verb");
            AppTypeButCompetition.text("Competition");
            AppTypeButTraining.text("Training");
            AppTipAppType.text("Choose type: ");
            AppTipTaskType.text("Choose task: ");
            AppTipLanguage.text("Choose language: ");
            if (taskType == 1) AppTipTaskRight.text("used with");
            if (taskType == 2) AppTipTaskRight.text("translated as");
            break;
    }
}

function getTranslation(word, lng) {
    switch (lng) {
        case "ua" :
            return word.translation.ua === "" ? word.translation.en : word.translation.ua;
            break;
        case "de" :
            return word.translation.de === "" ? word.translation.en : word.translation.de;
            break;
        case "ru" :
            return word.translation.ru === "" ? word.translation.en : word.translation.ru;
            break;
        default :
            return word.translation.en;
    }
}

function move(word) {
    task.splice(task.indexOf(word), 1);
}

function check(event) {
    var elDiv = document.createElement("div");
    $(elDiv).addClass("output");
    //switch (appType) {
    //    case 1 :
            if (correct.indexOf(rcurrent) != -1) {
                if (event.data.answer == 1)
                {
                    cpoints++;
                    seriaCounter++;
                    points += seriaCounter * 10;
                    appTimeRemaining += TIME_REWARD_FOR_COMPETITION;
                    move(currentWord);
                    $(elDiv).addClass("correct-out");
                }
                else {
                    ipoints++;
                    seriaCounter = 0;
                    $(elDiv).addClass("incorrect-out");
                }
            }
            else {
                if (event.data.answer == 0)
                {
                    cpoints++;
                    seriaCounter++;
                    points += seriaCounter * 10;
                    appTimeRemaining += TIME_REWARD_FOR_COMPETITION;
                    move(currentWord);
                    $(elDiv).addClass("output correct-out");
                }
                else {
                    ipoints++;
                    seriaCounter = 0;
                    $(elDiv).addClass("incorrect-out");
                }
            }
    //        break;
    //    default : break;
    //}
    $(elDiv).html(currentWord.word + " uses with: " + correct + " || your answer: " + rcurrent);
    outputScreen.append(elDiv);
    if (task.length == 0) {
        appEnd();
    }
    else {
        appUpdate();
        getTask();
    }
}

function getTask() {
    var taskid = Math.floor(Math.random() * (task.length));
    currentWord = task[taskid];
    $('#left-task').text(currentWord.word);

    var iscorrect = Math.random();
    switch (taskType) {
        case 1 :
            if (iscorrect >= 0.6) {
                if (currentWord.with.length > 1) {
                    var tt = Math.floor(Math.random() * (currentWord.with.length));
                    var t = currentWord.with[tt];
                }
                else {
                    var t = currentWord.with[0];
                }
                rcurrent = t;
                $('#right-task').text(rcurrent);
            }
            else {
                var t = Math.floor(Math.random() * (prepositions.length));
                $('#right-task').text(prepositions[t]);
                rcurrent = prepositions[t];
            }
            correct = currentWord.with;
            break;
        case 2 :
            if (iscorrect >= 0.55) {
                var t = getTranslation(currentWord, appLang);
                $('#right-task').text(t);
                rcurrent = t;
            }
            else {
                var t = Math.floor(Math.random() * (verbs.length));
                var wt = verbs[t];
                $('#right-task').text(getTranslation(wt, appLang));
                rcurrent = getTranslation(wt, appLang);
            }
            correct = getTranslation(currentWord, appLang);
            break;
        default :
            break;
    }
    console.log("answer: " + rcurrent);
    console.log("correct: " + correct);
}

/**
 * ALPHA FUNCTIONS
 */

function getVerbs() {
    verbs = [];
    words.forEach(function(element) {
        if (element.type == "verb") verbs.push(element);
    });
}

/**
 * DATA
 */

// TODO Groups prepositions. WOrds in different forms

var prepositions = ["ב", "ל", "מ", "את", "על", "עם", "בפני", "אל"];

// TODO Add words

var words = [
    {
        id : 0,
        type : "verb",
        root : "שמש",
        model : "התפעל",
        with : ["ב"],
        translation : {en : "to use", ua : "використовувати", de : "", ru : "использовать"},
        lvl : 1,
        forms : [
            {
                word : "להשתמש",
                time : -1,
                lvl : 1
            },
            {
                word : "משתמש",
                time : 1,
                gender : 1,
                number : 1,
                lvl : 1
            },
            {
                word : "משתמשת",
                time : 1,
                gender : 0,
                number : 1,
                lvl : 1
            }
        ]
    },
    {
        id : 1,
        type : "verb",
        with : ["ל", "ב"],
        translation : {en : "to pay", ua : "платити", de : "", ru : "платить"},
        lvl : 1,
        forms : [
            {
                word : "לשלם",
                time : -1,
                lvl : 1
            }
        ]
    },
    {
        id : 2,
        type : "preposition",
        translation : {en : "in", ua : "", ru : ""},
        lvl : 1,
        forms : [

        ]
    },
    {
        word : "להתרחץ",
        type : "verb",
        with : ["ב"],
        translation : {en : "to wash", ua : "купатися", de : "", ru : "купаться"},
        lvl : 1
    },
    {
        word : "להשתתף",
        type : "verb",
        with : ["ב"],
        translation : {en : "to participate", ua : "брати участь", de : "", ru : "участвовать"},
        lvl : 1
    },
    {
        word : "לגרום",
        type : "verb",
        with : ["ל"],
        translation : {en : "to cause", ua : "спричиняти", de : "", ru : "спричинять"},
        lvl : 1
    },
    {
        word : "לבצע",
        type : "verb",
        with : ["את"],
        translation : {en : "to perform", ua : "виконувати", de : "", ru : "использовать"},
        lvl : 1
    },
    {
        word : "לתפוס",
        type : "verb",
        with : ["את"],
        translation : {en : "to catch", ua : "ловити", de : "", ru : "ловить"},
        lvl : 1
    },
    {
        word : "לדרוש",
        type : "verb",
        with : ["את", "מ"],
        translation : {en : "to demand", ua : "вимагати", de : "", ru : "требовать"},
        lvl : 1
    },
    {
        word : "לאשר",
        type : "verb",
        with : ["את"],
        translation : {en : "to approve", ua : "затвердити", de : "", ru : "утверждать"},
        lvl : 1
    },
    {
        word : "להציע",
        type : "verb",
        with : ["ל"],
        translation : {en : "to suggest", ua : "пропонувати", de : "", ru : "предлагать"},
        lvl : 1
    },
    {
        word : "לסלוח",
        type : "verb",
        with : ["ל"],
        translation : {en : "to forgive", ua : "прощати", de : "", ru : "прощать"},
        lvl : 1
    },
    {
        word : "להתעניין",
        type : "verb",
        with : ["ב"],
        translation : {en : "to be interested", ua : "цікавитися", de : "", ru : "интересоваться"},
        lvl : 1
    },
    {
        word : "להמשיך",
        type : "verb",
        with : ["את"],
        translation : {en : "to continue", ua : "продовжувати", de : "", ru : "продолжать"},
        lvl : 1
    },
    {
        word : "לענות",
        type : "verb",
        with : ["ל"],
        translation : {en : "to answer", ua : "відповідати", de : "", ru : "отвечать"},
        lvl : 1
    },
    {
        word : "לקבל",
        type : "verb",
        with : ["מ", "את"],
        translation : {en : "to receive", ua : "отримувати", de : "", ru : "получать"},
        lvl : 1
    },
    {
        word : "להסביר",
        type : "verb",
        with : ["ל"],
        translation : {en : "to explain", ua : "пояснювати", de : "", ru : "объяснять"},
        lvl : 1
    },
    {
        word : "לבלות",
        type : "verb",
        with : ["ב", "עם"],
        translation : {en : "to spend", ua : "проводити час", de : "", ru : "проводить время"},
        lvl : 1
    },
    {
        word : "להתלונן",
        type : "verb",
        with : ["בפני", "על"],
        translation : {en : "to complain", ua : "скаржитися", de : "", ru : "жаловаться"},
        lvl : 1
    },
    {
        word : "להתגעגע",
        type : "verb",
        with : ["אל", "ל"],
        translation : {en : "to miss", ua : "сумувати", de : "", ru : "скучать"},
        lvl : 1
    },
    {
        word : "להחזיר",
        type : "verb",
        with : ["ל", "מ", "את"],
        translation : {en : "to return", ua : "повернути", de : "", ru : "вернуть"},
        lvl : 1
    },
    {
        word : "לחלום",
        type : "verb",
        with : ["על"],
        translation : {en : "to dream", ua : "мріяти", de : "", ru : "мечтать"},
        lvl : 2
    },
    {
        word : "להימאס",
        type : "verb",
        with : ["מ"],
        translation : {en : "to be tired of", ua : "набридати", de : "", ru : "надоедать"},
        lvl : 1
    },
    {
        word : "לבקש",
        type : "verb",
        with : ["מ", "את"],
        translation : {en : "to ask", ua : "просити", de : "", ru : "просить"},
        lvl : 1
    },
    {
        word : "להחליט",
        type : "verb",
        with : ["את"],
        translation : {en : "to decide", ua : "вирішувати", de : "", ru : "решать"},
        lvl : 1
    },
    {
        word : "להסתדר",
        type : "verb",
        with : ["ב", "עם"],
        translation : {en : "to get in", ua : "влаштовуватися", de : "", ru : "устраиваться"},
        lvl : 1
    },
    {
        word : "לדאוג",
        type : "verb",
        with : ["ל"],
        translation : {en : "to worry", ua : "турбуватися", de : "", ru : "беспокоиться"},
        lvl : 1
    },
    {
        word : "לסמוך",
        type : "verb",
        with : ["על"],
        translation : {en : "to trust", ua : "довіряти", de : "", ru : "доверять"},
        lvl : 1
    },
    {
        word : "לשכור",
        type : "verb",
        with : ["את"],
        translation : {en : "to rent", ua : "орендувати", de : "", ru : "арендовать"},
        lvl : 2
    },
    {
        word : "לחתום",
        type : "verb",
        with : ["על"],
        translation : {en : "to sign", ua : "підписувати", de : "", ru : "подписывать"},
        lvl : 1
    },
    {
        word : "למהר",
        type : "verb",
        with : ["ל"],
        translation : {en : "to rush", ua : "поспішати", de : "", ru : "спешить"},
        lvl : 1
    },
    {
        word : "לסיים",
        type : "verb",
        with : ["את"],
        translation : {en : "to finish", ua : "закінчувати", de : "", ru : "заканчивать"},
        lvl : 1
    },
    {
        word : "להכין",
        type : "verb",
        with : ["את"],
        translation : {en : "to prepare", ua : "підготувати", de : "", ru : "подготовить"},
        lvl : 1
    },
    {
        word : "לשכוח",
        type : "verb",
        with : ["את"],
        translation : {en : "to forget", ua : "забувати", de : "", ru : "забывать"},
        lvl : 1
    },
    {
        word : "להזמין",
        type : "verb",
        with : ["את"],
        translation : {en : "to order, to invite", ua : "замовляти, запрошувати", de : "", ru : "заказывать, приглашать"},
        lvl : 1
    },
    {
        word : "להצטער",
        type : "verb",
        with : ["על"],
        translation : {en : "to apologize", ua : "вибачатися", de : "", ru : "извиняться"},
        lvl : 1
    },
    {
        word : "להפסיק",
        type : "verb",
        with : ["את"],
        translation : {en : "to stop", ua : "зупинити, перервати", de : "", ru : "прервать"},
        lvl : 1
    },
    {
        word : "לבחור",
        type : "verb",
        with : ["את", "ב"],
        translation : {en : "to choose", ua : "вибирати", de : "", ru : "выбирать"},
        lvl : 2
    },
    {
        word : "להקשיב",
        type : "verb",
        with : ["ל"],
        translation : {en : "to listen", ua : "слухати", de : "", ru : "слушать"},
        lvl : 2
    },
    {
        word : "להתקדם",
        type : "verb",
        with : ["ב"],
        translation : {en : "to make progress", ua : "продвигатися", de : "", ru : "продвигаться"},
        lvl : 2
    },
    {
        word : "להמליץ",
        type : "verb",
        with : ["ל", "על"],
        translation : {en : "to recommend", ua : "рекомендувати", de : "", ru : "рекомендовать"},
        lvl : 2
    },
    {
        word : "להצליח",
        type : "verb",
        with : ["ב"],
        translation : {en : "to succeed", ua : "досягти успіху", de : "", ru : "преуспевать"},
        lvl : 1
    },
    {
        word : "לנצח",
        type : "verb",
        with : ["ב"],
        translation : {en : "to win", ua : "перемогти", de : "", ru : "победить"},
        lvl : 3
    },
    {
        word : "להיכשל",
        type : "verb",
        with : ["ב"],
        translation : {en : "to fail", ua : "провалити", de : "", ru : "провалить"},
        lvl : 3
    },
    {
        word : "להיכנס",
        type : "verb",
        with : ["ל"],
        translation : {en : "to enter", ua : "заходити", de : "", ru : "входить"},
        lvl : 1
    },
    {
        word : "לגור",
        type : "verb",
        with : ["ב"],
        translation : {en : "to live", ua : "", de : "", ru : "проживать"},
        lvl : 1
    },
    {
        word : "לטייל",
        type : "verb",
        with : ["ב", "ל"],
        translation : {en : "to travel", ua : "", de : "", ru : "гулять, путешествовать"},
        lvl : 1
    },
    {
        word : "לזכור",
        type : "verb",
        with : ["את"],
        translation : {en : "to remember", ua : "", de : "", ru : "помнить"},
        lvl : 1
    }
];