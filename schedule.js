const fs = require('fs');

// let inputs = process.argv[2];
let inputs ='{"environment": "dev","load_end_time": "21:00","load_start_time": "21:45","location": "westus2","pre_scaleup_pods": "8","service_name": "voice-ors"}';

inputsJSON = JSON.parse(inputs,null,3);
// console.log(inputsJSON);
let scheduleFile = './schedule_scale_pods.json';

try {
    const schedule = fs.readFileSync(scheduleFile, 'utf8');
    const jsonSchedule = JSON.parse(schedule, null, 3);
    let service = inputsJSON['service_name'];

    if(jsonSchedule['services'][service]==undefined){
        jsonSchedule['services'][service] = JSON.parse("{}",null,3);
        jsonSchedule['services'][service]['resourceType'] = 'statefulset';
    }

    //update json values
    jsonSchedule['services'][service]['preScaleUpPods'] = inputsJSON['pre_scaleup_pods'] ? inputsJSON['pre_scaleup_pods']:jsonSchedule['services'][service]['preScaleUpPods'];
    jsonSchedule['loadStartTime'] = inputsJSON['load_start_time'] ? inputsJSON['load_start_time']:jsonSchedule['loadStartTime'];
    jsonSchedule['loadEndTime'] = inputsJSON['load_end_time'] ? inputsJSON['load_end_time']:jsonSchedule['loadEndTime'];
    // jsonSchedule['services'][service]['replicaCount'] = parseInt(replicaCount);
    
    console.log(`updating schedule json \n${service}:`,jsonSchedule['services'][service]);
    
    //write updated json to the file
    fs.writeFileSync(scheduleFile,JSON.stringify(jsonSchedule,null,3),'utf8');

} catch (e) {
    console.log('Exception during processing');
    console.log(e);
}