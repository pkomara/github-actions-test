const fs = require('fs');

// let inputs = process.argv[2];
let inputs ='{"environment": "dev","load_end_time": "21:00","load_start_time": "21:45","location": "westus2","pre_scaleup_pods": "8","service_name": "voice-ors"}';

inputsJSON = JSON.parse(inputs,null,3);
// console.log(inputsJSON);
let scheduleFile = './schedule_scale_pods.json';

try {
    const schedule = fs.readFileSync(scheduleFile, 'utf8');
    var jsonSchedule = JSON.parse(schedule, null, 3);
    let service = inputsJSON['service_name'];

    if(jsonSchedule[service]==undefined){
        jsonSchedule[service] = JSON.parse("{}",null,3);
        resourceType = (execSync("kubectl -n voice get statefulset --selector servicename="+ service +"--no-headers -o custom-columns=':metadata.name' | grep -v canary | wc -l") ==0)?'deployment':'statefulset';
        jsonSchedule[service]['resourceType'] = resourceType;
    }


    //update json values
    jsonSchedule[service]['preScaleUpPods'] = inputsJSON['pre_scaleup_pods'];
    jsonSchedule[service]['startTime'] = inputsJSON['load_start_time'];
    jsonSchedule[service]['endTime'] = inputsJSON['load_end_time'];
    // jsonSchedule[service]['actualPods'] = parseInt(replicaCount);
    
    console.log(`updating schedule json \n${service}:`,jsonSchedule[service]);
    
    //write updated json to the file
    fs.writeFileSync(scheduleFile,JSON.stringify(jsonSchedule,null,3),'utf8');


} catch (e) {
    console.log('Exception during processing');
    console.log(e);
}
