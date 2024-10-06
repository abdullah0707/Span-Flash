var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;


var soundsArr;
// var video, video_div;
var timeOutPlay;
var clickSd, goodSd, errorSd,
    rightFbSd, wrongFbSd, timeFbSd, psvBbSfx, ngvBbSfx,
    timeOutSd, intro, nashat, timeOutFBSd, tryFbSd;

numOfPlaces = 6;

timerOut = 0;

score = 0;

allAnswer = [];

allQuestion = [];

questionsScore = ['ans2', 'ans2', 'ans1', 'ans4', 'ans4', 'ans3'];

countQuestion = 0;

countNumQuestion = 1;

countAllQuestion = 0;

answerName = '';

retryV = false;

attempts = 0;

maxAttempts = 3;

overAll = [];

l = console.log;

/*========Start=======*/

var correctAnswersCountV = 0;

/*========End=======*/

function init()
{
    canvas = document.getElementById("canvas");
    anim_container = document.getElementById("animation_container");
    dom_overlay_container = document.getElementById("dom_overlay_container");
    var comp = AdobeAn.getComposition("497D7612BE5C9048A046023EF176C60F");
    var lib = comp.getLibrary();
    var loader = new createjs.LoadQueue(false);
    loader.addEventListener("fileload", function (evt)
    {
        handleFileLoad(evt, comp)
    });
    loader.addEventListener("complete", function (evt)
    {
        handleComplete(evt, comp)
    });
    var lib = comp.getLibrary();
    loader.loadManifest(lib.properties.manifest);
}

function handleFileLoad(evt, comp)
{
    var images = comp.getImages();
    if (evt && (evt.item.type == "image"))
    {
        images[evt.item.id] = evt.result;
    }
}

// All Answers Questions
function initExportRoot(exportRoot)
{
    allAnswer = [
        exportRoot["ans1"],
        exportRoot["ans2"],
        exportRoot["ans3"],

        exportRoot["ans4"],
        // exportRoot["ans5"],
        // exportRoot["ans6"]

    ],

        allQuestion = [
            exportRoot["question1"],
            exportRoot["question2"],
            // exportRoot["ans3"],

            // exportRoot["ans4"],
            // exportRoot["ans5"],
            // exportRoot["ans6"]

        ]

}


function handleComplete(evt, comp)
{
    //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
    var lib = comp.getLibrary();
    var ss = comp.getSpriteSheet();
    var queue = evt.target;
    var ssMetadata = lib.ssMetadata;
    for (i = 0; i < ssMetadata.length; i++)
    {
        ss[ssMetadata[i].name] = new createjs.SpriteSheet({
            "images": [queue.getResult(ssMetadata[i].name)],
            "frames": ssMetadata[i].frames
        })
    }
    exportRoot = new lib._412L02V19();
    initExportRoot(exportRoot);
    stage = new lib.Stage(canvas);
    //Registers the "tick" event listener.
    fnStartAnimation = function ()
    {
        stage.addChild(exportRoot);
        stage.enableMouseOver(10);
        createjs.Touch.enable(stage);
        document.ontouchmove = function (e)
        {
            e.preventDefault();
        }
        stage.mouseMoveOutside = true;
        stage.update();
        createjs.Ticker.setFPS(lib.properties.fps);
        createjs.Ticker.addEventListener("tick", stage);
        prepareTheStage();
    }
    //Code to support hidpi screens and responsive scaling.
    function makeResponsive(isResp, respDim, isScale, scaleType)
    {
        var lastW, lastH, lastS = 1;
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function resizeCanvas()
        {
            var w = lib.properties.width,
                h = lib.properties.height;
            var iw = window.innerWidth,
                ih = window.innerHeight;
            var pRatio = window.devicePixelRatio || 1,
                xRatio = iw / w,
                yRatio = ih / h,
                sRatio = 1;
            if (isResp)
            {
                if ((respDim == 'width' && lastW == iw) || (respDim == 'height' && lastH == ih))
                {
                    sRatio = lastS;
                } else if (!isScale)
                {
                    if (iw < w || ih < h)
                        sRatio = Math.min(xRatio, yRatio);
                } else if (scaleType == 1)
                {
                    sRatio = Math.min(xRatio, yRatio);
                } else if (scaleType == 2)
                {
                    sRatio = Math.max(xRatio, yRatio);
                }
            }
            canvas.width = w * pRatio * sRatio;
            canvas.height = h * pRatio * sRatio;
            canvas.style.width = dom_overlay_container.style.width = anim_container.style.width = w * sRatio + 'px';
            canvas.style.height = anim_container.style.height = dom_overlay_container.style.height = h * sRatio + 'px';
            stage.scaleX = pRatio * sRatio;
            stage.scaleY = pRatio * sRatio;
            lastW = iw;
            lastH = ih;
            lastS = sRatio;
            stage.tickOnUpdate = false;
            stage.update();
            stage.tickOnUpdate = true;
        }
    }
    makeResponsive(true, 'both', true, 1);
    AdobeAn.compositionLoaded(lib.properties.id);
    fnStartAnimation();
    exportRoot["playBtn"].cursor = "pointer";
    exportRoot["playBtn"].addEventListener("click", playFlash);
}

