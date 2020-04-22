import config from './config'
import WebServiceErrorStatusesEnum from './WebServiceErrorStatusesEnum'

class ipfsFile {
    constructor(hash, time, exists, url) {
        this.hash = hash;
        this.time = time;
        this.exists = exists;
        this.url = url;
    }
}

class WebService {
    async getFileAsync(hash) {
        console.log("in web service.js");
        var response = await fetch(`${config.apiServerAddress}/getfile?hash=${hash}`, {
            method: 'GET',
            headers: { 'Accept': 'text/plain', 'Content-Type': 'text/plain' }
        });

        if (response.status === 200) {
            var fileInfo = await response.json();
            return new ipfsFile(fileInfo.hash, new Date(fileInfo.unixTimeAdded * 1000).toString(), fileInfo.exists, fileInfo.url);
        }
        else if(response.status === 404) {
            return WebServiceErrorStatusesEnum.FileNotExist;
        }
        else {
            console.log('hash: '+ hash +' status: ' + response.status);
            return WebServiceErrorStatusesEnum.DifferentGetError;
        }
    }

    async getFileHash(privateKey) {
        var response = await fetch(`${config.apiServerAddress}/getHash?address=${privateKey}`, {
            method: 'GET',
            headers: { 'Accept': 'text/plain', 'Content-Type': 'text/plain' }
        });

        if (response.status === 200) {
            var fileInfo = await response.json();
            console.log("fileinfo\n",fileInfo);
            return fileInfo;
        }
        else if(response.status === 404) {
            return WebServiceErrorStatusesEnum.FileNotExist;
        }else if(response.status=== 501){
            return WebServiceErrorStatusesEnum.Wrongkey;
        }
        else {
            console.log('hash: '+  +' status: ' + response.status);
            return WebServiceErrorStatusesEnum.DifferentGetError;
        }
    }

    async addFileAsync(fileObj) {
          
            var response = await fetch(`${config.apiServerAddress}/addfile`, {
                method: 'POST',
                headers: { 'Accept': 'application/octet-stream', 'Content-Type': 'application/octet-stream' },
                body: fileObj
            });
    
            if (response.status === 200) {
                var json = await response.json();
                return json;
            }
            else if(response.status === 409) {
                return WebServiceErrorStatusesEnum.FileAlreadyExists;
            }
            else {
                return WebServiceErrorStatusesEnum.DifferentAddError;
            }
    }

    async addRecipient(data){
        console.log("inside web service",data);
        var response = await fetch(`${config.apiServerAddress}/addRecipient`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: data
        });

        if (response.status === 200) {
            var json = await response.json();
            return json;
        }else if(response.status === 409) {
            return WebServiceErrorStatusesEnum.UnauthorizedUser;
        }
        else {
            return WebServiceErrorStatusesEnum.DifferentAddError;
        }
    }
}

export default WebService;
export { ipfsFile };