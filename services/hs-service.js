const hsContract = require('./hs-contract-provider').getInstance();
const web3Utils = require('./web3-Utils');
const web3 = require('./web3-provider');

const getFile = async (hash) => {

    var data = [];
    const response = await hsContract.methods.get(web3Utils.stringToBytes(hash)).call();
    data.push({ filehash: response[0], ipfshash: response[1], dateAdded: response[2], exists: response[3] });
    return data;
};

const getFile1 = async (address) => {
    var data = [];
    console.log("in hs service",address);
    const response = await hsContract.methods.getHashFromAddress(web3Utils.stringToBytes(address)).call();
    console.log("Response from hs-service \n ", response);
    var jsonResponse = JSON.stringify(response);
    console.log(jsonResponse);
    var jsonObj = JSON.parse(jsonResponse);
    var filehashList = jsonObj['0'];
    var ipfshashList = jsonObj['1'];
    
    for(var i=0;i<filehashList.length;i++){
        var filehash = filehashList[i];
        var ipfshash = ipfshashList[i];
        data.push({filehash: filehash, ipfshash: ipfshash});
    }
    //data.push({ filehash: response[0], ipfshash: response[1] });
    console.log("Data", data);
    return data;
};

const addFile = async (ipfsHash, fileHash, dateAdded,recipient) => {
    const accounts = await web3.eth.getAccounts();
    console.log("recipient =",recipient);
    const response = await hsContract.methods.add(
        web3Utils.stringToBytes(ipfsHash),
        web3Utils.stringToBytes(fileHash),
        dateAdded,web3Utils.stringToBytes(recipient),recipient).send({from: accounts[0]});
    console.log("response from hs-serivce",response);
    return response;
};

module.exports = {
    get: async (hash) => await getFile(hash),
    get1: async (address) => await getFile1(address),
    add: async (ipfsHash, fileHash, dateAdded,recipient) => await addFile(ipfsHash, fileHash, dateAdded,recipient)
}