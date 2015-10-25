function HebrewEditor(editorBox) {
    var $that = this;
    this.appendCharacter = function(newChar){
        this.textModel.appendCharacter(newChar);
    };
    this.removeLastCharacter = function(){
        this.textModel.removeLastCharacter();
    };
    this.replaceLastCharacter = function(newChar){
        this.textModel.replaceLastCharacter(newChar);
    };
    this.getCurrentText = function() {
        return this.textModel.getCurrentText().trim();
    };

    this.clear = function() {
        this.textModel.clear();
    };

    /*
     * "\u05BC" = dagesh
     * "\u05AB" = accent (ole)
     */
    var ignoreForVowelishness = ["\u05BC", "\u05AB"];
    this.endsVowelishly = function(textModelToCheck, withDagesh) {
        if (typeof textModelToCheck == "undefined")
            textModelToCheck = $.extend(true, {}, this.textModel);
        var lastChar = textModelToCheck.getNthCharacter(textModelToCheck.getLength() - 1);

        if ($.inArray(lastChar, ignoreForVowelishness) != -1)
        {
            withDagesh |= lastChar == "\u05BC";
            textModelToCheck.removeLastCharacter();
            return this.endsVowelishly(textModelToCheck, withDagesh);
        }
        else {
            /*
             * \u05D0-\u05EA = UTF8 range from Aleph to Tav
             *
             * UTF16 characters:
             * \uFB2A = HEBREW LETTER SHIN WITH SHIN DOT
             * \uFB2B = HEBREW LETTER SHIN WITH SIN
             *
             * Note also that \uFB4B = HEBREW LETTER VAV WITH HOLAM (excluded because it's a vowel)
             */
            return ( this.isConsonantish(lastChar) &&
                   textModelToCheck.getCurrentText().trim().length > 0 &&
                   !(lastChar == "ו" && withDagesh) );
        }
    };

    this.isConsonantish = function(char)
    {
        return char.match(/[\u05D0-\u05EA\uFB2A\uFB2B]/);
    };
    this.getNthLastConsonantIndex = function(n, t) //t = temporaryTextModel
    {
        var found = false;
        var maxN = t.getLength();
        for (var i = 0; i <= n; i++)
        {
            maxN--;
            found = false;
            for (var seekn = maxN; seekn >= 0; seekn--)
            {
                var currentChar = t.getNthCharacter(seekn);
                if (this.isConsonantish(currentChar)) {
                    maxN = seekn;
                    found = true;
                    break;
                }
            }
        }
        return found ? maxN : -1;
    };
    this.convertFinalForm = function(t) { //t = temporaryTextModel
        if ($that.getNthLastConsonantIndex(0, t) < 0)
            return t;
        if (t.getNthCharacter($that.getNthLastConsonantIndex(0, t)) in finalFormMap)
        {
            t.replaceNthCharacter(finalFormMap[t.getNthCharacter($that.getNthLastConsonantIndex(0, t))], $that.getNthLastConsonantIndex(0, t));
        }
        if ($that.getNthLastConsonantIndex(1, t) < 0)
            return t;
        if (t.getNthCharacter($that.getNthLastConsonantIndex(1, t)) in invertedFinalFormMap)
        {
            var charactersBetweenLastConsonants = t.getCurrentText().slice($that.getNthLastConsonantIndex(1, t), $that.getNthLastConsonantIndex(0, t));
            if (!charactersBetweenLastConsonants.match(/[\ ־]/) || charactersBetweenLastConsonants.match(/\uFB4B/))
            {
                t.replaceNthCharacter(invertedFinalFormMap[t.getNthCharacter($that.getNthLastConsonantIndex(1, t))], $that.getNthLastConsonantIndex(1, t));
            }
        }
        return t;
    };


    this.$editorBox = editorBox;
    this.textModel = new TextModel({
        beforeTextChange: this.convertFinalForm,
        onTextChange: function(newText) {
            editorBox.text(newText);
        }
    });
    return this;
}
