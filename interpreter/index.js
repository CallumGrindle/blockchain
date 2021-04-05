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
const STORE = 'STORE';
const LOAD = 'LOAD';

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
    JUMPI,
    STORE,
    LOAD
};

const OPCODE_GAS_MAP = {
    STOP: 0,
    ADD: 1,
    SUB: 1,
    MUL: 1,
    DIV: 1,
    PUSH: 0,
    LT: 1,
    GT: 1,
    EQ: 1,
    AND: 1,
    OR: 1,
    JUMP: 2,
    JUMPI: 2,
    STORE: 5,
    LOAD: 5
};

const EXECUTION_LIMIT = 10000
const EXECUTION_COMPLETE = 'Execution complete';

class Interpreter {
    constructor({ storageTrie } = {}) {
        this.state = {
            programCounter: 0,
            stack: [],
            code: [],
            executionCount: 0
        };
        this.storageTrie = storageTrie;
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

        let gasUsed = 0;

        while (this.state.programCounter < this.state.code.length) {
            this.state.executionCount++;

            if (this.state.executionCount > EXECUTION_LIMIT) {
                throw new Error(`Check for infinite loop. Excecution limit of ${EXECUTION_LIMIT} exceeded`)
            }

            const opCode = this.state.code[this.state.programCounter];

            gasUsed += OPCODE_GAS_MAP[opCode];

            let value; 
            let key;

            try {
                switch (opCode) {
                    case STOP:
                        throw new Error(EXECUTION_COMPLETE);
                    case PUSH:
                        this.state.programCounter++;
                        if (this.state.programCounter === this.state.code.length) {
                            throw new Error(`The 'PUSH' instruction cannot be last`);
                        }

                        value = this.state.code[this.state.programCounter];
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
                    case STORE:
                        key = this.state.stack.pop();
                        value = this.state.stack.pop();
                        
                        this.storageTrie.put({ key, value });

                        break;
                    case LOAD:
                        key = this.state.stack.pop();
                        value = this.storageTrie.get({ key });

                        this.state.stack.push(value);

                        break;
                    default:
                        break;
                }
            } catch (error) {
                if (error.message === EXECUTION_COMPLETE) {
                    return {
                        result: this.state.stack[this.state.stack.length-1],
                        gasUsed
                    }
                }

                throw error;
            } 

            this.state.programCounter++
        }
    }
}

Interpreter.OPCODE_MAP = OPCODE_MAP;
module.exports = Interpreter;
