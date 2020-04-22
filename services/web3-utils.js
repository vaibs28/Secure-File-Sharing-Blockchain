const web3 = require('./web3-provider');
const wallet = require('ethereumjs-wallet');
const ethUtil = require('ethereumjs-util');

module.exports = {
    
    hashString: (data) => {
        if(typeof data !== 'string') {
            throw new Error(`expecting argument of type string, but got: ${typeof data}`);
        }

        return web3.utils.soliditySha3(data); 
    },

    stringToBytes: (data) => {
        if(typeof data !== 'string') {
            throw new Error(`expecting argument of type string, but got: ${typeof data}`);
        }

        return web3.utils.asciiToHex(data);
    },

    bytesToString: (bytes) => {
        return web3.utils.hexToUtf8(bytes);
    },

    numberInEtherToWei: (data) => {
        return web3.utils.toWei(data, 'ether');
    },

    keyToAddress: (key) => {
        try{
        var hexKey = '0x'+key;
        const privateKeyBuffer = ethUtil.toBuffer(hexKey);
        const instance = wallet.fromPrivateKey(privateKeyBuffer);
        var address = instance.getAddressString();
        }
        catch(err){
            return err.message;
        }
        return address;
    }
};