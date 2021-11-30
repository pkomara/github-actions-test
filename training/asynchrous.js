// var prom1 = new Promise((resolve,reject)=>{
// if (true){
//     resolve('I am good');
// }
// else{
//     reject('Not fine');
// }
// });

const { default: axios } = require("axios");

// function sleep(x){
//     return new Promise((resolve,reject)=>{
//         try {
//             setTimeout(()=>{resolve('after 10 seconds')},x*1000);
//         } catch (error) {
//             reject(error);
//         }
//     });
// };

// Promise.all([prom1,sleep(10)]).then(result=>{
//     console.log(result);
// }).catch(err=>{
//     console.log(err);
// });

axios('https://restcountries.com/v2/all').then((result)=>{
    let modifiedResult=result.data.map((item)=>{
        return {name:item.name,code:item.alpha3Code}
    }
    )
    console.log(modifiedResult[0])
}).catch((err)=>{
    console.log(err);
});


(async()=>{
    try {
        var y= await axios('https://restcountries.com/v2/all');
        // console.log('Get result from async');
        console.log(y.data[0][0]);
    } catch (error) {
        console.log(error);
    }
})();

