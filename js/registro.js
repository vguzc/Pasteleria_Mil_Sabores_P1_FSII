document.addEventListener("DOMContentLoaded", () => {
    const selectRegion = document.getElementById("selectRegion");
    const selectComuna = document.getElementById("selectComuna");
    const formRegistro = document.getElementById("formRegistro");

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
        const nombre = document.getElementById("nombre").value.trim();
        const apellidos = document.getElementById("apellidos").value.trim();
        const correo = document.getElementById("correo").value.trim().toLowerCase();
        const fechaNac = document.getElementById("fechaNacimiento").value;
        const direccion = document.getElementById("direccion").value.trim();
        const regionIndex = selectRegion.value;
        const comuna = selectComuna.value;
        const codigoPromo = document.getElementById("codigoPromo").value.trim().toUpperCase();

        const regexRun = /^[0-9]{7,8}[0-9kK]{1}$/;
        if (!regexRun.test(run)) {
            mostrarError("errorRun", "RUN inválido. Debe tener entre 7 y 9 caracteres, sin puntos ni guion.");
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

        const regexCorreo = /^[a-zA-Z0-9._%+-]+@(gmail\.com|duoc\.cl|profesor\.duoc\.cl)$/;
        if (!regexCorreo.test(correo)) {
            mostrarError("errorCorreo", "Correo debe ser @gmail.com, @duoc.cl o @profesor.duoc.cl");
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

        if (codigoPromo === "FELICES50") {
            beneficios.push("10% de Descuento Adicional aplicado por Código Promocional");
        }

        const esDominioDuoc = correo.endsWith("@duoc.cl") || correo.endsWith("@profesor.duoc.cl");
        const esCumpleaniosHoy = (hoy.getMonth() === fechaNacDate.getMonth()) && (hoy.getDate() === fechaNacDate.getDate());

        if (esDominioDuoc && esCumpleaniosHoy) {
            beneficios.push("🎂 ¡Torta Gratis de Convenio Duoc por estar de Cumpleaños Hoy!");
        }

        const nuevoUsuario = {
            run,
            nombre,
            apellidos,
            correo,
            fechaNac,
            edad,
            direccion,
            region: regionesYComunas[regionIndex].region,
            comuna,
            beneficios,
            rol: "Cliente"
        };

        const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios") || "[]");
        usuariosGuardados.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

        mostrarResultado(nuevoUsuario, beneficios);
    });

    function mostrarError(idElemento, mensaje) {
        document.getElementById(idElemento).textContent = mensaje;
    }

    function limpiarErrores() {
        document.querySelectorAll(".error-msg").forEach(span => span.textContent = "");
    }

    function mostrarResultado(usuario, beneficios) {
        formRegistro.reset();
        selectComuna.disabled = true;

        const divResultado = document.getElementById("resultadoBeneficios");
        const mensajeCliente = document.getElementById("mensajeCliente");
        const listaBeneficios = document.getElementById("listaBeneficios");

        mensajeCliente.textContent = `Bienvenido/a ${usuario.nombre} ${usuario.apellidos}. Tu cuenta ha sido creada exitosamente.`;
        listaBeneficios.innerHTML = "";

        if (beneficios.length > 0) {
            beneficios.forEach(b => {
                const li = document.createElement("li");
                li.textContent = b;
                listaBeneficios.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "Cuenta registrada correctamente. Explora nuestro catálogo de tortas.";
            listaBeneficios.appendChild(li);
        }

        divResultado.classList.remove("hidden");
    }
});