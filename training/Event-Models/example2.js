const {createReadStream} = require('fs');

let chunkIndex =0;
const readStream =  createReadStream('./lorem.txt');

readStream.on('data',(info)=>{
    console.log('============================='+ chunkIndex++ +'=========================');
    
})