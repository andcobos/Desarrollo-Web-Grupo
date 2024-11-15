import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

async function loadAttractions() {
    const attractionsContainer = document.querySelector('.activities');
    attractionsContainer.innerHTML = ''; // Limpia el contenido existente

    try {
        const attractionsSnapshot = await getDocs(collection(db, 'Atracciones'));
        attractionsSnapshot.forEach((docData) => {
            const data = docData.data();
            const attractionDiv = document.createElement('div');
            attractionDiv.className = 'activity';
            attractionDiv.innerHTML = `
                <img src="${data.imagen}" alt="${data.nombre}">
                <h3>${data.nombre}</h3>
                <p>${data.descripcion}</p>
                <button class="estado ${data.estado.toLowerCase()}">${data.estado}</button>
            `;
            attractionsContainer.appendChild(attractionDiv);
        });
    } catch (error) {
        console.error("Error al cargar atracciones:", error);
    }
}

window.onload = loadAttractions;
