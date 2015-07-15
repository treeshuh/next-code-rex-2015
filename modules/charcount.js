/* Server-side character count for Code Golf */
// Support languages: Java, Python
// Does not count comments or whitespace (space, tab, newline)
// Does not count the main method signature
// For Java, a curly brace set {...} counts as only 1 golf score

const identifiers = new RegExp("[A-Za-z0-9_]+", "g");
const whitespace = new RegExp("\\t+|\\s+", "g");
const comments = {
    "python": new RegExp("#.*(\\n|\\r|$)", "g"),
    "java": new RegExp("\\/\\*.*?\\*\\/|\\/(\\/|\\*).*?(\\n|\\r|$)", "g")
}
const mainFunc = {
    "python": new RegExp("def\\s+[\\w\\d_]+\\([\\w\\d\\_\\,\\s]+\\):"),
    "java": new RegExp("(private|public|protected)?\\s*(final)?\\s*(static)?\\s*(int|long|boolean|void|float|double|String)\\s*[\\w\\d_]+\\(.*?\\)\\s*\\{")
}
const ext = {
    ".py": "python",
    ".java": "java"
}

exports.charcount = function(s, lang) {
    if (/\./.test(lang)) {
        lang = ext[lang];
    }
    s = s.replace(comments[lang], "");
    s = s.replace(mainFunc[lang], "");

    charCount = 0

    while (true) {
        c = countLiteral(s)
        if (c[0] == 0) {
            break
        }
        charCount += c[0]
        s = c[1]
    }

    s = s.replace(/break(\;)?$/g, "");
    s = s.replace(identifiers, "?");
    s = s.replace(whitespace, "");
    // if java, only count curly brace set once
    if (lang == "java") {
        s = s.replace(/\}/g, "");
    }

    return s.length + charCount
}

function countLiteral(s) {
    p = new RegExp("((''').*?('''))|(\".*?\")|('[^']*?')")
    match = p.exec(s)
    if (match) {
        return [match[0].length, s.substring(0, match.index) + s.substring(match.index + match[0].length)]
    }
    return [0, s]
}