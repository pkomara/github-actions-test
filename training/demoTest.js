const addNumbers =require('./demo');

addNumbers(1,2,(err,res)=>{
    console.log(res);
})

// addNumbers= (a,b)=>{
//  return  new Promise((resolve,reject)=>{
//      setTimeout(() => {
//          resolve(a+b);
//      }, 2000);
//  })
// }

// async function main(){
//     console.log('Hi')  

//     let result = await addNumbers(1,2)
//     console.log(result);
//     console.log('There')
// }

// main();
