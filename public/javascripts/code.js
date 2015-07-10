/*Javascript for code challenges*/

var language = "python";
var warning = "##### DO NOT CHANGE FUNCTION NAME #####\n";
var flavor = "\n\t# your code here";
var editor;

$(document).ready(function() {
	editor = ace.edit("editor");
	editor.setTheme("ace/theme/github");
	editor.getSession().setMode("ace/mode/" + language);
	if (!previousScore) {
		editor.setValue(warning + template + flavor)
	}
	$("#editor").show();
	editor.gotoLine(2);
	$("#submit").fadeIn();
});



$("#submit").on("click", function(){
	$.ajax({
		type: "POST",
		url: "/submit",
		data: {challengeId: challengeId, data: editor.getValue()},
		success: function(data) {
			console.log(data.result)
			handleResult(data.result)
		}
	})
})

function handleResult(result) {
	$(".alert").fadeOut();
	if (result.success) {
		if (result.achievedMaxScore) {
			alertSuccess("Congrats!", "You've achieved the maximum score for this challenge. Code on!")
		} else if (result.improved) {
			alertSuccess("Success", "You achieved a score of " + result.score + " out of a possible " + maxScore
			 + ". <br> Try shortening your code to earn more bonus points!");
		} else {
			alertSuccess("Success", "However, you did not improve on your previous score of: " + result.previousScore + ".");
		}
	} else {
		alertError("Oops!", result.message || "Your submission failed to run. Check your syntax.")
	}
}

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