const defaultRoute = (req,res)=>{
    res.send("<h1>I am the Payment router</h1>");
};

const login = (req,res)=>{
    res.send("<h1>Payment login</h1>");
};

const register = (req,res)=>{
    res.send("<h1>Payment register</h1>");
};

module.exports={
    defaultRoute,
    login,
    register
}