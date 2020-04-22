import React, { Component } from 'react';
import { Grid, Segment, Header, Form, List, Message, Icon,  Tab } from 'semantic-ui-react';
import ReactDropzone from 'react-dropzone';
import './App.css';
import WebService from './WebService'
import {ipfsFile} from './WebService'
import WebServiceErrorStatusesEnum from './WebServiceErrorStatusesEnum'

class App extends Component {
  state = {
    recipient: '',
    webServiceErrorStatus: null,
    isUploadLoading: false,
    isSearchLoading: false,
    isReaderError: false,
    isAfterUpload: false,
    isAfterSearch: false,
    fileHash: '',
    ipfsHash: '',
    ipfsHashes: [],
    fileInfo: null,
    urls:[],
    uploadedHashes: []
  }
  
  constructor() {
    super();
    this.WebService = null;
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleSend = this.handleSend.bind(this);
    
  }

  async componentWillMount() {
    this.WebService = new WebService();
    this.setState({
      fileInfo: new ipfsFile()
    });
  }

  

  changeUploadState = event => {
    this.setState({
      loading:this.state.webServiceErrorStatus,
    });
  }

  fileHashChanged = event => {
    this.setState({
      webServiceErrorStatus: null,
      isAfterSearch: false,
      fileHash: event.target.value,
    });
  };

  searchFormSubmitted = async () => {
    this.setState({
      isSearchLoading: true
    });
    
    var response = await this.WebService.getFileAsync(this.state.fileHash);

    if(response instanceof WebServiceErrorStatusesEnum) {
      this.setState({
        webServiceErrorStatus: response
      });
    }
    else {
      this.setState({
        fileInfo: response,
        isAfterSearch: true
      });
    }

    this.setState({
      isSearchLoading: false
    });
  };


  //gets the file hash from private key
  searchFormSubmitted1 = async () => {
    this.setState({
      isSearchLoading: true
    });
    //response is an array [{filehash:"",url:""},{}]
    var response = await this.WebService.getFileHash(this.state.recipient);
    console.log("in app.js\n",response);
    const urls = [];
    for(var i=0;i<response.length;i++){
      var url = response[i].url;
      urls.push(url);
    }
    console.log(urls);
    if(response instanceof WebServiceErrorStatusesEnum || response.length===0) {
      this.setState({
        webServiceErrorStatus: response
      });
    }
    else {
      this.setState({
        urls: urls,
        isAfterSearch: true
      });
    }

    this.setState({
      isSearchLoading: false
    });
  };

  fileDropped = async (acceptedFiles) => {
    console.log(this.state.recipient);
    acceptedFiles.forEach(file => {
      this.setState({
        isUploadLoading: true,
        webServiceErrorStatus: null,
        isReaderError : false
      });
  
      var uploadedHashes = [];
      //var ipfsHashes = [];
      const reader = new FileReader();

      reader.onerror = () => {
        console.log('file reading has failed');
        this.setState({
          isUploadLoading: false,
          isReaderError: true
        });
      }

      reader.onload = async () => {
        const fileAsArrayBuffer = reader.result;
    
        var response = await this.WebService.addFileAsync(fileAsArrayBuffer);

        if(response instanceof WebServiceErrorStatusesEnum) {
          this.setState({
            webServiceErrorStatus: response,
            isUploadLoading: false
          });
        }
        else {
          uploadedHashes.push(response.fileHash)
          //ipfsHashes.push(response.ipfsHash)
          var tempUploadedHashes = this.state.uploadedHashes;
          //var tempIPFSHash = this.state.ipfsHash;
          tempUploadedHashes.push(...uploadedHashes);
          //tempIPFSHash.push(...ipfsHashes);
          console.log(response);
          this.setState({
            fileHash: response.fileHash,
            ipfsHash:response.ipfsHash,
            uploadedHashes: tempUploadedHashes,
          });
          
        }

        //call addRecipient
        var data = JSON.stringify({address:this.state.recipient , fileHash:this.state.ipfsHash , uploadedHashes:this.state.fileHash});
        console.log("data is" , data);
        var response2 = await this.WebService.addRecipient(data);
        if(response2 instanceof WebServiceErrorStatusesEnum) {
          console.log("File already exists");
          //this.state.isAfterUpload= true;
          this.setState({
            webServiceErrorStatus:response2,
            isUploadLoading:false,
          });
          

        }else {
          this.setState({
            isAfterUpload: true,
            //fileHash: response.fileHash,
            //ipfsHash:response.ipfsHash,
            //uploadedHashes: tempUploadedHashes,
            isUploadLoading: false
          });
        }
      };

      reader.readAsArrayBuffer(file);
    });  
  };


  handleChangeAddress(event){
    this.setState({recipient: event.target.value});
    console.log(this.state.recipient);
  }

  handleSend = async(event) => {
    //document.getElementById('new-notification-form').reset();
    event.preventDefault();
    var data = JSON.stringify({address:this.state.recipient , fileHash:this.state.ipfsHash , uploadedHashes:this.state.uploadedHashes});
    console.log(data);
    var response =  this.WebService.addRecipient(data);
    console.log(response);
  };

