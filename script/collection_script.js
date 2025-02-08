// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAiQDJB2tR1ehw9MlU8eRMKPII3G7ZiwC8",
    authDomain: "chicken-egg-1f343.firebaseapp.com",
    databaseURL: "https://chicken-egg-1f343-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chicken-egg-1f343",
    storageBucket: "chicken-egg-1f343.firebasestorage.app",
    messagingSenderId: "786188684823",
    appId: "1:786188684823:web:bbb87dc422d8f91f459652"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyu9gOrf1zSyGaDyvwOrYiysaRLvjhW_SJzVJMfPMxclt9DfSC8mBnKy5nYAFrbi6IJ/exec"; // Replace with your Google Apps Script URL

document.addEventListener('DOMContentLoaded', (event) => {
    const header = document.getElementById('header');
    const upperSection = document.querySelector('.upper');

    window.addEventListener('scroll', () => {
        const upperSectionRect = upperSection.getBoundingClientRect();
        const upperSectionHeight = upperSectionRect.height;
        const upperSectionBottom = upperSectionRect.bottom;

        // Calculate 1/5 of the height of the upper section
        const oneFifthHeight = upperSectionHeight / 5;

        // Check if the bottom of the upper section is within 1/5 of its height from the top of the viewport
        if (upperSectionBottom <= oneFifthHeight) {
            header.style.backgroundColor = 'rgba(189, 219, 217, 1)';
            header.style.boxShadow = '0 3px 4px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.backgroundColor = 'transparent';
            header.style.boxShadow = 'none';
        }
    });
});

const room_temp = document.getElementById("temp_room");
const dimmer_lamp1 = document.getElementById("dimmer_ac1");
const dimmerSlider = document.querySelector('.dimmer-slider');

// Value for the parameters
// Room Temperature
const room_ref = ref(database, 'sensor/room_temp');
onValue(room_ref, (snapshot) => {
    const room_value = snapshot.val();
    room_temp.innerHTML = `${room_value}°C`;
});

// Dimmer Power
const dimmer_ref = ref(database, 'sensor/power');
onValue(dimmer_ref, (snapshot) => {
    const dimmer_value = snapshot.val();
    dimmerSlider.style.width = `${dimmer_value}%`; // Update the width of the dimmer-slider
    dimmer_lamp1.innerHTML = `${dimmer_value}%`; // Add percentage sign
});
