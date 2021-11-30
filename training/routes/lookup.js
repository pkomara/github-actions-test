const router = require('express').Router();
const lookupControllers = require('../controllers/lookup');

router.get("/getCountries",lookupControllers.getCountries);
router.get("/getCountriesAsync",lookupControllers.getCountriesAsync);
router.get("/getMultipleData",lookupControllers.getMultipleData);


module.exports=router;