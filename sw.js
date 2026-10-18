/* AI FUSION service worker.
 * Same-origin GETs only. Never cache or intercept cross-origin requests
 * (GoHighLevel embeds on link.aifusionautomations.com, booking calendars,
 * forms and analytics) or form POSTs.
 */
/* eslint-disable no-restricted-globals */
"use strict";

var CACHE_VERSION = "aifa-pwa-v1";
var OFFLINE_URL = "/offline.html";

var SHELL_URLS = [
  "/",
  OFFLINE_URL,
  "/add-to-your-phone.html",
  "/manifest.json",
  "/css/site-chrome.css",
  "/js/pwa.js",
  "/js/aifa-nav.js",
  "/img/brand/fusion-flow-icon-128.webp",
  "/img/brand/icon-192.png",
  "/img/brand/icon-512.png",
  "/img/brand/icon-192-maskable.png",
  "/img/brand/icon-512-maskable.png",
  "/favicon.ico",
  "/favicon-192.png",
  "/fonts/plus-jakarta-sans-latin.woff2"
];

function sameOrigin(request) {
  try {
    return new URL(request.url).origin === self.location.origin;
  } catch (err) {
    return false;
  }
}

function isApiPath(request) {
  try {
    return new URL(request.url).pathname.indexOf("/api/") === 0;
  } catch (err) {
    return false;
  }
}

function isHtmlRequest(request) {
  if (request.mode === "navigate") return true;
  var accept = request.headers.get("accept") || "";
  return accept.indexOf("text/html") !== -1;
}

function precacheShell() {
  return caches.open(CACHE_VERSION).then(function (cache) {
    return Promise.all(
      SHELL_URLS.map(function (url) {
        return cache.add(url).catch(function () {
          return undefined;
        });
      })
    );
  });
}

function dropOldCaches() {
  return caches.keys().then(function (keys) {
    return Promise.all(
      keys
        .filter(function (key) {
          return key !== CACHE_VERSION;
        })
        .map(function (key) {
          return caches.delete(key);
        })
    );
  });
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    precacheShell().then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    dropOldCaches().then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;

  if (request.method !== "GET") return;
  if (!sameOrigin(request)) return;
  if (isApiPath(request)) return;

  if (isHtmlRequest(request)) {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          if (response && response.ok) {
            var copy = response.clone();
            caches.open(CACHE_VERSION).then(function (cache) {
              cache.put(request, copy);
            });
          }
          return response;
        })
        .catch(function () {
          return caches.match(request).then(function (cached) {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (response) {
        if (response && response.ok) {
          var copy = response.clone();
          caches.open(CACHE_VERSION).then(function (cache) {
            cache.put(request, copy);
          });
        }
        return response;
      });
    })
  );
});
