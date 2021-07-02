const fs = require('fs');

// let inputs = process.argv[2];
let inputs ='{"load_end_time": "21:00","load_start_time": "21:45","location": "westus2","load_test_name": "load3","is_load_recursive":false}';

inputsJSON = JSON.parse(inputs,null,3);
// console.log(inputsJSON);
let scheduleFile = './schedule_scale_pods.json';

try {
    const schedule = fs.readFileSync(scheduleFile, 'utf8');
    const jsonSchedule = JSON.parse(schedule, null, 3);
    let load = inputsJSON['load_test_name'];

    if(jsonSchedule['loadTests'][load]==undefined){
        jsonSchedule['loadTests'][load]= JSON.parse("{}",null,3);
    }

    //update json values
    jsonSchedule['loadTests'][load]['startTime'] = inputsJSON['load_start_time'] ? inputsJSON['load_start_time']:jsonSchedule['loadTests'][load]['startTime'];
    jsonSchedule['loadTests'][load]['endTime'] = inputsJSON['load_end_time'] ? inputsJSON['load_end_time']:jsonSchedule['loadTests'][load]['endTime'];    
    jsonSchedule['loadTests'][load]['recursive'] = inputsJSON['is_load_recursive'];
    
    console.log(`updating schedule json for load tests`);
    
    //write updated json to the file
    fs.writeFileSync(scheduleFile,JSON.stringify(jsonSchedule,null,3),'utf8');

} catch (e) {
    console.log('Exception during processing');
    console.log(e);
}