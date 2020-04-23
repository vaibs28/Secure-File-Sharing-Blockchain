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

2) Start IPFS daemon.  

   ipfs daemon

3) Configure config.js variables in Services/config.js.  
   Add Ganache mnemonic to CONFIG.wallet_passphrase. 
   
4) Deploy Smart Contracts using Truffle and Ganache.  
   Configure config.js variables in Services/config.js.  
   
   cd SecureFileSharing.  
   truffle compile -all.  
   truffle migrate -reset.  

4) Use the contract address generated after deployment in config.js, CONFIG.hs_contract_address variable.

5) Start the webapp.  

   npm install.  
   npm start.  

6) Start the React App.    

   cd app.  
   npm install.  
   npm start.  

7) Enable CORS from the Chrome Extension  

Note: The implementation stores the addresses of the authorized accounts in smart contract as per the current Ganache accounts. So, the values would need to be updated as per the blockchain on which the application runs.


Screenshots   


![](https://github.com/vaibs28/SecureFileSharingBlockchain/blob/master/img/s1.png).  


![](https://github.com/vaibs28/SecureFileSharingBlockchain/blob/master/img/s2.png).  


![](https://github.com/vaibs28/SecureFileSharingBlockchain/blob/master/img/s3.png).  



![](https://github.com/vaibs28/SecureFileSharingBlockchain/blob/master/img/s4.png).  


![](https://github.com/vaibs28/SecureFileSharingBlockchain/blob/master/img/s5.png).  
