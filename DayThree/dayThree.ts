import { readFileSync } from "fs";

const filePath = '../data/EngineSchematic.txt';

const text = readFileSync(filePath, "utf8").toString();

const lines = text.split("\n");

console.log( lines );

