const fs = require('fs');

let environment = process.argv[2] || 'dev';
let location = process.argv[3] || 'westus2';
let action = process.argv[4] || 'apply'
let tenant_data = fs.readFileSync('./tenants/azure/'+environment+'/new_tenant.json', 'utf8');
console.log(tenant_data)

let tenantsFile = './tenants/azure/'+environment+'/tenants.json';
 
try {
    const tenants = fs.readFileSync(tenantsFile, 'utf8');
    const tenantsJSON = JSON.parse(tenants, null, 3);
    const tenantData = JSON.parse(tenant_data,null,3);
    let tenant_found = false;
    tenant_key = Object.keys(tenantData)[0];
    tenant_value = tenantData[tenant_key];

    if (action === 'apply') {

        if (tenant_value['key']) {
            delete tenant_value['key']
        }

        tenantsJSON.map((object, index) => {
            if (object.name === tenant_value.name && object.tenant_id === tenant_value.tenant_id) {
                tenant_found = true;
                tenantsJSON[index] = tenant_value
            }
        })

        if (!tenant_found) {
            tenantsJSON.push(tenant_value);
        }
    } else if (action === 'destroy') {
        const index = tenantsJSON.findIndex((tenant) => {
            return tenant.tenant_id === tenant_value.tenant_id;
        })

        if (index !== -1) tenantsJSON.splice(index, 1);
    } else { // for action as destroy-proxy
        let diffLocations = tenant_value.locations;
        const index = tenantsJSON.findIndex((tenant) => {
            return tenant.tenant_id === tenant_value.tenant_id;
        })

        if (index !== -1) {
            if (diffLocations.includes(location)) {
                tenantsJSON.splice(index, 1);
            } else {
                let locations = tenantsJSON[index][locations];
                locations = locations.filter((loc) => {
                    return !diffLocations.includes(loc);
                })
                tenantsJSON[index][locations] = locations;
            }
        }
    }

    fs.writeFileSync(tenantsFile, JSON.stringify(tenantsJSON, null, 3), 'utf8');

} catch (e) {
    console.log('Exception during processing');
    console.log(e);
}