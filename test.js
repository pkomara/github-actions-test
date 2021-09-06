// axios.get("https://consul-ui.api01-westus2.dev.genazure.com/v1/internal/ui/services?dc=westus2-dev").then(
//     res => {
//         let services = res.data.filter((obj)=>{
//                 return obj["Name"].toUpperCase().includes('REDIS')
//         })
//         console.log(services)
//     }
// )

var axios = require('axios');

let environment = process.argv[2] || 'dev';
let region = process.argv[3] || 'westus2';

let redis_err = '';

function print_result() {
    console.log('+++++++ Result summary +++++++')
    if (redis_err) {
        console.log(redis_err);
    }
        
}

async function check_redis_entries_in_consul(environment, region) {
    return new Promise(async (resolve, reject) => {
        try {
            let redis_entries = [];
            let missing_consul_entries = [];
            let required_consul_entries = [
                'redis-config-state',
                'redis-agent-state',
                'redis-tenant-stream',
                'redis-call-state',
                'redis-registrar-state',
                'redis-sip-state',
                'redis-ors-stream',
                'redis-ors-state',
                'redis-rq-state'
            ];

            consul_entries = await axios.get(`https://consul-ui.api01-${region}.${environment}.genazure.com/v1/internal/ui/services?dc=${region}-${environment}`);
            consul_entries.data.map((entry) => {
                if (entry["Name"].toUpperCase().includes('REDIS')) {
                    redis_entries.push(entry["Name"]);
                }
            });

            required_consul_entries.map((entry, idx) => {
                let index = redis_entries.indexOf(entry.trim());
                if (index < 0) {
                    missing_consul_entries.push(required_consul_entries[idx]);
                } else {
                    console.log(entry + " entry is present in consul")
                }
            });

            if (missing_consul_entries.length > 0) {
                redis_err += '\nRedis entries required for voice services are missing in consul: ' + missing_consul_entries;
            }

            resolve();
        } catch (e) {
            console.log('Exception during fetching entries from consul url', e);
            redis_err += '\nRedis secret validation by script has failed for. Check runbook and validate redis secret manually';
        }
    });
}

async function main() {
    try {
        let promises = [];
        promises.push(check_redis_entries_in_consul(environment, region));

        await Promise.all(promises);

        print_result();

    } catch (e) {
        console.log('Exception during processing');
        console.log(e);
    }
}

main()