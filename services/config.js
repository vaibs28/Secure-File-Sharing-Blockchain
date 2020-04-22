const result = require('dotenv').config();

CONFIG = {} 
CONFIG.app = process.env.APP   || 'development';
CONFIG.port = process.env.PORT  || '3002';

CONFIG.eth_url = process.env.ETH_URL || 'http://127.0.0.1:7545';
CONFIG.wallet_passphrase = process.env.HD_WALLET_PASSPHRASE || 'manage soap wild avocado armed hollow scheme soul sunny rich parrot sock';
CONFIG.eth_network_id = process.env.ETH_NETWORK_ID || '5777';

CONFIG.hs_contract_address = "0xFd56b41289DBE0C4e14746bEF4d478DD93fa7e91";

CONFIG.ipfs_api_address = '127.0.0.1';
CONFIG.ipfs_api_port = '5001';
CONFIG.ipfs_url = CONFIG.ipfs_api_address + ':8080/ipfs/';

CONFIG.clientUrl = 'http://localhost:3003';


