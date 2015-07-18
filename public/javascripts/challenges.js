var logosAlpha = [];
var logos = [];
const ringNames = ["speed", "code", "puzzle"];

for (var i in ringNames) {
    var img = new Image();
    img.src = "/images/" + ringNames[i] + "_color_alpha.png";
    logosAlpha[i] = img;
    var img = new Image();
    img.src = "/images/" + ringNames[i] + "_color.png";
    logos[i] = img;
}

const opacityFill = "1.0";
const opacityEmpty = "0.5";
const rings = {
    "speed": "rgba(0, 188, 140, " + opacityFill + ")",
    "code": "rgba(55, 90, 127, " + opacityFill + ")",
    "puzzle": "rgba(231, 76, 60, " + opacityFill + ")"
};

$(document).ready(function() {

    function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length - size);
    }

    var count = 0;
    var countUp = setInterval(function() {
        if (count < teamTotal) {
            count += Math.round(70 * teamTotal / 2019);
            $("#team-score").html(pad(count, 4)).css("opacity", 0.9 * (count / teamTotal));
        } else {
            $("#team-score").html(pad(teamTotal, 4)).css("opacity", 1.0).css("font-size", "120px");
            clearInterval(countUp);
        }
    }, 30);

    var ringOpts = {
        readOnly: true,
        thickness: 0.18,
        displayInput: false,
    }

    function drawRings() {
        for (var i in rings) {
            ringOpts.fgColor = rings[i]
            ringOpts.bgColor = ringOpts.fgColor.replace(opacityFill, opacityEmpty);
            $("#ring-" + i).attr("value", (stats[i].score) ? String(stats[i].score) : String(Math.round(stats[i].possible / 100)));
            $("#ring-" + i).knob(ringOpts);
        }
    }

    function drawLogos() {
        for (var i in ringNames) {
            var canvas = $("canvas")[i];
            var context = canvas.getContext("2d");
            h = context.canvas.height;
            w = context.canvas.width;
            var logoHeight = 0.4 * h;
            category = ringNames[i];
            img = (stats[category].score == stats[category].possible) ? logos[i] : logosAlpha[i];
            ratio = img.width / img.height
            logoWidth = logoHeight * ratio;
            context.drawImage(img, w / 2 - logoWidth / 2, h / 2 - logoWidth / 2, logoWidth, logoWidth);
        }
    }

    drawRings();

    setTimeout(function() {
        drawLogos();
        $("#rings-bar>div").hide().css("visibility", "visible").fadeIn(750, function() {
            $(".panel-collapse").collapse("show");
        });
    }, 100);
    setTimeout(function() {
        $("#panel-speed").fadeIn(750, function() {});
    }, 150);

    setTimeout(function() {
        $("#panel-code").fadeIn(750, function() {});
    }, 200);

    setTimeout(function() {
        $("#panel-puzzle").fadeIn(750, function() {});
    }, 250);

    $("#center-pane").on("click", function() {
        location.href = "/scoreboard";
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
    }).on("mouseleave", function(e) {

    });

});