function stopAllSounds()
{
    for (var s = 0; s < soundsArr.length; s++)
    {
        soundsArr[s].stop();
    }
}

function playFlash()
{
    stopAllSounds();
    clickSd.play();
    exportRoot.play();

}

// function playVideo(){


//     exportRoot["playBtn"].alpha=0;
//     exportRoot["playBtn"].removeEventListener("click", playVideo);
//     video_div = document.getElementById("videoPlay").style.display = "inline-block";

//     video = document.getElementById('videoPlay').play();

//     document.getElementById("videoPlay").onended = function() {videoEnd()};

//     console.log("playVideo");
//     // exportRoot.play();
// }

// function videoEnd() {
//     document.getElementById("videoPlay").style.display = "none";
//     exportRoot.play();
// };

function prepareTheStage()
{
    overAll = [
        exportRoot["confirmBtn"],
        exportRoot["showAnsBtn"],
        exportRoot["retryBtn"],
        exportRoot["startBtn"],
    ];

    overAll.forEach(function (el)
    {
        el.cursor = "pointer";
        el.addEventListener("mouseover", over);
        el.addEventListener("mouseout", out);
    });

    clickSd = new Howl({
        src: ['sounds/click.mp3']
    });
    goodSd = new Howl({
        src: ['sounds/good.mp3']
    });
    errorSd = new Howl({
        src: ['sounds/error.mp3']
    });
    rightFbSd = new Howl({
        src: ['sounds/rightFbSd.mp3']
    });
    wrongFbSd = new Howl({
        src: ['sounds/wrongFbSd.mp3']
    });
    tryFbSd = new Howl({
        src: ['sounds/tryFbSd.mp3']
    });
    nashat = new Howl({
        src: ['sounds/nashat.mp3']
    });
    intro = new Howl({
        src: ['sounds/intro.mp3']
    });
    quizSd = new Howl({
        src: ['sounds/quizSd.mp3']
    });
    timeFbSd = new Howl({
        src: ['sounds/timeFbSd.mp3']
    });
    psvBbSfx = new Howl({
        src: ['sounds/psvBbSfx.mp3']
    });
    ngvBbSfx = new Howl({
        src: ['sounds/ngvBbSfx.mp3']
    });
    timeOutSd = new Howl({
        src: ['sounds/timeOutSd.mp3']
    });
    timerOutSounds = new Howl({
        src: ['sounds/timerOutSounds.mp3']
    });

    soundsArr = [clickSd, goodSd, errorSd, quizSd, timeFbSd, psvBbSfx, ngvBbSfx, timeOutSd,
        rightFbSd, timerOutSounds, wrongFbSd, intro, nashat, tryFbSd];
    stopAllSounds();

    exportRoot["startBtn"].addEventListener("click", function ()
    {
        playFn();
    });
    exportRoot["retryBtn"].addEventListener("click", retryFN);
    exportRoot["showAnsBtn"].addEventListener("click", function ()
    {
        stopAllSounds();
        exportRoot["showAnsBtn"].alpha = 0;
        exportRoot["answers"].alpha = 1;
        exportRoot["answers"].gotoAndPlay(0);
    });

    hideFB();
}

function playFn()
{

    exportRoot.play();
    stopAllSounds();

}

function hideFB()
{

    exportRoot["wrongFB"].alpha = 0;
    exportRoot["wrongFB"].playV = false;

    exportRoot["rightFB"].alpha = 0;
    exportRoot["rightFB"].playV = false;

    exportRoot["tryFB"].alpha = 0;
    exportRoot["tryFB"].playV = false;

    exportRoot["timeOutFB"].alpha = 0;
    exportRoot["timeOutFB"].playV = false;

    exportRoot["hideSymb"].alpha = 0;
    exportRoot["hideSymb"].playV = false;

    exportRoot["answers"].alpha = 0;
    exportRoot["answers"].playV = false;

    exportRoot["timerSymb"].alpha = 1;
    exportRoot["timerSymb"].playV = false;

    exportRoot["retryBtn"].alpha = 0;
    exportRoot["retryBtn"].gotoAndStop(0);

    exportRoot["showAnsBtn"].alpha = 0;
    exportRoot["showAnsBtn"].gotoAndStop(0);

    exportRoot["confirmBtn"].alpha = 0;
    exportRoot["confirmBtn"].gotoAndStop(0);

}



