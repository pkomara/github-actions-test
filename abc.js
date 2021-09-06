const fs = require('fs');

let environment = process.argv[2] || 'dev';
// let tenant_data = process.argv[3] ;
let tenant_data = fs.readFileSync('./tenants/azure/'+environment+'/sample.json', 'utf8');
console.log(tenant_data)

let tenantsFile = './tenants/azure/'+environment+'/tenants.json';
 
try {
    const tenants = fs.readFileSync(tenantsFile, 'utf8');
    const tenantsJSON = JSON.parse(tenants, null, 3);
    const tenantData = JSON.parse(tenant_data,null,3);
    const tenant_found = false;
    tenant_key = Object.keys(tenantData)[0];
    tenant_value = tenantData[tenant_key];
    if(tenant_value['key']){
        delete tenant_value['key']
    }

    tenantsJSON.map((object,index)=>{
        if(object.name === tenant_value.name){
            tenant_found = true;
            tenantsJSON[index] = tenant_value
        }
    })

    if(! tenant_found){
        tenantsJSON.push(tenant_value);
    }

    fs.writeFileSync(tenantsFile,JSON.stringify(tenantsJSON,null,3),'utf8');

} catch (e) {
    console.log('Exception during processing');
    console.log(e);
}

