import { Token, TokenType, token_type_to_string, Location } from "./tokens";

class Variable {
    public name: string = "";
    public type: TokenType;
    public value: string = "";

    constructor(name: string, type: TokenType, value: string) {
        this.name = name;
        this.type = type;
        this.value = value;
    }
}

export class Interpreter {
    private variables: Variable[] = [];
    private stack: Token[] = []

    private tokens: Token[] = [];
    private current_token_index = 0;

    private keywords: string[] = ["print"];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    /**
     * interpret
     */
    public interpret() {
        while (this.current_token_index < this.tokens.length) {
            const current_token = this.current_token();
            switch (current_token.type) {
                // Primitive types
                case TokenType.String:
                    this.stack.push(current_token);
                    break;
                
                case TokenType.Identifier:
                    // Keywords
                    if(this.keywords.includes(current_token.value)) {
                        switch (current_token.value) {
                            case "print":
                                if (this.stack.length !== 0)
                                    console.log(this.stack[this.stack.length-1].value);
                                else
                                    this.throw_err(`Cannot print from empty stack.`);
                                this.stack = [];
                                break;

                            default:
                                this.throw_err(`Unimplemented keyword '${current_token.value}'`);
                        }
                    } else {
                        if(!current_token.location.line.trimEnd().endsWith('=')) {
                            const v = this.get_variable(current_token.value);
                            this.stack.push(new Token(v.type, v.value, new Location(0,0,"")));
                        } else {
                            this.stack.push(current_token);
                        }
                    }
                    break;
                
                case TokenType.Equals:
                    // Variable assignment
                    // Syntax: x 5 =
                    if (this.stack.length < 2) {
                        console.log(this.stack)
                        this.throw_err(
                            `Stack not sufficient for variable assignment.`,
                            `Variable assignment: <variable_name> <value> =` + "\n" +
                            `[Example] x 5 =`
                        )
                    }

                    const variable_name = this.stack[this.stack.length - 2];
                    const variable_value = this.stack[this.stack.length - 1]

                    this.required_type(variable_name, TokenType.Identifier);
                    this.required_types(variable_value, [TokenType.Identifier, TokenType.Number, TokenType.String]);
                    
                    this.variables.push(new Variable(variable_name.value, variable_value.type, variable_value.value));
                    
                    this.stack.pop();
                    this.stack.pop();
                    break;

                default:
                    this.throw_err(`Unimplemented token '${current_token.value}' (type: ${token_type_to_string(current_token.type)})`);
                    break;
            }

            this.next();
        }
    }

    private next() {
        this.current_token_index++;
    }

    private current_token(): Token {
        return this.tokens[this.current_token_index];
    }

    private required_type(token: Token, type: TokenType) {
        if (token.type !== type) {
            this.throw_err(`Expected token ${token.value} to be of type '${token_type_to_string(type)}', found '${token.type}'`)
        }
    }

    private required_types(token: Token, types: TokenType[]) {
        if (!types.includes(token.type)) {
            this.throw_err(`Expected token ${token.value} to be of either one of types '${types.map(token_type_to_string).join(', ')}', found '${token.type}'`)
        }
    }

    private get_variable(variable_name: string): Variable {
        for (let i=0;i<this.variables.length;i++)
            if (variable_name === this.variables[i].name)
                return this.variables[i];
        
        this.throw_err(`Variable ${variable_name} is not declared`);
        // Unreachable
        return this.variables[0];
    }

    private throw_err(msg: string, help: string = "") {
        console.log(`[Error] ${msg}`);
        if (help.length > 0) {
            console.log(`[Help] ${help}`)
        }
        console.log(`[Code]`);
        console.log(` ${this.current_token().location.line_number} | ${this.current_token().location.line}`);
        process.exit(1);
    }
}