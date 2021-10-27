const router = require('express').Router();
const paymentControllers = require('../controllers/payment');

router.get("/",paymentControllers.defaultRoute);
router.get("/login",paymentControllers.login);
router.get("/register",paymentControllers.register);

module.exports=router;