/* eslint-disable no-undef */
/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: process.env.VUE_APP_APIKEY,
  authDomain: process.env.VUE_APP_AUTHDOMAIN,
  projectId: process.env.VUE_APP_PROJECTId,
  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_MEASUREMENTID,
  appId: process.env.VUE_APP_APPId,
});



const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Recibido mensaje en background:', payload);
  // Aquí puedes manejar la notificación
});