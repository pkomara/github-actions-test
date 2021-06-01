const fs = require('fs');

let scheduleFile = './schedule_scale_pods.json';
let dateNow = new Date();
dateNow.setUTCMinutes(10);
dateNow.setUTCHours(16);
let hourNow = dateNow.getUTCHours();
let minsNow = dateNow.getUTCMinutes();


console.log('Time now is '+dateNow.getUTCHours()+":"+dateNow.getUTCMinutes());


try {
    const schedule = fs.readFileSync(scheduleFile, 'utf8');
    const jsonSchedule = JSON.parse(schedule, null, 3);
    // console.log(schedule);
    for ( let service in jsonSchedule ) {

        let LoadStartTimeHour = parseInt(jsonSchedule[service]['startTime'].split(":")[0].trim()) ;
        let LoadStartTimeMins = parseInt(jsonSchedule[service]['startTime'].split(":")[1].trim()) ;
        let LoadEndTimeHour = parseInt(jsonSchedule[service]['endTime'].split(":")[0].trim()) ;
        let LoadEndTimeMins = parseInt(jsonSchedule[service]['endTime'].split(":")[1].trim());

        let timeDiffInMins=(LoadStartTimeHour-hourNow)*60 +LoadStartTimeMins-minsNow;

        if (timeDiffInMins>=0 && timeDiffInMins<60){
            // pre-scale up the pods as load test is about to begin.
            if( parseInt(jsonSchedule[service]['actualPods']) < parseInt(jsonSchedule[service]['preScaleUpPods']) ) // donot pre-scale pods when actual pod count is more than preScaleUpPods value
            {
                console.log("Prescaling to "+ jsonSchedule[service]['preScaleUpPods'] + " pods for service " + service);
                // let output = execSync("kubectl scale "+ jsonSchedule[service]['resourceType'] +" -n voice "+service+" --replicas="+jsonSchedule[service]['preScaleUpPods'])
                // console.log("Prescaled pods for service "+service +" : " +output);                
            }
            else{
                console.log("Cannot prescale as preScaleUpPods value is less than actual pod count")
            }
        }
        
        timeDiffInMins=(hourNow-LoadEndTimeHour)*60 +minsNow-LoadEndTimeMins;

        if(timeDiffInMins>=0 && timeDiffInMins<60){
            //scale down the pods as load test has ended.
            console.log("Down scaling to "+ jsonSchedule[service]['actualPods'] + " pods for service " + service);
            // let output = execSync("kubectl scale "+ jsonSchedule[service]['resourceType'] +" -n voice "+service+" --replicas="+jsonSchedule[service]['actualPods']);
            // console.log("downscaled pods for service "+service +" : " +output);
        }
    }

} catch (e) {
    console.log('Exception during processing');
    console.log(e);
}
