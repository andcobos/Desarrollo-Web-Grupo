import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Configuración de Firebase
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


async function loadPrices() {
    const pricesTableBody = document.getElementById('tabla_tarifas_body');
    pricesTableBody.innerHTML = ''; 

    try {
        const pricesSnapshot = await getDocs(collection(db, 'Precios'));
        pricesSnapshot.forEach((docData) => {
            const data = docData.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.tipo}</td>
                <td>$${data.precio.toFixed(2)}</td>
            `;
            pricesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar precios:", error);
    }
}
window.onload = loadPrices;