"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumberAtIndex = exports.sumAllLines = exports.convertLineToDigits = void 0;
function convertLineToDigits(line) {
    // Two conditions - digit or word
    // if digit simply add digit to new string
    // if word look up digit in object and add to new string 
    var numberWords = {
        zero: '0',
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9'
    };
    var convertedString = "";
    var buildingString = "";
    for (var i = 0; i < line.length; i++) {
        var char = line[i];
        buildingString += char;
        if (char.match(/\d/)) {
            buildingString += char;
            convertedString += char;
            continue;
        }
        for (var key in numberWords) {
            if (buildingString.endsWith(key)) {
                convertedString += numberWords[key];
                continue;
            }
        }
    }
    return convertedString;
}
exports.convertLineToDigits = convertLineToDigits;
function sumAllLines(arrayOfLines) {
    var sumOfAllLines = arrayOfLines.reduce(function (accum, currVal) {
        var lineAsNumber = Number(currVal);
        if (isNaN(lineAsNumber)) {
            return accum;
        }
        return Number(accum) + Number(lineAsNumber);
    }, 0);
    return Number(sumOfAllLines);
}
exports.sumAllLines = sumAllLines;
function getNumberAtIndex(str, index) {
    // Regular expression to find numbers
    var regex = /\d+/g;
    var match;
    // Iterate over all number matches
    while ((match = regex.exec(str)) !== null) {
        // Check if the given index is within the current match
        if (index >= match.index && index < match.index + match[0].length) {
            return match[0];
        }
    }
    return str.charAt(index); // Return null if no number is found at the index
}
exports.getNumberAtIndex = getNumberAtIndex;
