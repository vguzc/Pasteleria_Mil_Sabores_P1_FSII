document.addEventListener("DOMContentLoaded", () => {
    const selectRegion = document.getElementById("selectRegion");
    const selectComuna = document.getElementById("selectComuna");
    const formRegistro = document.getElementById("formRegistro");
    const inputRun = document.getElementById("run");

    if (inputRun) {
        inputRun.addEventListener("input", (e) => {
            e.target.value = formatearRUN(e.target.value);
        });
    }

    if (typeof regionesYComunas !== "undefined") {
        regionesYComunas.forEach((item, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = item.region;
            selectRegion.appendChild(option);
        });
    }

    selectRegion.addEventListener("change", (e) => {
        const indexRegion = e.target.value;
        selectComuna.innerHTML = '<option value="">-- Selecciona Comuna --</option>';

        if (indexRegion !== "") {
            selectComuna.disabled = false;
            regionesYComunas[indexRegion].comunas.forEach(comuna => {
                const option = document.createElement("option");
                option.value = comuna;
                option.textContent = comuna;
                selectComuna.appendChild(option);
            });
        } else {
            selectComuna.disabled = true;
        }
    });

    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();
        limpiarErrores();

        let esValido = true;

        // Obtención de Valores
        const run = document.getElementById("run").value.trim();
        const nombre = formatearNombrePropio(document.getElementById("nombre").value);
        const apellidos = formatearNombrePropio(document.getElementById("apellidos").value);
        const correo = document.getElementById("correo").value.trim().toLowerCase();
        const fechaNac = document.getElementById("fechaNacimiento").value;
        const direccion = document.getElementById("direccion").value.trim();
        const regionIndex = selectRegion.value;
        const comuna = selectComuna.value;
        const clave = document.getElementById("clave").value;
        const confirmarClave = document.getElementById("confirmarClave").value;

        if (!validarRUNChileno(run)) {
            mostrarError("errorRun", "RUN no es válido. Ingresa un RUN real (ej: 19.876.543-K).");
            esValido = false;
        }

        if (nombre.length < 2) {
            mostrarError("errorNombre", "Ingresa un nombre válido.");
            esValido = false;
        }
        if (apellidos.length < 2) {
            mostrarError("errorApellidos", "Ingresa apellidos válidos.");
            esValido = false;
        }

        const regexCorreo = /^[a-zA-Z0-9._%+-]+@(gmail\.com|duocuc\.cl|profesor\.duoc\.cl)$/;
        if (!regexCorreo.test(correo)) {
            mostrarError("errorCorreo", "Correo debe ser @gmail.com, @duocuc.cl o @profesor.duoc.cl");
            esValido = false;
        }

        if (!fechaNac) {
            mostrarError("errorFecha", "Selecciona tu fecha de nacimiento.");
            esValido = false;
        }

        if (direccion.length < 5) {
            mostrarError("errorDireccion", "Ingresa una dirección completa.");
            esValido = false;
        }
        if (regionIndex === "") {
            mostrarError("errorRegion", "Selecciona una región.");
            esValido = false;
        }
        if (comuna === "") {
            mostrarError("errorComuna", "Selecciona una comuna.");
            esValido = false;
        }

        if (clave.length < 4) {
            mostrarError("errorClave", "La contraseña debe tener al menos 4 caracteres.");
            esValido = false;
        }

        if (clave !== confirmarClave) {
            mostrarError("errorConfirmarClave", "Las contraseñas ingresadas no coinciden.");
            esValido = false;
        }

        if (!esValido) return;

        const beneficios = [];
        const hoy = new Date();
        const fechaNacDate = new Date(fechaNac);

        // Calcular Edad Exacta
        let edad = hoy.getFullYear() - fechaNacDate.getFullYear();
        const mesDiff = hoy.getMonth() - fechaNacDate.getMonth();
        if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaNacDate.getDate())) {
            edad--;
        }

        if (edad >= 50) {
            beneficios.push("50% de Descuento por tener 50 años o más (Especial 50° Aniversario)");
        }

        const esDominioDuoc = correo.endsWith("@duocuc.cl") || correo.endsWith("@profesor.duoc.cl") || correo.endsWith("@duoc.cl");

        if (esDominioDuoc) {
            beneficios.push("Convenio Duoc UC: 10% OFF en productos (código DUOC10) y Torta Gratis en la semana de tu cumpleaños.");
        }

        const nuevoUsuario = {
            run,
            nombre,
            apellidos,
            correo,
            clave,
            fechaNac,
            edad,
            direccion,
            region: regionesYComunas[regionIndex].region,
            comuna,
            beneficios,
            cuponesUsados: [],
            rol: "Cliente"
        };

        const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios") || "[]");
        usuariosGuardados.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

        mostrarResultado(nuevoUsuario, beneficios);
    });

    function mostrarError(idElemento, mensaje) {
        const el = document.getElementById(idElemento);
        if (!el) return;
        const iconoAdvertencia = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px; margin-right:4px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        el.innerHTML = iconoAdvertencia + mensaje;
    }

    function limpiarErrores() {
        document.querySelectorAll(".error-msg").forEach(span => span.innerHTML = "");
    }

    function mostrarResultado(usuario, beneficios) {
        formRegistro.reset();
        selectComuna.disabled = true;

        const divResultado = document.getElementById("resultadoBeneficios");
        const mensajeCliente = document.getElementById("mensajeCliente");
        const listaBeneficios = document.getElementById("listaBeneficios");

        mensajeCliente.textContent = `Bienvenido/a ${usuario.nombre} ${usuario.apellidos}. Tu cuenta ha sido creada exitosamente.`;
        listaBeneficios.innerHTML = "";

        const beneficiosFiltrados = (beneficios || []).filter(b => b && !b.includes("Explora nuestro catálogo"));

        if (beneficiosFiltrados.length > 0) {
            beneficiosFiltrados.forEach(b => {
                const li = document.createElement("li");
                li.textContent = b;
                listaBeneficios.appendChild(li);
            });
            listaBeneficios.style.display = "block";
        } else {
            listaBeneficios.style.display = "none";
        }

        divResultado.classList.remove("hidden");
        divResultado.style.display = "block";
    }
});

