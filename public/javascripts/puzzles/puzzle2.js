const clickThreshold = 4 // pixels;
const borderWidth = 8 // pixels;
const unclickColor = "rgb(238,238,238)" // MIT gray;
const clickColor = "rgb(120, 0, 0)" // MIT maroon;
const hoverColor = "rgb(120, 0, 0, 0.5)" // transparent maroon;

var cellValues = [
    [2, 0, 1, 0, 2, 3, 2, 0, 1, 0, 0, 2],
    [2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 2, 2, 3, 2, 3, 2, 3, 3, 3, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 2, 3, 2, 3, 0, 0, 0, 3]
]

var correctValues = [
    [2, 1, 1, 1, 2, 3, 2, 1, 1, 1, 1, 2],
    [2, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 1, 2, 2, 3, 2, 3, 2, 3, 3, 3, 2],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 2, 3, 2, 3, 0, 0, 0, 3]
]

function initGrid() {
    if (!$('#interative>table').length) {
        $('#interactive').append("<table><tbody></tbody></table>");
    }
    $('tbody').html('')
    for (r in cellValues) {
        $('tbody').append("<tr class='row' id='row-" + r + "'></tr>");
        for (c in cellValues[r]) {
            value = cellValues[r][c];
            $("#row-" + r).append("<td class='cell' id='cell-" + r + c + "'></td>");
            if (value) {
                $("#cell-" + r + c).html(value)
            }
            if (r == 0) {
                $("#cell-" + r + c).css("border-top-width", 2 * borderWidth + "px")
            }
            if (r == cellValues.length - 1) {
                $("#cell-" + r + c).css("border-bottom-width", 2 * borderWidth + "px")
            }
            if (c == 0) {
                $("#cell-" + r + c).css("border-left-width", 2 * borderWidth + "px")
            }
            if (c == cellValues[r].length - 1) {
                $("#cell-" + r + c).css("border-right-width", 2 * borderWidth + "px")
            }
        }
    }
    $('td').css("border", borderWidth + "px solid " + unclickColor)
}

// border = "top", "bottom", "left", or "right"
function getColorChange(border, row, col) {
    return $("#cell-" + row + col).css("border-" + border + "-color") == clickColor ? unclickColor : clickColor;
}

// border = "top", "bottom", "left", or "right"
function processClick(border, row, col) {
    var color = getColorChange(border, row, col)
    $("#cell-" + row + col).css("border-" + border + "-color", color);
    switch (border) {
        case "top":
            $("#cell-" + (row - 1) + col).css("border-bottom-color", color);
            checkSolve();
            return;
        case "bottom":
            $("#cell-" + (row + 1) + col).css("border-top-color", color);
            checkSolve();
            return;
        case "left":
            $("#cell-" + row + (col - 1)).css("border-right-color", color);
            checkSolve();
            return;
        case "right":
            $("#cell-" + row + (col + 1)).css("border-left-color", color);
            checkSolve();
            return;
        default:
            checkSolve();
            return;
    }
}

function checkSolve() {
    matched = true;
    for (r in correctValues) {
        for (c in correctValues[r]) {
            correct = correctValues[r][c]
            current = getClickedBorders(r, c)
            if (correct && current != correct) {
                matched = false;
                $("#cell-" + r + c).css("color", clickColor);
            } else if (current == correct) {
                $("#cell-" + r + c).css("color", "green");
            }
        }
    }
    if (!matched) {
        return false;
    }
    solve();
}

function solve() {
    alertSuccess("CONGRATS!", "You've solved the puzzle. The solution is the MIRROR IMAGE what you see.")
}

function getClickedBorders(r, c) {
    borders = ["top", "bottom", "left", "right"];
    count = 0;
    for (i in borders) {
        count += ($("#cell-" + r + c).css("border-" + borders[i] + "-color") == clickColor);
    }
    return count;
}

function listenForClicks() {
    $('td').click(function(e) {
        var r = this.parentNode.rowIndex;
        var c = this.cellIndex;
        var w = $(this).width();
        var h = $(this).height();

        var posX = $(this).position().left,
            posY = $(this).position().top;

        var relX = e.pageX - posX,
            relY = e.pageY - posY;

        var border = undefined
        if (relX < clickThreshold + 3) {
            border = "left"
        } else if (relX > w ) {
            border = "right"
        } else if (relY < clickThreshold + 3) {
            border = "top"
        } else if (relY > h ) {
            border = "bottom"
        }
        if (border) {
            processClick(border, r, c);
        }

    });
}


$(document).ready(function() {
    initGrid();
    listenForClicks();
});