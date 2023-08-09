import Pocketbase from "/public/js/pb.js";
addEventListener("install", (event) => {
  console.log("Service worker installed");
  event.waitUntil(self.skipWaiting()); // Activate service worker immediately
});
addEventListener("activate", (event) => {
  console.log("Service worker activated");
  event.waitUntil(self.clients.claim()); // Take control of all open pages
});
addEventListener("message", (event) => {
  const messageData = JSON.parse(event.data);
  if (messageData.action === "ping") {
    console.log("Service worker received ping");
  }
});
function init() {
  addEventListener("message", (event) => {
    let data = JSON.parse(event.data);
    self.uuid = data.uuid;
    self.origin = data.origin;
    self.notify = data.notify;

    if (Notification.permission === "granted" && self.notify) {
      console.log("Notifications granted");
      const pb = new Pocketbase("https://postr.pockethost.io");
      let uuid = self.uuid;
      pb.autoCancellation(false);

      function subscrive() {
        pb.collection("notifications").subscribe("*", async (data) => {
          if (data.action === "create" && data.record.recipient == uuid) {
            let user = await pb.collection("users").getOne(data.record.author);
            console.log("user", user);
            let profile = `https://postr.pockethost.io/api/files/_pb_users_auth_/${user.id}/${user.avatar}`;
            // If you don't want to send a message, you can directly show the notification
            showNotification(
              data,
              data.record.title,
              data.record.body,
              self.origin + "/#/post/" + data.record.id,
              profile,
              data.record.id,
              pb,
              uuid
            );
            pb.collection("notifications").delete(data.record.id);
          }
        });
      }
      subscrive();
      // keep worker alive
      setInterval(async () => {
        await pb.collection("notifications").unsubscribe();
        subscrive();
      }, 1000 * 60 * 60 * 24);
    }
  });
}

init();

let count = 0;
function showNotification(dd, title, body, url, badge, id, pb, uuid) {
  self.registration.showNotification(title, {
    body: body,
    icon: badge,
    image: "/public/img/logo.png",
    vibrate: [200, 100, 200],
  });
  navigator.setAppBadge(++count);
  self.addEventListener("notificationclick", async function (event) {
    event.notification.close();

    navigator.setAppBadge(0);

    event.waitUntil(
      clients
        .matchAll({
          type: "window",
        })
        .then((windowClients) => {
          // Check if there is already a window/tab open with the target URL
          function open(url) {
            for (const client of windowClients) {
              if (client.url === url && "focus" in client) {
                return client.focus();
              }
            }
            // If no window/tab is already open, open a new one
            if (clients.openWindow) {
              return clients.openWindow(url);
            }
          }
          if (dd.record.post) {
            open(self.location.origin + "/#/post/" + dd.record.post);
          } else {
            open(self.location.origin + "/#/profile/" + dd.record.author);
          }
        })
    );
  });
}
