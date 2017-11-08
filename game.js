var inquirer = require('inquirer');

//validator is used to determine if the user entered a letter or not.
var validator = require('validator');
var Word = require('./word.js');

//ToGuess contains all of the possible words the user can guess
var ToGuess = require('./toGuess.js');

var game = {
	wordsToGuess: ToGuess.toGuess, //imports the possible words the user can guess
	guessesLeft: 10, //number of guesses the user has left
	guessedLetters: [], //array of all user guessed letters
	currentWord: "", //holds the current word the user is guessing
	random: "", //holds the random number used to select the word the user will guess from the ToGuess file
	
	/*startGame begins the game by ensuring that a reset has occurred, then choosing a random word from an array of possible words. Then the letters for the word are obtained using the .getLetters() method. The user is then shown the underscored word so that they can guess. The random number is stored for later use. The user is then prompted for an their guess. If reset has not occurred, it will be reset and the startGame function will be called again.*/
	startGame: function(){
		if(this.guessesLeft === 10 && this.guessedLetters.length === 0){
			var randomNum = Math.floor(Math.random()*this.wordsToGuess.length);
			this.currentWord = new Word((this.wordsToGuess[randomNum]).toUpperCase());
			this.currentWord.getLetters();
			console.log(this.currentWord.showWord());
			this.random = randomNum;
			this.userPrompt();
		}
		else{
			this.reset();
			this.startGame();
		}
	},

	//Resets to the beginning values of the game
	reset: function(){
		this.guessedLetters = [];
		this.guessesLeft = 10;
	},

	/*userPrompt asks the user to enter a guess based on the underscored word that is displayed. This user input is validated using the validator package to ensure that the character the user entered is a letter and that the user did not enter multiple letters. Once the input is validated, the user's response is checked against various play conditions, such as if the letter has already been guessed, if the letter matches a letter in the word the user must guess, as well as accounts for the win and lose conditions*/
	userPrompt: function(){
		var that = this;

		inquirer.prompt([
		{
			name: "userLetter",
			type: "input",
			message: "Pick a letter",

			//Checks if the user entered a letter and how many characters the user has input
			validate: function(usersLetter){
				if(validator.isAlpha(usersLetter) && usersLetter.length < 2){
					return true;
				}
				else{
					return false;
				}
			}
		}
		]).then(function(letter){
			var chosenLetter = (letter.userLetter).toUpperCase();
			var alreadyGuessed = false; //used to determine if the user has already guessed a letter.

			/*Checks the user input against all letters in the already guessed letters array. If there is a match, alreadyGuessed is set to true*/ 
			for(var i = 0; i < that.guessedLetters.length; i++){
				if(chosenLetter === that.guessedLetters[i]){
					alreadyGuessed = true;
				}
			}

			//If the letter has not been guessed before, the user input will be pushed to the guessedLetters array
			if(alreadyGuessed === false){	
				that.guessedLetters.push(chosenLetter);
				var checkGuess = that.currentWord.checkLetter(chosenLetter); //checks if the user input matches any letter from the word being guessed. 

				/*If the user input does not match any letters, then the user is shown that they were incorrect, as well as how many guesses the user has left and the current state of the word*/
				if(checkGuess === false){
					that.guessesLeft --;
					console.log('\nWrong! \nGuesses Left ' + that.guessesLeft + '\n----------------\n'+ that.currentWord.showWord() + '\n---------------- \nGuessed Letters ' + that.guessedLetters);
					//Ensures that the user is still in play condition
					if(that.guessesLeft > 0 && that.currentWord.guessed === false){
						that.userPrompt();
					}
				}

				/*If the user input does match a letter, then the win condition is checked. If the win condition is not met, then the user shown that they are correct, as well as how many guesses are left and the current state of the word*/ 
				else{
					console.log('\nCorrect!');

					//Checks for win condition
					if(that.currentWord.wordGuessed() === true){
						console.log("\n" + that.currentWord.showWord() + "\nYou Won!");

						//If the user has won, the current word that the user guessed will be removed from play for all future games
						that.wordsToGuess.splice(that.random, 1);

						//ensures that the user still has words to guess
						if(that.wordsToGuess.length > 0){
							that.startGame();
						}

						//if the user has played all possible words and won on at least the last game, the user will be shown the following message
						else{
							console.log("\nYOU HAVE REALLY REALLY WON!");
						}
					}
					else{
						console.log('\nGuesses Left ' + that.guessesLeft + '\n----------------\n' + that.currentWord.showWord()+ '\n----------------\nGuessed Letters ' + that.guessedLetters);
						if(that.guessesLeft > 0 && that.currentWord.guessed === false){
							that.userPrompt();
						}
					}
				}
				
				/*if the user has used up all of their guesses, then the correct answer is shown. The user is asked if they would like to play again*/
				if(that.guessesLeft === 0){
					console.log('\nYou Lose' + '\nThe correct word was ' + that.currentWord.word);
					that.wordsToGuess.splice(that.random, 1);

					//checks if there are still words to play
					if(that.wordsToGuess.length > 0){
						inquirer.prompt([{
							name: "playAgain",
							type: "confirm",
							message: "Play Again?"
						}]).then(function(response){
							if(response.playAgain === true){
								that.startGame();
							}
							else{
								console.log("See ya");
							}
						})
					}

					//if the user has played all words and loses on the last game, the user will be shown the following message
					else{
						console.log("\nWomp womp, you are a true loser");
					}
				}
			}

			//if alreadyGuessed is true, then the use will be informed that they have already picked that letter and that they need to choose again. 
			else{
				console.log("\nAlready guessed; try again");
				that.userPrompt();
			}
		})
	}
}

//starts the game
game.startGame();