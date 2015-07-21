$(document).ready(function(){
	var viewmodel = function(){
		var maxTime = timeLimit;
		var startTime;
		var targetWords = targetString.split(" ");
		var index = ko.observable(0);
	 	var targetText = ko.observable(targetWords[0]);
		var inputText = ko.observable("");
		var challenging = ko.observable(false);
		var maxTimerWidth = $(".timer").width();
		var oneSegmentWidth = String(maxTimerWidth/targetWords.length) + "px";

		if (previousScore) {
			alertSuccess("You have already completed this challenge.", "");
			$("#max-score").addClass("max");
		}

		var valid = ko.computed(function(){
			if (index() == targetWords.length - 1 && targetText() == inputText()) {
				$(".input-progress").animate({"width": maxTimerWidth});
				$(".timer-progress").stop();
				challenging(false);
				index(0);
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
			            $("#max-score").addClass("max");
			            alertSuccess("Success!", "You passed the speed challenge.")
			        }
			    })
				return true
			}
			else if (inputText()[inputText().length - 1] == " " && targetText() == inputText().substring(0, inputText().length-1)){
				//valid input
				index(index()+1);
				$(".input-progress").animate({"width": "+=" + oneSegmentWidth});
				if (index() != targetWords.length){
					targetText(targetWords[index()]);	
					inputText("")
				}
			}
			return false
		})

		var startChallenge = function(){
			challenging(true);
		 	setUpTimer();
		 	$("input[type=text]").focus();
		 	$(".timer-progress").css("width", "0");
		 	$(".input-progress").css("width", "0");
		}

		var setUpTimer = function(){
			startTime = Date.now();
			$(".timer-progress").animate({
				"width": "100%"
			}, maxTime*1000, "linear", function(){
				alertError("You ran out of time!", "Press START to try again.");
				index(0);
				challenging(false);
			})
		}

		return{
			challenging: challenging,
			targetText: targetText,
			inputText: inputText,
			valid: valid,
			targetWords: targetWords,
			index: index,
			startChallenge: startChallenge,
		}
	}
	ko.applyBindings(viewmodel())	
})

function alertError(header, message) {
    error = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
    error += "<strong>" + header + "</strong>\t" + message + "</div>";
    $("#alerts").append(error)
}

function alertSuccess(header, message) {
    success = '<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
    success += "<strong>" + header + "</strong>\t" + message + "</div>";
    $("#alerts").append(success)
}