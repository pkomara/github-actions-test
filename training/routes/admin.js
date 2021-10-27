const router = require('express').Router();
const adminContollers = require('../controllers/admin');

router.get("/",adminContollers.defaultRoute);
router.get("/login",adminContollers.login);
router.get("/register",adminContollers.register);

module.exports=router;