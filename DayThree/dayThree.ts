import { readFileSync } from "fs";
import { sumAllLines } from "../Utilities/utils";
const log = console.log;

const filePath = '../data/EngineSchematic.txt';

const text = readFileSync(filePath, "utf8").toString();

interface MatchedNumber {
    number : number;
    index : number;
    lastIndex : number;
}

const sectionToArray = ( line : string | undefined, leftAdjacentIndex : number, rightAdjecentIndex : number ) : Array<string> => {
    const sectionArray : Array<string> = [];
    if ( !line ) {
        return [];
    }
    const numberSection = line.slice( leftAdjacentIndex, rightAdjecentIndex );

    const numberSectionArray = numberSection.split("");

    numberSectionArray.forEach( ( item ) => {
        sectionArray.push( item );
    } );
    
    return sectionArray;
}

const numberIsAdjacentToSymbol = ( leftAdjacentIndex : number, rightAdjecentIndex : number, currentLine : string, topLine : string | undefined, bottomLine : string | undefined ) : boolean => {

    let adjacentItemsContainer : Array<string> = [];
 
    const topLineSection = sectionToArray( topLine, leftAdjacentIndex, rightAdjecentIndex );
    const currentLineSection = sectionToArray( currentLine, leftAdjacentIndex, rightAdjecentIndex );
    const bottomLineSection = sectionToArray( bottomLine, leftAdjacentIndex, rightAdjecentIndex );

    adjacentItemsContainer = adjacentItemsContainer.concat( topLineSection, currentLineSection, bottomLineSection );


    const containsSymbol = containsNonNumericItem( adjacentItemsContainer );

    return containsSymbol;

}

const containsNonNumericItem = (adjacentItemsContainer: Array<string>): boolean => {
    return adjacentItemsContainer.some((item) => isNaN( Number( item ) ) && item !== ".");
};

const gatherAdjacentNumbers = ( lines : Array<string> ) : Array<number> => {
    let numbersAdjacentToSymbol : Array<number> = [];

    lines.forEach( ( currentLine, lineIndex ) => {
        const regexNumberMatch = /\d+/g;
        let result : RegExpExecArray | null;
        
        let matchedNumberObjs : Array<MatchedNumber | null> = [];
        while ( result = regexNumberMatch.exec( currentLine ) ) {
            const leftAdjacentIndex  = result.index - 1 === -1 ? 0 : result.index - 1 ;
            const rightAdjecentIndex = regexNumberMatch.lastIndex + 1;
            const number = Number( result[0] );




            const matchedNumberObj : MatchedNumber = {
                number: number,
                index: leftAdjacentIndex,
                lastIndex: rightAdjecentIndex 
            }
            
            matchedNumberObjs.push( matchedNumberObj );
        }
        
        if( matchedNumberObjs.length === 0 ) {
            return;
        }

        matchedNumberObjs.forEach( ( matchedNumber ) => {
            if ( !matchedNumber ) {
                return;
            }

            const { number, index, lastIndex } = matchedNumber;
            const topLine = lines[ lineIndex - 1 ];
            const bottomLine = lines[ lineIndex + 1 ];

            const numberIsAdjacent = numberIsAdjacentToSymbol( index, lastIndex, currentLine, topLine, bottomLine );
            
            if ( numberIsAdjacent ) {
                numbersAdjacentToSymbol.push( number );
            }
        } );
        
    } ); 

    return numbersAdjacentToSymbol
};


const lines = text.split("\n");
const sum = sumAllLines( gatherAdjacentNumbers( lines ) );

log(sum)