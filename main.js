let isScaledUp=false;

setTimeout(()=>{  
    if(!isScaledUp){
        console.log('Pre Scaling of pods failed');
        process.exit(1);
    }
    },3000);

( function checkPodStatus(stopChecking,podCount){ 
    setTimeout(() => {
      if(podCount == 5)
      {
          stopChecking=true;
          isScaledUp=true;
      }               
      if (!stopChecking)
      {
          checkPodStatus(stopChecking,++podCount);
      }  
    }, 1000);
  }
)(false,0);