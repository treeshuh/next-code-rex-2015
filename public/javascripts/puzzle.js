/* Javascript for puzzle challenges */

$(document).ready(function(){
	$("#submit").on("click", function() {
		sendAnswer();
	});
	$('input').keydown(function(e){
	    if (e.keyCode == 13) {
	    	sendAnswer();
	    }
	});
})

function sendAnswer() {
	i = $("#input").val().trim();
	$("#input").val("");
	if (i) {
		$.ajax({
	        type: "POST",
	        url: "/submit",
	        data: {
	            challengeId: challengeId,
	            input: i
	        },
	        success: function(data) {
	            console.log(data.result)
	            handleResult(data.result);
	        }
	    })
	}
}

function handleResult(result) {
	if (result.correct) {
		alertSuccess("", result.message);
	} else {
		alertError("", result.message);
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