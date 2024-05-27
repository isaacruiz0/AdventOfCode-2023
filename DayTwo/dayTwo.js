// POSSIBLE GAMES FROM
// 12 red cubes, 13 green cubes, and 14 blue cubes
var readFileSync = require('fs').readFileSync;
var filePath = '../data/GameResultsList.txt';
var data = readFileSync(filePath, 'utf8');
var lines = data.split('\n');
var LOADED_BAG;
(function (LOADED_BAG) {
    LOADED_BAG[LOADED_BAG["RED"] = 12] = "RED";
    LOADED_BAG[LOADED_BAG["GREEN"] = 13] = "GREEN";
    LOADED_BAG[LOADED_BAG["BLUE"] = 14] = "BLUE";
})(LOADED_BAG || (LOADED_BAG = {}));
var grabGameId = function (gameIdSplit) {
    var gameId = gameIdSplit.split(' ')[1];
    return parseInt(gameId);
};
var grabSubsets = function (splitSubsets) {
    var subsets = splitSubsets.split(';');
    // [ ' 3 blue, 4 red', ' 1 red, 2 green, 6 blue', ' 2 green' ] 
    return subsets;
};
var createSubsetObjectList = function (subsets) {
    var subsetList = [];
    // [ ' 3 blue, 4 red', ' 1 red, 2 green, 6 blue', ' 2 green' ]
    subsets.forEach(function (subset) {
        // [ ' 3 blue', ' 4 red' ]
        var rolledCubes = subset.split(',');
        var gameColorObject = {};
        rolledCubes.forEach(function (rolledCube) {
            var rolledCubeSplit = rolledCube.split(' ');
            gameColorObject[rolledCubeSplit[2].trim()] = parseInt(rolledCubeSplit[1]);
        });
        subsetList.push(gameColorObject);
    });
    return subsetList;
};
var isGameValid = function (subsetList) {
    var validGame = true;
    // [ { blue: 3, red: 4 }, { red: 1, green: 2, blue: 6 }, { green: 2 } ]
    subsetList.forEach(function (subset) {
        var invalidRed = subset.red && subset.red > LOADED_BAG.RED;
        var invalidGreen = subset.green && subset.green > LOADED_BAG.GREEN;
        var invalidBlue = subset.blue && subset.blue > LOADED_BAG.BLUE;
        if (invalidRed || invalidGreen || invalidBlue) {
            validGame = false;
        }
    });
    return validGame;
};
var gatherValidGameIds = function (lines) {
    var validGameIds = [];
    lines.forEach(function (line) {
        var splitGameIdAndColors = line.split(':');
        var gameId = grabGameId(splitGameIdAndColors[0]);
        var subsets = grabSubsets(splitGameIdAndColors[1]);
        var subsetList = createSubsetObjectList(subsets);
        if (isGameValid(subsetList)) {
            validGameIds.push(gameId);
        }
    });
    return validGameIds;
};
var validGameIds = gatherValidGameIds(lines);
var sumOfValidGameIds = validGameIds.reduce(function (ret, currentValue) {
    return ret + currentValue;
});
console.log(sumOfValidGameIds);
