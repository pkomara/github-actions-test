const promise = new Promise((resolve , reject)=>{
    if (true){
        resolve('Promise resolved');
    }
    else{
        console.log('There is some issue');
    }
});

promise.then((result=>{
    console.log(result);
})).catch((err)=>{
    console.log(err);
});

console.log('I am outside of promise')