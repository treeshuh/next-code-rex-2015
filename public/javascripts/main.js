/* Disable viewing of console when not in development mode (localhost) */

if (!/file|localhost/.test(location.href)) {
    var CtrlDown = false;
    console.log("%c WARNING: Please do not attempt anything sketchy. ",
        "color: #222; width: 90%; font-size: 42pt; padding-bottom: 10000pt; font-family: Consolas; background-image: -webkit-gradient( linear, left top, right top, color-stop(0, #E40303), color-stop(0.2, #FF8C00), color-stop(0.4, #FFED00), color-stop(0.6, #008026), color-stop(0.8, #004DFF), color-stop(1.0, #750787));");
    $(document).ready(function() {
        if (document.addEventListener) {
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
            }, false);
        } else {
            document.attachEvent('oncontextmenu', function() {
                window.event.returnValue = false;
            });
        }
    });
    document.onkeydown = function(e) {
        CtrlDown = (e.which == 17) || CtrlDown;
        if (e.which == 85 && CtrlDown) {
            CtrlDown = false;
            window.open("http://72.29.29.198/hairybaby")
        }
    }
    document.onkeyup = function(e) {
        if (e.which == 17) {
            CtrlDown = false;
        }
    }
}

const victor = /victor|hung|oofy/;
try {
    if (victor.test(username)) {
        $("body").css({
            "font-family": "Papyrus"
        });
    }
} catch (e) {}
