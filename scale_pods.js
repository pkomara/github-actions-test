const fs = require('fs');

let scheduleFile = './schedule_scale_pods.json';
let dateNow = new Date();
// dateNow.setUTCMinutes(45);
// dateNow.setUTCHours(14);
let hourNow = dateNow.getUTCHours();
let minsNow = dateNow.getUTCMinutes();
let statefulsetServices= ['voice-ors','voice-rq','voice-sip','voice-sipproxy' ];

console.log('Time now is '+dateNow.getUTCHours()+":"+dateNow.getUTCMinutes());

try {
    const schedule = fs.readFileSync(scheduleFile, 'utf8');
    const jsonSchedule = JSON.parse(schedule, null, 3);
    // console.log(schedule);

    for(let load in jsonSchedule['loadTests'])
    {
        let LoadStartTimeHour = parseInt(jsonSchedule['loadTests'][load]['startTime'].split(":")[0].trim()) ;
        let LoadStartTimeMins = parseInt(jsonSchedule['loadTests'][load]['startTime'].split(":")[1].trim()) ;
        let LoadEndTimeHour = parseInt(jsonSchedule['loadTests'][load]['endTime'].split(":")[0].trim()) ;
        let LoadEndTimeMins = parseInt(jsonSchedule['loadTests'][load]['endTime'].split(":")[1].trim());
    
        let timeDiffInMins=(LoadStartTimeHour-hourNow)*60 +LoadStartTimeMins-minsNow;
    
        if (timeDiffInMins>=0 && timeDiffInMins<60)    // pre-scale up the pods as load test is about to begin.
        {
            console.log(`${load} load test is about to start`);
            for ( let service in jsonSchedule['services'] ) 
            {
                console.log("Prescaling to "+ jsonSchedule['services'][service]['preScaleUpPods'] + " pods for service " + service);
                resourceType = statefulsetServices.includes(service) ? 'statefulset':'deployment';
                console.log("kubectl scale "+ resourceType +" -n voice "+service+" --replicas="+jsonSchedule['services'][service]['preScaleUpPods'])              
            }
        }
        
        timeDiffInMins=(hourNow-LoadEndTimeHour)*60 +minsNow-LoadEndTimeMins;
    
        if(timeDiffInMins>=0 && timeDiffInMins<60)    //scale down the pods as load test has ended.
        {
            console.log(`${load} load test is about to end`);
            for ( let service in jsonSchedule['services'] ) 
            {
                console.log("Down scaling to "+ jsonSchedule['services'][service]['replicaCount'] + " pods for service " + service);
                resourceType = statefulsetServices.includes(service) ? 'statefulset':'deployment';
                console.log("kubectl scale "+ resourceType +" -n voice "+service+" --replicas="+jsonSchedule['services'][service]['replicaCount']);         
            }
            if(! jsonSchedule['loadTests'][load].recursive){
                //remove the load information from the json file as the load is not recursive
                delete jsonSchedule['loadTests'][load];
                fs.writeFileSync(scheduleFile,JSON.stringify(jsonSchedule,null,3),'utf8');
            }
        }
    }

} catch (e) {
    console.log('Exception during processing');
    console.log(e);
}
