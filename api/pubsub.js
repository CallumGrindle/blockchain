const PubNub = require('pubnub');
const { PUBNUB_CREDENTIALS } = require('../keys');

const CHANNELS_MAP = {
    TEST: "TEST",
    BLOCK: "BLOCK"
};

class PubSub {
    constructor({ blockchain }) {
        this.pubnub = new PubNub(PUBNUB_CREDENTIALS);
        this.blockchain = blockchain;
        this.subscribeToChannels();
        this.listen();
    }

    subscribeToChannels() {
        this.pubnub.subscribe({
            channels: Object.values(CHANNELS_MAP)
        });
    }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message })
    }

    listen() {
        this.pubnub.addListener({
            message: messageObject => {
                const { channel, message } = messageObject;
                const parsedMessage = JSON.parse(message);
                
                console.log('Message received. Channel:', channel);

                switch (channel) {
                    case CHANNELS_MAP.BLOCK:
                        console.log('block message', message);
                        
                        this.blockchain.addBlock({ block: parsedMessage })
                            .then(() => console.log('New block accepted'))
                            .catch(error => console.error('New block rejected:', error.message));
                        break;
                    default:
                        return;
                }
            }
        });
    }

    broadcastBlock(block) {
        this.publish({
            channel: CHANNELS_MAP.BLOCK,
            message: JSON.stringify(block)
        });
    }
}

module.exports = PubSub;    