/**
 * Formatea un RUN chileno añadiendo puntos y guion automáticamente (ej: 19.876.543-K).
 * @param {string} valor 
 * @returns {string}
 */
function formatearRUN(valor) {
    let limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length === 0) return '';
    if (limpio.length === 1) return limpio;

    let dv = limpio.slice(-1);
    let cuerpo = limpio.slice(0, -1);
    let cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${cuerpoFormateado}-${dv}`;
}

/**
 * Valida un RUN chileno utilizando el algoritmo oficial del Módulo 11.
 * @param {string} runCompleto 
 * @returns {boolean}
 */
function validarRUNChileno(runCompleto) {
    let limpio = runCompleto.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length < 8 || limpio.length > 9) return false;

    let dvIngresado = limpio.slice(-1);
    let cuerpo = limpio.slice(0, -1);

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    let resto = 11 - (suma % 11);
    let dvEsperado = '0';
    if (resto === 11) dvEsperado = '0';
    else if (resto === 10) dvEsperado = 'K';
    else dvEsperado = String(resto);

    return dvIngresado === dvEsperado;
}

/**
 * Formatea un nombre propio o apellidos con mayúscula inicial en cada palabra (Capital Case).
 * @param {string} texto 
 * @returns {string}
 */
function formatearNombrePropio(texto) {
    if (!texto || typeof texto !== 'string') return '';
    return texto
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map(palabra => palabra ? palabra.charAt(0).toUpperCase() + palabra.slice(1) : '')
        .join(' ');
}