# blockchain
a proof of concept blockchain based on Ethereum with smart contract functionality.

run root node (port 3000): `npm run dev`**

run peer (random port): `npm run dev-peer`**

running a node will create an account within a transaction and sync previous blocks with other nodes

transactions are added to blocks and added to the blockchain by mining

-----------------------------------------------------
hit  GET `/blockchain` to view all blocks in the blockchain

hit GET `/blockchain/mine` to mine a block. Nodes receive rewards for mining 

hit GET `/{account_address}/balance` to view an account balance

hit POST `/account/transaction` to propose a transaction to be verified in the next block

---------------------------------------------------------

** you will need PubNub credentials to run this application. Using pubnub is a limitation of this project as it centralises node communication. Truely decentralised peer to peer communication would be a big improvement
