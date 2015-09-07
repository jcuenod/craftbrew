var hebrewConsonantMap = {
    "A": ["א", "ע"],
    "B": ["ב"],
    "C": ["כ", "ח","ף"],
    "D": ["ד"],
    "E": ["א"],
    "F": ["פ"],
    "G": ["ג"],
    "H": ["ה"],
    "I": ["י"],
    "J": ["י"],
    "K": ["כ", "ק"],
    "L": ["ל"],
    "M": ["מ"],
    "N": ["נ"],
    "O": ["וֹ", "ס"],
    "P": ["פ"],
    "Q": ["ק"],
    "R": ["ר"],
    "S": ["שׁ", "שׂ", "ס"],
    "T": ["ת", "ט", "צ"],
    "U": [""],
    "V": ["ו", "וֹ", "ב"],
    "W": ["ו", "וֹ"],
    "X": [""],
    "Y": ["י"],
    "Z": ["צ", "ז"],
};

var hebrewVowelMap = {
	"A": ["ָ", "ֳ", "ַ", "ֲ", "א", "ע"],
	"E": ["ְ", "ֵ", "ֶ", "ֱ"],
	"I": ["ִ", "ְ", "י"],
	"O": ["ֹ", "ָ", "וֹ"],
	"U": ["ֻ", "ו", "וּ"],
}

var finalFormMap = {
    "כ": "ך",
    "מ": "ם",
    "פ": "ף",
    "נ": "ן",
    "צ": "ץ",
}

function invertObject(obj)
{
    var result = {};
    var keys = Object.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
}
var invertedFinalFormMap = invertObject(finalFormMap);