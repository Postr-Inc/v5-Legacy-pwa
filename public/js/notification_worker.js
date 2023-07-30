let uuid;
self.onmessage = function(e) {
    
   if(e.data.uuid){
    self.uuid = e.data.uuid;
   }
   if(e.data.origin){
         self.origin = e.data.origin;
   }
}

if(Notification.permission == 'granted'){
    import('/public/js/pb.js').then(
        (module) => {
            const Pocketbase = module.default;
            const pb = new Pocketbase('https://postr.pockethost.io')
            let uuid = self.uuid;
            pb.autoCancellation(false)
             
             
            pb.collection('notifications').subscribe('*', async (data) => {
                if(data.action == 'create' && data.record.recipient.includes(uuid)){
                     let notification = new Notification(
                       `${record.username} posted a new post`,
                          {
                        body: data.record.body,
                        icon: self.origin + '/public/assets/images/logo.png'
                    });
                    notification.onclick = function() {
                        open(self.origin + '/#/post/' + data.record.id)
                        this.close();
                    }
                    notification.onclose = function() {
                        self.postMessage('Notification has closed!')
                    }
                   
    
                }
            })

          
            
            
           
            
             
    
        }  
    )       
}
 
  
 