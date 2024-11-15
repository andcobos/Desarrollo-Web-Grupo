// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDieTjYC55s_CS4PCyHuGAe0xV-fqIIjF4",
    authDomain: "sitio-turistico-proyecto.firebaseapp.com",
    projectId: "sitio-turistico-proyecto",
    storageBucket: "sitio-turistico-proyecto.firebasestorage.app",
    messagingSenderId: "586162511493",
    appId: "1:586162511493:web:8541bb386c2d5bad9153ec"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
