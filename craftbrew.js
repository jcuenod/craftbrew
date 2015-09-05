var inLoopTimer;
var loop;
var timeout = 6000;
var inloopCode = 0;
var lastCode;
var requireConsonant = false;
var justTriedAVowel = false;
var ctrlDown = false;

$(document).on("keydown", function(e) {
    if (ctrlDown)
        return;
    switch (e.which) {
        case inloopCode:
            loop();
            break;
        case 8: //backspace
            backspaceCharacter();
            e.preventDefault();
            break;
        case 9: //tab
            if (justTriedAVowel)
            {
                backspaceCharacter();
                buildLoop(hebrewConsonantMap, lastCode);
                inloopCode = 9;
            }
            e.preventDefault();
            break;
        case 17:
            ctrlDown = true;
            break;
        case 32: //space
            appendCharacter(" ");
            break;
        case 189: //minus
            appendCharacter("־"); //maqaf
            break;
        case 190: //full stop
            appendCharacter("ּ"); //dagesh
            break;
        case 65:
        case 69:
        case 73:
        case 79:
        case 85:
            if (!requireConsonant)
            {
                var withDagesh = false;
                var charToCheck = $(".content").text().slice(-1);
                if (charToCheck == "\u05BC")
                {
                    //if last character was a dagesh, check the previous one
                    charToCheck = $(".content").text().slice(-2, -1);
                    withDagesh = true;
                }
                /*
                 * \u05D0-\u05EA = UTF8 range from Aleph to Tav
                 *
                 * UTF16 characters:
                 * \uFB2A = HEBREW LETTER SHIN WITH SHIN DOT
                 * \uFB2B = HEBREW LETTER SHIN WITH SIN
                 *
                 * Note also that \uFB4B = HEBREW LETTER VAV WITH HOLAM (excluded because it's a vowel)
                 */
                var lastCharacterConsonantish = charToCheck.match(/[\u05D0-\u05EA\uFB2A\uFB2B]/);
                if ( lastCharacterConsonantish &&
                        currentText().trim().length > 0 &&
                        !(charToCheck == "ו" && withDagesh) )
                {
                    //we try for vowels - only if a vowel was hit and there's something there
                    buildLoop(hebrewVowelMap, e.which);
                    justTriedAVowel = true;
                    break;
                }
            }
            justTriedAVowel = false;
            /* falls through */
        default:
            buildLoop(hebrewConsonantMap, e.which);
    }
}).on("keyup", function(e) {
    if (e.which == 17)
        ctrlDown = false;
});

function buildLoop(characterMap, keycode)
{
    var possibleCharacters = characterMap[ String.fromCharCode(keycode) ];

    appendCharacter(possibleCharacters[0]);
    inloopCode = lastCode = keycode;

    var currentIteration = 0;
    loop = function() {
        currentIteration++;
        replaceLastCharacter(possibleCharacters[ currentIteration % (possibleCharacters.length) ]);
        resetTimer(currentIteration);
    };
    resetTimer();
}
function resetTimer(multiplier)
{
    multiplier = typeof myVar != 'undefined' ? multiplier : 0;
    multiplier = multiplier > 4 ? 4 : multiplier;
    clearTimeout(inLoopTimer);
    inLoopTimer = setTimeout(function() {
        inloopCode = false;
        console.log("done");
    }, timeout + 120 * multiplier);
}

var lastInsertion;
function currentText() { return $(".content").text().slice(); }
function appendCharacter(charToAppend)
{
    $(".content").text(currentText() + charToAppend);
    lastInsertion = charToAppend;
}
function replaceLastCharacter(newChar)
{
    backspaceCharacter();
    appendCharacter(newChar);
}
function backspaceCharacter()
{
    $(".content").text(currentText().slice(0, - lastInsertion.length));
}

$(function(){
    $(".modalTrigger, .modalBackground, .modalClose").click(function() {
        $(".modalContent, .modalBackground").fadeToggle();
    });
    $(".modalContent, .modalBackground").hide();
});
