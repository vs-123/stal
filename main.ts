import * as fs from "fs";
import {Token, TokenType} from "./tokens";
import { Lexer } from "./lexer";
import { Interpreter } from "./interpreter";

const args = process.argv;

if (args.length != 3) {
    console.log(`[Error] No input file provided.`);
    process.exit(1);
}

const safe_read_file = (file: string): string => {
    try {
        return fs.readFileSync(file).toString();
    } catch (error) {
        console.log(`[Error] Could not read given input file`);
        console.log(`[Reason] ${error}`);
        process.exit(1);
    }
}

const source_code = safe_read_file(args[2]);
const lexer = new Lexer(source_code);
lexer.lex();
// console.log(lexer.tokens());

const interpreter = new Interpreter(lexer.tokens());
interpreter.interpret();