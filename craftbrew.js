var inLoopTimer;
var loop;
var timeout = 600;
var consonants = true;
var currentIteration = 0;
var lastcode = 0;
var requireConsonant = false;
var unrequireTimer;

$(document).on("keydown", function(e) {
    switch (e.which) {
        case lastcode:
            loop();
            break;
        case 8: //backspace
            $(".content").text($(".content").text().slice(0, - 1));
            e.preventDefault();
            break;
        case 9: //tab
            unrequireConsonant();
            break;
        case 32: //space
            $(".content").text($(".content").text().slice() + " ");
            break;
        case 45: //hyphen
            $(".content").text($(".content").text().slice() + "־"); //maqaf
            break;
        case 190: //full stop
            $(".content").text($(".content").text().slice() + "ּ"); //dagesh
            break;
        case 65:
        case 69:
        case 73:
        case 79:
        case 85:
            if (!requireConsonant)
            {
                var charToCheck = $(".content").text().slice(-1);
                if (charToCheck == "\u05BC")
                    charToCheck = $(".content").text().slice(-2, -1);
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
                if ( lastCharacterConsonantish && $(".content").text().trim().length > 0) {
                    //we try for vowels - only if a vowel was hit and there's something there
                    buildLoop(hebrewVowelMap, e.which);
                    break;
                }
            }
            /* falls through */
        default:
            buildLoop(hebrewConsonantMap, e.which);
    }
});

function buildLoop(characterMap, keycode)
{
    $(".content").text($(".content").text() + characterMap[String.fromCharCode(keycode)][0]);
    currentIteration = 0;
    lastcode = keycode;
    loop = function() {
        currentIteration++;
        index = currentIteration % (characterMap[String.fromCharCode(keycode)].length);
        $(".content").text($(".content").text().slice(0, - 1) + characterMap[String.fromCharCode(keycode)][index]);
        resetTimer(currentIteration);
    };
    resetTimer(0);
}
function resetTimer(multiplier)
{
    multiplier = multiplier > 4 ? 4 : multiplier;
    clearTimeout(inLoopTimer);
    inLoopTimer = setTimeout(function() {
        lastcode = false;
    }, timeout + 120 * multiplier);
}
function unrequireConsonant()
{
    requireConsonant = true;
    clearTimeout(inLoopTimer);
    unrequireTimer = setTimeout(function() {
        requireConsonant = false;
    }, 1500);
}

$(function(){
    $(".modalTrigger, .modalBackground, .modalClose").click(function() {
        $(".modalContent, .modalBackground").fadeToggle();
    });
    $(".modalContent, .modalBackground").hide();
});
