import { db } from './firebase.js';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const userRole = localStorage.getItem('userRole');
const userName = localStorage.getItem('userName');

if (!userRole) {
    window.location.href = 'login.html';
} else {
    const navItems = document.getElementById('nav-items');
    const sections = [];

    if (userRole === 'Admin') {
        sections.push({ id: 'gestion-usuarios', name: 'Gestión de Usuarios' });
    }
    sections.push(
        { id: 'gestion-atracciones', name: 'Gestión de Atracciones' },
        { id: 'gestion-precios', name: 'Gestión de Precios' }
    );

    sections.forEach(section => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `<a class="nav-link text-light-gray" href="#${section.id}">${section.name}</a>`;
        navItems.appendChild(li);
    });

    if (userRole === 'Admin') {
        loadEmployees();
    } else {
        document.getElementById('gestion-usuarios').style.display = 'none';
    }
}

window.logout = function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
}

window.addEmployee = async function addEmployee() {
    const name = document.getElementById('employeeName').value.trim();
    const role = document.getElementById('employeeRole').value;
    const username = document.getElementById('employeeUsername').value.trim();
    const password = document.getElementById('employeePassword').value.trim();

    if (!name || !username || !password) {
        showToast('Por favor, complete todos los campos.', 'warning');
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
        showToast('Empleado agregado exitosamente.', 'success');
        const modal = document.getElementById('addEmployeeModal');
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();
        document.getElementById('addEmployeeForm').reset();
        loadEmployees();
    } catch (error) {
        console.error('Error al agregar empleado:', error);
        showToast('Error al agregar empleado. Por favor, inténtelo de nuevo.', 'danger');
    }
}

window.changePassword = async function changePassword() {
    const employeeId = document.getElementById('employeeIdToChangePassword').value;
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!newPassword || !confirmPassword) {
        showToast('Por favor, complete todos los campos.', 'warning');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('Las contraseñas no coinciden.', 'warning');
        return;
    }

    try {
        const hashedPassword = CryptoJS.SHA256(newPassword).toString();
        const employeeRef = doc(db, 'Empleados', employeeId);
        await updateDoc(employeeRef, { password: hashedPassword });
        showToast('Contraseña actualizada exitosamente.', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
        modal.hide();
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        showToast('Error al cambiar contraseña. Por favor, inténtelo de nuevo.', 'danger');
    }
}

window.deleteEmployee = function deleteEmployee(employeeId) {
    document.getElementById('employeeIdToDelete').value = employeeId;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteEmployeeModal'));
    modal.show();
}

