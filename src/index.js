import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import { postLink } from "./API";
import Cookies from "js-cookie";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

try {
  async function subscribe() {
    window.onload = async () =>
      await navigator.serviceWorker.register("/sw.js");

    let sw = await navigator.serviceWorker.ready;
    let push = await sw?.pushManager?.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_WEB_PUSH_PUBLIC,
    });
    if (sw && push)
      await axios
        .post(postLink.subscribeWebPush, {
          token: Cookies.get("token"),
          browserID: Cookies.get("browser-id"),
          pushSubscription: JSON.stringify(push),
        })
        .catch((err) => console.error(err));
  }

  if (
    document.cookie.length > 0 &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    Notification.permission !== "denied"
  ) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        subscribe();
      }
    });
  }
} catch (error) {
  // There's nothing we can do...
}
