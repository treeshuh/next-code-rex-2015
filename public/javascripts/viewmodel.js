var viewmodel = function(){
	console.log("starting")
 	var targetText = ko.observable("Type in this answer");
	var inputText = ko.observable();

	return{
		targetText: targetText,
		inputText: inputText
	}
}
ko.applyBindings(viewmodel())
