source = "";
const TOKENS=[
	//SINGLE CHARACTER TOKENS
	"LEFT_PAREN", "RIGHT_PAREN", "LEFT_BRACE","RIGHT_BRACE", "COMMA","DOT", "MINUS", "PLUS", "SEMICOLON", "SLASH", "STAR",
	//1 - 2 CHARACTER TOKENS
	"BANG", "BANG_EQUAL", "EQUAL", "EQUAL_EQUAL", "GREATER", "GREATER_EQUAL", "LESS", "LESS_EQUAL",
	//LITERALS
	"IDENTIFIER", "STRING", "NUMBER",
	//KEYWORDS
	"AND", "CLASS", "ELSE", "FALSE", "FOR", "FUNCTION", "IF", "NIL", "OR", "PRINT", "RETURN", "SUPER", "THIS","VAR","WHILE",
	"EOF", "ERROR"
	];

function Enum(prefix, list){
	let count = 0;
	for(let T of list){
		eval(`${prefix}_${T}=${count++}`);
	}
}

Enum("TOKEN", TOKENS);

class Token{
	constructor(type, start, length, line){
		this.type = type;
		this.start = start;
		this.length = length;
		this.line = line;
	}
}

class Scanner{
	constructor(start, current, line){
		this.start = start;
		this.current = current;
		this.line = line;
	}

	scanToken(){
		this.start = this.current;
		if(this.isAtEnd()){
			return makeToken(TOKEN_EOF);
		}

		return errorToken("Unexpected Character");
	}

	isAtEnd(){
		return this.current = "\0";
	}
}

class Interpreter{
	constructor(source){
		this.source = source;
		this.scanner = Scanner(0,0,1);
	}

}
function MakeToken(type, start, length, line, source){

}

function scanner(source){

}


function compile(source){

}

function interpret(source){
	compile(source);
	return INTERPRET_OK;
}