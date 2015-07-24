var logos = [];
const ringNames = ["speed", "puzzle", "code"];

for (var i in ringNames) {
    var img = new Image();
    img.src = "/images/" + ringNames[i] + "_color.png";
    logos[i] = img;
}

const opacityFill = "0.85";
const rings = {
    "speed": "rgba(0, 188, 140, " + opacityFill + ")",
    "code": "rgba(55, 90, 142, " + opacityFill + ")",
    "puzzle": "rgba(231, 76, 60, " + opacityFill + ")"
};
const opacities = {
    "speed": "0.45",
    "puzzle": "0.55",
    "code": "0.55"
}

var isOpera = /opr/i.test(navigator.userAgent);
var isChrome = !!window.chrome;
var isSafari = /mac.*safari/i.test(navigator.userAgent) && !isChrome;
var hardcode = !(isOpera || isSafari);

if (hardcode) {
    $(".ring-set").addClass("hardcode");
}

var globalMaxScore;

$(document).ready(function() {

    var windowWidth = $(window).width();
    var ringWidth = Math.round(windowWidth > 1280 ? 125 : windowWidth > 800 ? windowWidth / 12 : 60);

    var ringOpts = {
        readOnly: true,
        thickness: 0.18,
        displayInput: false,
        width: ringWidth,
        height: ringWidth
    }

    function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length - size);
    }

    if (username === "scoreboard") {
        $(".stats-item").addClass("me").css("opacity", "1.0");
    }

    globalMaxScore = $($(".team-score")[0]).html();

    var populateScoreboard = function() {
        var previousScore = globalMaxScore;
        var rank = 1;
        $.each($(".ring-set"), function(index, value) {
            var myScore = $($(".team-score")[index]).html();
            if (myScore == globalMaxScore) {
                $($(this).parent()).addClass("rank-1");
            }
            if (myScore != previousScore) {
                rank++;
                previousScore = myScore;
            }
            $($(".team-rank")[index]).html(rank + " ");
            var id = $(this).attr("id");
            if (id.indexOf(username) > -1) {
                $($(this).parent()).addClass("me");
            }
            for (var i in rings) {
                ringOpts.fgColor = rings[i]
                ringOpts.bgColor = ringOpts.fgColor.replace(opacityFill, opacities[i]);
                ringOpts.max = maxScores[i];
                var me = $("#" + id + ">div>.ring-" + i);
                me.attr("value", parseInt(me.attr("value")) ? Math.ceil(me.attr("value")*0.99) : Math.round(ringOpts.max*0.01));
                me.knob(ringOpts);
            }
            var fudge = windowWidth > 961 ? ringWidth / 20 : 0;
            for (var i in ringNames) {
                var category = ringNames[i];
                var achievedMax = ($("#" + id + ">div>div>.ring-" + category).attr("value") >= 0.99*maxScores[category]);
                if (achievedMax) {
                    var canvas = $("#" + id + ">div>div>canvas")[i];
                    var context = canvas.getContext("2d");
                    h = context.canvas.height;
                    w = context.canvas.width;
                    var logoHeight = h / 3;
                    img = logos[i];
                    ratio = img.width / img.height
                    logoWidth = logoHeight * ratio;
                    context.drawImage(img, w / 2 - logoWidth / 2 + (i - 1) * fudge, h / 2 - logoHeight / 2, logoWidth, logoWidth);
                }
            }
            if (username == "scoreboard" || /challenges/.test(referer)) {
                setTimeout(function() {
                    $("#" + id.replace("ring", "stats")).hide().css("visibility", "visible").fadeIn(750);
                }, 100);
            } else {
                $("#" + id.replace("ring", "stats")).css("visibility", "visible");
            }
        });
    }

    setTimeout(populateScoreboard, 100);

    function highlightLastSolve() {
        if (username == "scoreboard") {
            scoreUpdate.child("last").once("value", function(data) {
                if (data.val() && data.val().user) {
                    var lastSolveUser = data.val().user.username;
                    $("#stats-" + lastSolveUser).addClass("highlight");
                    setTimeout(function() {
                        $("#stats-" + lastSolveUser).find(".shine-effect").animate({
                            opacity: 0
                        }, 750);
                    }, 1500);
                }
            });
        }
    }

    setTimeout(highlightLastSolve, 1500);

    $.fn.scrollView = function() {
        return this.each(function() {
            $('html, body').animate({
                scrollTop: $(this).offset().top - 15
            }, 1000);
        });
    }

    var scrollToMe = function() {
        var me = $('#stats-' + username);
        me.scrollView();
        me.animate({
            "opacity": 1.0
        }, function() {
            $('#stats-' + username).addClass("highlight");
            setTimeout(function() {
                $('#stats-' + username).find(".shine-effect").animate({
                    opacity: 0
                }, 750, function(){
                    $('#stats-' + username).removeClass("highlight");
                    if ($(window).width() < 961) {
                        $(".stats-item").addClass("shiny");
                        $(".stats-item").on("mouseenter", function(){
                            $(this).removeClass("shiny")
                        });
                    }
                });
            }, 1500);
        });
    }

    setTimeout(scrollToMe, 2500);
    $(".greeting").on("click", scrollToMe);

});

var firstLoad = true;
var scoreUpdate = new Firebase("https://next-code-rex-2015.firebaseio.com/solves");
if (username === "scoreboard") {
    scoreUpdate.on("value", function(data) {
        if (!firstLoad) {
            $(".stats-item").fadeOut(400, function() {
                location.reload(true);
            });
        }
        firstLoad = false;
    });
}
