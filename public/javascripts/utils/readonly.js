/* Safety measures for client-side coding interface */
// - prevents modification of method signature
// - prevents spam submissions over 50 lines
// - prevents paste/cut

$(document).ready(function() {

    editor.keyBinding.addKeyboardHandler({
        handleKeyboard: function(data, hash, keyString, keyCode, event) {
            if (hash === -1 || (keyCode <= 40 && keyCode >= 37)) return false;
            i = editor.getSelectionRange();
            if (i.start.row < 2 || i.end.row < 2) {
                if (keyCode != 13) {
                    $(".alert").hide();
                    alertError("DO NOT modify the function signature.", "");
                    return {
                        command: "null",
                        passEvent: false
                    };
                }
            }
            if (i.end.row > 50) {
                $(".alert").fadeOut();
                alertError("Woah there.", "Watch what you're trying to do.");
                editor.gotoLine(3);
                if (!previousScore) {
                    location.reload();
                }
                return {
                    command: "null",
                    passEvent: false
                };
            }
        }
    });

    before(editor, 'onPaste', preventCopyPaste);
    before(editor, 'onCut', preventCopyPaste);

    function before(obj, method, wrapper) {
        var orig = obj[method];
        obj[method] = function() {
            var args = Array.prototype.slice.call(arguments);
            return wrapper.apply(this, function() {
                return orig.apply(obj, origArgs);
            }, args);
        }

        return obj[method];
    }

    function preventCopyPaste(next) {
        return;
        next();
    }

})
