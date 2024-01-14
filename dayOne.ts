import { readFileSync } from "fs";

const filePath = "data.txt";
const text = readFileSync(filePath, "utf8").toString();

const lines : Array<string> = text.split("\n");


const arrayOfSums = lines.map( ( line ) => {
    const numericLine = line.match(/\d+/g);

    if( !numericLine ) {
        return null;
    }

    // [ '58', '146', '2' ]
    const firstDigit = numericLine[0].split("")[0];
    const lastDigit = numericLine[numericLine.length - 1].slice(-1);

    const combinedDigit = Number( firstDigit + lastDigit ); 

    return combinedDigit;
});

const sumOfAllLines = arrayOfSums.reduce( (accum, currVal ) => {
    if ( ( accum !== 0 && !accum ) || !currVal ) {
        return 0;
    }

    return accum + currVal
}, 0)

console.log(sumOfAllLines)



