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

// The Game object constructor function, which initializes the required fields
function Game(list) {
  // Select a random cat breed from the list
  var randomNum = getRandomIntInclusive(0, list.length - 1);
  this.breed = list[randomNum];

  // Create a list of letters holding the breed string
  this.breedList = this.breed.split('');

  // Create the guessed list containing dashes
  var guess = [];
  var letters = 0;
  for (var i = 0; i < this.breedList.length; i++) {
    if (this.breedList[i] !== " ") { // if letter, put dash
      guess.push("_");
      letters ++; // keep track of how many letters the breed has
    } else { // if space, put " "
      guess.push(" ");
    }
  }
  this.guessList = guess;

  // Set the number of guesses to twice the number of letters
  this.numGuesses = letters * 2;

  // Set the original list of letters guessed to be empty
  this.lettersGuessed = [];

  // Format the current guess in order to display in in HTML
  this.printGuess = function() {
    var guess = "";

    for (var i = 0; i < this.guessList.length; i++) {
      if (this.guessList[i] !== " ") { // if letter, put the letter
        guess += this.guessList[i];
        guess += " "; // add space so many _ do not look like a line
      } else { // if space, put | to separate the words
        guess += "| ";
      }
    }

    return guess
  }
}

// A function that randomly selects a cat breed from a list
function selectCatBreed(list) {
  // Select a cat breed at random
  var randomNum = getRandomIntInclusive(0, list.length - 1);
  var randomBreed = list[randomNum];

  return randomBreed
}

// Run Javascript when the HTML has finished loading
$(document).ready(function() {

  // Specify the file containing the cat breeds
  var catBreedFile = "./assets/cat_breeds.txt";

  // Store all of the cat breeds in a variable
  var allCatBreeds = loadWordList(catBreedFile);

// Run this in a while loop until the user gets tired :)

  // Initialize the Hangman game
  var hangman = new Game(allCatBreeds);
  console.log(hangman.breedList);
  console.log(hangman.guessList);

  // Display the randomly selected breed in HTML
  $("#userGuess").append($("<div>").html(hangman.printGuess()));
  $("#triesLeft").append($("<div>").html(hangman.numGuesses));
  $("#lettersGuessed").append($("<div>").html(hangman.lettersGuessed));


});