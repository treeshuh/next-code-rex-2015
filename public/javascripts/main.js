/* Disable viewing of console when not in development mode (localhost) */

if (!/file|localhost/.test(location.href)) {
    console.log("%c WARNING: Please do not attempt anything sketchy. ",
        "color: #222; width: 100%; font-size: 42pt; padding-bottom: 10000pt; font-family: Consolas; background-image: -webkit-gradient( linear, left top, right top, color-stop(0, #E40303), color-stop(0.2, #FF8C00), color-stop(0.4, #FFED00), color-stop(0.6, #008026), color-stop(0.8, #004DFF), color-stop(1.0, #750787));");
    console = null;
}