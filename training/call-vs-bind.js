function Emp(gender){
    console.log(this.firstName);
    console.log(this.lastName);
    console.log(gender);
}

var obj1 = {
    "firstName":'Pavan',
    "lastName":'Sai'
}

var obj2 ={
    "firstName":'K',
    "lastName":'P'
}

executeLater2=Emp.bind(obj2,"M");
executeLater1=Emp.bind(obj1,"M");

executeLater2();
executeLater1();
