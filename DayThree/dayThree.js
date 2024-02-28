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
    sectionArray = numberSection.split("");
    return sectionArray;
};
var getAdjacentNumbersFromLine = function (line, leftAdjacentIndex, rightAdjecentIndex) {
    if (!line) {
        return [];
    }
    var numberSection = line.slice(leftAdjacentIndex, rightAdjecentIndex);
    var regexNumberMatch = /\d+/g;
    var result;
    var numberMatchIndexes = [];
    while ((result = regexNumberMatch.exec(numberSection))) {
        var startingNumberIndex = leftAdjacentIndex + result.index;
        numberMatchIndexes.push(startingNumberIndex);
    }
    var adjacentNumbers = [];
    log(line);
    numberMatchIndexes.forEach(function (numberMatchIndex) {
        log('Number Index', numberMatchIndex);
        adjacentNumbers.push(Number((0, utils_1.getNumberAtIndex)(line, numberMatchIndex)));
    });
    return adjacentNumbers;
};
var getGearRatio = function (leftAdjacentIndex, rightAdjecentIndex, currentLine, topLine, bottomLine) {
    var adjacentNumbersContainer = [];
    var topAdjacentNumbers = getAdjacentNumbersFromLine(topLine, leftAdjacentIndex, rightAdjecentIndex);
    var currentAdjacentNumbers = getAdjacentNumbersFromLine(currentLine, leftAdjacentIndex, rightAdjecentIndex);
    var bottomAdjacentNumbers = getAdjacentNumbersFromLine(bottomLine, leftAdjacentIndex, rightAdjecentIndex);
    adjacentNumbersContainer = topAdjacentNumbers.concat(currentAdjacentNumbers, bottomAdjacentNumbers);
    if (adjacentNumbersContainer.length === 2) {
        return adjacentNumbersContainer[0] * adjacentNumbersContainer[1];
    }
    else {
        return 0;
    }
};
var gatherGearRatios = function (lines) {
    var gearRatios = [];
    lines.forEach(function (currentLine, lineIndex) {
        var regexGearMatch = /\*/g;
        var result;
        var matchedGearObjs = [];
        while (result = regexGearMatch.exec(currentLine)) {
            var leftAdjacentIndex = result.index - 1 === -1 ? 0 : result.index - 1;
            var rightAdjecentIndex = regexGearMatch.lastIndex + 1;
            var matchedGearObj = {
                leftAdjacentIndex: leftAdjacentIndex,
                rightAdjacentIndex: rightAdjecentIndex
            };
            matchedGearObjs.push(matchedGearObj);
        }
        if (matchedGearObjs.length === 0) {
            return;
        }
        matchedGearObjs.forEach(function (matchedGear) {
            if (!matchedGear) {
                return;
            }
            var leftAdjacentIndex = matchedGear.leftAdjacentIndex, rightAdjacentIndex = matchedGear.rightAdjacentIndex;
            var topLine = lines[lineIndex - 1];
            var bottomLine = lines[lineIndex + 1];
            var gearRatio = getGearRatio(leftAdjacentIndex, rightAdjacentIndex, currentLine, topLine, bottomLine);
            if (gearRatio) {
                gearRatios.push(gearRatio);
            }
        });
    });
    return gearRatios;
};
var lines = text.split("\n");
var sum = (0, utils_1.sumAllLines)(gatherGearRatios(lines));
log(sum);
