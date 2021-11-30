var x =[12,3 ,5, 9,20 ,2, 10];

Array.prototype.getEvens= function(){
    let y=[];
    for (let index = 0; index < this.length; index++) {
        if (this[index]%2==0)  y.push(this[index]);
    }
    return y;
}

let y= x.getEvens();
console.log(y);