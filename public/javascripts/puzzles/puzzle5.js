/** Color Puzzle **/
$(document).ready(function() {
    const rules = [
       "Provide colorful answers to fill in the blanks and match the clues!"
    ];

    const colors = {
        "GRAY": "#7f8c8d",
        "IVORY": "#FFFFF0",
        "ROSE": "#F4C2C2",
        "RED": "#e74c3c",
        "CRIMSON": "#c0392b",
        "CORAL": "#FF7F50",
        "ORANGE": "#FFA500",
        "GOLD": "#FFD700",
        "BRONZE": "#965a38",
        "YELLOW": "#FFFF00",
        "OLIVE": "#808000",
        "TEAL": "#16a085",
        "AQUA": "#00CCFB",
        "CYAN": "00FFFF",
        "BLUE": "#00008b",
        "VIOLET": "#91219E",
        "FUCHSIA": "#FF00FF",
        "MAGENTA": "#FF0090"
    };

    function getLabel(code) {
        for (var i in colors) {
            if (colors[i] == code) {
                return i;
            }
        }
    } 

    const label = {"VIOLET": true, "BRONZE": true, "AQUA": true, "CRIMSON": true, "RED": true, "ROSE": true}

    const colorCodes = [];
    for (i in colors) {
        colorCodes.push(colors[i]);
    }

    const colorsAndLetterIndex = {
        "GRAY": 2,
        "IVORY": null,
        "ROSE": 2,
        "RED": 1,
        "CRIMSON": 0,
        "CORAL": 0,
        "ORANGE": 0,
        "GOLD": 3,
        "BRONZE": 3,
        "YELLOW": 4,
        "OLIVE": 2,
        "TEAL": 1,
        "AQUA": 0,
        "CYAN": 0,
        "BLUE": 2,
        "VIOLET": 3,
        "FUCHSIA": 3,
        "MAGENTA": 4
    };

    const puzzleLines = [
        {answer: "TEAL", pun: "4 or no 4?", clue: "gameshow"},
        {answer: "AQUA", pun: "4ing to you", clue: "orianthi"},
        {answer: "CRIMSON", pun: "sour 7 cheese", clue: "chip dip"},
        {answer: "FUCHSIA", pun: "con7nism", clue: "asian philosophy"},
        {answer: "RED", pun: "3 my mind", clue: "mentalism"},
        {answer: "GOLD", pun: "murdered in 4 blood", clue: "no feeling"},
        {answer: "GRAY", pun: "4t gatsby", clue: "fitzgerald"},
        {answer: "CYAN", pun: "4tific theory", clue: "testable hypothesis"},
        {answer: "YELLOW", pun: "6 world!", clue: "first program"},
        {answer: "BRONZE", pun: "brains over 6", clue: "pen is mightier"},
        {answer: "CORAL", pun: "5ation is not causation", clue: "coincidence"},
        {answer: "VIOLET", pun: "6 the law", clue: "criminal activity"},
        {answer: "BLUE", pun: "4 me away", clue: "mindboggling"},
        {answer: "ROSE", pun: "4 to the occasion", clue: "met a challenge"},
        {answer: "OLIVE", pun: "5 you", clue: "<3"},
        {answer: "ORANGE", pun: "6inal idea", clue: "patentable"},
        {answer: "MAGENTA", pun: "i 7leman", clue: "chivalrous"}
    ];

    const unicodeHexCircleLetters = {
        A: "&#x24b6;",
        B: "&#x24b7;",
        C: "&#x24b8;",
        D: "&#x24b9;", 
        E: "&#x24ba;",
        F: "&#x24bb;",
        G: "&#x24bc;",
        H: "&#x24bd;",
        I: "&#x24be;",
        J: "&#x24bf;", 
        K: "&#x24c0;",
        L: "&#x24c1;",
        M: "&#x24c2;",
        N: "&#x24c3;",
        O: "&#x24c4;",
        P: "&#x24c5;", 
        Q: "&#x24c6;",
        R: "&#x24c7;",
        S: "&#x24c8;",
        T: "&#x24c9;",
        U: "&#x24ca;", 
        V: "&#x24cb;",
        W: "&#x24cc;",
        X: "&#x24cd;",
        Y: "&#x24ce;",
        Z: "&#x24cf;" 
    }

    function showRules() {
        for (i in rules) {
            $("#instruction-panel").append("<li>" + rules[i] + "</li>")
        }
    }

    // Generates 3 by 6 toble with all the colors
    function colorBank() {
        table = "<table class='color-bank'>"
        for (i in colorCodes) {
            if (i%6 == 0) {
                table += "<tr>";
            }
            table += "<td style='text-align:center; background-color: " + colorCodes[i] + "'>" + (typeof label[getLabel(colorCodes[i])] !== "undefined" ? getLabel(colorCodes[i]) : "") + "</td>";
            if (i%6 == 5) {
                table += "</tr>"
            }
        }
        $("#interactive").append(table);
    }


    // @param 1 <= numBlanks
    function blankGenerator(numBlanks, selectedIndex) {
        blanks = [];
        for (var i = 0; i < numBlanks; i++) {
            if (i == selectedIndex) {
                blanks.push("&#x25cb;");
            }
            else {
                blanks.push("&#x2423;");
            }
        }
        return blanks;
    }

    function circleGenerator(numBoxes) {
        boxes = [];
        for (var i = 0; i < numBoxes; i++) {
            boxes.push("&#x25cb;");
        }
        return boxes;
    }

    function cluesAndBlanks() {
        puzzles = "<br><h3>Clues:</h3><table>";
        for (line in puzzleLines) {
            clueToWrite = puzzleLines[line];
            puzzles += "<tr><td>";
            puzzles += "<input type='text' data-bind='value: attempted()[" + line + "], valueUpdate: " + '"afterkeydown"' + ",  style: {backgroundColor: colorings()[" + line + "]}'/>";
            puzzles += "</td><td>"
            puzzles += "<span class='line-number'>" + String(parseInt(line)+1) + ". </span>";
            puzzles += "<span data-bind='html: guesses()[" + line + "]'></span>"
            puzzles += " <span class='extra-clue'>(" + clueToWrite["clue"] + ")</span></td></tr>";
        }
        puzzles += "</table><br>"
        $("#interactive").append(puzzles);
    }

    function finalAnswerClue() {
        finalClue = "<div class='final-clue'>";
        finalClue += "<h3>Answer:</h3>";
        finalClue += "&#x2610&#x2610&#x2610&#x2610&#x2610";
        finalClue += "<span data-bind='html: finalClueHtml()'></span>"
        finalClue += "<br><span class='extra-clue'>(self decision)</span>"
        finalClue += "</div>";
        $("#interactive").append(finalClue);
    }

    var viewmodel = function() {
        var attempted = ko.observableArray([]);
        var checker = ko.observableArray();
        var initialBlanks = []; //arrayy of array
        var blankTexts = ko.observableArray();
        var initialFinalClue = circleGenerator(17); // 6 + 1 + 10

        for (var i = 0; i < puzzleLines.length; i ++) {
            attempted().push(ko.observable());
            checker().push(false);
            clueToWrite = puzzleLines[i];
            numToBlank = clueToWrite["pun"].match(/\d/g)[0]
            blankedText = blankGenerator(numToBlank, 
                    colorsAndLetterIndex[clueToWrite["answer"]]
                );
            initialBlanks.push(blankedText);
            blankTexts(initialBlanks);
        }

        var arrayToString = function(array) {
            finalS = "";
            for (var i = 0; i < array.length; i ++) {
                finalS += array[i] + " "; 
            }
            return finalS;
        }

        var finalClueHtml = ko.pureComputed(function(){
            finalC = ""
            for (var i = 0; i < initialFinalClue.length; i++) {
                if (checker()[i]) {
                    ans = puzzleLines[i].answer;
                    index = colorsAndLetterIndex[ans];
                    letter = ans[index];
                    finalC += unicodeHexCircleLetters[letter];
                }
                else {
                    finalC += initialFinalClue[i];
                }

                if (i == 5 || i == 6) {
                    finalC += "&nbsp;&nbsp;&nbsp;";
                }
            }
            return finalC;
        });

        // DON'T BE FOOLED BY THE DUMB NAME: THIS IS THE CLUE TEXT
        var guesses = ko.pureComputed(function() {
            currentGuesses = [];
            for (var i = 0; i < puzzleLines.length; i ++) {
                clueToWrite = puzzleLines[i];
                newBlank = clueToWrite["pun"].replace(/\d/g, function(match) {
                        return arrayToString(blankTexts()[i]);
                });
                currentGuesses.push(
                    newBlank
                );
            }
            return currentGuesses;
        })

        var colorings = ko.pureComputed(function() {
            colorsToReturn = [];
            checks = [];
            newBlanks = [];
            for (var i = 0; i < puzzleLines.length; i ++) {
                a = attempted()[i]();
                if (a) {
                    copy = $.extend(true, [], initialBlanks[i]);
                    guess = a.toUpperCase();
                    stringGuess = guess;
                    currentBlank = []; 
                    replaceIndex = colorsAndLetterIndex[puzzleLines[i].answer];

                    // sub in
                    for (var j = 0; j < initialBlanks[i].length; j++) {
                        if (stringGuess.length > j) {
                            if (j == replaceIndex) {
                                currentBlank.push(unicodeHexCircleLetters[stringGuess[j]]);
                            }
                            else {
                                currentBlank.push(stringGuess[j]);
                            }
                        }
                        else {
                            currentBlank.push(copy[j]);
                        }
                    }
                    newBlanks.push(currentBlank);
                }
                else {
                    guess = "";
                    newBlanks.push(initialBlanks[i]);
                }
                colorsToReturn.push(colors[guess] || "#FFFFFF");
                checks.push(guess == puzzleLines[i].answer)
            }
            blankTexts(newBlanks);
            checker(checks);
            return colorsToReturn;
        });

        return {
            attempted: attempted,
            colorings: colorings,
            finalClueHtml: finalClueHtml,
            guesses: guesses
        };
    }

    showRules();
    colorBank();
    cluesAndBlanks();
    finalAnswerClue();
    ko.applyBindings(viewmodel());

});
