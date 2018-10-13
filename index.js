var inquirer = require("inquirer");

var request = require("request");

var Word = require("./word");

var activeWord;

var pick;

var guessNumber = 0;

var difficulty = 0;

var wins = 0;

var losses = 0;

var showing = false;

var definition = "";

const askGuess = [
  {
    type: "input",
    name: "guess",
    message: "\nGuess a letter:\n"
  }
];

const getStarted = [
  {
    type: "list",
    name: "difficulty",
    choices: ["3", "5", "7"],
    message:
      "\nThe objective is to expose all the letters of the word before you run out of incorrect guesses. \n\nPlease choose the number of incorrect guesses you'd like to have.\n"
  },
  {
    type: "list",
    name: "start",
    choices: ["Yes", "No"],
    message: "\nAre you ready to guess a letter?\n"
  }
];

const checkReady = [
  {
    type: "list",
    name: "start",
    choices: ["Yes", "No"],
    message: "\nAre you ready to guess a letter?\n"
  }
];

var finished = [
  {
    type: "list",
    name: "restart",
    choices: ["Yes", "No"],
    message: "\nWould you like to play another game?\n"
  }
];

//var words = ["philosophy", "epistemology", "knowledge", "metaphysics"];
var theWords = {
  words: [],
  definitions: "",

  dictionary: function() {
    //wordlist/en/domains%3Dphilosophy

    var options = {
      url: `https://od-api.oxforddictionaries.com:443/api/v1/wordlist/en/domains%3Dphilosophy`,
      headers: {
        app_id: "3bf9a8be",
        app_key: "a5014898c22fa4a2b67d30727bce1c80"
      }
    };
    request(options, this.getWords);

    //console.log(`from inside dictionary, text = ${text}`);
  },

  getWords: function(error, response, body) {
    //console.log("inside getWords");

    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      const regEx = ",";
      info.results.forEach(element => {
        if (!element.word.includes(regEx)) {
          theWords.words.push(element.word);
          //console.log(
          // `from inside getwords, here's theWords.words: ${element.word}`
          // );
        }
      });
    }
    startGame();
  },

  getDefinitions: function(text) {
    //console.log("inside getDefinitions");
    //console.log(`from inside getDefinitions, here the element from theWords.words: ${element}`);
    var options = {
      url: `https://od-api.oxforddictionaries.com:443/api/v1/entries/en/${text}`,
      headers: {
        app_id: "3bf9a8be",
        app_key: "a5014898c22fa4a2b67d30727bce1c80"
      }
    };

    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        //console.log(info);
        if (
          !info.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]
        ) {
          console.log(`here's the failure: ${info.results[0].id}`);
        } else {
          theWords.definitions =
            info.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0];

          // console.log(info.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]);
        }
      } else if (err) {
        console.log(err);
      }
    });
  }
};

function checkGuess(answer) {
  if (answer.start === "Yes") {
    if (!showing) {
      showWord();
      difficulty = answer.difficulty;
    }

    inquirer.prompt(askGuess).then(obj => compare(obj));
  } else {
    console.log(
      `Thanks for playing! You finished this session with ${wins} wins and ${losses} losses. `
    );
  }
}
function checkRestart(answer) {}

function checkGuess(answer) {
  if (answer.start === "Yes") {
    if (!showing) {
      showWord();
      difficulty = answer.difficulty;
    }

    inquirer.prompt(askGuess).then(obj => compare(obj));
  } else {
    console.log(
      `Thanks for playing! You finished this session with ${wins} wins and ${losses} losses. `
    );
  }
}
function checkRestart(answer) {
  if (answer.restart === "Yes") {
    startGame();
  } else {
    console.log(
      `\nThanks for playing! You finished this session with ${wins} wins and ${losses} losses.\n `
    );
  }
}

function pickWord() {
  pick = Math.floor(Math.random() * theWords.words.length);
  var def = theWords.words[pick];
  theWords.getDefinitions(def);
  return def;
}

function expandWord() {
  activeWord.word.forEach(element => {
    element.guess = true;
  });
  return activeWord.theWord().replace(/,/g, "");
}

function showDef(text) {
  console.log(`${text} is ${theWords.definitions}`);
}

function checkLoser(number1, number2) {
  if (!(number1 < number2)) {
    //Loser!!
    var target = expandWord();
    //getDef(target, dictionary);

    losses++;
    console.log(
      `\n\nFailure! Failure! Failure! Failure! Failure! Failure! Failure!\nOh no! You didn't get the word before you've exceeded the number of incorrect guesses.\nYou now have ${wins} wins and ${losses} losses. \nThe word you were trying to guess is ${target}.\n${target} means ${
        theWords.definitions
      }.\n\n`
    );

    return true;
  } else {
    return false;
  }
}

function checkWinner() {
  let count = 0;
  for (const key in activeWord.word) {
    if (activeWord.word.hasOwnProperty(key)) {
      const element = activeWord.word[key];

      if (element.guess) {
        count++;

        if (activeWord.word.length === count) {
          //winner!!
          wins++;

          console.log(
            `\nVictory! Victory! Victory! Victory! Victory! Victory!\n\n\You guessed all the letters in the word! You've won!\n`
          );
          showDef(expandWord());
          return true;
        }
      }
    }
  }
  return false;
}

function compare(obj) {
  console.log(obj.guess);
  if (!activeWord.getGuess(obj.guess)) {
    guessNumber++;
  }

  if (checkLoser(guessNumber, difficulty)) {
    inquirer.prompt(finished).then(obj => checkRestart(obj));
  } else if (checkWinner()) {
    inquirer.prompt(finished).then(obj => checkRestart(obj));
  } else {
    showWord();
    keepScore();
  }
}

function configureGame() {
  theWords.dictionary();

  console.log(
    "\n\n///////////////////////////////////////////////////////////////////////////////////\n\nWelcome to the Philosophical Word Guess Game!\n\nYou will be asked to spell out words fron the philosophy domain that are listed in the Oxford Dictionary. Beware: Many of them are quite difficult to figure out. \nIf you think you'll need some extra time, choose a higher number of guesses. If you want to press your luck, pick 3.\nYou'll get a hint when the going gets rough.\n"
  );
  //console.log(`the words array is: ${theWords.words}`);
  //console.log(`the definitions array is: ${theWords.definitions}`);
  //console.table(theWords.words, theWords.definitions);
}

function startGame() {
  activeWord = new Word(pickWord());
  activeWord.buildWord(activeWord.name, false);

  guessNumber = 0;
  showing = false;

  inquirer.prompt(getStarted).then(obj => checkGuess(obj));
}

function keepScore() {
  console.log(
    `\nYou've had ${guessNumber} incorrect guesses. You have ${difficulty -
      guessNumber} incorrect guesses remaining.\n`
  );
  if (difficulty - guessNumber === 2) {
    console.log(`Hint: the word means ${theWords.definitions}\n`);
  }
  inquirer.prompt(checkReady).then(obj => checkGuess(obj));
}

function showWord() {
  showing = true;
  const regEx = /,/g;
  const regEx2 = /\s/g;

  var target = activeWord.theWord();
  var clean = target.replace(regEx, " ");

  console.log(`\nThe word to guess is \n\n ${clean}\n`);
}

configureGame();
