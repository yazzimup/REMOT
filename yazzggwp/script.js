// ==UserScript==
// @name         Google Dice Remote Injector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Memanipulasi Google Dice secara real-time via Firebase
// @author       YAZZ Developer
// @match        https://www.google.com/search*
// @match        https://www.google.co.id/search*
// @grant        none
// @require      https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js
// @require      https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js
// == ==/UserScript==

(function() {
    'use strict';

    // Konfigurasi Firebase yang sama persis dengan YAZZ Remote
    const firebaseConfig = {
        apiKey: "API_KEY_ANDA",
        authDomain: "PROJECT_ID.firebaseapp.com",
        databaseURL: "https://PROJECT_ID-default-rtdb.firebaseio.com",
        projectId: "PROJECT_ID",
        storageBucket: "PROJECT_ID.appspot.com",
        messagingSenderId: "SENDER_ID",
        appId: "APP_ID"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();

    // Fungsi untuk menyuntikkan nilai ke elemen Google Dice DOM
    function manipulateDice(targetValue) {
        // Selektor elemen hasil dadu Google (struktur kelas/atribut Google bisa disesuaikan jika berubah)
        const diceElement = document.querySelector('input[aria-label="Hasil"]') || document.querySelector('.qL59ab') || document.querySelector('div[jsname="Vmd40c"]');
        
        if (diceElement) {
            // Jika elemen berupa input atau container teks
            if (diceElement.tagName === 'INPUT') {
                diceElement.value = targetValue;
                diceElement.dispatchEvent(new Event('input', { bubbles: true }));
                diceElement.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                diceElement.innerText = targetValue;
            }
            console.log("Google Dice berhasil dimanipulasi menjadi:", targetValue);
        } else {
            console.warn("Widget Google Dice belum ditemukan di halaman ini. Pastikan Anda sudah meluncurkan dadu di Google.");
        }
    }

    // Mendengarkan perubahan data secara real-time dari Firebase
    db.ref('google_dice/target_value').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.value) {
            manipulateDice(data.value);
        }
    });
})();