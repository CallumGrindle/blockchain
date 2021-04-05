const Interpreter = require('./index');
const {
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
} = Interpreter.OPCODE_MAP;

describe('Interpreter', () => {
    describe('runCode()', () => {
        describe('and the code includes ADD', () => {
            it('adds two values', () => {
                expect(new Interpreter().runCode([PUSH, 2, PUSH, 3, ADD, STOP]).result
                ).toEqual(5);
            });
        });

        describe('and the code includes SUB', () => {
            it('subtracts one value from another', () => {
                expect(new Interpreter().runCode([PUSH, 2, PUSH, 3, SUB, STOP]).result
                ).toEqual(1);
            });
        });

        describe('and the code includes MUL', () => {
            it('products two values', () => {
                expect(new Interpreter().runCode([PUSH, 2, PUSH, 3, MUL, STOP]).result
                ).toEqual(6);
            });
        });

        describe('and the code includes DIV', () => {
            it('divides ones value by another', () => {
                expect(new Interpreter().runCode([PUSH, 2, PUSH, 3, DIV, STOP]).result
                ).toEqual(1.5);
            });
        });

        describe('and the code includes LT', () => {
            it('checks one value is less than another', () => {
                expect(new Interpreter().runCode([PUSH, 2, PUSH, 3, LT, STOP]).result
                ).toEqual(0);
                expect(new Interpreter().runCode([PUSH, 3, PUSH, 2, LT, STOP]).result
                ).toEqual(1);
            });
        });

        describe('and the code includes GT', () => {
            it('checks one value is greater than another', () => {
                expect(new Interpreter().runCode([PUSH, 3, PUSH, 2, GT, STOP]).result
                ).toEqual(0);
                expect(new Interpreter().runCode([PUSH, 2, PUSH, 3, GT, STOP]).result
                ).toEqual(1);
            });
        });

        describe('and the code includes EQ', () => {
            it('checks two values are equal', () => {
                expect(new Interpreter().runCode([PUSH, 2, PUSH, 3, EQ, STOP]).result
                ).toEqual(0);
                expect(new Interpreter().runCode([PUSH, 3, PUSH, 3, EQ, STOP]).result
                ).toEqual(1);
            });
        });

        describe('and the code includes AND', () => {
            it('ands two conditions', () => {
                expect(new Interpreter().runCode([PUSH, 0, PUSH, 0, AND, STOP]).result
                ).toEqual(0);
                expect(new Interpreter().runCode([PUSH, 1, PUSH, 0, AND, STOP]).result
                ).toEqual(0);
                expect(new Interpreter().runCode([PUSH, 0, PUSH, 1, AND, STOP]).result
                ).toEqual(0);
                expect(new Interpreter().runCode([PUSH, 1, PUSH, 1, AND, STOP]).result
                ).toEqual(1);
            });
        });

        describe('and the code includes OR', () => {
            it('ors two conditions', () => {
                expect(new Interpreter().runCode([PUSH, 0, PUSH, 0, OR, STOP]).result
                ).toEqual(0);
                expect(new Interpreter().runCode([PUSH, 1, PUSH, 0, OR, STOP]).result
                ).toEqual(1);
                expect(new Interpreter().runCode([PUSH, 0, PUSH, 1, OR, STOP]).result
                ).toEqual(1);
                expect(new Interpreter().runCode([PUSH, 1, PUSH, 1, OR, STOP]).result
                ).toEqual(1);
            });
        });

        describe('and the code includes JUMP', () => {
            it('jumps to a destination', () => {
                expect(new Interpreter().runCode(
                    [PUSH, 6, JUMP, PUSH, 0, JUMP, PUSH, 'jump successful', STOP]
                ).result
                ).toEqual('jump successful');
            });
        });

        describe('and the code includes JUMPI', () => {
            it('jumps to a destination if a condition is met', () => {
                expect(new Interpreter().runCode(
                    [PUSH, 8, PUSH, 1, JUMPI, PUSH, 0, JUMP, PUSH, 'jump successful', STOP]
                ).result
                ).toEqual('jump successful');
            });
        });

        describe('and the code includes invalid JUMP destination', () => {
            it('throws an error', () => {
                expect(
                    () => new Interpreter().runCode(
                        [PUSH, 99, PUSH, 1, JUMPI, PUSH, 0, JUMP, PUSH, 'jump successful', STOP]
                    )
                    ).toThrow('Invalid destination 99')
            })
        })

        describe('and the code includes invalid PUSH destination', () => {
            it('throws an error', () => {
                expect(() => new Interpreter().runCode([PUSH, 0, PUSH])
                ).toThrow('The \'PUSH\' instruction cannot be last')
            })
        })

        describe('and the code includes infinte loop', () => {
            it('throws an error', () => {
                expect(() => new Interpreter().runCode([PUSH, 0, JUMP, STOP])
                ).toThrow('Check for infinite loop. Excecution limit of 10000 exceeded')
            })
        })
    });
});