// POSSIBLE GAMES FROM
// 12 red cubes, 13 green cubes, and 14 blue cubes
const { readFileSync } = require('fs');

const filePath = '../data/GameResultsList.txt';

const data = readFileSync(filePath, 'utf8');
const lines : Array<string> = data.split('\n');

enum LOADED_BAG {
    RED = 12,
    GREEN = 13,
    BLUE = 14
}

interface gameColorSubset {
    red ?: number,
    green ?: number,
    blue ?: number
}

const grabGameId = ( gameIdSplit : string ) : number => {
    const gameId = gameIdSplit.split( ' ' )[1];

    return parseInt( gameId );
}

const grabSubsets = ( splitSubsets : string ) => {
    const subsets = splitSubsets.split( ';' );
   
   // [ ' 3 blue, 4 red', ' 1 red, 2 green, 6 blue', ' 2 green' ] 
    return subsets;
}

const createSubsetObjectList = ( subsets : Array<string> ) : Array<gameColorSubset> => {
    let subsetList : Array<gameColorSubset> = [];
    // [ ' 3 blue, 4 red', ' 1 red, 2 green, 6 blue', ' 2 green' ]
    subsets.forEach( ( subset ) => {   
        // [ ' 3 blue', ' 4 red' ]
        const rolledCubes = subset.split( ',' );

        const gameColorObject : gameColorSubset = {};

        rolledCubes.forEach( ( rolledCube ) => {
            const rolledCubeSplit = rolledCube.split( ' ' );
            gameColorObject[ rolledCubeSplit[2].trim() as keyof gameColorSubset ] = parseInt( rolledCubeSplit[1] ); 
        } );

        subsetList.push( gameColorObject );
    });

    return subsetList;
}

const isGameValid = ( subsetList : Array<gameColorSubset> ) : boolean => {
    let validGame = true;
    // [ { blue: 3, red: 4 }, { red: 1, green: 2, blue: 6 }, { green: 2 } ]
    subsetList.forEach( ( subset ) => {
        const invalidRed = subset.red && subset.red > LOADED_BAG.RED;
        const invalidGreen = subset.green && subset.green > LOADED_BAG.GREEN;
        const invalidBlue = subset.blue && subset.blue > LOADED_BAG.BLUE;
        if ( invalidRed || invalidGreen || invalidBlue) {
            validGame = false;
        }
    });
    
    return validGame;
}

const gatherValidGameIds = (lines: Array<string>) : Array<number> => {
    let validGameIds : Array<number> = [];

    lines.forEach( ( line ) => {
        const splitGameIdAndColors = line.split( ':' );
        const gameId = grabGameId( splitGameIdAndColors[0] );
        const subsets = grabSubsets( splitGameIdAndColors[1] );
        const subsetList = createSubsetObjectList( subsets );

        if ( isGameValid( subsetList ) ) {
            validGameIds.push( gameId );
        }
    })

    return validGameIds;
}

const  validGameIds : Array<number> = gatherValidGameIds( lines );
const sumOfValidGameIds = validGameIds.reduce( ( ret : number, currentValue : number ) : number => {
    return ret + currentValue;
} );

console.log( sumOfValidGameIds );