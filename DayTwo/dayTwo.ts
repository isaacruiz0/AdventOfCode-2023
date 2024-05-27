const log = console.log;
//The Elf would first like to know which games would have been possible if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes?

import { readFileSync } from "fs";
type Games = Array<string>;
type GameID = number;

const main = () => {
    const filePath = "../data/GameResultsList.txt";
    const text = readFileSync(filePath, "utf8").toString();

    const games : Games = text.split("\n");

    const gameIDList = createValidGameIDList( games );
    console.log(gameIDList)
    
    const validGameIDSum = sumArray( gameIDList );

    console.log( validGameIDSum );
 }

const createValidGameIDList = ( games : Games ) : Array<GameID> => {
    return games.map( gameProcessor );
}

/**
 * @param 'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green'
 */
const gameProcessor = ( game : Games[number], index : number ) : GameID => {
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
 * @param [ '1 red, 10 blue, 5 green', '11 blue, 6 green' ]
 */
const containsInvalidSet = ( sets : Array<string> ) : boolean =>  {
    // interface MaxCubeCount {
    //     red : number;
    //     green : number;
    //     blue : number;
    // }    

    // const maxCubeCount : MaxCubeCount = {
    //     red: 12,
    //     green: 13,
    //     blue: 14
    // }

    enum MaxCubeCount {
        red = 12,
        green = 13,
        blue = 14
    }

    const containsInvalidSetFlag = sets.some( ( set ) => { 
        const cubes = set.split( ',' ).map( ( cube ) => {
            return cube.trim();
        } ); 
    
        const cubeCountOutOfRange = cubes.some( ( cube ) => {
            const cubePair= cube.split(' ');
            const count : number = parseInt( cubePair[0] );
            const color = cubePair[1] as keyof MaxCubeCount;
    
            return count > MaxCubeCount[ color ]
    
        } );

        return cubeCountOutOfRange
    } )

    return containsInvalidSetFlag;
}

/**
 * @param 'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green'
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

main();