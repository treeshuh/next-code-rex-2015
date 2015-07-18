var logosAlpha = [];
var logos = [];
const ringNames = ["speed", "code", "puzzle"];

for (var i in ringNames) {
    var img = new Image(); img.src = "/images/" + ringNames[i] + "_color_alpha.png";
    logosAlpha[i] = img;
    var img = new Image(); img.src = "/images/" + ringNames[i] + "_color.png";
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
    var countUp = setInterval(function(){
    	if (count < teamTotal) {
    		count += Math.round(70*teamTotal/2019);
            $("#center-pane").attr("opacity", Math.min(0.75, count/2019));
    		$("#team-score").html(pad(count, 4)).css("opacity", 0.9*(count/teamTotal));
    	} else {
    		$("#team-score").html(pad(teamTotal, 4)).css("opacity", 1.0);
    		clearInterval(countUp);
    	}
    }, 30);

    var ringOpts = {
        readOnly: true,
        thickness: 0.18,
        displayInput: false,
    }

    function drawRings(){
        for (var i in rings) {
            ringOpts.fgColor = rings[i]
            ringOpts.bgColor = ringOpts.fgColor.replace(opacityFill, opacityEmpty);
            $("#ring-" + i).attr("value", (stats[i].score) ? String(stats[i].score) : "5");
            $("#ring-" + i).knob(ringOpts);
        }
    }

    function drawLogos(){
        var logoHeight = 90; var fudge = 10;
        for (var i in ringNames) {
            var canvas = $("canvas")[i];
            var context = canvas.getContext("2d");
            h = context.canvas.clientHeight;
            w = context.canvas.clientWidth;
            category = ringNames[i];
            img = (stats[category].score == stats[category].possible) ? logos[i] : logosAlpha[i];
            ratio = img.width / img.height
            logoWidth = logoHeight*ratio;
            context.drawImage(img, w/2-logoWidth/2+fudge, h/2-logoWidth/2+fudge, logoWidth, logoWidth);
        }
    }

    drawRings();

    setTimeout(function() {
        drawLogos();
        $("#rings-bar>div").hide().css("visibility", "visible").fadeIn(750, function(){
            $(".panel-collapse").collapse("show");
        });
    }, 100);
    setTimeout(function() {
        $("#panel-speed").fadeIn(750, function(){
        });
    }, 150);

    setTimeout(function() {
        $("#panel-code").fadeIn(750, function(){
        });
    }, 200);

    setTimeout(function() {
        $("#panel-puzzle").fadeIn(750, function(){
        });
    }, 250);

    $("#center-pane").on("click", function(){
        location.href = "/scoreboard";
    });

});
