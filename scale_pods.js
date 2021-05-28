const fs = require('fs');


let scheduleFile = './schedule_scale_pods.json';
let dateNow = new Date();
dateNow.setUTCMinutes(30);
dateNow.setUTCHours(15);

console.log('Time now is '+dateNow.getUTCHours()+":"+dateNow.getUTCMinutes());

function calculateTimeDiffInMins(time1,time2){
    diffMs=Math.abs(time1-time2)
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); 
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); 
    return (diffHrs*60+diffMins);
}

try {
    const schedule = fs.readFileSync(scheduleFile, 'utf8');
    const jsonSchedule = JSON.parse(schedule, null, 3);
    // console.log(schedule);
    for ( let service in jsonSchedule ) {
        let LoadStartTime = new Date();
        let LoadEndTime = new Date();

        const LoadStartTimeHour = parseInt(jsonSchedule[service]['startTime'].split(":")[0].trim()) ;
        const LoadStartTimeMins = parseInt(jsonSchedule[service]['startTime'].split(":")[1].trim()) ;
        const LoadEndTimeHour = parseInt(jsonSchedule[service]['endTime'].split(":")[0].trim()) ;
        const LoadEndTimeMins = parseInt(jsonSchedule[service]['endTime'].split(":")[1].trim());

        LoadStartTime.setUTCHours(LoadStartTimeHour);
        LoadStartTime.setUTCMinutes(LoadStartTimeMins);
        LoadEndTime.setUTCHours(LoadEndTimeHour);
        LoadEndTime.setUTCMinutes(LoadEndTimeMins);

        let timeDiffInMins=calculateTimeDiffInMins(LoadStartTime,dateNow);
        console.log('Load start :',LoadStartTime.toUTCString())
        console.log('Load End : ',LoadEndTime.toUTCString())
        if ((dateNow <= LoadStartTime) && (timeDiffInMins>=0 && timeDiffInMins<30)){
            // pre-scale up the pods as load test is about to begin.
            console.log("Prescaling to "+ jsonSchedule[service]['preScaleUpPods'] + " pods for service " + service);              

        }

        timeDiffInMins=calculateTimeDiffInMins(LoadEndTime,dateNow);

        if((dateNow >= LoadEndTime) && (timeDiffInMins>=0 && timeDiffInMins<30) ){
            //scale down the pods as load test has ended.
            console.log("Down scaling to "+ jsonSchedule[service]['actualPods'] + " pods for service " + service);
        }
    }

} catch (e) {
    console.log('Exception during processing');
    console.log(e);
}
