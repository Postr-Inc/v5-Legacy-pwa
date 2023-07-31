let created;
function backgroundSync() {
    let worker = new Worker('public/js/notification_worker.js');
    if(!localStorage.getItem('notify')){
      console.log('no notify')
      worker.terminate()
      return;
    }
    if(!created) {
        created = true;
     
    let userid = pb.authStore.isValid ? pb.authStore.model.id : null;
    
    worker.postMessage({uuid: userid});
    worker.postMessage({origin: window.location.origin});
    worker.onmessage = function(e) {
       console.log(e.data)
    }
    
    if(Notification.requestPermission() == 'granted'){
        handleNotifications()
    }
 
   
   }
  }
   
   
  // constantly check if the user is logged in for notifications
 let timer =  setInterval(() => {
    if(pb.authStore.isValid){
        backgroundSync()
        clearInterval(timer)
        console.log('cleared')
    }
  }, 1000)

 

 


export async function handleNotifications(){
  pb.collection('notifications').subscribe('*', (data) => {
    if(data.record.recipient == pb.authStore.model.id){
        console.log(data)
    }
  })
}