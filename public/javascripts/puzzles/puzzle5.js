/** Color Puzzle **/
$(document).ready(function() {
    const rules = [
       "Fill in the blanks!"
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
        "BRONZE": "#cd7f32",
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
            table += "<td style='background-color: " + colorCodes[i] + "'></td>";
            if (i%6 == 5) {
                table += "</tr>"
            }
        }
        $("#interactive").append(table);
    }


    // @param 1 <= numBlanks
    function blankGenerator(numBlanks, selectedIndex) {
        blanks = "";
        for (var i = 0; i < numBlanks; i++) {
            if (i == selectedIndex) {
                blanks += "&#x2610 ";
            }
            else {
                blanks += "&#x2423 "
            }
        }
        return blanks;
    }

    function boxGenerator(numBoxes) {
        boxes = "";
        for (var i = 0; i < numBoxes; i++) {
            boxes += "&#x2610";
        }
        return boxes;
    }

    function cluesAndBlanks() {
        puzzles = "<br><h3>Clues:</h3>";
        for (line in puzzleLines) {
            clueToWrite = puzzleLines[line];
            puzzles += "<span class='line-number'>" + String(parseInt(line)+1) + ". </span>";
            blankedText = clueToWrite["pun"].replace(/\d/g, function(match) {
                return blankGenerator(match[0], 
                    colorsAndLetterIndex[clueToWrite["answer"]]
                );
            });
            puzzles += blankedText;
            puzzles += " <span class='extra-clue'>(" + clueToWrite["clue"] + ")</span>";
            puzzles += "<br>"
        }
        $("#interactive").append(puzzles);
    }

    function finalAnswerClue() {
        finalClue = "<div class='final-clue'>";
        finalClue += "<h3>Answer:</h3>";
        finalClue += "&#x25cb&#x25cb&#x25cb&#x25cb&#x25cb";
        finalClue += boxGenerator(6) + "&nbsp;&nbsp;&nbsp;"; //eached
        finalClue += boxGenerator(1) + "&nbsp;&nbsp;&nbsp;"; //a 
        finalClue += boxGenerator(10); //conclusion
        finalClue += "<br><span class='extra-clue'>(conclude)</span>"
        finalClue += "</div>";
        $("#interactive").append(finalClue);
    }


    showRules();
    colorBank();
    cluesAndBlanks();
    finalAnswerClue();
});
