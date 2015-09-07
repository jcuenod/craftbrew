var inLoopTimer;
var loop;
var timeout = 600;
var inloopCode = 0;
var lastCode = [];
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
            e.preventDefault();
            lastCode.pop();
            backspaceCharacter();
            break;
        case 9: //tab
            if (justTriedAVowel)
            {
                backspaceCharacter();
                buildLoop(hebrewConsonantMap, lastCode.pop());
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
            var withDagesh = false;
            var lastChar = getLastCharacter();
            if (lastChar == "\u05BC")
            {
                //if last character was a dagesh, check the previous one
                lastChar = getSecondLastCharacter();
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
            if ( isConsonantish(lastChar) &&
                    currentText().trim().length > 0 &&
                    !(lastChar == "ו" && withDagesh) )
            {
                //we try for vowels - only if a vowel was hit and there's something there
                buildLoop(hebrewVowelMap, e.which);
                justTriedAVowel = true;
                break;
            }
            justTriedAVowel = false;
            /* falls through */
        default:
            buildLoop(hebrewConsonantMap, e.which);
    }
    //no matter what, just do this check...
    convertFinalForm();
}).on("keyup", function(e) {
    if (e.which == 17)
        ctrlDown = false;
});

function buildLoop(characterMap, keycode)
{
    if (String.fromCharCode(keycode) in characterMap)
    {
        var possibleCharacters = characterMap[ String.fromCharCode(keycode) ];

        appendCharacter(possibleCharacters[0]);
        inloopCode = keycode;
        lastCode.push(keycode);

        var currentIteration = 0;
        loop = function() {
            currentIteration++;
            replaceLastCharacter(possibleCharacters[ currentIteration % (possibleCharacters.length) ]);
            resetTimer(currentIteration);
        };
        resetTimer();
    }
}
function resetTimer(multiplier)
{
    multiplier = typeof myVar != 'undefined' ? multiplier : 0;
    multiplier = multiplier > 4 ? 4 : multiplier;
    clearTimeout(inLoopTimer);
    inLoopTimer = setTimeout(function() {
        inloopCode = false;
    }, timeout + 120 * multiplier);
}

function convertFinalForm()
{
    var finalForm = finalFormMap[getLastConsonant()];
    var midtextForm = invertedFinalFormMap[getSecondLastConsonant()];
    if (typeof finalForm != 'undefined')
    {
        replaceCharacterAtIndex(finalForm, getLastConsonantIndex());
    }
    if (typeof midtextForm != 'undefined')
    {
        var charactersBetweenLastConsonants = currentText().slice(getSecondLastConsonantIndex(), getLastConsonantIndex());
        if (!charactersBetweenLastConsonants.match(/\ /))
        {
            replaceCharacterAtIndex(midtextForm, getSecondLastConsonantIndex());
        }
    }
}

function getLastConsonantIndex()
{
    for (var n = 0; n < currentText().length; n++)
    {
        var currentChar = getNthLastCharacter(n);
        if (isConsonantish(currentChar)) {
            return currentText().length - n - 1;
        }
    }
}
function getLastConsonant()
{
    return getNthCharacter(getLastConsonantIndex());
}
function getSecondLastConsonantIndex()
{
    for (var n = getLastConsonantIndex() - 1; n >= 0; n--)
    {
        var currentChar = getNthCharacter(n);
        if (isConsonantish(currentChar)) {
            return n;
        }
    }
}
function getSecondLastConsonant()
{
    return getNthCharacter(getSecondLastConsonantIndex());
}

var lastInsertion = [];
function currentText() { return $(".content").text().slice(); }
function appendCharacter(charToAppend)
{
    var newText = currentText() + charToAppend;
    $(".content").text(newText);
    lastInsertion.push(charToAppend);
}
function replaceLastCharacter(newChar)
{
    backspaceCharacter();
    appendCharacter(newChar);
}
function backspaceCharacter()
{
    if (currentText().trim().length === 0)
        return;
    var newText = currentText().slice(0, - lastInsertion.pop().length);
    $(".content").text(newText);
}
function replaceCharacterAtIndex(newChar, index)
{
    var newText = currentText().slice(0, index) + newChar + currentText().slice(index + 1);
    $(".content").text(newText);
}
function getNthCharacter(n)
{
    return currentText().slice(n, n + 1);
}
function getLastCharacter()
{
    return getNthLastCharacter(0);
}
function getSecondLastCharacter()
{
    return getNthLastCharacter(1);
}
function getNthLastCharacter(n)
{
    if (n === 0)
        return currentText().slice(-1);
    return currentText().slice(-n - 1, -n);
}

function isConsonantish(char)
{
    return char.match(/[\u05D0-\u05EA\uFB2A\uFB2B]/);
}

$(function(){
    $(".modalTrigger, .modalBackground, .modalClose").click(function() {
        $(".modalContent, .modalBackground").fadeToggle();
    });
    $(".modalContent, .modalBackground").hide();

    if (!FontDetect.isFontLoaded('SBL Hebrew'))
    {   // Assume we fell back to Verdana, so adjust the column width.
        alert("You don't have to, but we strongly recommend installing the SBL Hebrew Font (see the help for more information)");
    }
});
