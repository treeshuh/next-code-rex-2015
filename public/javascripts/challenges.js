var logosAlpha = [];
var logos = [];
const ringNames = ["speed", "puzzle", "code"];

for (var i in ringNames) {
    var img = new Image();
    img.src = "/images/" + ringNames[i] + "_color_alpha.png";
    logosAlpha[i] = img;
    var img = new Image();
    img.src = "/images/" + ringNames[i] + "_color.png";
    logos[i] = img;
}

const opacityFill = "0.85";
const opacityEmpty = "0.55";
const rings = {
    "speed": "rgba(0, 188, 140, " + opacityFill + ")",
    "puzzle": "rgba(231, 76, 60, " + opacityFill + ")",
    "code": "rgba(55, 90, 142, " + opacityFill + ")"
};

$(document).ready(function() {

    function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length - size);
    }

    function startCountUp() {
        var count = 0;
        var countUp = setInterval(function() {
            if (count < teamTotal) {
                count += Math.round(130 * teamTotal / 2019);
                var fraction = (count / teamTotal);
                $("#team-score").html(pad(count, 4)).css("opacity", 0.70 * fraction + 0.25).css("font-size", 100 + 20 * fraction + "px");
            } else {
                $("#team-score").html(pad(teamTotal, 4)).css({
                    "opacity": 1.0,
                    "font-size": "120px"
                });
                $("#total-score").fadeIn(400);
                clearInterval(countUp);
            }
        }, 60);
    }

    if (!/challenges|scoreboard/.test(referer)) {
        setTimeout(startCountUp, 150);
        $("#center-pane").fadeIn(600);
    } else {
        $("#team-score").html(pad(teamTotal, 4)).css({
            "opacity": 1.0,
            "font-size": "120px"
        });
        $("#center-pane").show();
        $("#total-score").show();
    }

    var ringWidth = Math.min(200, Math.round($(window).width() / 6));
    var ringOpts = {
        readOnly: true,
        thickness: 0.18,
        displayInput: false,
        width: ringWidth,
        height: ringWidth
    }

    function drawRings() {
        for (var i in rings) {
            ringOpts.fgColor = rings[i]
            ringOpts.bgColor = ringOpts.fgColor.replace(opacityFill, opacityEmpty);
            $("#ring-" + i).attr("value", (stats[i].score) ? String(stats[i].score) * .99 : String(Math.round(stats[i].possible / 100)));
            $("#ring-" + i).knob(ringOpts);
        }
    }

    function drawLogos() {
        for (var i in ringNames) {
            var category = ringNames[i];
            var div = $(".ring-" + category);
            var src = (stats[category].score == stats[category].possible) ? logos[i].src : logosAlpha[i].src;
            div.css("background-image", "url('" + src + "')");
        }
    }

    drawRings();

    if (!/challenge|scoreboard/.test(referer)) {
        animateChallenges();
    } else {
        displayChallenges();
    }

    function animateChallenges() {
        setTimeout(function() {
            drawLogos();
            $("#rings-bar").hide().css("visibility", "visible").fadeIn(1000);
        }, 100);
        setTimeout(function() {
            $("#panel-speed").fadeIn(600);
        }, 150);
        setTimeout(function() {
            $("#panel-puzzle").fadeIn(550);
        }, 300);
        setTimeout(function() {
            $("#panel-code").fadeIn(500, function() {
                $(".panel-slide").slideDown(500);
                $("#left-pane").animate({
                    "height": "auto",
                    "min-height": "100%"
                });
            });
        }, 450);
    }

    function displayChallenges() {
        setTimeout(function() {
            drawLogos();
            $("#rings-bar").hide().css("visibility", "visible").fadeIn(500);
        }, 100);
        $("#left-pane").css({
            "height": "auto",
            "min-height": "100%"
        });
        $(".panel").show();
        $(".panel-slide").slideDown();
    }

    $("#center-pane").on("click", showScoreboard);

    function showScoreboard() {
        $("#scoreboard-frame").attr("src", "/scoreboard");
        $("#scoreboard-tab").fadeOut(1000);
        $("#center-pane").animate({
            opacity: 0
        }, 1500, function() {
            $("#center-pane").remove();
            $("#scoreboard-frame").contents().find(".header").hide();
            $("#scoreboard-frame").contents().find("h2").html("<strong>CURRENT RANKINGS</strong>").css("font-size", "48px");
            $("#scoreboard-frame").contents().find(".stats-item").css("border", "none");
            $("#scoreboard-frame").animate({
                opacity: 1
            }, 600);
        });
    }

    $("div.ring").on("mouseenter", function() {
        var category = $(this).attr("class").split("-")[1];
        $("#" + category).slideDown("slow");
    }).on("click", function() {
        var category = $(this).attr("class").split("-")[1];
        $(".panel-slide").slideUp(400, function() {
            $("#" + category).slideDown();
        })
    });

    $("canvas").on("mouseenter", function(e) {
        var context = $(this)[0].getContext("2d");
        h = context.canvas.height;
        w = context.canvas.width;
        fontSize = h / 8;
        fontWidth = fontSize / 5.2;
        var category = $($($(this).parent()).parent()).attr("class").split("-")[1];
        context.font = fontSize + "px agencyFB";
        context.fillStyle = rings[category];
        var score = stats[category].score;
        context.fillText(stats[category].score, w / 2 - String(score).length * fontWidth, h - fontSize * 1.2);
    });

    $(".panel-heading").on("click", function() {
        var me = $(this);
        var panel = $($(me.parent()).children()[1]);
        toggleSlide(panel);
    });

    function toggleSlide(elem) {
        if (elem.css("display") == "none") {
            elem.slideDown("slow");
        } else {
            elem.slideUp("slow");
        }
    }

    function slideDownPanel(elem) {
        elem.slideDown();
    }

});
