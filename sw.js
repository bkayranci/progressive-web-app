"use strict";

var cacheName = "static";
var cachePageFiles = [
  "/",
  "/index.html",
  "/src/js/app.js",
  "/src/css/app.css",
  "/src/images/pwa.png",
  "/src/images/pwa.jpg",
  "/src/images/not-found.jpg",
  "/src/images/icons/app-icon-144x144.png",
  "/src/images/icons/app-icon-256x256.png",
  "/src/images/icons/app-icon-96x96.png",
  "/src/images/icons/app-icon-512x512.png",
  "https://fonts.googleapis.com/css?family=Raleway:400,700",
  "/notFound.html"
];

self.addEventListener("push", function (event) {
  var notifiBody = "PWA Push Notification";
  var imageIcon = "/src/images/badge-icon.png";
  var redirectUrl = "https://developers.google.com/web/fundamentals/codelabs/push-notifications";
  self.registration.showNotification("Click Here", {
    body: notifiBody,
    icon: imageIcon,
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      redirectUrl
    },
    timeout: 1000
  });
});

self.addEventListener("notificationclick", function (event) {
  var url = event.notification.data.redirectUrl;
  event.waitUntil(
    clients.matchAll({
      type: "window"
    }).then(windowClients => {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener("install", function (event) {
  console.log("SW Installed");
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName)
      .then(function (cache) {
        return cache.addAll(cachePageFiles);
      })
  );
});

self.addEventListener("activate", function (event) {
  self.clients.claim();
  console.log("SW Activated");
  event.waitUntil(
    caches.keys()
      .then(function (cacheKeys) {
        var deletePromises = [];
        for (var i = 0; i < cacheKeys.length; i++) {
          if (cacheKeys[i] !== cacheName) {
            deletePromises.push(caches.delete(cacheKeys[i]));
          }
        }
        return Promise.all(deletePromises);
      })
  )
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (res) {
        if (res) {
        // return new Response("hello")
          return res;
        } else {
          return fetch(event.request);
        }
      }).catch(function () {
        return caches.match("notFound.html");
      })
  );
});