  render() {
    return (
      <div>
        <div className="mainContent">
        <br/><br/>
          <Header inverted as='h1'>
            <Message.Header>Secure File Sharing Over Blockchain</Message.Header>
          </Header>
         <br/><br/>
       
          <Grid textAlign='center' >
            <Grid.Column style={{ maxWidth: '50%', maxHeight:'100%'}}>
              <Tab menu={{ secondary: true }} panes={[
                  { menuItem: {content: 'Upload', icon:'upload', key: 'Upload'},render: () => 
                    <Tab.Pane className='tabPane'>
                      <Segment basic loading={this.state.isUploadLoading}>
                      <Form id="new-notification-form">
                        <Form.Input fluid 
                            action={{disabled: this.state.recipient === ''}}
                            placeholder='Provide Address' 
                            type='text' value={this.state.value} 
                            onChange={this.handleChangeAddress} />
                            </Form>
                            <br/>
                        <Form error={this.state.webServiceErrorStatus === WebServiceErrorStatusesEnum.DifferentAddError}>
                          <Header color='blue' as='h2'>File Upload</Header>
                          <ReactDropzone multiple={true}
                            className='dropZoneDefaultState' 
                            acceptClassName='dropZoneAcceptState' 
                            rejectClassName='dropZoneRejectState' 
                            onDrop={this.fileDropped}>
                            <Segment style={{ width: '100%' , maxHeight: 1000}}>
                              <Icon disabled name='file outline' size='massive' color='teal'/>
                              <Header as='h4'>Click here</Header>
                            </Segment>
                          </ReactDropzone>
                          <Message error header='Action Error' content='Something went wrong. Please contact with system administrator.' />
                          <br/>
                        
                        </Form>
                        <br/>
                        
                        {this.state.isAfterUpload && this.state.uploadedHashes.length > 0 &&
                          <Segment raised style={{ maxWidth: 800, maxHeight: 450 }}>
                            <Header color='blue' as='h3'>Uploaded files hash list:</Header>
                            <List ordered relaxed style={{maxWidth: 800, maxHeight: 100, textAlign: 'left' , overflowY:'auto'} }>
                              {this.state.uploadedHashes.map((hash, index) => 
                                <List.Item key={index}>
                                  <List.Header>
                                    {hash}
                                  </List.Header>
                                </List.Item>)}
                            </List>    
                          </Segment>}
                        {this.state.webServiceErrorStatus === WebServiceErrorStatusesEnum.UnauthorizedUser &&
                          <Segment raised>
                            <Header color='red' as='h3'>Unauthorized User</Header>
                          </Segment>}
                        {this.state.isReaderError &&
                          <Segment raised>
                            <Header color='red' as='h3'>Problem with reading file!</Header>
                          </Segment>}
                      </Segment>
                     
                    </Tab.Pane> 
                  },
                  { menuItem: {content: 'Search', icon:'search', key: 'Search'}, render: () => 
                    <Tab.Pane className='tabPane'>
                      <Segment basic loading={this.state.isSearchLoading}>
                        <Header color='blue' as='h2'>Search</Header>
                        <Form onSubmit={this.searchFormSubmitted1} error={this.state.webServiceErrorStatus === WebServiceErrorStatusesEnum.DifferentGetError}>
                        <Form.Input fluid 
                            action={{disabled: this.state.recipient === '', icon: 'search'}}
                            placeholder='Provide Private Key' 
                            type='password' value={this.state.recipient} 
                            onChange={this.handleChangeAddress} />
                         </Form>
                         <br/>
                          <Form onSubmit={this.searchFormSubmitted} error={this.state.webServiceErrorStatus === WebServiceErrorStatusesEnum.DifferentGetError}>
                          <Form.Input fluid 
                            action={{disabled: this.state.fileHash === '', icon: 'search'}}
                            placeholder='Provide file hash...' 
                            type='text' value={this.state.fileHash} 
                            onChange={this.fileHashChanged} /> 
                            
                          <Message error header='Action Error' content='Something went wrong. Please contact with system administrator.' />
                        </Form>
                        {this.state.isAfterSearch &&
                          <Segment raised>
                                <Header color='blue' as='h3'>Files Authorized to Access:</Header>
                                <List ordered relaxed style={{maxWidth: 800, maxHeight: 100, textAlign: 'left' , overflowY:'auto'} }>
                              {this.state.urls.map((url, index) => 
                                  <List.Item key={index}>
                                    <List.Content>
                                      <List.Header>IPFS path (click link to check file)</List.Header>
                                      <List.Description>
                                        <a target="_blank" rel="noopener noreferrer" href={'http://' + url}>{url}</a>
                                      </List.Description>
                                    </List.Content>
                                  </List.Item>)}
                                </List>              
                          </Segment>} 
                          {this.state.webServiceErrorStatus === WebServiceErrorStatusesEnum.FileNotExist &&
                            <Segment>
                              <Header color='red' as='h3'>File info has not been found in blockchain.</Header>
                            </Segment>}
                            {this.state.webServiceErrorStatus === WebServiceErrorStatusesEnum.Wrongkey &&
                            <Segment>
                              <Header color='red' as='h3'>Wrong Private Key</Header>
                            </Segment>}
                      </Segment>
                    </Tab.Pane> 
                  }]
              }/>
            </Grid.Column>
          </Grid>
          
        </div>
      </div>
    );
  }
}

export default App;
