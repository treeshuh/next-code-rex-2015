var logos = [];
const ringNames = ["speed", "code", "puzzle"];

for (var i in ringNames) {
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

var ringOpts = {
    readOnly: true,
    thickness: 0.18,
    displayInput: false,
    width: 125,
    height: 125
}

var globalMaxScore;

$(document).ready(function() {

    function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length - size);
    }

    globalMaxScore = $($(".team-score")[0]).html();

    setTimeout(function() {
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
                ringOpts.bgColor = ringOpts.fgColor.replace(opacityFill, opacityEmpty);
                ringOpts.max = maxScores[i];
                var me = $("#" + id + ">div>.ring-" + i);
                me.attr("value", parseInt(me.attr("value")) ? String(me.attr("value")) : String(Math.round(ringOpts.max / 100)));
                me.knob(ringOpts);
            }
            var fudge = 7.5;
            for (var i in ringNames) {
                var category = ringNames[i];
                var achievedMax = ($("#" + id + ">div>div>.ring-" + category).attr("value") == maxScores[category]);
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
            setTimeout(function() {
                $("#" + id.replace("ring", "stats")).hide().css("visibility", "visible").fadeIn(750);
            }, 100);
        });

    }, 100);

    $.fn.scrollView = function() {
        return this.each(function() {
            $('html, body').animate({
                scrollTop: $(this).offset().top
            }, 1000);
        });
    }

    setTimeout(function() {
        var me = $('#stats-' + username);
        me.scrollView();
        me.animate({"opacity": 1.0})
    }, 2000);

});
