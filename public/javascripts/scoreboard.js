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

var ringOpts = {
    readOnly: true,
    thickness: 0.18,
    displayInput: false
}

$(document).ready(function() {

    function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length - size);
    }

    setTimeout(function() {

        $.each($(".ring-set"), function() {
            var id = $(this).attr("id");
            for (var i in rings) {
                ringOpts.fgColor = rings[i]
                ringOpts.bgColor = ringOpts.fgColor.replace(opacityFill, opacityEmpty);
                ringOpts.max = maxScores[i];
                //console.log($(id+">div>.ring-"+i))
                var me = $("#" + id + ">div>.ring-" + i);
                me.attr("value", parseInt(me.attr("value")) ? String(me.attr("value")) : String(Math.round(ringOpts.max / 100)));
                me.knob(ringOpts);
            }
            var logoHeight = 65;
            fudge = 10;
            for (var i in ringNames) {
                var category = ringNames[i];
                var achievedMax = ($("#" + id + ">div>div>.ring-" + category).attr("value") == maxScores[category]);
                if (achievedMax) {
                    var canvas = $("#" + id + ">div>div>canvas")[i];
                    var context = canvas.getContext("2d");
                    h = 200 || context.canvas.clientHeight; // hard code T.T
                    w = 200 || context.canvas.clientWidth;
                    img = logos[i];
                    ratio = img.width / img.height
                    logoWidth = logoHeight * ratio;
                    context.drawImage(img, w / 2 - logoWidth / 2 + (i == 0 ? 0 : fudge), h / 2 - logoHeight / 2 + fudge, logoWidth, logoWidth);
                }
            }
            $("#" + id.replace("ring", "stats")).hide().css("visibility", "visible").fadeIn(750);
        });
    }, 250);

});
