var Letter = require("./letter.js");

var Word = function(word){
	this.word = word;
	this.letters = [];
	this.guessed = false;

	//that is used when 'this' does not refer to the object from the outermost function
	var that = this;

	/*gets all of the letters from the phrase to be guessed and creates new objects from each letter using the Letter constructor.*/
	this.getLetters = function(){
		for(var i = 0; i < that.word.length; i++){
			this.letters.push(new Letter(that.word[i]));
		}
	}

	/*checks if every letter object has the show property equal to true, meaning every letter has been revealed due to correct guesses. If every letter has been revealed, the guessed property for Word is set equal to true, since the entire phrase has been guessed; true is also returned. Otherwise, guessed property is false.*/
	this.wordGuessed = function(){
		if(this.letters.every(function(letter){
			return letter.show === true;
		})){
			this.guessed = true;
			return true;
		}
		else{
			this.guessed = false;
		}
	}

	/*checks the letter the user guesses against all of the letter objects for the phrase. If there is a match, it sets that letter's show property to true (so it will show up on the user's screen) and also returns the correct boolean as true. Otherwise, correct will be returned as false.*/
	this.checkLetter = function(userGuess){
		var correct = false;
		this.letters.forEach(function(letter){
			if(letter.letter === userGuess){
				letter.show = true;
				correct = true;
			}
		})
		return correct;
	}

	/*shows the word based on whether a letter has been guessed or not. If it has, it will show the actual letter, otherwise it will show an underscore or a space.*/
	this.showWord = function(){
		var show = '';
		that.letters.forEach(function(letter){
			var currentLetter = letter.showLetter();
			show += currentLetter;
		});
		return show;
	}
}

module.exports = Word;


