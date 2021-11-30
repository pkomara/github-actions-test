const router = require('express').Router();
const userControllers = require('../controllers/user');

router.get("/",userControllers.defaultRoute);
router.get("/login",userControllers.login);
router.get("/register",userControllers.register);
router.get("/authenticate/:username/:password",userControllers.authenticate,userControllers.getProfile);

module.exports=router;