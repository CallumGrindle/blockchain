const { v4: uuidv4 } = require('uuid');

const TRANSACTION_TYPE_MAP = {
    CREATE_ACCOUNT: 'CREATE_ACCOUNT',
    TRANSACT: 'TRANSACT'
};

const Account = require('../account');

class Transaction {
    constructor({ id, from, to, value, data, signature }) {
        this.id = id || uuidv4();
        this.from = from || '-';
        this.to = to || '-';
        this.value = value || 0;
        this.data = data || '-';
        this.signature = signature || '-';
    }

    static createTransaction({ account, to, value }) {
        if (to) {
            const transactionData = {
                id: uuidv4(),
                from: account.address,
                to, 
                value,
                data: { type: TRANSACTION_TYPE_MAP.TRANSACT }
            }
            
            return new Transaction({
                ...transactionData,
                signature: account.sign(transactionData)
            });
        }

        return new Transaction({
            data: {
                type: TRANSACTION_TYPE_MAP.CREATE_ACCOUNT,
                accountData: account.toJSON()
            }
        });
    }

    static validateStandardTransaction({ state, transaction }) {
        return new Promise((resolve, reject) => {
            const { id, from, signature, value, to } = transaction;
            const transactionData = { ...transaction };
            delete transactionData.signature;

            if (!Account.verifySignature({ 
                publicKey: from, 
                data: transactionData, 
                signature })
            ) {
                return reject(new Error(`Transaction: ${id} signature is invalid`));
            }

            const fromBalance = state.getAccount({ address: from }).balance;

            if (value > fromBalance) {
                return reject(new Error(
                    `Transaction value: ${value} exceeds balance: ${fromBalance}`
                ));
            }

            const toAccount = state.getAccount({ address: to });

            if (!toAccount) {
                return reject(new Error(
                    `The to field: ${to} does not exist`
                ));
            }

            return resolve();
        })
    }

    static validateCreateAccountTransaction({ transaction }) {
        return new Promise((resolve, reject) => {
            const expectedAccountDataFields = Object.keys(new Account().toJSON());
            const fields = Object.keys(transaction.data.accountData);

            if (fields.length !== expectedAccountDataFields.length) {
                return reject(
                    new Error(`The transaction account data has an incorrect number of fields`)
                );
            }

            fields.forEach(field => {
                if (!expectedAccountDataFields.includes(field)) {
                    return reject(new Error(`The field ${field} is unexpected for Account data`));
                }
            });

            return resolve();
        });
    }

    static validateTransactionSeries({ transactionSeries, state }) {
        return new Promise(async (resolve, reject) => {
            for (let transaction of transactionSeries) {
                try {
                    switch (transaction.data.data.type) {
                        case TRANSACTION_TYPE_MAP.CREATE_ACCOUNT:
                            await Transaction.validateCreateAccountTransaction({ 
                                transaction 
                            });
                            break;
                        case TRANSACTION_TYPE_MAP.TRANSACT:
                            await Transaction.validateStandardTransaction({ 
                                state,
                                transaction
                            });
                        default:
                            break;
                    }
                } catch (error) {
                    return reject(error);
                }
            }
            
            return resolve();
        });
    }

    static runTransaction({ transaction, state }) {
        switch(transaction.data.type) {
            case TRANSACTION_TYPE_MAP.TRANSACT:
                Transaction.runStandardTransaction({ state, transaction });
                console.log(' -- Updated account data to reflect standard transaction');
                break;
            case TRANSACTION_TYPE_MAP.CREATE_ACCOUNT:
                Transaction.runCreateAccountTransaction({ state, transaction });
                console.log(' -- Stored account data');
                break;
            default:
                break;
        }
    }

    static runStandardTransaction({ state, transaction }) {        
        const fromAccount = state.getAccount({ address: transaction.from });
        const toAccount = state.getAccount({ address: transaction.to });

        const { value } = transaction;

        fromAccount.balance -= value;
        toAccount.balance += value;

        state.putAccount({ address: transaction.from, accountData: fromAccount })
        state.putAccount({ address: transaction.to, accountData: toAccount })
    }

    static runCreateAccountTransaction({ state, transaction }) {
        const { accountData } = transaction.data;
        const { address } = accountData;        

        state.putAccount({ address, accountData });
    }
}

module.exports = Transaction;