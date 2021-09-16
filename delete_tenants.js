const fs = require('fs');

let environment = process.argv[2] || 'dev';
let tenant_data = fs.readFileSync('./tenants/azure/'+environment+'/new_tenant.json', 'utf8');
console.log(tenant_data)

let tenantsFile = './tenants/azure/'+environment+'/tenants.json';
 
try {
    const tenants = fs.readFileSync(tenantsFile, 'utf8');
    const tenantsJSON = JSON.parse(tenants, null, 3);
    const tenantData = JSON.parse(tenant_data,null,3);
    tenant_key = Object.keys(tenantData)[0];
    tenant_value = tenantData[tenant_key];
 
    let modifiedTenantsJSON = tenantsJSON.filter((object)=>{
        return object.tenant_id !== tenant_value.tenant_id;
    })


    fs.writeFileSync(tenantsFile,JSON.stringify(modifiedTenantsJSON,null,3),'utf8');

} catch (e) {
    console.log('Exception during processing');
    console.log(e);
}

