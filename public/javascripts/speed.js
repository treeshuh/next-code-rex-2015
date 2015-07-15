$(document).ready(function(){
	var viewmodel = function(){
		var maxTime = timeLimit;
		var startTime; var timeIntervalId;
		var targetWords = targetString.split(" ");
		var index = ko.observable(0);
	 	var targetText = ko.observable(targetWords[0]);
		var inputText = ko.observable("");
		var challenging = ko.observable(false);
		var alertMessage = ko.observable("");

		var valid = ko.computed(function(){
			if (index() == targetWords.length - 1 && targetText() == inputText()) {
				$(".input-progress").css("width", "200px");
				window.clearInterval(timeIntervalId);
				$.ajax({
			        type: "POST",
			        url: "/submit",
			        data: {
			            challengeId: challengeId,
			            data: {
			            	score: maxScore,
			            	completion: 100,
			            	time: (Date.now()-startTime)/1000
			            }
			        },
			        success: function(data) {
			            console.log(data.result)
			            handleResult(data.result);
			        }
			    })
				return true
			}
			else if (inputText()[inputText().length - 1] == " " && targetText() == inputText().substring(0, inputText().length-1)){
				//valid input
				index(index()+1);
				$(".input-progress").css("width", ""+ 200*index()/targetWords.length + "px");
				if (index() != targetWords.length){
					targetText(targetWords[index()]);	
					inputText("")
				}
				else{
				}
			}
			return false
		})

		var startChallenge = function(){
			alertMessage("");
			challenging(true);
		 	setUpTimer();
		 	$("input[type=text]").focus();
		}

		var setUpTimer = function(){
			startTime = Date.now();
			time = 0;
			timeIntervalId = setInterval(function(){
				time += 500;
				if(time >= maxTime*1000 && index() > 0){
					window.clearInterval(timeIntervalId);
					window.alert("fail");
				}
				$(".timer-progress").css("width", ""+ 200*time/(maxTime*1000) + "px");
			}, 500)
		}

		function handleResult(result) {
			text = "Your score is " + result.score + ".";
			text += "This is " + String(result.score - result.previousScore) + " more than your previous score";
			console.log(text);
			alertMessage(text);
		}

		return{
			challenging: challenging,
			targetText: targetText,
			inputText: inputText,
			valid: valid,
			targetWords: targetWords,
			index: index,
			startChallenge: startChallenge,
			alertMessage: alertMessage
		}
	}
	ko.applyBindings(viewmodel())	
})