importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '561852282413'
});

console.log(firebase.messaging());


self.addEventListener('install', function () {
    console.log('Install!');
})

self.addEventListener('activate', function () {
    console.log('Activate!');
})

self.addEventListener('fetch', function (event) {
    //console.log('Fetch!', event.request);
})