# SecureFileSharing
Prototype to store files on IPFS and Ethereum Blockchain.

## Requirements
* IPFS 
* Truffle 
* Ganache 
* Web3.js 
* NodeJs 
* Chrome with CORS extension

## Instructions

1) Install IPFS

2) Start IPFS daemon 
   ipfs daemon

3) Configure config.js variables in Services/config.js. Add Ganache mnemonic to CONFIG.wallet_passphrase
   Deploy Smart Contracts using Truffle and Ganache
   cd SecureFileSharing
   truffle compile -all
   truffle migrate -reset

4) Use the contract address generated after deployment in config.js, CONFIG.hs_contract_address variable.

5) Start the webapp
   npm install
   npm start

6) Start the React App
   cd app
   npm install
   npm start

7) Enable CORS from the Chrome Extension 