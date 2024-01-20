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
    let sw = await navigator.serviceWorker.ready;
    let push = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_WEB_PUSH_PUBLIC,
    });

    await axios
      .post(postLink.subscribeWebPush, {
        token: Cookies.get("token"),
        pushSubscription: JSON.stringify(push),
      })
      .catch((err) => console.error(err));
  }

  if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") subscribe();
    });
  }

  if ("serviceWorker" in navigator) {
    window.onload = async () => {
      await navigator.serviceWorker.register("/sw.js");
    };
  }
} catch (error) {}
