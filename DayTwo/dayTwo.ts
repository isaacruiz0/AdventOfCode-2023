const log = console.log;

import { readFileSync } from "fs";
type Games = Array<string>;
type GameID = number;
enum MaxCubeCount {
    red = 12,
    green = 13,
    blue = 14
}

interface CubeMakeup {
    red : number;
    green : number;
    blue : number;
}

const filePath = "../data/GameResultsList.txt";
const text = readFileSync(filePath, "utf8").toString();
const games : Games = text.split("\n");

const grabValidGameIDSum = () => {

    const gameIDList = createValidGameIDList( games );
    
    const validGameIDSum = sumArray( gameIDList );

}

const createValidGameIDList = ( games : Games ) : Array<GameID> => {
    return games.map( validGameProcessor );
}

/**
 * @param 'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green'
 */
const validGameProcessor = ( game : Games[number], index : number ) : GameID => {
    const gameID = index + 1;

    const isPossible = calculateGamePossibility( game );

    if ( isPossible ) {
       return gameID;
    }

    return 0;
}

/**
 * @param 'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green'
 */
const calculateGamePossibility = ( game : Games[number] ) : boolean => {
    const setsList = grabSets( game );
    const gameIsPossible = !containsInvalidSet( setsList );

    return gameIsPossible;
}

/**
 * Game - 'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green'
 * Sets  - [ '1 red, 10 blue, 5 green', '11 blue, 6 green' ]
 * Set - '1 red, 10 blue, 5 green'
 * Cubes - [ '1 red', '10 blue', '5 green' ]
 */


/**
 * @param [ '1 red, 10 blue, 5 green', '11 blue, 6 green' ]
 */
const containsInvalidSet = ( sets : Array<string> ) : boolean =>  {
    const containsInvalidSetFlag = sets.some( ( set ) => { 
        const cubes = grabCubes( set );
    
        const containsCubeOutOfRange = cubes.some( ( cube ) => {
            const cubePair = grabCubePair( cube );
    
            return cubePair.count > MaxCubeCount[ cubePair.color ];
        } );

        return containsCubeOutOfRange;
    } )

    return containsInvalidSetFlag;
}
/**
 * @param '1 red, 10 blue, 5 green'
 * @returns [ '1 red', '10 blue', '5 green' ]
 */
const grabCubes = ( set : string ) => {
    return set.split( ',' ).map( ( cube ) => {
        return cube.trim();
    } ); ;
}

/**
 * @param '1 red'
 * @returns {
 *              color: 'red',
 *              count: 1
 *          }
 */
const grabCubePair = ( cube : string ): any => {
    const cubePair = cube.split(' ');
    const count : number = parseInt( cubePair[0] );
    const color = cubePair[1] as keyof typeof MaxCubeCount;

    return { color, count };
}

/**
 * @param 'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green'
 * @returns [ '1 red, 10 blue, 5 green', '11 blue, 6 green' ]
 */
const grabSets = ( game : Games[number] ) : Array<string> => {
    const removeGameIDIndex = game.indexOf( ':' ) + 1;

    const parsedGame = game.slice( removeGameIDIndex );

    const sets = parsedGame.split( ';' ).map( ( set ) => {
        return set.trim();
    } )

    return sets;
}

const sumArray = ( numbers : Array<number> ) : number => {
    let sum = 0;
    for (const number of numbers) {
        sum += number;
    }

    return sum;

}

grabValidGameIDSum();

// The power of a set of cubes is equal to the numbers of red, green, and blue cubes multiplied together

const grabMinimumSetOfCubesSum = () => {
    const powerCubesList = createCubePowerList( games );
    const sum = sumArray( powerCubesList );

    return sum;
}

const createCubePowerList = ( games: Games ) : Array<number> => {
    return games.map( grabCubePower );
}

/**
 * @param 'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green'
 */
const grabCubePower = ( game : string ) : number => {
    const minimumCubesPossible : CubeMakeup = {
        red: 0,
        green: 0,
        blue: 0,
    }

    const setsList = grabSets( game );
    setsList.forEach( ( set ) => {
        const cubes = grabCubes( set );
        cubes.forEach( ( cube ) => {
            const cubePair = grabCubePair( cube );
            if ( cubePair.count > minimumCubesPossible[ cubePair.color as keyof CubeMakeup ] ) {
                minimumCubesPossible[ cubePair.color as keyof CubeMakeup ] = cubePair.count;
            }
        } )
    } )

    return calculatePower( minimumCubesPossible );
}

const calculatePower = ( minimumCubesPossible : CubeMakeup ) : number => {
    return minimumCubesPossible.blue*minimumCubesPossible.green*minimumCubesPossible.red;    
};

log( grabMinimumSetOfCubesSum() );