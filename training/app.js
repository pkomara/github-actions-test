const express = require('express');
const app = express();
const admin = require('./routes/admin');
const user = require('./routes/user');
const payment = require('./routes/payment');
const lookup = require('./routes/lookup');

app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.listen(5000,err=>{
    if(err){
        console.log(err);
    }
    else{
        console.log('App running on port 5000')
    }
});

app.use("/admin",admin);
app.use("/payment",payment);
app.use("/user",user);
app.use("/lookup",lookup);
