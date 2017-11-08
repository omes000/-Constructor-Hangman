var inquirer = require('inquirer');
//validator is used to determine if the user entered a letter or not.
var validator = require('validator');
var Word = require('./word.js');
var ToGuess = require('./toGuess.js');

// var guessesLeft = 10;
// var guessedLetters = [];
// var currentWord = "";


var game = {
	wordsToGuess: ToGuess.toGuess,
	guessesLeft: 10,
	guessedLetters: [],
	currentWord: "",
	random: "",
	
	startGame: function(){
		// if(this.guessedLetters.length > 0){
		// 	this.guessedLetters = [];
		// 	this.guessesLeft = 10;
		// }
		if(this.guessesLeft === 10 && this.guessedLetters.length === 0){
			//this.reset();
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
	reset: function(){
		this.guessedLetters = [];
		this.guessesLeft = 10;
	},

	userPrompt: function(){
		var that = this;
		if(this.guessedLetters.length > 0){

		}

		inquirer.prompt([
		{
			name: "userLetter",
			type: "input",
			message: "Pick a letter",
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
			var alreadyGuessed = false;

			for(var i = 0; i < that.guessedLetters.length; i++){
				if(chosenLetter === that.guessedLetters[i]){
					alreadyGuessed = true;
				}
			}

			if(alreadyGuessed === false){
				that.guessedLetters.push(chosenLetter);
				var checkGuess = that.currentWord.checkLetter(chosenLetter);

				if(checkGuess === false){
					that.guessesLeft --;
					console.log('\nWrong! \nGuesses Left ' + that.guessesLeft + '\n----------------\n'+ that.currentWord.showWord() + '\n---------------- \nGuessed Letters ' + that.guessedLetters);
				}
				else{
					console.log('Correct!');
					if(that.currentWord.wordGuessed() === true){
						console.log(that.currentWord.showWord());
						that.wordsToGuess.splice(that.random, 1);
						console.log('You Won!');
						//alreadyGuessed = false;
						that.startGame();
					}
					else{
						console.log('Guesses Left ' + that.guessesLeft);
						console.log('\n----------------');
						console.log(that.currentWord.showWord());
						console.log('\n----------------');
						console.log('Guessed Letters ' + that.guessedLetters);
					}
				}
				if(that.guessesLeft > 0 && that.currentWord.guessed === false){
					that.userPrompt();
				}
				else if(that.guessesLeft <= 0){
					console.log('You Lose');
					console.log('The correct word was ' + that.currentWord.word);
					inquirer.prompt([{
						name: "playAgain",
						type: "confirm",
						message: "Play Again?"
					}]).then(function(response){
						if(response.playAgain === true){
							that.wordsToGuess.splice(that.random, 1);
							that.startGame();
						}
						else{
							console.log("See ya");
						}
					})
				}
			}
			else{
				console.log("Already guessed; try again");
				that.userPrompt();
			}
		})
	}
}

// function startGame(){
// 	if(guessedLetters.length > 0){
// 		guessedLetters = [];
// 	}
// 	currentWord = new Word(words[2]);
// 	currentWord.getLetters();
// 	console.log(currentWord.showWord());
// 	userPrompt();
// }

// function userPrompt(){
// 	inquirer.prompt([
// 		{
// 			name: "userLetter",
// 			type: "input",
// 			message: "Pick a letter",
// 			validate: function(usersLetter){
// 				if(validator.isAlpha(usersLetter) && usersLetter.length < 2){
// 					return true;
// 				}
// 				else{
// 					return false;
// 				}
// 			}
// 		}
// 	]).then(function(letter){
// 		var chosenLetter = (letter.userLetter).toUpperCase();
// 		var alreadyGuessed = false;

// 		for(var i = 0; i < guessedLetters.length; i++){
// 			if(chosenLetter === guessedLetters[i]){
// 				alreadyGuessed = true;
// 			}
// 		}

// 		if(alreadyGuessed === false){
// 			guessedLetters.push(chosenLetter);
// 			var checkGuess = currentWord.checkLetter(chosenLetter);

// 			if(checkGuess === false){
// 				guessesLeft --;
// 				console.log('\nWrong! \nGuesses Left ' + guessesLeft + '\n----------------\n'+ currentWord.showWord() + '\n---------------- \nGuessed Letters ' + guessedLetters);
// 			}
// 			else{
// 				console.log('Correct!');
// 				if(currentWord.wordGuessed() === true){
// 					console.log(currentWord.showWord());
// 					console.log('You Won!');
// 				}
// 				else{
// 					console.log('Guesses Left ' + guessesLeft);
// 					console.log('\n----------------');
// 					console.log(currentWord.showWord());
// 					console.log('\n----------------');
// 					console.log('Guessed Letters ' + guessedLetters);
// 				}
// 			}
// 			if(guessesLeft > 0 && currentWord.guessed === false){
// 				userPrompt();
// 			}
// 			else if(guessesLeft <= 0){
// 				console.log('You Lose');
// 				console.log('The correct word was ' + currentWord.word);
// 			}
// 		}
// 		else{
// 			console.log("Already guessed; try again");
// 			userPrompt();
// 		}
// 	})
// }

game.startGame();