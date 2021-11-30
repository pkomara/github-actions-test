var allRequests = new Map();
var currentKey = 1;

 function addNewRequest(command, region, tenantId) {
    var newRequest = {};
    newRequest.key =  currentKey;
    newRequest.command = command;
    newRequest.region = region ? region : " ";
    newRequest.tenantId = tenantId? tenantId : " ";
    newRequest.requestSent = false;
    newRequest.responseReceived = false;
     allRequests.set( currentKey++, newRequest);
    console.log('All requests :' , allRequests);
    console.log('addNewRequest() | newRequest: ' + newRequest);
    // return newRequest.key;
  }

  async function sendRequestToVM() {
    let sendRequests = new Map();
    console.log("All requests :", allRequests);
    try {
      for(const key of  allRequests.keys())
      {
        if(! allRequests.get(key).requestSent)
        {
          sendRequests.set(key, allRequests.get(key));
           allRequests.get(key).requestSent = true;
        }
        console.log(sendRequests);
      }
      console.log('sendRequestToVM() | sendRequests: ' , sendRequests);
      return sendRequests;
    } catch (error) {
      console.log("Error : ",error)
    }
}

async function main(){
    await addNewRequest('version-info');
    await addNewRequest('version-info');
    // allRequests.get(1).responseReceived=true
    // console.log(allRequests.values())
    allRequests.forEach((value,key) => {
      console.log(`print key and value ${key} , ${value.requestSent}`);
      
      
    });

}

main();

// const restify = require('restify');

// const server = restify.createServer();
// addNewRequest('version-info')
// server.listen(3000, function () {
//     console.log(`\nBot started, ${server.name} listening to ${server.url}`);
//   });
//   server.use(restify.plugins.bodyParser({ mapParams: true }));
//   server.post("/api/processedCommands", async (req,res)=>{
//     console.log(req.body);
//     for ( const item of req.body){
//       console.log(item)
//       processedRequest = allRequests.get(item.key);
//       console.log('inside the for ',processedRequest);
//       processedRequest.responseReceived = true;
//       processedRequest.response=item.response;
//       allRequests.set(item.key,processedRequest);
//       }
//         console.log('processResponseFromVM() | allRequests: ' + this.allRequests);
//   });