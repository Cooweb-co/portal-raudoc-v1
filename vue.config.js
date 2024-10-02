module.exports = {
    transpileDependencies: ["@vueform"],
    pwa: {
        workboxOptions: {
          importWorkboxFrom: 'cdn',
          swDest: 'firebase-messaging-sw.js',
          importScripts: [
            'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
            'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
          ]
        }
    }
}