// A function that selects a random integer between a given min and max
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// A function that reads in the game data from a file
function loadWordList(file) {
  var dataArray;

  // Setting jQuery ajax setting to async:false in order to allow time for the file to load.
  // This seems pretty ugly, but is the only way I could figure out how to make this work.
  jQuery.ajaxSetup({async:false});

  // Read in the contents of the file using jQuery
  $.get(file, function(data) {
    // Parse the data into an array of stings
    dataArray = data.split("\n");
  }, 'text');

  // Setting jQuery ajax setting back to async:true, which is the default.
  jQuery.ajaxSetup({async:true}); 

  return dataArray
}

// A function that determines if two arrays of the same length are equal
function arraysEqual(arrA, arrB) {
  for (var i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) {
      return false
    }
  }

  return true
}

// The Game object
function Game(list) {
  // Store the list of all cat breeds
  this.allBreedsList = list;

  // Total number of user wins, initially zero
  this.totalWins = 0;

  // Total number of user losses, initially zero
  this.totalLosses = 0;

  // Set up a new game
  this.setupNewGame = function() {
    // Select a random cat breed from the list
    var randomNum = getRandomIntInclusive(0, list.length - 1);
    this.breed = this.allBreedsList[randomNum].toLowerCase();

    // Create a list of characters for the breed string
    this.breedList = this.breed.split('');

    // Create the letters guessed list, initially containing dashes
    var guessList = [];
    var lettersTotal = 0;
    for (var i = 0; i < this.breedList.length; i++) {
      if (this.breedList[i] !== " ") { // if letter, put dash
        guessList.push("_");
        lettersTotal ++; // keep track of how many letters the breed has
      } else { // if space, put " "
        guessList.push(" ");
      }
    }
    this.guessList = guessList;

    // Set the number of guesses to twice the number of letters
    this.numGuesses = lettersTotal * 2;

    // Set the original list of letters guessed to empty
    this.lettersGuessed = [];

    // Trigger to start a new game
    this.gameOver = false;

    // Reset the display for a new game
    this.printStats();
  }

  // Update the user guess list with the incoming letter
  this.updateGuess = function(letter) {
    // Variable keeping track of whether or not a letter appears in the word
    var inWord = false;

    // Check if the given letter has already been guessed
    if (this.lettersGuessed.indexOf(letter) !== -1) {
      // Letter has already been guessed, do nothing
      console.log("Letter has alredy been guessed!");
      return
    } else {
      // Letter has not been guessed
      this.lettersGuessed.push(letter);

      // Check if the letter appears in the word
      for (var i = 0; i < this.breedList.length; i++) {
        if (this.breedList[i] === letter) { // if it matches, record it
            this.guessList[i] = letter;
            inWord = true;
        }
      }

      // Letter is not in the word, decrement the number of guesses
      if (!inWord) {
        this.numGuesses --;
      }
    }
  }

  // Format the current guess in order to display it nicely in HTML
  this.printGuess = function() {
    var guess = "";

    for (var i = 0; i < this.guessList.length; i++) {
      if (this.guessList[i] !== " ") { // if not a space, insert the character
        guess += this.guessList[i];
        guess += " "; // add space so several _ characters do not look like a line
      } else { // if space, put | to separate the words
        guess += "| ";
      }
    }

    return guess
  }

  // Print the game stats such as letters guessed and win/loss numbers
  this.printStats = function() {
    $("#userGuess").html(this.printGuess());
    $("#lettersGuessed").html(this.lettersGuessed);
    $("#triesLeft").html(this.numGuesses);
    $("#totalWins").html(this.totalWins);
    $("#totalLosses").html(this.totalLosses);
  }

  // Check if the user has won or lost
  this.checkWin = function() {
    if (arraysEqual(this.guessList, this.breedList) && (this.numGuesses >= 0)) {
      // User has won the game
      $("#userWinMessage").html("You have guessed " + this.guessList.join('') + " correctly!");
      this.totalWins ++;
      this.gameOver = true;
    } else if (!arraysEqual(this.guessList, this.breedList) && (this.numGuesses <= 0)) {
      // User has lost the game
      $("#userLossMessage").html("You did not guess " + this.breedList.join('') + "!");
      this.totalLosses ++;
      this.gameOver = true;
    } else {
      // Game continues
      console.log("User is still in the game...");
    }
  }
}

// Run Javascript when the HTML has finished loading
$(document).ready(function() {

  // Specify the file containing the cat breeds
  var catBreedFile = "./assets/cat_breeds.txt";

  // Store all of the cat breeds in a variable
  var allCatBreeds = loadWordList(catBreedFile);

  // Create the Hangman game object
  var hangman = new Game(allCatBreeds);

  // Initialize a new game
  hangman.setupNewGame();

  // Listen for keyboard events
  $(document).keypress(function(evn) {
    // Record the letter pressed on the keyboard
    var letter = evn.key.toLowerCase();

    // Update the user guess
    hangman.updateGuess(letter);

    // Check if the user has won or lost
    hangman.checkWin();

    // Update the game display
    hangman.printStats();

    // Check if the game should be restarted at this time
    if (hangman.gameOver == true) {
      hangman.setupNewGame();
    }
  }); // user keyboard press

}); // main routine
