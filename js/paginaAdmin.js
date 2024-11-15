import { db } from './firebase.js';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const userRole = localStorage.getItem('userRole');
const userName = localStorage.getItem('userName');

if (!userRole) {
    alert('No ha iniciado sesión. Será redirigido al inicio de sesión.');
    window.location.href = 'Login.html';
} else {
    const navItems = document.getElementById('nav-items');

    if (userRole === 'Admin') {
        navItems.innerHTML = `
            <li class="nav-item">
                <a class="nav-link text-light-gray" href="#gestion-usuarios">Gestión de Usuarios</a>
            </li>
            <!-- Otros enlaces -->
        `;
        loadEmployees();
    } else if (userRole === 'Empleado') {
        navItems.innerHTML = `
            <!-- Enlaces para empleados -->
        `;
        document.getElementById('gestion-usuarios').style.display = 'none';
    }
}

window.logout = function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = 'Login.html';
}

window.addEmployee = async function addEmployee() {
    const name = document.getElementById('employeeName').value.trim();
    const role = document.getElementById('employeeRole').value;
    const username = document.getElementById('employeeUsername').value.trim();
    const password = document.getElementById('employeePassword').value.trim();

    if (!name || !username || !password) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        const hashedPassword = CryptoJS.SHA256(password).toString();
        const newEmployee = {
            name: name,
            role: role,
            username: username,
            password: hashedPassword
        };
        await addDoc(collection(db, 'Empleados'), newEmployee);
        alert('Empleado agregado exitosamente.');
        const modal = document.getElementById('addEmployeeModal');
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();
        document.getElementById('addEmployeeForm').reset();
        loadEmployees();
    } catch (error) {
        console.error('Error al agregar empleado:', error);
        alert('Error al agregar empleado. Por favor, inténtelo de nuevo.');
    }
}

window.changePassword = async function changePassword() {
    const employeeId = document.getElementById('employeeIdToChangePassword').value;
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!newPassword || !confirmPassword) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    try {
        const hashedPassword = CryptoJS.SHA256(newPassword).toString();
        const employeeRef = doc(db, 'Empleados', employeeId);
        await updateDoc(employeeRef, { password: hashedPassword });
        alert('Contraseña actualizada exitosamente.');
        const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
        modal.hide();
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        alert('Error al cambiar contraseña. Por favor, inténtelo de nuevo.');
    }
}

async function loadEmployees() {
    const tbody = document.getElementById('employeesTableBody');
    tbody.innerHTML = '';
    const querySnapshot = await getDocs(collection(db, 'Empleados'));
    querySnapshot.forEach((docData) => {
        const data = docData.data();
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${docData.id}</td>
            <td>${data.name}</td>
            <td>${data.role}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteEmployee('${docData.id}')">Eliminar</button>
                <button class="btn btn-primary btn-sm" onclick="openChangePasswordModal('${docData.id}')">Cambiar Contraseña</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function loadAttractions() {
    const attractionsContainer = document.getElementById('attractionsContainer');
    attractionsContainer.innerHTML = '';
    const querySnapshot = await getDocs(collection(db, 'Atracciones'));
    querySnapshot.forEach((docData) => {
        const data = docData.data();
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${data.imagen}" class="card-img-top" alt="${data.nombre}">
                <div class="card-body text-center">
                    <h5 class="card-title">${data.nombre}</h5>
                    <p class="card-text">${data.descripcion}</p>
                    <p class="card-text">Estado: ${data.estado}</p>
                    <button class="btn btn-secondary btn-sm" onclick="toggleAttraction('${docData.id}', 'Cerrado')">Cerrar</button>
                    <button class="btn btn-warning btn-sm" onclick="toggleAttraction('${docData.id}', 'En Mantenimiento')">Mantenimiento</button>
                    <button class="btn btn-success btn-sm" onclick="toggleAttraction('${docData.id}', 'Abierto')">Abrir</button>
                </div>
            </div>
        `;
        attractionsContainer.appendChild(col);
    });
}

window.toggleAttraction = async function toggleAttraction(id, status) {
    try {
        const attractionRef = doc(db, 'Atracciones', id);
        await updateDoc(attractionRef, { estado: status });
        alert(`Atracción actualizada a estado: ${status}`);
        loadAttractions();
    } catch (error) {
        console.error('Error al actualizar atracción:', error);
        alert('Error al actualizar atracción. Por favor, inténtelo de nuevo.');
    }
}

async function loadPrices() {
    const pricesTableBody = document.getElementById('pricesTableBody');
    pricesTableBody.innerHTML = '';
    const pricesRef = collection(db, 'Precios');
    const querySnapshot = await getDocs(pricesRef);
    querySnapshot.forEach((docData) => {
        const data = docData.data();
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${data.tipo}</td>
            <td>$${data.precio.toFixed(2)}</td>
        `;
        pricesTableBody.appendChild(tr);
    });
}

window.updatePrice = async function updatePrice() {
    const entryType = document.getElementById('entryType').value;
    const newPrice = parseFloat(document.getElementById('newPrice').value);

    if (isNaN(newPrice) || newPrice < 0) {
        alert('Por favor, ingrese un precio válido.');
        return;
    }

    try {
        const priceRef = doc(db, 'Precios', entryType);
        await setDoc(priceRef, { tipo: entryType, precio: newPrice });
        alert(`El precio para "${entryType}" ha sido actualizado a $${newPrice.toFixed(2)}`);
        loadPrices();
    } catch (error) {
        console.error('Error al actualizar precio:', error);
        alert('Error al actualizar precio. Por favor, inténtelo de nuevo.');
    }
}

window.onload = function() {
    loadAttractions();
    loadPrices();
}
