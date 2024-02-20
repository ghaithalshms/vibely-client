self.addEventListener("push", async (event) => {
  let payload = {};
  try {
    payload = event.data.json();
  } catch (e) {
    console.error("Error parsing push notification payload:", e);
  }

  const notificationOptions = {
    body: payload.body,
    icon: `https://vibely-backend-fkpv.onrender.com/api/user/data/picture?username=${payload.title}`,
    data: { url: `https://vibely.rf.gd/inbox/${payload.title}` },
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, notificationOptions)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data.url;
  if (url) {
    clients.openWindow(url);
  }
});
