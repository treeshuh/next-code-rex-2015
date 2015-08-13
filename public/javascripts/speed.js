$(document).ready(function(){
	var viewmodel = function(){
		var maxTime = timeLimit;
		var startTime;
		var targetWords = targetString.replace(/\&\#x27;/g, "\'").split(" ");
		var index = ko.observable(0);
	 	var targetText = ko.observable(targetWords[0]);
		var inputText = ko.observable("");
		var challenging = ko.observable(false);
		var maxTimerWidth = $(".timer").width();
		var oneSegmentWidth = String(maxTimerWidth/targetWords.length) + "px";

		if (previousScore == maxScore) {
			alertSuccess("You have already completed this challenge.", "");
			$("#max-score").addClass("max");
		}

		var valid = ko.computed(function(){
			if (index() == targetWords.length - 1 && targetText() == inputText()) {
				$(".input-progress").animate({"width": maxTimerWidth});
				$(".timer-progress").stop();
				challenging(false);
				index(0);
				inputText("");
				targetText(targetWords[0]);
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
			        	handleResult(data.result);
			            $("#max-score").addClass("max");
			            alertSuccess("Congrats!", "You passed the speed challenge.")
			        }
			    })
				return true
			}
			else if (inputText()[inputText().length - 1] == " " && targetText() == inputText().substring(0, inputText().length-1)){
				//valid input
				index(index()+1);
				if (index() != targetWords.length){
					inputText("");
					targetText(targetWords[index()]);	
				}
				$(".input-progress").animate({"width": "+=" + oneSegmentWidth});
			} else if (targetText().indexOf(inputText()) < 0) {
				$("#input").addClass("invalid");
			} else {
				$("#input").removeClass("invalid");
			}
			return false
		})

		var startChallenge = function(){
			challenging(true);
			index(0);
			targetText(targetWords[0]);
			$(".timer-progress").css("width", "0");
		 	$(".input-progress").css("width", "0");
		 	$("input[type=text]").focus();
		 	setTimeout(setUpTimer, 750);
		}

		$('body').keydown(function(e){ 
		   if (e.keyCode == 32 && !challenging()) {
		   	e.preventDefault();
		   	startChallenge();
		   }
		});

		var setUpTimer = function(){
			startTime = Date.now();
			$(".timer-progress").animate({
				"width": "100%"
			}, maxTime*1000, "linear", function(){
				completionPercent = index()/targetWords.length;
				completionScore = Math.round((maxScore*0.75) * completionPercent);
				$.ajax({
			        type: "POST",
			        url: "/submit",
			        data: {
			            challengeId: challengeId,
			            data: {
			            	score: completionScore,
			            	completion: completionPercent,
			            	time: (Date.now()-startTime)/1000
			        	}
			    	},
			    	success: function(data) {
			    		handleResult(data.result)
			    	}
			    });
			    $(".alert").hide();
			    alertError("You ran out of time!", "You scored " + completionScore + " points. Press START to try again.");
				challenging(false);
			})
		}

		var handleResult = function(result) {
			if (result.score > previousScore) {
				$("#best-score").html(result.score);
				previousScore = result.score;
			}
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