var Letter = require("./letter");

var Word = function(text) {
  this.name = text;
  this.word = [];

  this.theWord = function() {
    let content = [];
    this.word.forEach(object => {
      content.push(object.beenGuessed());
    });
    return content.toString();
  };

  this.getGuess = function(char) {
    let count = 0;
    for (const key in this.word) {
      if (this.word.hasOwnProperty(key)) {
        const element = this.word[key];
        if (element.checkIt(char)) {
          count++;
        }
      }
    }
    if (count > 0) {
      return true;
    } else {
      return false;
    }
  };

  this.buildWord = function(text, tval) {
    for (const key in text) {
      if (text.hasOwnProperty(key)) {
        const element = text[key];
        this.word.push(new Letter(element, tval));
      }
    }
  };
};

module.exports = Word;
