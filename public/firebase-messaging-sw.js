// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDJX79LvtgtLxbjAqfF6b_AJsGJ0JMnrC0",
  authDomain: "medirep-79cbf.firebaseapp.com",
  projectId: "medirep-79cbf",
  storageBucket: "medirep-79cbf.firebasestorage.app",
  messagingSenderId: "370328830072",
  appId: "1:370328830072:web:40eafa195003c22d2a2d8d",
  measurementId: "G-7SVFGCVV9L"
});

const messaging = firebase.messaging();
