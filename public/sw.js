// self.addEventListener("push", () => {
//   self.registration.showNotification("Hello world!", {});
// });

self.addEventListener("push", (event) => {
  // Parse the payload from the received push notification
  let payload = {};
  try {
    payload = event.data.json();
  } catch (e) {
    // Handle parsing error
    console.error("Error parsing push notification payload:", e);
  }

  // Use the payload as the notification message
  const notificationOptions = {
    body: payload.message || "Default notification message",
    // icon: "path/to/your/icon.png", // Add the path to your custom icon
  };

  // Show the notification
  event.waitUntil(
    self.registration.showNotification(
      payload.title || "Default Title",
      notificationOptions
    )
  );
});
