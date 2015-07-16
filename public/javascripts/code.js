/* Javascript for code challenges */

/* Stock messages */
const FINISHED = ["You've already achieved the maximum score for this challenge.",
    "<br> <br> <button class='btn btn-default' onclick=\"location.href='/challenges'\">Back to Challenges</button>"
];
const ACHIEVED_MAX = ["Congrats!",
    "You've achieved the maximum score for this challenge. <br> <br> <button type='button' class='btn btn-default' onclick=\"location.href='/challenges'\">Code on!</button>"
];

var editor;

$(document).ready(function() {

    var changingLanguage;
    var language;

    var PYTHON = {
        name: "python",
        ext: ".py", // file extension
        warn: "# DO NOT CHANGE FUNCTION SIGNATURE #\n", // line 1
        template: template["python"], // line 2
        flavor: "\n\t# your code here\n", // line 3
        contents: ""
    }
    var JAVA = {
        name: "java",
        ext: ".java", // file extension
        warn: "/* DO NOT CHANGE METHOD SIGNATURE */\n", // line 1
        template: template["java"], // line 2
        flavor: " {\n\t/* your code here */\n\n\n\n\n}", // line 3
        contents: ""
    }

    const supportedLanguages = {
        "python": PYTHON,
        "java": JAVA
    };

    /* Setup UI */
    language = /static/.test($("#editor").html()) ? JAVA : PYTHON;
    loadUtils();
    setupEditor();
    setupTask();
    updateScorebar();
    attachClicksToHover();
    $('[data-toggle="popover"]').popover();
    $(".btn-group").fadeIn();

    // Change language on button click
    $(".btn-lang").on("click", function() {
        changingLanguage = true;
        var name = $(this).attr("id");
        setLanguage(supportedLanguages[name]);
        $(".btn-lang").prop('disabled', false).removeClass("btn-warning");
        $(this).prop('disabled', true).addClass("btn-warning");
    })

    // Submit code to server
    $("#submit").on("click", function() {
        $(".progress").show();
        $(".alert").fadeOut();
        $("#submit").html("Compiling...");
        if (validate()) {
            setTimeout(function() {
                $("#submit").html("Testing...")
            }, 1000);
            setInterval(function() {
                $("#progress").css("width", $("#progress").css("width") * (1 + Math.random() * 0.4));
            }, 100);
            $.ajax({
                type: "POST",
                url: "/submit",
                data: {
                    challengeId: challengeId,
                    data: editor.getValue(),
                    ext: language.ext
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

    function setLanguage(newLanguage) {
        if (!(newLanguage.name in supportedLanguages)) {
            return;
        }
        if (language.name && newLanguage.name != language.name) {
            alertWarning("You've changed to " + newLanguage.name.toUpperCase() + ".", "Please note the different par score.")
        }
        $("#" + newLanguage.name).prop('disabled', true);
        // save contents of current language
        language.contents = editor.getValue();
        language = newLanguage;
        editor.getSession().setMode("ace/mode/" + language.name);
        editor.setValue(language.contents);
        $("#par").html(targetGolf[language.name]);
        updateScorebar();
        if (!language.contents) {
            editor.setValue(language.warn + language.template + language.flavor);
            editor.gotoLine(3);
            $("#examples").collapse("show");
        }
        changingLanguage = false;
    }

    function setupTask() {
        $("#statement").append(statement.replace(/\_([^\_]+)\_/g, "<v>$1</v>"));
        $("#task").collapse("show");
    }

    function setupEditor() {
        editor = ace.edit("editor");
        editor.setTheme("ace/theme/solarized_light");
        setLanguage(language);
        editor.setHighlightActiveLine(false);
        editor.$blockScrolling = Infinity;
        if (!previousScore) {
            editor.setValue(language.warn + language.template + language.flavor);
            editor.gotoLine(3);
            $("#examples").collapse("show");
        } else if (previousScore == maxScore) {
            alertSuccess(FINISHED[0], FINISHED[1]);
            editor.setReadOnly(true);
            $(".btn-group>button").prop('disabled', true);
        }
        $("#editor").show();
        updateCharCount();
        editor.getSession().on('change', function(e) {
            updateCharCount();
        });
    }

    function updateCharCount() {
        c = charcount(editor.getValue(), language.name);
        $("#golf-score").html(c);
        b = Math.min(maxBonus, Math.round(targetGolf[language.name] / c * maxBonus));
        $("#bonus-score").html("+" + b);
        if (b == maxBonus && previousScore == maxScore) {
            $("#bonus-score").addClass("max");
        } else {
            $("#bonus-score").removeClass();
        }
    }

    function validate() {
        v = editor.getValue();
        if (!/return\s+[^\s]+/.test(v)) {
            alertError("Error!", "Your program must include a <code>return</code> statement.")
            return false
        }
        if (v.indexOf(language.template) < 0) {
            alertError("Error!", "Invalid function signature.")
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
                alertSuccess(ACHIEVED_MAX[0], ACHIEVED_MAX[1]);
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
            if (result.error) {
                alertConsole("Compile error.", result.error)
            } else {
                alertError("Oops!", result.message || "Your submission failed to run. Check your syntax.")
            }
        }
    }

    function loadUtils() {
        files = ["readonly", "charcount", "sanitize"];
        for (filename in files) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = "/javascripts/utils/" + files[filename] + ".js";
            $('body').append(script);
        }
    }

});

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

function alertWarning(header, message) {
    $(".alert").fadeOut();
    warning = '<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
    warning += "<strong>" + header + "</strong>\t" + message + "</div>";
    $("#alerts").append(warning)
}

function alertConsole(header, message) {
    $("#alerts").append("<div class='alert'> <strong>" + header + "</strong>" + "<br> <pre>" + message + "</pre></div>");
}