window.confirmDeleteEmployee = async function confirmDeleteEmployee() {
    const employeeId = document.getElementById('employeeIdToDelete').value;
    try {
        await deleteDoc(doc(db, 'Empleados', employeeId));
        showToast('Empleado eliminado exitosamente.', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteEmployeeModal'));
        modal.hide();
        loadEmployees();
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        showToast('Error al eliminar empleado. Por favor, inténtelo de nuevo.', 'danger');
    }
}

window.openChangePasswordModal = function openChangePasswordModal(employeeId) {
    document.getElementById('employeeIdToChangePassword').value = employeeId;
    const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
    modal.show();
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
            <td>${data.username}</td>
            <td>${data.role}</td>
            <td>
                <button class="btn btn-danger btn-sm me-1" onclick="deleteEmployee('${docData.id}')">Eliminar</button>
                <button class="btn btn-primary btn-sm" onclick="openChangePasswordModal('${docData.id}')">Cambiar Contraseña</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.addAttraction = async function addAttraction() {
    const name = document.getElementById('attractionName').value.trim();
    const description = document.getElementById('attractionDescription').value.trim();
    const image = document.getElementById('attractionImage').value.trim();
    const status = document.getElementById('attractionStatus').value;

    if (!name || !description || !image) {
        showToast('Por favor, complete todos los campos.', 'warning');
        return;
    }

    try {
        const newAttraction = {
            nombre: name,
            descripcion: description,
            imagen: image,
            estado: status
        };
        await addDoc(collection(db, 'Atracciones'), newAttraction);
        showToast('Atracción agregada exitosamente.', 'success');
        const modal = document.getElementById('addAttractionModal');
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();
        document.getElementById('addAttractionForm').reset();
        loadAttractions();
    } catch (error) {
        console.error('Error al agregar atracción:', error);
        showToast('Error al agregar atracción. Por favor, inténtelo de nuevo.', 'danger');
    }
}

window.editAttraction = function editAttraction(attractionId) {
    const attraction = attractionsList.find(attr => attr.id === attractionId);
    if (attraction) {
        document.getElementById('editAttractionName').value = attraction.nombre;
        document.getElementById('editAttractionDescription').value = attraction.descripcion;
        document.getElementById('editAttractionImage').value = attraction.imagen;
        document.getElementById('editAttractionStatus').value = attraction.estado;
        document.getElementById('attractionIdToEdit').value = attractionId;
        const modal = new bootstrap.Modal(document.getElementById('editAttractionModal'));
        modal.show();
    }
}

window.updateAttraction = async function updateAttraction() {
    const attractionId = document.getElementById('attractionIdToEdit').value;
    const name = document.getElementById('editAttractionName').value.trim();
    const description = document.getElementById('editAttractionDescription').value.trim();
    const image = document.getElementById('editAttractionImage').value.trim();
    const status = document.getElementById('editAttractionStatus').value;

    if (!name || !description || !image) {
        showToast('Por favor, complete todos los campos.', 'warning');
        return;
    }

    try {
        const attractionRef = doc(db, 'Atracciones', attractionId);
        await updateDoc(attractionRef, {
            nombre: name,
            descripcion: description,
            imagen: image,
            estado: status
        });
        showToast('Atracción actualizada exitosamente.', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('editAttractionModal'));
        modal.hide();
        loadAttractions();
    } catch (error) {
        console.error('Error al actualizar atracción:', error);
        showToast('Error al actualizar atracción. Por favor, inténtelo de nuevo.', 'danger');
    }
}

window.deleteAttraction = function deleteAttraction(attractionId) {
    document.getElementById('attractionIdToDelete').value = attractionId;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteAttractionModal'));
    modal.show();
}

window.confirmDeleteAttraction = async function confirmDeleteAttraction() {
    const attractionId = document.getElementById('attractionIdToDelete').value;
    try {
        await deleteDoc(doc(db, 'Atracciones', attractionId));
        showToast('Atracción eliminada exitosamente.', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteAttractionModal'));
        modal.hide();
        loadAttractions();
    } catch (error) {
        console.error('Error al eliminar atracción:', error);
        showToast('Error al eliminar atracción. Por favor, inténtelo de nuevo.', 'danger');
    }
}

window.toggleAttraction = async function toggleAttraction(id, status) {
    try {
        const attractionRef = doc(db, 'Atracciones', id);
        await updateDoc(attractionRef, { estado: status });
        loadAttractions();
    } catch (error) {
        console.error('Error al actualizar atracción:', error);
        showToast('Error al actualizar atracción. Por favor, inténtelo de nuevo.', 'danger');
    }
}

let attractionsList = [];

async function loadAttractions() {
    attractionsList = [];
    const attractionsContainer = document.getElementById('attractionsContainer');
    attractionsContainer.innerHTML = '';
    const querySnapshot = await getDocs(collection(db, 'Atracciones'));
    querySnapshot.forEach((docData) => {
        const data = docData.data();
        data.id = docData.id;
        attractionsList.push(data);
    });
    attractionsList.forEach((data) => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${data.imagen}" class="card-img-top" alt="${data.nombre}">
                <div class="card-body text-center">
                    <h5 class="card-title">${data.nombre}</h5>
                    <p class="card-text">${data.descripcion}</p>
                    <p class="card-text">Estado: ${data.estado}</p>
                    <div class="d-flex flex-wrap justify-content-center">
                        <button class="btn btn-secondary btn-sm m-1" onclick="toggleAttraction('${data.id}', 'Cerrado')">Cerrar</button>
                        <button class="btn btn-warning btn-sm m-1" onclick="toggleAttraction('${data.id}', 'En Mantenimiento')">Mantenimiento</button>
                        <button class="btn btn-success btn-sm m-1" onclick="toggleAttraction('${data.id}', 'Abierto')">Abrir</button>
                        <button class="btn btn-primary btn-sm m-1" onclick="editAttraction('${data.id}')">Editar</button>
                        <button class="btn btn-danger btn-sm m-1" onclick="deleteAttraction('${data.id}')">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        attractionsContainer.appendChild(col);
    });
}

window.addPrice = async function addPrice() {
    const entryType = document.getElementById('newEntryType').value.trim();
    const newPrice = parseFloat(document.getElementById('newEntryPrice').value);

    if (!entryType || isNaN(newPrice) || newPrice < 0) {
        showToast('Por favor, ingrese un tipo de entrada y un precio válido.', 'warning');
        return;
    }

    try {
        const priceRef = doc(db, 'Precios', entryType);
        await setDoc(priceRef, { tipo: entryType, precio: newPrice });
        showToast(`El precio para "${entryType}" ha sido agregado/actualizado a $${newPrice.toFixed(2)}`, 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('addPriceModal'));
        modal.hide();
        document.getElementById('addPriceForm').reset();
        loadPrices();
    } catch (error) {
        console.error('Error al agregar precio:', error);
        showToast('Error al agregar precio. Por favor, inténtelo de nuevo.', 'danger');
    }
}

window.editPrice = function editPrice(priceId, tipo, precio) {
    document.getElementById('priceIdToEdit').value = priceId;
    document.getElementById('editEntryType').value = tipo;
    document.getElementById('editEntryPrice').value = precio;
    const modal = new bootstrap.Modal(document.getElementById('editPriceModal'));
    modal.show();
}

window.updatePrice = async function updatePrice() {
    const priceId = document.getElementById('priceIdToEdit').value;
    const newPrice = parseFloat(document.getElementById('editEntryPrice').value);

    if (isNaN(newPrice) || newPrice < 0) {
        showToast('Por favor, ingrese un precio válido.', 'warning');
        return;
    }

    try {
        const priceRef = doc(db, 'Precios', priceId);
        await updateDoc(priceRef, { precio: newPrice });
        showToast('Precio actualizado exitosamente.', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('editPriceModal'));
        modal.hide();
        loadPrices();
    } catch (error) {
        console.error('Error al actualizar precio:', error);
        showToast('Error al actualizar precio. Por favor, inténtelo de nuevo.', 'danger');
    }
}

window.deletePrice = function deletePrice(priceId) {
    document.getElementById('priceIdToDelete').value = priceId;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeletePriceModal'));
    modal.show();
}

window.confirmDeletePrice = async function confirmDeletePrice() {
    const priceId = document.getElementById('priceIdToDelete').value;
    try {
        await deleteDoc(doc(db, 'Precios', priceId));
        showToast('Precio eliminado exitosamente.', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeletePriceModal'));
        modal.hide();
        loadPrices();
    } catch (error) {
        console.error('Error al eliminar precio:', error);
        showToast('Error al eliminar precio. Por favor, inténtelo de nuevo.', 'danger');
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
            <td>
                <button class="btn btn-primary btn-sm me-1" onclick="editPrice('${docData.id}', '${data.tipo}', '${data.precio}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deletePrice('${docData.id}')">Eliminar</button>
            </td>
        `;
        pricesTableBody.appendChild(tr);
    });
}

function showToast(message, type) {
    const toastContainerId = 'toast-container';
    let toastContainer = document.getElementById(toastContainerId);
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = toastContainerId;
        toastContainer.className = 'position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = 1100;
        document.body.appendChild(toastContainer);
    }

    const toastId = `toast-${Date.now()}`;
    const toastWrapper = document.createElement('div');
    toastWrapper.innerHTML = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
            </div>
        </div>
    `;
    const toastElement = toastWrapper.firstElementChild; // Uso de firstElementChild para evitar nodos de texto
    toastContainer.appendChild(toastElement);

    const bsToast = new bootstrap.Toast(toastElement, { delay: 3000 });
    bsToast.show();

    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

window.onload = function() {
    loadAttractions();
    loadPrices();
}
