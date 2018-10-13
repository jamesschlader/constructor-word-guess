var Letter = function(letter, guess) {
  this.letter = letter;
  this.guess = guess;

  this.beenGuessed = function() {
    if (this.letter === " ") {
      this.guess = true;
      return " ";
    } else if (this.letter === "'") {
      this.guess = true;
      return "'";
    } else if (this.letter === "-") {
      this.guess = true;
      return "-";
    } else if (this.guess) {
      return this.letter;
    } else {
      return "_";
    }
  };
  this.checkIt = function(char) {
    if (char === this.letter) {
      this.guess = true;
      return true;
    } else if (!this.guess) {
      this.guess = false;
      return false;
    }
  };
};

module.exports = Letter;