function activateButtons()
{

    //ForEach on array and add events mouse and stop all buttons.
    allAnswer.forEach(function (el)
    {
        el.gotoAndStop(0);
        el.cursor = "pointer";
        el.addEventListener("mouseover", over);
        el.addEventListener("mouseout", out);
        el.addEventListener("click", showFB);

    });

}
function activateQuestion()
{

    //ForEach on array and add events mouse and stop all buttons.
    allQuestion.forEach(function (el)
    {
        // el.gotoAndStop(0);
        el.cursor = "pointer";
        // el.addEventListener("mouseover", over);
        // el.addEventListener("mouseout", out);
        el.addEventListener("click", SpanQuestion);

    });
}

// Show Next Questions And Select Answer
function showFB(e)
{

    clickSd.play(); // Sounds Click

    exportRoot["confirmBtn"].alpha = 1;
    exportRoot["confirmBtn"].cursor = "pointer";
    exportRoot["confirmBtn"].addEventListener("click", confirmFN);

    activateButtons(); // Add Event Mouse Button After Select
    deactivateQuestion();
    e.currentTarget.gotoAndStop(1); // Active Button click After Select
    e.currentTarget.cursor = "default"; // Active Button Cursor Default After Select
    e.currentTarget.removeEventListener("mouseover", over); // Remove Mouse Event Over After Select
    e.currentTarget.removeEventListener("mouseout", out); // Remove Mouse Event Out After Select
    e.currentTarget.removeEventListener("click", showFB); // Remove Mouse Event Click After Select

    answerName = e.currentTarget.name; //Export Name Answers After Next
    console.log("Answer Name : " + answerName);
}

function deactivateButtons()
{
    //ForEach on array and add events mouse and stop all buttons.
    allAnswer.forEach(function (el)
    {
        el.gotoAndStop(0)
        el.cursor = "default";
        el.removeEventListener("click", showFB);
        el.removeEventListener("mouseover", over);
        el.removeEventListener("mouseout", out);
    });

    exportRoot["confirmBtn"].cursor = "auto";
    exportRoot["confirmBtn"].removeEventListener("click", confirmFN);

}

function deactivateQuestion()
{
    //ForEach on array and add events mouse and stop all buttons.
    allQuestion.forEach(function (el)
    {
        // el.gotoAndStop(0)
        el.cursor = "default";
        el.removeEventListener("click", SpanQuestion);
        // el.removeEventListener("mouseover", over);
        // el.removeEventListener("mouseout", out);
    });
}

function stopSpinner($quiz, $span, $num)
{

    exportRoot[$quiz][$span].gotoAndPlay($num);

    console.log($quiz + '-' + $span);
}

function SpanQuestion()
{

    deactivateQuestion();

    clearInterval(timeOutPlay);
    clickSd.play();

    psvBbSfx.play();

    psvBbSfx.on('end', function ()
    {
        activateButtons();

    });
    exportRoot["question" + (countNumQuestion)]["span" + (countAllQuestion + 1)].play();
    if (countAllQuestion < 3)
    {
        stopSpinner("question1", "span1", 2);
        // timeOutFB();
    } else if (countAllQuestion > 3)
    {
        stopSpinner("question2", "span5", 3);
        // timeOutFB();
    }

    countAllQuestion++;
    console.log("Span Question ");
}

function SdSpan()
{
    ngvBbSfx.play();

    ngvBbSfx.on('end', function ()
    {
        activateQuestion();

    });
}


