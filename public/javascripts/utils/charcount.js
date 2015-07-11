/* Client-side character count for Code Golf */

const identifiers = new RegExp("[A-Za-z0-9_]+", "g");
const whitespace = new RegExp("\\t+|\\s+", "g");
const comments = new RegExp("#.*(\\n|\\r|$)", "g");
const func = new RegExp("def\\s+[A-Za-z0-9_]+\\([A-Za-z0-9-\\,\\s]+\\):");

function charcount(s) {

    s = s.replace(comments, "");
    s = s.replace(func, "");

    charCount = 0

    while (true) {
        c = countLiteral(s)
        if (c[0] == 0) {
            break
        }
        charCount += c[0]
        s = c[1]
    }

    s = s.replace(identifiers, "?");
    s = s.replace(whitespace, "");

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