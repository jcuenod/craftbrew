var timer;
var loop;
var timeout = 600;
var consonants = true;
var currentIteration = 0;
var lastcode = 0;

$(document).on("keydown", function(e) {
    switch (e.which) {
        case lastcode:
            loop();
            break;
        case 8: //backspace
            $(".content").text($(".content").text().slice(0, - 1));
            e.preventDefault();
            break;
        case 190:
            $(".content").text($(".content").text().slice() + "ּ");
            break;
        case 32:
            $(".content").text($(".content").text().slice() + " ");
            break;
        case 65:/* falls through */
        case 69:/* falls through */
        case 73:/* falls through */
        case 79:/* falls through */
        case 85:
            var charToCheck = $(".content").text().slice(-1);
            if (charToCheck == "\u05BC")
                charToCheck = $(".content").text().slice(-2, -1);
            var lastCharacterConsonantish = charToCheck.match(/[\u05D0-\u05EA]/);
            if ( lastCharacterConsonantish && $(".content").text().trim().length > 0) {
                //we try for vowels - only if a vowel was hit and there's something there
                buildLoop(hebrewVowelMap, e.which);
                break;
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
    clearTimeout(timer);
    timer = setTimeout(endWait, timeout + 120 * multiplier);
}
function endWait()
{
    lastcode = false;
    console.log("end");
}

$(function(){
    $(".modalTrigger, .modalBackground, .modalClose").click(function() {
        $(".modalContent, .modalBackground").fadeToggle();
    });
    $(".modalContent, .modalBackground").hide();
});
