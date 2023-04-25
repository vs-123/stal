export enum TokenType {
    Identifier,
    Number,
    String,

    Equals,
}

export function token_type_to_string(token_type: TokenType): string {
    switch (token_type) {
        case TokenType.Identifier:
            return "identifier";
        case TokenType.Number:
            return "number";
        case TokenType.String:
            return "string";
        case TokenType.Equals:
            return "equals";
    }
}

export class Location {
    public line_number: number = 0;
    public col: number = 0;
    public line: string = "";

    constructor(line_number: number, col: number, line: string) {
        this.line_number = line_number;
        this.col = col;
        this.line = line;
    }
}

export class Token {
    public type: TokenType;
    public value: string;
    public location: Location;

    constructor(type: TokenType, value: string, location: Location) {
        this.type = type;
        this.value = value;
        this.location = location;
    }
}