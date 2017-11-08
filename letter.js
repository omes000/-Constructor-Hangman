/*The Letter constructor returns a space when it finds a space in the phrase to be guessed (such as multiword answers), returns an underscore if the letter has not been guessed yet, and returns the actual letter if the letter has been guessed correctly.*/

var Letter = function(letter){
	this.letter = letter;
	this.show = false;
	this.showLetter = function(){
		if (this.letter === ' '){
			this.show = true;
			return "  ";
		}
		else if(this.show === false){
			return " _ ";
		}
		else{
			return this.letter;
		}
	}	
}

module.exports = Letter;