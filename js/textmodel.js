function TextModel (options) {
    this.currentText = options.startingText || "";
    this.lastInsertion = [];

    this.appendCharacter = function(charToAppend) {
        this.setCurrentText(this.currentText + charToAppend);
        this.lastInsertion.push(charToAppend);
    };
    this.removeLastCharacter = function() {
        if (this.currentText.trim().length === 0)
        {
            this.currentText = "";
            return;
        }
        this.setCurrentText(this.currentText.slice(0, - this.lastInsertion.pop().length));
    };
    this.replaceLastCharacter = function(newChar) {
        this.removeLastCharacter();
        this.appendCharacter(newChar);
    };

    this.getNthCharacter = function(n)
    {
        return this.currentText.slice(n, n + 1);
    };
    this.replaceNthCharacter = function(newChar, n)
    {
         this.setCurrentText(this.currentText.slice(0, n) + newChar + this.currentText.slice(n + 1));
    };

    this.getCurrentText = function() {
        return this.currentText;
    };
    this.getLength = function() {
        return this.currentText.length;
    };
    this.setCurrentText = function(newText){
        if (typeof options.beforeTextChange != 'undefined')
        {
            var t = options.beforeTextChange(new TextModel({startingText: newText}));
            newText = t.getCurrentText();
        }
        this.currentText = newText;
        if (typeof options.onTextChange != 'undefined')
            options.onTextChange(newText);
    };
    return this;
}
