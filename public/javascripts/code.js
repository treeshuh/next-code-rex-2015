/* Javascript for code challenges */

var language = "python";
var warning = "# DO NOT CHANGE FUNCTION NAME #\n";
var flavor = "\n\t# your code here";
var editor;

$(document).ready(function() {
    setupEditor();
    updateScorebar();
    attachClicksToHover();
    $('[data-toggle="popover"]').popover();
    $("#submit").fadeIn();
});

$("#submit").on("click", function() {
    $(".progress").show();
    $(".alert").fadeOut();
    $("#submit").html("Compiling...");
    setTimeout(function() {
        $("#submit").html("Testing...")
    }, 1000)
    if (validate()) {
        setInterval(function() {
            $("#progress").css("width", $("#progress").css("width") * (1 + Math.random() * 0.4));
        }, 100);
        $.ajax({
            type: "POST",
            url: "/submit",
            data: {
                challengeId: challengeId,
                data: editor.getValue()
            },
            success: function(data) {
                if (data.result.success) {
                    $("#progress").addClass("progress-bar-success");
                } else {
                    $("#progress").addClass("progress-bar-danger");
                }
                $("#progress").css("width", "100%");
                setTimeout(function() {
                    $(".progress").fadeOut(500, function() {
                        $("#progress").css("width", "10%");
                        $("#progress").removeClass("progress-bar-success");
                        $("#progress").removeClass("progress-bar-danger");
                    });
                    $("#submit").html("Submit");
                    handleResult(data.result);
                }, 500);
            }
        })
    } else {
        $("#submit").html("Submit");
        $(".progress").hide();
    }
})

function attachClicksToHover() {
    $('#scorebar>ul>li').hover(function() {
        $(this).click();
    })
}

function updateScorebar() {
    if (previousScore) {
        $(".stat-num").removeClass("incomplete");
        $("#base-score").removeClass().addClass("max");
        if (previousScore == maxScore) {
            $("#bonus-score").removeClass().addClass("max");
        }
    } else {
        $(".stat-num").addClass("incomplete");
    }
}

function setupEditor() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/solarized_light");
    editor.getSession().setMode("ace/mode/" + language);
    editor.setHighlightActiveLine(false);
    $("#task").collapse("show");
    if (!previousScore) {
        editor.setValue(warning + template + flavor);
        editor.gotoLine(3);
        $("#examples").collapse("show");
    } else if (previousScore == maxScore) {
        alertSuccess("", "You've already achieved the maximum score for this challenge.");
        editor.setReadOnly(true);
        $("#editor").addClass("complete");
        $(".ace_gutter").addClass("complete");
        $("#submit").prop('disabled', true);
    }
    $("#editor").show();
    updateCharCount();
    editor.getSession().on('change', function(e) {
        updateCharCount();
    });
}

function updateCharCount() {
    c = charcount(editor.getValue());
    $("#golf-score").html(c);
    b = Math.min(maxBonus, Math.round(targetGolf / c * maxBonus));
    $("#bonus-score").html("+" + b);
    if (b == maxBonus && previousScore) {
        $("#bonus-score").addClass("max");
    } else {
        $("#bonus-score").removeClass();
    }
}

function validate() {
    v = editor.getValue();
    if (!/return\s+[\w\d]+/.test(v)) {
        alertError("Error!", "Your program must include a <code>return</code> statement.")
        return false
    }
    if (v.indexOf(template) < 0) {
        alertError("Error!", "Invalid function name.")
        return false
    }
    sanitize = check(v)
    if (!sanitize[0]) {
        alertError("Please don't try to crash our server.", sanitize[1])
        return false
    }
    return true
}

function handleResult(result) {
    $(".alert").fadeOut();
    if (result.success) {
        if (result.achievedMaxScore) {
            alertSuccess("Congrats!", "You've achieved the maximum score for this challenge. Code on!");
            $("#team-score").html(result.score)
            previousScore = result.score
            updateScorebar();
        } else if (result.improved) {
            alertSuccess("Success.", "You achieved a score of " + result.score + " out of a possible " + maxScore + ". <br> Try shortening your code to earn more bonus points!");
            $("#team-score").html(result.score)
            previousScore = result.score
            updateScorebar();
        } else {
            alertSuccess("Your submission was successful.", "However, you did not improve on your previous score of " + result.previousScore + ".");
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