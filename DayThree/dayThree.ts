import { readFileSync } from "fs";
import { sumAllLines, getNumberAtIndex } from "../Utilities/utils";
import { start } from "repl";

const log = console.log;

const filePath = '../data/EngineSchematic.txt';

const text = readFileSync(filePath, "utf8").toString();

interface MatchedGear {
    leftAdjacentIndex  : number;
    rightAdjacentIndex : number;
}

const sectionToArray = ( line : string | undefined, leftAdjacentIndex : number, rightAdjecentIndex : number ) : Array<string> => {
    let sectionArray : Array<string> = [];
    if ( !line ) {
        return [];
    }
    const numberSection = line.slice( leftAdjacentIndex, rightAdjecentIndex );

    sectionArray = numberSection.split("");
    
    return sectionArray;
} 

const getAdjacentNumbersFromLine = (line: string | undefined, leftAdjacentIndex: number, rightAdjecentIndex: number) : Array<number> => {

    if ( !line ) {
        return [];
    }

    const numberSection = line.slice( leftAdjacentIndex, rightAdjecentIndex );
    const regexNumberMatch = /\d+/g;

    let result: RegExpExecArray | null;

    const numberMatchIndexes : Array<number> = [];

    while ( ( result = regexNumberMatch.exec( numberSection ) ) ) {
        const startingNumberIndex = leftAdjacentIndex + result.index;
        numberMatchIndexes.push( startingNumberIndex );
    }

    const adjacentNumbers: Array<number> = [];

    log( line )
    numberMatchIndexes.forEach( ( numberMatchIndex ) => {
        log( 'Number Index', numberMatchIndex )
        adjacentNumbers.push( Number( getNumberAtIndex( line, numberMatchIndex ) ) );
    });

    return adjacentNumbers;
}

type AdjacentNumbersContainer = Array<number>;
const getGearRatio = ( leftAdjacentIndex : number, rightAdjecentIndex : number, currentLine : string, topLine : string | undefined, bottomLine : string | undefined ) : number => {

    let adjacentNumbersContainer : AdjacentNumbersContainer = [];
 
    type TopAdjacentNumbers = Array<number>;
    const topAdjacentNumbers : TopAdjacentNumbers  = getAdjacentNumbersFromLine( topLine, leftAdjacentIndex, rightAdjecentIndex );
    const currentAdjacentNumbers : TopAdjacentNumbers= getAdjacentNumbersFromLine( currentLine, leftAdjacentIndex, rightAdjecentIndex );
    const bottomAdjacentNumbers : TopAdjacentNumbers= getAdjacentNumbersFromLine( bottomLine, leftAdjacentIndex, rightAdjecentIndex );

    adjacentNumbersContainer = topAdjacentNumbers.concat(currentAdjacentNumbers, bottomAdjacentNumbers);

    if( adjacentNumbersContainer.length === 2 ) {
        return adjacentNumbersContainer[0] * adjacentNumbersContainer[1];
    } else {
        return 0;
    }

}

const gatherGearRatios = ( lines : Array<string> ) : Array<number> => {
    let gearRatios : Array<number> = [];

    lines.forEach( ( currentLine, lineIndex ) => {
        const regexGearMatch = /\*/g;
        let result : RegExpExecArray | null;
        let matchedGearObjs : Array<MatchedGear | null> = [];
        
        while ( result = regexGearMatch.exec( currentLine ) ) {
            const leftAdjacentIndex  = result.index - 1 === -1 ? 0 : result.index - 1 ;
            const rightAdjecentIndex = regexGearMatch.lastIndex + 1;

            const matchedGearObj : MatchedGear = {
                leftAdjacentIndex: leftAdjacentIndex,
                rightAdjacentIndex: rightAdjecentIndex 
            }
            
            matchedGearObjs.push( matchedGearObj );
        }
        
        if( matchedGearObjs.length === 0 ) {
            return;
        }

        matchedGearObjs.forEach( ( matchedGear ) => {

            if ( !matchedGear ) {
                return;
            }

            const { leftAdjacentIndex, rightAdjacentIndex } = matchedGear;
            const topLine = lines[ lineIndex - 1 ];
            const bottomLine = lines[ lineIndex + 1 ];

            const gearRatio = getGearRatio( leftAdjacentIndex, rightAdjacentIndex, currentLine, topLine, bottomLine );
            
            if ( gearRatio ) {
                gearRatios.push( gearRatio );
            }
        } );
        
    } ); 

    return gearRatios
};


const lines = text.split("\n");
const sum = sumAllLines( gatherGearRatios( lines ) );

log( sum );