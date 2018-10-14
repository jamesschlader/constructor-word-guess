# constructor-word-guess

This is a classic word-guess game along the lines of Hangman. It is run from the command line using node.js. The user is prompted to make guesses against philosophical words drawn from the Oxford Dictionary. 

Features:
-uses the Oxford Dictionary API to supply the words to be guessed.
-uses inquirer node.js module to collect user input.
-builds the word to be guessed out of two different constructor functions: one for the letters and one for the word itself.
-the game offers 3 levelsof difficulty to challenge even the most knowledgeable user.
-the game offers hints by supplying the word's definition when the user is down to just 2 guesses remaining.
-at the end of the game, both the word and its definition is revealed, win or lose.

