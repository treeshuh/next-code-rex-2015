$(document).ready(function(){
	var viewmodel = function(){
		targetString = "Type in this answer.";
		var targetWords = targetString.split(" ");
		var index = ko.observable(0);
	 	var targetText = ko.observable(targetWords[0]);
		var inputText = ko.observable("");

		var valid = ko.computed(function(){
			if  (index() == targetWords.length - 1 && targetText() == inputText()) {
				window.alert("done!")
				return true
			}
			else if (inputText()[inputText().length - 1] == " " && targetText() == inputText().substring(0, inputText().length-1)){
				//valid input
				index(index()+1);
				if (index() != targetWords.length){
					targetText(targetWords[index()]);	
					inputText("")
				}
				else{
				}
			}
			return false
		})
		return{
			targetText: targetText,
			inputText: inputText,
			valid: valid,
			targetWords: targetWords,
			index: index
		}
	}
	ko.applyBindings(viewmodel())	
})


