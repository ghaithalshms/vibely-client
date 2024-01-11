import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import { postLink } from "./API";
import Cookies from "js-cookie";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

async function subscribe() {
  let sw = await navigator.serviceWorker.ready;
  let push = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.REACT_APP_WEB_PUSH_PUBLIC,
  });
  console.log(JSON.stringify(push));

  await axios
    .post(postLink.subscribeWebPush, {
      token: Cookies.get("token"),
      pushSubscription: JSON.stringify(push),
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err));
}

if ("Notification" in window && Notification.permission !== "denied") {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      const notification = new Notification("Hi there!");
      subscribe();
    }
  });
}

if ("serviceWorker" in navigator) {
  window.onload = async () => {
    let sw = await navigator.serviceWorker.register("./sw.js");
    console.log(sw);
  };
}
