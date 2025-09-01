// -------- HORARIOS BASE --------
const horariosBase = ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
const horaSelect = document.getElementById("hora");

// Función para actualizar horarios según citas
function actualizarHorarios() {
    const fecha = document.getElementById("fecha").value;
    horaSelect.innerHTML = "";

    if (!fecha) return;

    const citas = JSON.parse(localStorage.getItem("citas")) || [];
    const ocupados = citas.filter(c => c.fecha === fecha).map(c => c.hora);

    horariosBase.forEach(hora => {
        if (!ocupados.includes(hora)) {
            const option = document.createElement("option");
            option.value = hora;
            option.textContent = hora;
            horaSelect.appendChild(option);
        }
    });

    // Si no hay horarios disponibles
    if (horaSelect.options.length === 0) {
        const option = document.createElement("option");
        option.textContent = "No hay horarios disponibles";
        option.disabled = true;
        horaSelect.appendChild(option);
    }
}

// Inicializar horarios al cargar la página
window.addEventListener("load", actualizarHorarios);
document.getElementById("fecha").addEventListener("change", actualizarHorarios);

// -------- CALCULAR ANTICIPO --------
document.getElementById("servicio").addEventListener("change", e => {
    const precios = {
        "Uñas - $350": 350,
        "Pestañas - $500": 500,
        "Manicure - $250": 250,
        "Pedicure - $250": 250
    };
    const precio = precios[e.target.value];
    document.getElementById("anticipo").innerText = `💰 Anticipo: $${(precio*0.4).toFixed(2)}`;
});

// -------- RESERVAR POR WHATSAPP --------
document.getElementById("reservaForm").addEventListener("submit", e => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const servicio = document.getElementById("servicio").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const anticipo = document.getElementById("anticipo").innerText;

    if (!nombre || !telefono || !fecha || !hora || hora.includes("No hay")) {
        alert("Por favor completa todos los campos correctamente");
        return;
    }

    // Guardar cita
    const citas = JSON.parse(localStorage.getItem("citas")) || [];
    citas.push({ nombre, telefono, servicio, fecha, hora, anticipo });
    localStorage.setItem("citas", JSON.stringify(citas));

    // Abrir WhatsApp
    const numeroSalon = "5215539568014"; // tu número de WhatsApp
    const mensaje = `Hola! Soy ${nombre}. Quiero reservar ${servicio} el ${fecha} a las ${hora}. Tel: ${telefono}. ${anticipo}`;
    const url = `https://wa.me/${numeroSalon}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    e.target.reset();
    document.getElementById("anticipo").innerText = "";
    actualizarHorarios();
});

// -------- ADMINISTRADOR --------
document.getElementById("adminBtn").addEventListener("click", () => {
    const pass = prompt("Introduce la contraseña:");
    if (pass === "1234") {
        mostrarCitas();
        document.getElementById("adminPanel").classList.remove("oculto");
    } else {
        alert("❌ Contraseña incorrecta");
    }
});

// Mostrar citas en tabla
function mostrarCitas() {
    const citas = JSON.parse(localStorage.getItem("citas")) || [];
    const tabla = document.getElementById("citasTabla");
    tabla.innerHTML = "";

    citas.forEach((cita,index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${cita.nombre}</td>
            <td>${cita.telefono}</td>
            <td>${cita.servicio}</td>
            <td>${cita.fecha}</td>
            <td>${cita.hora}</td>
            <td>${cita.anticipo}</td>
            <td><button onclick="eliminarCita(${index})">❌</button></td>
        `;
        tabla.appendChild(fila);
    });
}

// Eliminar cita
function eliminarCita(index) {
    const citas = JSON.parse(localStorage.getItem("citas")) || [];
    citas.splice(index, 1);
    localStorage.setItem("citas", JSON.stringify(citas));
    mostrarCitas();
    actualizarHorarios();
}

// -------- COMPARTIR PÁGINA --------
document.getElementById("compartirBtn").addEventListener("click", () => {
    const urlPagina = window.location.href;
    if (navigator.share) {
        navigator.share({
            title: "Bonita_sttudio",
            text: "¡Reserva tu cita en Bonita_sttudio!",
            url: urlPagina
        }).catch(err => console.log("Error al compartir:", err));
    } else {
        navigator.clipboard.writeText(urlPagina).then(() => {
            alert("✅ Link copiado al portapapeles: " + urlPagina);
        }).catch(() => {
            prompt("Copia este link para compartir:", urlPagina);
        });
    }
});
