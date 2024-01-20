export function convertLineToDigits( line : string) : string {
    // Two conditions - digit or word
    // if digit simply add digit to new string
    // if word look up digit in object and add to new string 
    const numberWords = {
        zero: '0',
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9'
    };

    let convertedString = "";
    let buildingString = "";

    for ( let i = 0; i < line.length; i++ ) {
        const char = line[i];

        buildingString += char;

        if ( char.match(/\d/) ) {
            buildingString += char;
            convertedString += char;
            continue
        }

        for( const key in numberWords ) {
            if ( buildingString.endsWith( key ) ) {
                convertedString += numberWords[key];
                continue;
            }
        }

    }

    return convertedString
}

export function sumAllLines(arrayOfLines: Array<string | number>): number {
    const sumOfAllLines = arrayOfLines.reduce((accum, currVal) => {
        const lineAsNumber = Number(currVal);
        if (isNaN(lineAsNumber)) {
            return accum;
        }    

        return Number( accum ) + Number( lineAsNumber );
    }, 0);

    return Number( sumOfAllLines );
}
