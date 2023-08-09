let created;
function backgroundSync() {
 
   
    navigator.serviceWorker.register('/notification_worker.js', {
      scope: '/',
      type: 'module'
    }).then((reg) => {
      let sw = reg.installing || reg.waiting || reg.active;
      if (sw && !created) {
        console.log('Service worker is active');
        
        sw.postMessage(JSON.stringify({uuid: pb.authStore.model.id, origin: window.location.origin, notify:  localStorage.getItem('notify') ? true : false }));
        
       
       window.addEventListener('message', (event) => { console.log('new event ====>', event); });
       setInterval(() => {
        sw.postMessage(JSON.stringify({action: 'ping'}));
        sw.update()
       }, 1000);
        
      }
      created = true
    })
    .catch((err) => {
      console.error('Error registering service worker:', err);
    });
  
    
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
 console.log('handling notifications')
}
