const axios = require('axios');

const getCountries = (req,res) =>{
    axios('https://restcountries.com/v2/all').then((result)=>{
        let modifiedResult=result.data.map((item)=>{
            return {name:item.name,code:item.alpha3Code}
        }
        )
        res.send(modifiedResult)
    }).catch((err)=>{
        console.log(err);
    });
}

const getCountriesAsync = async(req , res)=>{
    try {
        let result = await axios('https://restcountries.com/v2/all');
        let modifiedResult=result.data.map((item)=>{
            return {name:item.name,code:item.alpha3Code}
        });
        res.json(modifiedResult);
    } catch (error) {
        res.send(error);
    }

}

const getMultipleData = async(req,res)=>{
    try {
        const promises = [axios('https://restcountries.com/v2/all'),axios('https://api.coingecko.com/api/v3/asset_platforms')];
        let result = await Promise.all(promises);
        res.json({countries:result[0].data,platforms:result[1].data});

    } catch (error) {
        res.send(error);
    }
}

module.exports = {getCountries,getCountriesAsync,getMultipleData};