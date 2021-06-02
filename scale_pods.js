const fs = require('fs');

let scheduleFile = './schedule_scale_pods.json';
let dateNow = new Date();
dateNow.setUTCMinutes(40);
dateNow.setUTCHours(15);
let hourNow = dateNow.getUTCHours();
let minsNow = dateNow.getUTCMinutes();


console.log('Time now is '+dateNow.getUTCHours()+":"+dateNow.getUTCMinutes());


try {
    const schedule = fs.readFileSync(scheduleFile, 'utf8');
    const jsonSchedule = JSON.parse(schedule, null, 3);
    // console.log(schedule);
    let LoadStartTimeHour = parseInt(jsonSchedule['loadStartTime'].split(":")[0].trim()) ;
    let LoadStartTimeMins = parseInt(jsonSchedule['loadStartTime'].split(":")[1].trim()) ;
    let LoadEndTimeHour = parseInt(jsonSchedule['loadEndTime'].split(":")[0].trim()) ;
    let LoadEndTimeMins = parseInt(jsonSchedule['loadEndTime'].split(":")[1].trim());
    
    for ( let service in jsonSchedule.services ) {

        let timeDiffInMins=(LoadStartTimeHour-hourNow)*60 +LoadStartTimeMins-minsNow;

        if (timeDiffInMins>=0 && timeDiffInMins<60){
            // pre-scale up the pods as load test is about to begin.
            console.log("Prescaling to "+ jsonSchedule['services'][service]['preScaleUpPods'] + " pods for service " + service);               
        }
        
        timeDiffInMins=(hourNow-LoadEndTimeHour)*60 +minsNow-LoadEndTimeMins;

        if(timeDiffInMins>=0 && timeDiffInMins<60){
            //scale down the pods as load test has ended.
            console.log("Down scaling to "+ jsonSchedule['services'][service]['replicaCount'] + " pods for service " + service);
        }
    }

} catch (e) {
    console.log('Exception during processing');
    console.log(e);
}
