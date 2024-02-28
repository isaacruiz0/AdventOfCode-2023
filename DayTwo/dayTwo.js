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
    var redCubes = 0;
    var greenCubes = 0;
    var blueCubes = 0;
    subsetList.forEach(function (subset) {
        redCubes += subset.red || 0;
        greenCubes += subset.green || 0;
        blueCubes += subset.blue || 0;
    });
    if (redCubes > LOADED_BAG.RED || greenCubes > LOADED_BAG.GREEN || blueCubes > LOADED_BAG.BLUE) {
        return false;
    }
    return true;
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
console.log(validGameIds);
console.log(sumOfValidGameIds);
