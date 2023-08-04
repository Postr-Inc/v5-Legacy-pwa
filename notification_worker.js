import Pocketbase from "/public/js/pb.js";
self.skipWaiting();
addEventListener("message", (event) => {
    let self = JSON.parse(event.data);
    if (Notification.permission === 'granted' && self.notify) {
        console.log('Notifications granted');
        const pb = new Pocketbase('https://postr.pockethost.io');
        let uuid = self.uuid;
        pb.autoCancellation(false);
    
        pb.collection('notifications').subscribe('*', async (data) => {
            if (data.action === 'create' && data.record.recipient == uuid) {
              
                let user = await pb.collection('users').getOne(data.record.author);
                console.log('user', user);
                let profile = `https://postr.pockethost.io/api/files/_pb_users_auth_/${user.id}/${user.avatar}`
                // If you don't want to send a message, you can directly show the notification
                showNotification(data.record.title, data.record.body, self.origin + '/#/post/' + data.record.id, profile, data.record.id, pb);
            }
        });
        console.log('Awaiting Notifications');
    }
    
});
 

let count = 0;
function showNotification(title, body, url, badge, id, pb) {
   
    self.registration.showNotification(title, {
        body: body,
        icon: badge,
        image:'/public/img/logo.png',
        vibrate: [200, 100, 200]
    });
    navigator.setAppBadge(++count);
    self.addEventListener('notificationclick', async function (event) {
      await pb.collection('notifications').delete(id);
      navigator.setAppBadge(--count);
      event.notification.close();
      event.waitUntil(clients.openWindow(url));
      
    });
}
