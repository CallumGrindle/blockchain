const STOP = 'STOP';
const ADD = 'ADD';
const SUB = 'SUB';
const MUL = 'MUL';
const DIV = 'DIV';
const PUSH = 'PUSH';
const LT = 'LT';
const GT = 'GT';
const EQ = 'EQ';
const AND = 'AND';
const OR = 'OR';
const JUMP = 'JUMP';
const JUMPI = 'JUMPI';

const OPCODE_MAP = {
    STOP,
    ADD,
    SUB,
    MUL,
    DIV,
    PUSH,
    LT,
    GT,
    EQ,
    AND,
    OR,
    JUMP,
    JUMPI
};

const EXECUTION_LIMIT = 10000
const EXECUTION_COMPLETE = 'Execution complete';

class Interpreter {
    constructor() {
        this.state = {
            programCounter: 0,
            stack: [],
            code: [],
            executionCount: 0
        };
    }

    jump() {
        const destination = this.state.stack.pop();
                        
        if (destination < 0 || destination > this.state.code.length) {
            throw new Error(`Invalid destination ${destination}`);
        }

        this.state.programCounter = destination;
        this.state.programCounter--;
    }

    runCode(code) {
        this.state.code = code;

        while (this.state.programCounter < this.state.code.length) {
            this.state.executionCount++;

            if (this.state.executionCount > EXECUTION_LIMIT) {
                throw new Error(`Check for infinite loop. Excecution limit of ${EXECUTION_LIMIT} exceeded`)
            }

            const opCode = this.state.code[this.state.programCounter];

            try {
                switch (opCode) {
                    case STOP:
                        throw new Error(EXECUTION_COMPLETE);
                    case PUSH:
                        this.state.programCounter++;
                        if (this.state.programCounter === this.state.code.length) {
                            throw new Error(`The 'PUSH' instruction cannot be last`);
                        }

                        const value = this.state.code[this.state.programCounter];
                        this.state.stack.push(value);
                        break;
                    case ADD:
                    case SUB: 
                    case MUL:
                    case DIV:
                    case LT:
                    case GT:
                    case EQ:
                    case AND:
                    case OR:

                        const a = this.state.stack.pop();
                        const b = this.state.stack.pop();

                        let result;

                        if (opCode === ADD) result = a + b;
                        if (opCode === SUB) result = a - b;
                        if (opCode === MUL) result = a * b;
                        if (opCode === DIV) result = a / b;
                        if (opCode === LT) result = a < b ? 1 : 0;
                        if (opCode === GT) result = a > b ? 1 : 0;
                        if (opCode === EQ) result = a === b ? 1 : 0;
                        if (opCode === AND) result = a && b;
                        if (opCode === OR) result = a || b;
                        
                        this.state.stack.push(result);
                        break;
                    case JUMP:
                        this.jump();
                        break;
                    case JUMPI:
                        const condition = this.state.stack.pop();

                        if (condition === 1) {
                            this.jump();
                        }
                        break;
                    default:
                        break;
                }
            } catch (error) {
                if (error.message === EXECUTION_COMPLETE) {
                    return this.state.stack[this.state.stack.length-1];
                }

                throw error;
            } 

            this.state.programCounter++
        }
    }
}

Interpreter.OPCODE_MAP = OPCODE_MAP;
module.exports = Interpreter;

// let code;

// code = [PUSH, 2, PUSH, 3, MUL, STOP];
// result = new Interpreter().runCode(code);
// console.log(result);

// code = [PUSH, 2, PUSH, 3, LT, STOP];
// result = new Interpreter().runCode(code);
// console.log('LT', result);

// code = [PUSH, 2, PUSH, 3, GT, STOP];
// result = new Interpreter().runCode(code);
// console.log('GT', result);

// code = [PUSH, 2, PUSH, 3, EQ, STOP];
// result = new Interpreter().runCode(code);
// console.log('EQ', result);

// code = [PUSH, 2, PUSH, 2, EQ, STOP];
// result = new Interpreter().runCode(code);
// console.log('EQ', result);

// code = [PUSH, 0, PUSH, 1, AND, STOP];
// result = new Interpreter().runCode(code);
// console.log('EQ', result);

// code = [PUSH, 2, PUSH, 3, ADD, PUSH, 5, EQ, STOP];
// result = new Interpreter().runCode(code);
// console.log('EQ', result);

// code = [PUSH, 6, JUMP, PUSH, 0, JUMP, PUSH, 'jump successful', STOP];
// result = new Interpreter().runCode(code);
// console.log('JUMP', result);

// code = [PUSH, 8, PUSH, 1, JUMPI, PUSH, 0, JUMP, PUSH, 'jump successful', STOP];
// result = new Interpreter().runCode(code);
// console.log('JUMPI', result);

// code = [PUSH, 0, PUSH];
// try {
//     new Interpreter().runCode(code);
// } catch (error) {
//     console.log(error.message);
// }

// code = [PUSH, 0, JUMP, STOP];
// try {
//     new Interpreter().runCode(code);
// } catch (error) {
//     console.log(error.message);
// }

