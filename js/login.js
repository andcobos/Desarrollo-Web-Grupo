import { db } from './firebase.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

document.getElementById('loginButton').addEventListener('click', login);

async function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        let userFound = false;
        const hashedPassword = CryptoJS.SHA256(password).toString();

        const adminRef = collection(db, 'Admins');
        const qAdmin = query(adminRef, where('username', '==', username));
        const querySnapshotAdmin = await getDocs(qAdmin);

        for (const doc of querySnapshotAdmin.docs) {
            const data = doc.data();
            if (data.password === hashedPassword) {
                userFound = true;
                localStorage.setItem('userRole', 'Admin');
                localStorage.setItem('userName', data.username);
                window.location.href = 'PaginaAdmin.html';
                break;
            }
        }

        if (!userFound) {
            const empleadoRef = collection(db, 'Empleados');
            const qEmpleado = query(empleadoRef, where('username', '==', username));
            const querySnapshotEmpleado = await getDocs(qEmpleado);

            for (const doc of querySnapshotEmpleado.docs) {
                const data = doc.data();
                if (data.password === hashedPassword) {
                    userFound = true;
                    localStorage.setItem('userRole', 'Empleado');
                    localStorage.setItem('userName', data.username);
                    window.location.href = 'PaginaAdmin.html';
                    break;
                }
            }
        }

        if (!userFound) {
            alert('Usuario o contraseña incorrectos.');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
    }
}
