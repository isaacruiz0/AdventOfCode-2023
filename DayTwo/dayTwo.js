"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var utils_1 = require("../Utilities/utils");
var filePath = "../data/data.txt";
var text = (0, fs_1.readFileSync)(filePath, "utf8").toString();
var lines = text.split("\n");
var arrayOfSums = lines.map(function (line) {
    var filteredLineWithDigits = (0, utils_1.convertLineToDigits)(line);
    var numericLine = filteredLineWithDigits.match(/\d+/g);
    if (!numericLine) {
        return null;
    }
    var firstDigit = numericLine[0].split("")[0];
    var lastDigit = numericLine[numericLine.length - 1].slice(-1);
    var combinedDigit = Number(firstDigit + lastDigit);
    return combinedDigit;
});
var sumOfAllLines = arrayOfSums.reduce(function (accum, currVal) {
    if ((accum !== 0 && !accum) || !currVal) {
        return 0;
    }
    return accum + currVal;
}, 0);
console.log(sumOfAllLines);
