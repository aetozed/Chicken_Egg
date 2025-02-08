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

// Reference to the camera image
const cameraImage = document.getElementById("cameraImage");

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyu9gOrf1zSyGaDyvwOrYiysaRLvjhW_SJzVJMfPMxclt9DfSC8mBnKy5nYAFrbi6IJ/exec"; // Replace with your Google Apps Script URL

// Fetch camera image from Firebase and send to Google Drive
const photoRef = ref(database, 'cam/photo');
let previousPhoto = null;

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

document.getElementById('downloadLink').addEventListener('click', function() {
    const image = document.getElementById('cameraImage');
    const downloadLink = document.getElementById('downloadLink');
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    downloadLink.href = image.src;
    downloadLink.download = `photo_${formattedDate}.png`;
});

const room_temp = document.getElementById("temp_room");
const dimmer_lamp1 = document.getElementById("dimmer_ac1");
const fan_image = document.querySelector('.isi-bulat2 img'); // Reference to the fan image
const suhu = document.getElementById("suhu_id");
const lembab = document.getElementById("lembab_id");
const hari = document.getElementById("hari_id");
const roll = document.getElementById("roll_id");
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

// Fan Status
const fan_ref = ref(database, 'sensor/kipas');
onValue(fan_ref, (snapshot) => {
    const fan_value = snapshot.val();
    if (fan_value === 1) {
        fan_image.classList.add('rotate');
    } else {
        fan_image.classList.remove('rotate'); 
    }
});

// Suhu Status
const suhu_ref = ref(database, 'sensor/Suhu');
onValue(suhu_ref, (snapshot) => {
    const suhu_value = snapshot.val();
    suhu.innerHTML = `${suhu_value}°C`;
});

// Lembab Status
const lembab_ref = ref(database, 'sensor/Kelembapan');
onValue(lembab_ref, (snapshot) => {
    const lembab_value = snapshot.val();
    lembab.innerHTML = `${lembab_value}%`;
});

// Hari Status
const hari_ref = ref(database, 'sensor/Hari');
onValue(hari_ref, (snapshot) => {
    const hari_value = snapshot.val();
    hari.innerHTML = hari_value;
});

// Roll Status
const roll_ref = ref(database, 'sensor/kandang_ayam');
onValue(roll_ref, (snapshot) => {
    const roll_value = snapshot.val();
    roll.innerHTML = roll_value;
});

//Value for the image
onValue(photoRef, async (snapshot) => {
    const base64String = snapshot.val();
    
    if (base64String) {
        // Update the displayed image
        cameraImage.src = `data:image/jpeg;base64,${base64String}`;
        
        // Save the previous photo to Google Drive
        if (previousPhoto) {
            await uploadToGoogleDrive(previousPhoto);
        }

        // Store the current photo as the previous one for the next update
        previousPhoto = base64String;
    }
});

// Upload the encoded string to Google Drive using Apps Script
async function uploadToGoogleDrive(encodedString) {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ image: encodedString })
        });

        console.log("Photo uploaded to Google Drive");
    } catch (error) {
        console.error("Error uploading to Google Drive:", error);
    }
}