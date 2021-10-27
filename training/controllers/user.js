const defaultRoute = (req,res)=>{
    res.send("<h1>I am the user router</h1>");
};

const login = (req,res,next)=>{
    
};

const register = (req,res)=>{
    res.send("<h1>User register</h1>");
};

const authenticate = (req ,res , next )=>{
    if(req.params.username === 'pavan' && req.params.password === '1234'){
        req.body.name = 'Pavan Sai Komara'
        next();
    }
    else{
        res.send("<h1>You are not authenticated</h1>");
    }
}

const getProfile = (req , res)=>{
    res.json({
        username : req.body.name,
        gender : 'M'
    });
};

module.exports={
    defaultRoute,
    login,
    register,
    authenticate,
    getProfile
}