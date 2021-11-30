const defaultRoute = (req,res)=>{
    res.send("<h1>I am the Admin router</h1>");
};

const login = (req,res)=>{
    res.send("<h1>Admin login</h1>");
};

const register = (req,res)=>{
    res.send("<h1>Admin register</h1>");
};

module.exports={
    defaultRoute,
    login,
    register
}