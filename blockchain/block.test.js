const Block = require('./block');
const { keccakHash } = require('../util/index')

describe('Block', () => {
    describe('calculateBlockTargetHash()', () => {
        it('calculates maximum hash when last block difficulty is 1', () => {
            expect(
                Block.calculateBlockTargetHash({ lastBlock: { blockHeaders: { difficulty: 1 } } })
            ).toEqual('f'.repeat(64));
        });

        it('calculates a low hash value when the last block difficulty is high', () => {
            expect(
                Block.calculateBlockTargetHash({ lastBlock: { blockHeaders: { difficulty: 500 } } }) < '1'
            ).toBe(true);
        });
    });

    describe('mineBlock()', () => {
        let lastBlock, minedBlock;

        beforeEach(() => {
            lastBlock = Block.genesis();
            minedBlock = Block.mineBlock({ lastBlock, beneficiary: 'beneficiary' })
        });

        it('mines a block', () => {
            expect(minedBlock).toBeInstanceOf(Block);
        });

        it('mines a block that meets the proof of work requirement', () => {
            const target = Block.calculateBlockTargetHash({ lastBlock });
            const { blockHeaders } = minedBlock;
            const { nonce } = blockHeaders;
            const truncatedBlockHeaders = { ...blockHeaders };
            delete truncatedBlockHeaders.nonce;
            const header = keccakHash(truncatedBlockHeaders);
            const underTargetHash = keccakHash(header + nonce);

            expect(underTargetHash < target).toBe(true);
        });
    });

    describe('adjustDifficulty()', () => {
        it('keeps difficulty above 0', () => {
            expect(
                Block.adjustDifficulty({
                    lastBlock: { blockHeaders: { difficulty: 0 } },
                    timestamp: Date.now()
                })
            ).toEqual(1)
        });
        it('increases difficulty for a quickly mined block', () => {
            expect(
                Block.adjustDifficulty({
                    lastBlock: { blockHeaders: { difficulty: 5, timestamp: 1000 } },
                    timestamp: 3000
                })
            ).toEqual(6)
        });
        it('decreases difficulty for a slowly mined block', () => {
            expect(
                Block.adjustDifficulty({
                    lastBlock: { blockHeaders: { difficulty: 5, timestamp: 1000 } },
                    timestamp: 200000
                })
            ).toEqual(4)
        });
    })

    describe('validateBlock()', () => {
        let block, lastBlock;

        beforeEach(() => {
            lastBlock = Block.genesis();
            block = Block.mineBlock({ lastBlock, beneficiary: 'beneficiary' });
        })

        it('resolves when the block is the genesis block', () => {
            expect(Block.validateBlock({ block: Block.genesis() })).resolves;
        });

        it('resolves if block is valid', () => {            
            expect(Block.validateBlock({ lastBlock, block })).resolves;
        });
    });
});