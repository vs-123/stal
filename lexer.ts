import {Token, TokenType, Location} from "./tokens";


export class Lexer {
    public source_code: string = "";

    private current_char_index: number = 0;
    private output_tokens: Token[] = [];

    private current_line_number: number = 1;
    private current_col: number = 1;

    private alphanumeric = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    private alphabetic = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    private whitespace = " \r\n";

    constructor (source_code: string) {
        this.source_code = source_code.replace("\t", "    ");
    }

    /**
     * tokens
     */
    public tokens(): Token[] {
        return this.output_tokens;
    }

    /**
     * lex
     */
    public lex() {
        const source_code_length = this.source_code.length;

        while (this.current_char_index < source_code_length) {
            const current_char = this.current_character();
            if (this.whitespace.includes(this.current_character())) {
                if (this.current_character() === "\n") {
                    this.current_line_number++;
                    this.current_col = 1;
                }
                this.next();
                continue;
            }

            if (this.alphabetic.includes(this.current_character())) {
                this.eat_identifier();
            } else if(this.current_character() === '"') {
                this.eat_string();
            } else if(this.current_character() === '=') {
                this.output_tokens.push(new Token(TokenType.Equals, '=', this.current_location()));
            } else {
                this.throw_err(`Unrecognized character ${this.current_character()}`)
            }

            this.next();
        }
    }

    private next() {
        this.current_char_index++;
        this.current_col++;
    }

    private current_character(): string {
        return this.source_code[this.current_char_index];
    }

    private current_line(): string {
        return this.source_code.split("\n")[this.current_line_number-1];
    }

    private current_location(): Location {
        return new Location(this.current_line_number, this.current_col, this.current_line());
    }

    private eat_identifier() {
        let eaten_identifier: string = "";

        while (this.alphanumeric.includes(this.current_character())) {
            eaten_identifier += this.current_character();
            this.next();
            // current_char = ;
        }

        this.output_tokens.push(new Token(TokenType.Identifier, eaten_identifier, this.current_location()));
    }

    private eat_string() {
        let eaten_string: string = "";

            this.next();
        while (this.current_character() != '"') {
            eaten_string += this.current_character();
            this.next();
        }

        this.output_tokens.push(new Token(TokenType.String, eaten_string, this.current_location()));
    }

    private throw_err(msg: string) {
        console.log(`[Error] ${msg}`);
        console.log(`[Code]`);
        console.log(` ${this.current_line_number} | ${this.current_line()}`);
        process.exit(1);
    }
}