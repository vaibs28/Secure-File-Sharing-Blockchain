pragma experimental ABIEncoderV2;

import "./Ownable.sol";

contract HashStorage is Ownable{
    mapping (string => DocInfo) collection;
    mapping (string => Info[]) addressToHash;

    struct DocInfo {
        string ipfshash;
        uint dateAdded; //in epoch
        bool exist;
        string authorizedRecipients;
    }

    struct Info{
        string ipfshash;
        string filehash;
        uint dateAdded; //in epoch
        bool exist;
        string authorizedRecipients;
    }

    event HashAdded(string ipfshash, string filehash, uint dateAdded, string recipient);

    constructor () public {
        owner = msg.sender;
    }

function compare(string memory a, string memory b) internal returns (bool) {
        if (bytes(a).length != bytes(b).length) {
            return false;
        }
        for (uint i = 0; i < bytes(a).length; i ++) {
            if(bytes(a)[i] != bytes(b)[i]) {
                return false;
            }
        }
        return true;
    }

function add(string memory _ipfshash,string memory _filehash,uint _dateAdded,string memory recipient,string memory recipient2) public onlyOwner {
        bool checkEquality = compare(recipient2,"0xffa2d6db76c632c6fd941d3bc0254dbda9af638f");
        require(checkEquality==true, "Not authorized to access");
        //if(collection[_filehash].exist == true)
        //    revert("already existing file");
        require(collection[_filehash].exist == false, "file already uploaded");
        DocInfo memory docInfo = DocInfo(_ipfshash, _dateAdded, true, recipient);
        collection[_filehash] = docInfo;
        Info memory docInfo2 = Info(_ipfshash, _filehash, _dateAdded, true, recipient);
        Info[] storage arr = addressToHash[recipient]; //get the existing list
        //add to list
        arr.push(docInfo2);
        //add to map
        addressToHash[recipient] = arr;
        emit HashAdded(_ipfshash, _filehash, _dateAdded, recipient);
    }

    function get(string memory _hash) public returns (string memory, string memory, uint, bool) {
        return (
            _hash,
            collection[_hash].ipfshash,
            collection[_hash].dateAdded,
            collection[_hash].exist
        );
    }

    function getHashFromAddress(string memory _address) public returns (string[] memory , string[] memory){
        Info[] storage arr = addressToHash[_address];
        string[] memory filehashes = new string[](arr.length);
        string[] memory ipfshashes = new string[](arr.length);
       
        for(uint i = 0;i<arr.length;i++){
            Info storage info = arr[i];
            filehashes[i] = info.filehash;
            ipfshashes[i] = info.ipfshash;
        }
        return(filehashes, ipfshashes);
    }
}