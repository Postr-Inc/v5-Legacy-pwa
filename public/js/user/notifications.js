function backgroundSync() {
    if(navigator.serviceWorker) return;

    navigator.serviceWorker.register('/public/js/notification_worker.js',
    {scope: './public/js/'}
    ).then(function(registration) {
        console.log('Service worker successfully registered.');
    })


}
  
  backgroundSync();
  

 


export async function handleNotifications(){
  pb.collection('notifications').subscribe('*', (data) => {
    if(data.record.recipient == pb.authStore.model.id){
        console.log(data)
    }
  })
}