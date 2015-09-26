var inLoopTimer;
var loop;
var timeout = 600;
var inloopCode = 0;
var lastCode = [];
var justTriedAVowel = false;
var ctrlDown = false;
var hebrewEditor;

$(function(){
    $(".modalTrigger, .modalBackground, .modalClose").click(function() {
        $(".modalContent, .modalBackground").fadeToggle();
    });
    $(".modalContent, .modalBackground").hide();

    if (!FontDetect.isFontLoaded('SBL BibLit'))
    {
        alert("You don't have to, but we strongly recommend installing the SBL BibLit font (see the help for more information)");
    }

    hebrewEditor = new HebrewEditor($(".content"));

    var buildLoop = function(characterMap, keycode)
    {
        if (String.fromCharCode(keycode) in characterMap)
        {
            var possibleCharacters = characterMap[ String.fromCharCode(keycode) ];

            hebrewEditor.appendCharacter(possibleCharacters[0]);
            inloopCode = keycode;
            lastCode.push(keycode);

            var currentIteration = 0;
            loop = function() {
                currentIteration++;
                hebrewEditor.replaceLastCharacter(possibleCharacters[ currentIteration % (possibleCharacters.length) ]);
                resetTimer(currentIteration);
            };
            resetTimer();
        }
    };
    var resetTimer = function(multiplier)
    {
        multiplier = typeof myVar != 'undefined' ? multiplier : 0;
        multiplier = multiplier > 4 ? 4 : multiplier;
        clearTimeout(inLoopTimer);
        inLoopTimer = setTimeout(function() {
            inloopCode = false;
        }, timeout + 120 * multiplier);
    };

    $(document).on("keydown", function(e) {
        if (ctrlDown)
            return true;
        switch (e.which) {
            case inloopCode:
                loop();
                break;
            case 8: //backspace
                e.preventDefault();
                lastCode.pop();
                hebrewEditor.removeLastCharacter();
                break;
            case 9: //tab
                if (justTriedAVowel)
                {
                    hebrewEditor.removeLastCharacter();
                    buildLoop(hebrewConsonantMap, lastCode.pop());
                    inloopCode = 9;
                }
                e.preventDefault();
                break;
            case 17:
                ctrlDown = true;
                break;
            case 27: //escape
                $(".modalContent, .modalBackground").fadeToggle();
                break;
            case 32: //space
                hebrewEditor.appendCharacter(" ");
                break;
            case 186: //semi-colon
                hebrewEditor.appendCharacter("׃"); //sof pasuq
                break;
            case 188: //comma
                hebrewEditor.appendCombinedCharacter("֫"); //accent (ole)
                break;
            case 189: //minus
                hebrewEditor.appendCharacter("־"); //maqaf
                break;
            case 190: //full stop
                hebrewEditor.appendCombinedCharacter("ּ"); //dagesh
                break;
            case 65:
            case 69:
            case 73:
            case 79:
            case 85:
                if ( hebrewEditor.endsVowelishly() )
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
    }).on("keyup", function(e) {
        if (e.which == 17)
            ctrlDown = false;
    });
    var isIe = (navigator.userAgent.toLowerCase().indexOf("msie") != -1 || navigator.userAgent.toLowerCase().indexOf("trident") != -1);
    var getSelectedText = function() {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (document.selection) {
            return document.selection.createRange().text;
        }
        return '';
    };
    var sendToClipBoard = function (e) {
        var textToPutOnClipboard = getSelectedText() || hebrewEditor.getCurrentText();
        if (isIe) {
            window.clipboardData.setData('Text', textToPutOnClipboard);
        } else {
            e.clipboardData.setData('text/plain', textToPutOnClipboard);
        }
        e.preventDefault();
    };
    document.addEventListener('copy', function(e) {
        sendToClipBoard(e);
    });
    document.addEventListener('cut', function(e) {
        sendToClipBoard(e);
        if (!getSelectedText())
        {
            hebrewEditor.clear();
            lastCode = [];
        }
    });
});
