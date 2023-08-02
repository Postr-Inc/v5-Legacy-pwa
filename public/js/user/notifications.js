let created;
function backgroundSync() {
  navigator.serviceWorker.register('/public/js/notification_worker.js', {
    type: 'module',
  }).then((registration) => {
    console.log('registered', registration);
    
    registration.addEventListener('activate', () => {
      registration.active.postMessage({
        uuid: pb.authStore.model.id,
        origin: window.location.origin,
      });
    });
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
