/** Interactive Nonagram **/
$(document).ready(function() {

    /* UI constants */
    const empty = "rgb(255, 255, 255)" // white;
    const fill = "rgb(130, 0, 0)" // MIT maroon;
    const hover = "rgba(130, 0, 0, 0.5)" // transparent maroon;
    const borderWidth = 3 // pixels;

    /* Game constants */
    const rowConstraints = [
        [3],
        [5],
        [7],
        [14],
        [14],
        [6, 2, 3],
        [4, 2, 3],
        [6, 2, 3],
        [7, 2, 2],
        [5, 2, 2, 2],
        [4, 2, 2, 1],
        [3, 1, 2, 3],
        [3, 2, 3, 2],
        [2, 2, 1],
        [1, 1, 4, 2, 1],
        [1, 2, 2],
        [1, 1],
        [12],
        [1, 1],
        [8]
    ];
    const colConstraints = [
        [1],
        [3],
        [4],
        [5, 6],
        [6, 7],
        [13, 4],
        [11, 1],
        [9, 3],
        [2, 3, 1, 1, 1],
        [2, 2, 2, 1, 1, 1],
        [3, 2, 2, 1, 1],
        [4, 2, 2, 1, 1],
        [2, 2, 3, 1, 1, 1],
        [3, 2, 2, 1, 1],
        [3, 2, 2, 3],
        [3, 2, 2, 1],
        [3, 2, 4],
        [3, 2, 1],
        [6]
    ];
    const solved = [
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1],
        [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1],
        [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
        [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
        [0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
    ]

    // Correct letters
    const letters = [
        "                   ",
        "                   ",
        "                   ",
        "                   ",
        "                   ",
        "        TH  E      ",
        "          A  N     ",
        "          SW       ",
        "            E  R   ",
        "        IS         ",
        "       L     A   S ",
        "      T N AM   E   ",
        "      O            ",
        "        F N E   X  ",
        "      T H    O   U ",
        "       S E  M  A   ",
        "      S     TE     ",
        "                   ",
        "          R  S     ",
        "                   "
    ]

    // Grid dimensions in <td> cells
    const gridWidth = letters[0].length;
    const gridHeight = letters.length;
    const constraintWidth = Math.max.apply(null, rowConstraints.map(function(a) {
        return a.length
    }))
    const constraintHeight = Math.max.apply(null, colConstraints.map(function(a) {
            return a.length
        }))
        // Board dimensions include game cells and constraint cells
    const boardWidth = constraintWidth + gridWidth;
    const boardHeight = constraintHeight + gridHeight;

    /* Game settings */
    const assistRate = 0.15;
    const junkLetterRate = 0.4;

    /* Game states */
    var mouseDown = false;
    var mousedownCell = [false, false]; // for toggling multiple cells with mouse drag

    const rules = [
        "Color the grid according to the numbers at the side by following " +
        "<a href='https://en.wikipedia.org/wiki/Nonogram'>Nonogram rules</a>, to reveal a hidden picture and secret message.",
        "In particular, the numbers measure how many <emph>unbroken</emph> lines of filled-in squares there are in any given row or column." +
        " For example, a clue of \"5 2 1\" would mean there are sets of five, two, and one filled squares, in that order, " +
        "with at least one blank square between successive groups.",
        "This is a long puzzle! To help you out, we've filled in some squares for you." +
        " In addition, once you complete any row correctly, it will be <b class='green'>LOCKED IN</b> (the clue will turn green)."
    ];

    function emptyCells(n) {
        cell = "<td class='constraint'></td>"
        s = "";
        while (n-- > 0) {
            s += cell
        }
        return s;
    }

    function initGrid() {
        if (!$('#interative>table').length) {
            $('#interactive').append("<table><tbody></tbody></table>");
        }
        $('tbody').html('')

        // initialize all rows
        for (r = 0; r < boardHeight; r++) {
            if (r < constraintHeight) {
                $('tbody').append("<tr class='row constraint'>" + emptyCells(boardWidth) + "</tr>");
            } else {
                $('tbody').append("<tr class='row' id='row-" + String(r - constraintHeight) + "'></tr>");
            }
        }

        // fill in letters
        var randomLetters = "AABCEEFHIILMNOPRRSSTTU";
        for (r = 0; r < gridHeight; r++) {
            for (c in letters[r]) {
                letter = letters[r][c].trim();
                if (solved[r][c] && Math.random() < assistRate) {
                    // this square gets filled in the final solution;
                    // with assitRate probability, fill in this square to help them out;
                    $("#row-" + r).append("<td class='solved' id='cell-" + r + "-" + c + "'></td>");
                    $("#cell-" + r + "-" + c).css("background-color", fill);
                } else {
                    $("#row-" + r).append("<td class='cell' id='cell-" + r + "-" + c + "'></td>");
                    if (solved[r][c] && !letter && Math.random() < junkLetterRate) {
                        letter = randomLetters[Math.floor(Math.random() * randomLetters.length)];
                    }
                }
                $("#cell-" + r + "-" + c).html(letter)
            }
        }
        // fill in row constraints
        for (r = 0; r < gridHeight; r++) {
            constraints = rowConstraints[r];
            c = constraintWidth;
            while (c-- > 0) {
                if (constraints.slice(-1).length) {
                    $("#row-" + r).prepend("<td class='constraint'>" + constraints.slice(-1) + "</td>");
                    constraints = constraints.slice(0, -1);
                } else {
                    $("#row-" + r).prepend("<td class='constraint'></td>");
                }
            }
        }
        // fill in column constraints
        for (c = 0; c < gridWidth; c++) {
            constraints = colConstraints[c]
            row = constraintHeight - 1
            while (constraints.length > 0) {
                $($($('tbody>tr')[row]).children()[c + constraintWidth]).html(constraints.slice(-1));
                constraints = constraints.slice(0, -1)
                row--;
            }
        }

        $('td').css("color", fill); // color the letters with the fill color
    }

    function getOddIndices(a) {
        A = [];
        for (var i = 1; i < a.length; i += 2) {
            A.push(a[i])
        }
        return A;
    }

    function addListeners() {

        $('.cell').mouseenter(function(e) {
            $(this).addClass("hover");
        });

        $('.cell').mouseleave(function(e) {
            if (!mouseDown) {
                $('.cell').removeClass("hover");
            }
        });

        $('.cell').mousedown(function(e) {
            mouseDown = true;
            mousedownCell = [$(this).attr("id").split("-")[1], $(this).attr("id").split("-")[2]]
        })

        $('.cell').mouseup(function(e) {
            mouseDown = false;
            $('.cell').removeClass("hover");
            mouseupCell = [$(this).attr("id").split("-")[1], $(this).attr("id").split("-")[2]];
            if (mouseupCell[0] === mousedownCell[0]) {
                r = mouseupCell[0]
                for (c = Math.min(mouseupCell[1], mousedownCell[1]); c <= Math.max(mouseupCell[1], mousedownCell[1]); c++) {
                    toggleCell(r, c);
                }
            } else if (mouseupCell[1] === mousedownCell[1]) {
                c = mouseupCell[1]
                for (r = Math.min(mouseupCell[0], mousedownCell[0]); r <= Math.max(mouseupCell[0], mousedownCell[0]); r++) {
                    toggleCell(r, c);
                }
            }
            checkSolve();
            mousedownCell = [false, false];
        });
    }

    function toggleCell(r, c) {
        me = $("#cell-" + r + "-" + c);
        if (me.hasClass("cell")) {
            me.css("background-color", me.css("background-color") == fill ? empty : fill);
        }
    }

    function isFilled(r, c) {
        me = $("#cell-" + r + "-" + c);
        return (me.css("background-color") == fill);
    }
    correctRows = []

    function checkSolve() {
        match = true;
        // only check rows...
        for (var i = 0; i < gridHeight; i++) {
            if (!arrayEquals(solved[i], getRowFilled(i))) {
                match = false;
            } else {
                if (!$("#row-" + i + ">.constraint").hasClass("green")) {
                    $("#row-" + i + ">.constraint").addClass("green big")
                    $("#row-" + i + ">.cell").removeClass("cell").unbind("mouseenter");
                    var j = i;
                    setTimeout(function() {
                        $("#row-" + j + ">.constraint").removeClass("big");
                    }, 300);
                }
            }
        }
        if (!match) {
            return false;
        }
        solve();
        return true;
    }

    function getRowFilled(r) {
        filled = [];
        for (c = 0; c < gridWidth; c++) {
            filled.push(isFilled(r, c) ? 1 : 0)
        }
        return filled;
    }

    function getColumnFilled(c) {
        filled = [];
        for (r = 0; r < gridHeight; r++) {
            filled.push(isFilled(r, c) ? 1 : 0)
        }
        return filled;
    }

    function solve() {
        $("td").unbind("mouseup");
        $("td").unbind("mouseenter");
        alertSuccess("CONGRATS!", "You've filled in all the squares correctly. Now just figure out the solution.")
    }

    function arrayEquals(a, b) {
        return a.join() === b.join();
    }


    function showRules() {
        for (i in rules) {
            $("#instruction-panel").append("<li>" + rules[i] + "</li>")
        }

    }

    showRules();
    initGrid();
    addListeners();

});
