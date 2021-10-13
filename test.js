// var axios = require('axios');
// const execSync = require('child_process').execSync;

// // axios.get("https://consul-ui.api01-westus2.dev.genazure.com/v1/internal/ui/services?dc=westus2-dev").then(
// //     res => {
// //         let services = res.data.filter((obj)=>{
// //                 return obj["Name"].toUpperCase().includes('REDIS')
// //         })
// //         console.log(services)
// //     }
// // )

// let environment = process.argv[2] || 'dev';
// let region = process.argv[3] || 'westus2';

// let redis_err = '';

// function print_result() {
//     console.log('+++++++ Result summary +++++++')
//     if (redis_err) {
//         console.log(redis_err);
//     }
// }

// async function check_redis_entries_in_consul(environment, region) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let redis_entries = {};
//             let required_consul_entries = [
//                 'redis-config-state',
//                 'redis-agent-state',
//                 'redis-tenant-stream',
//                 'redis-call-state',
//                 'redis-registrar-state',
//                 'redis-sip-state',
//                 'redis-ors-stream',
//                 'redis-ors-state',
//                 'redis-rq-state'
//             ];

//             console.log('Get redis enterprise list in', environment, region);
//             let redisEnterpriseCmd = `az redisenterprise list --resource-group "service-voice-${region}-${environment}"`
//             console.log('Command - ' + redisEnterpriseCmd);
//             let redisEnterpriseCmdOutput = JSON.parse(execSync(redisEnterpriseCmd).toString(), null, 3);
//             let redisEnterpriseList = redisEnterpriseCmdOutput.map(obj => obj.hostName);

//             consul_entries = await axios.get(`https://consul-ui.api01-${region}.${environment}.genazure.com/v1/internal/ui/services?dc=${region}-${environment}`);
//             consul_entries.data.map((entry) => {
//                 if ((index = required_consul_entries.indexOf(entry["Name"])) > -1) {
//                     // redis_entries[entry["Name"]] = { Nodes : entry.Nodes,InstanceCount: entry.InstanceCount,ChecksPassing: entry.ChecksPassing,ChecksWarning: entry.ChecksWarning,ChecksCritical: entry.ChecksCritical}
//                     // if (entry.Name === 'redis-rq-state') entry.Nodes = ['voice@redis01-voice-wlgtgdua-westus2-dev.westus2.redisenterprise.cache.azure.net']
//                     false_redis_address = false;
//                     entry.Nodes.forEach((node) => {
//                         if (!redisEnterpriseList.includes(node.split('@')[1])) {
//                             false_redis_address = true;
//                             redis_err += `\n${node} is not present in ${environment} ${region} redis enterprise list for consul entry ${entry.Name}`;
//                         }
//                     })
//                     if (!false_redis_address) required_consul_entries.splice(index, 1);
//                 }
//             });

//             if (required_consul_entries.length > 0) {
//                 redis_err += '\nRedis entries required for voice services are missing in consul: ' + required_consul_entries;
//             }

//             resolve();
//         } catch (e) {
//             console.log('Exception during fetching entries from consul url', e);
//             redis_err += '\nRedis secret validation by script has failed for. Check runbook and validate redis secret manually';
//         }
//     });
// }

// async function main() {
//     try {
//         let promises = [];
//         promises.push(check_redis_entries_in_consul(environment, region));

//         await Promise.all(promises);

//         print_result();

//     } catch (e) {
//         console.log('Exception during processing');
//         console.log(e);
//     }
// }

// main()

const execSync = require('child_process').execSync;
const fs = require('fs');
function sleep(x) {
    return new Promise((resolve) => {  setTimeout(resolve, x);  });
  }

async function main(){  
    execSync("gh auth login --with-token < ./token.txt");
    execSync("gh workflow run service-version-info.yaml -f service_name=voice-ors --repo https://github.com/genesysengage/voice-test");
    await sleep(5);
    let run_id = execSync("gh run list -w service-version-info.yaml -L 1 --repo https://github.com/genesysengage/voice-test").toString().split("\t").reverse()[0].trim();
    execSync(`gh run watch ${run_id} --exit-status -i 10 --repo https://github.com/genesysengage/voice-test`);
    if (fs.existsSync('version_info.json')) {
        fs.unlinkSync('version_info.json', (err) => {
            if (err) console.log(err);
        })
    }
    console.log(run_id)
    execSync(`gh run download ${run_id} -n version_info.json --repo https://github.com/genesysengage/voice-test`);
    serviceInfoJson=fs.readFileSync('version_info.json', 'utf8');
    console.log(serviceInfoJson);
}

main();