function confirmFN()
{

    if (countAllQuestion < 3)
    {
        SdSpan();

    } else if (countAllQuestion > 4)
    {

        SdSpan();
    }

    // exportRoot[ "question" + (countNumQuestion) ][ "span" + (countAllQuestion + 1 )].play();

    console.log("Count All Question " + countAllQuestion);
    console.log("Count Question " + countNumQuestion);

    if (countAllQuestion == 3)
    {

        countAllQuestion++;
        countNumQuestion++;

        createjs.Tween.get(exportRoot["hideSymb"], {
            override: true
        }).to({
            alpha: 1
        }, 400, createjs.Ease.easeOut).call(function ()
        {
            exportRoot.play();
            activateQuestion();
            exportRoot["timerSymb"].gotoAndStop(0);

            timerOut = 0;
            // timeOutFB();
            createjs.Tween.get(exportRoot["hideSymb"], {
                override: true
            }).to({
                alpha: 0
            }, 200, createjs.Ease.easeOut);
        });

        console.log("Count Question in if " + countNumQuestion);
    }


    hideFB();
    clickSd.play();
    deactivateButtons();
    // clearInterval(timeOutPlay);
    counterAnswer();



    if (countAllQuestion == 7)
    {
        clearInterval(timeOutPlay);
        stopAllSounds();


        if (score == numOfPlaces)
        {
            exportRoot["rightFB"].playV = true;
            exportRoot["rightFB"].alpha = 1;
            exportRoot["rightFB"].gotoAndPlay(0);
            console.log("rightFB");
        } else
        {
            attempts++;
            if (attempts == maxAttempts)
            {
                exportRoot["wrongFB"].playV = true;
                exportRoot["wrongFB"].alpha = 1;
                exportRoot["wrongFB"].gotoAndPlay(0);
                console.log("wrongFB");
            } else
            {
                exportRoot["tryFB"].playV = true;
                exportRoot["tryFB"].alpha = 1;
                exportRoot["tryFB"].gotoAndPlay(0);
                console.log("tryFB");
            }
        }
        deactivateQuestion();
    }


}

function counterAnswer()
{

    // var i = countQuestion;
    score += questionsScore[countQuestion] == answerName ? 1 : 0;
    ++countQuestion;
    console.log(score + " Count Score");

    // console.log(countQuestion + " Count Question");
}


function showBtnsFn()
{
    if (score == numOfPlaces || attempts == maxAttempts)
    {
        exportRoot["showAnsBtn"].alpha = 1;
    } else
    {
        exportRoot["retryBtn"].alpha = 1;
    }
}

function retryFN()
{
    stopAllSounds();
    exportRoot.gotoAndPlay("question");
    exportRoot["timerSymb"].gotoAndStop(0);
    clickSd.play();
    timerOut = 0;
    countQuestion = 0;
    countNumQuestion = 1;
    score = 0;
    countAllQuestion = 0;
    hideFB();
    retryV = true;
    deactivateButtons();
    activateQuestion();
    retryV = false;
    timeOutFB();
}



function out(e)
{
    e.currentTarget.gotoAndStop(0);
}

function over(e)
{
    e.currentTarget.gotoAndStop(1);
}
function over2(e)
{
    e.currentTarget.gotoAndStop(2);
}


// Timer Answers
function timeOutFB()
{
    timeOutPlay = [setInterval(Timer, 1000)];
}

// Show Time Out Answers in Console Log And Show FB End Time
function Timer()
{
    timerOut++;
    console.log(timerOut);
    exportRoot["timerSymb"].gotoAndStop(timerOut);

    if (countNumQuestion == 2 && timerOut == 60)
    {

        exportRoot["confirmBtn"].alpha = 0;

        deactivateButtons();

        timerOutSounds.play();

        attempts++;
        clearInterval(timeOutPlay);

        countAllQuestion = 7;

        deactivateQuestion();
        timerOutSounds.on('end', function ()
        {

            exportRoot["timeOutFB"].alpha = 1;
            exportRoot["timeOutFB"].playV = true;
            exportRoot["timeOutFB"].gotoAndPlay(1);

        });
        // confirmFN();

    } else if (timerOut === 60)
    {

        deactivateButtons();

        timeOutSd.play();
        exportRoot["confirmBtn"].alpha = 0;
        clearInterval(timeOutPlay);


        // deactivateButtons();
        timerOut = 0;

        timeOutFB();
        // activateQuestion();

        if (countNumQuestion == 1)
        {
            countAllQuestion = 3;
            // countNumQuestion == 2;

        }

        confirmFN();

        // timeOutSd.on('end',function(){

        // 	confirmFN();


        // });

    }

}

// Stop Time Answers
function stopTime()
{

    clearInterval(timeOutPlay);

}

function exitFullscreen()
{
    //toggle full screen
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    //var docElm = document.documentElement;
    /*if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    } else {*/
    if (document.exitFullscreen)
    {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen)
    {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen)
    {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen)
    {
        document.msExitFullscreen();
    }
    //}
}

