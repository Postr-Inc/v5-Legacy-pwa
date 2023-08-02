let uuid;
let notify
self.onmessage = function(e) {
   
    uuid = e.data.uuid;
    self.origin = e.data.origin;
    notify = e.data.notify;
    self.uuid = e.data.uuid;
    self.pb = e.data.pb;
}
 
let registered = false;
 
if(Notification.permission == 'granted'){
 
 
            let uuid = self.uuid; 
             
             
            self.pb.collection('notifications').subscribe('*', async (data) => {
                 
                 
                if(data.action == 'create' && data.record.recipient == uuid){
                     
                    showNotification(data.record.title, data.record.body,  self.origin + '/#/post/' + data.record.id)
                    
                   
    
                }
            })

          
            
            
           
            
             
    
      
}

function showNotification(title, body, url) {
    self.registration.showNotification(title, {
        body: body,
        icon: '/public/img/logo.png',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
    });
  }
 
  
 