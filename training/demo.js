addNumbers= (a,b,callback)=>{
    setTimeout(() => {
        return callback(null,a+b);
    }, 2000);
}

module.exports= addNumbers;