"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var utils_1 = require("../Utilities/utils");
var log = console.log;
var filePath = '../data/EngineSchematic.txt';
var text = (0, fs_1.readFileSync)(filePath, "utf8").toString();
var sectionToArray = function (line, leftAdjacentIndex, rightAdjecentIndex) {
    var sectionArray = [];
    if (!line) {
        return [];
    }
    var numberSection = line.slice(leftAdjacentIndex, rightAdjecentIndex);
    var numberSectionArray = numberSection.split("");
    numberSectionArray.forEach(function (item) {
        sectionArray.push(item);
    });
    return sectionArray;
};
var numberIsAdjacentToSymbol = function (leftAdjacentIndex, rightAdjecentIndex, currentLine, topLine, bottomLine) {
    var adjacentItemsContainer = [];
    var topLineSection = sectionToArray(topLine, leftAdjacentIndex, rightAdjecentIndex);
    var currentLineSection = sectionToArray(currentLine, leftAdjacentIndex, rightAdjecentIndex);
    var bottomLineSection = sectionToArray(bottomLine, leftAdjacentIndex, rightAdjecentIndex);
    adjacentItemsContainer = adjacentItemsContainer.concat(topLineSection, currentLineSection, bottomLineSection);
    var containsSymbol = containsNonNumericItem(adjacentItemsContainer);
    return containsSymbol;
};
var containsNonNumericItem = function (adjacentItemsContainer) {
    return adjacentItemsContainer.some(function (item) { return isNaN(Number(item)) && item !== "."; });
};
var gatherAdjacentNumbers = function (lines) {
    var numbersAdjacentToSymbol = [];
    lines.forEach(function (currentLine, lineIndex) {
        var regexNumberMatch = /\d+/g;
        var result;
        var matchedNumberObjs = [];
        while (result = regexNumberMatch.exec(currentLine)) {
            var leftAdjacentIndex = result.index - 1 === -1 ? 0 : result.index - 1;
            var rightAdjecentIndex = regexNumberMatch.lastIndex + 1;
            var number = Number(result[0]);
            var matchedNumberObj = {
                number: number,
                index: leftAdjacentIndex,
                lastIndex: rightAdjecentIndex
            };
            matchedNumberObjs.push(matchedNumberObj);
        }
        if (matchedNumberObjs.length === 0) {
            return;
        }
        matchedNumberObjs.forEach(function (matchedNumber) {
            if (!matchedNumber) {
                return;
            }
            var number = matchedNumber.number, index = matchedNumber.index, lastIndex = matchedNumber.lastIndex;
            var topLine = lines[lineIndex - 1];
            var bottomLine = lines[lineIndex + 1];
            var numberIsAdjacent = numberIsAdjacentToSymbol(index, lastIndex, currentLine, topLine, bottomLine);
            if (numberIsAdjacent) {
                numbersAdjacentToSymbol.push(number);
            }
        });
    });
    console.log(numbersAdjacentToSymbol);
    return numbersAdjacentToSymbol;
};
var lines = text.split("\n");
var sum = (0, utils_1.sumAllLines)(gatherAdjacentNumbers(lines));
log(sum);
