 // ===== 1. Conexión =====
        console.log('app.js conectado');

        // Precios para el reto de Total Estimado
        const PRECIOS = {
            'Pan de yema': 0.50,
            'Pan francés': 0.40,
            'Pan con chicharrón': 8.00,
            'Pastel de acelga': 5.00
        };

        // ===== 2. Funciones de validación =====

        function validarNombre(nombre) {
            const limpio = nombre.trim();
            if (limpio === '') return 'Escribe tu nombre.';
            if (limpio.length < 2) return 'Tu nombre debe tener al menos 2 letras.';
            return '';
        }

        function validarCelular(celular) {
            const limpio = celular.replace(/\s/g, '');
            if (limpio === '') return 'Escribe tu número de celular.';
            if (!/^9\d{8}$/.test(limpio)) {
                return 'El celular debe tener 9 dígitos y empezar con 9. Ejemplo: 987 654 321.';
            }
            return '';
        }

        function validarProducto(producto) {
            return producto === '' ? 'Elige un producto.' : '';
        }

        function validarCantidad(valor) {
            const cantidad = Number(valor);
            if (valor === '' || !Number.isInteger(cantidad) || cantidad < 1) {
                return 'La cantidad debe ser un número entero mayor que 0.';
            }
            if (cantidad > 100) return 'Para más de 100 unidades, llámanos por teléfono.';
            return '';
        }

        // Reto: Validar que la fecha no sea anterior a hoy
        function validarFecha(fechaIngresada) {
            if (fechaIngresada === '') return 'Elige la fecha de recojo.';

            const hoy = new Date();
            const anio = hoy.getFullYear();
            const mes = String(hoy.getMonth() + 1).padStart(2, '0');
            const dia = String(hoy.getDate()).padStart(2, '0');
            const fechaHoyStr = `${anio}-${mes}-${dia}`;

            if (fechaIngresada < fechaHoyStr) {
                return 'La fecha de recojo no puede ser una fecha pasada.';
            }
            return '';
        }

        // ===== 3. Mostrar u ocultar errores =====
        function mostrarError(id, mensaje) {
            const campo = document.getElementById(id);
            const error = document.getElementById('error-' + id);
            if (!campo || !error) return;

            error.textContent = mensaje;
            if (mensaje) {
                campo.setAttribute('aria-invalid', 'true');
            } else {
                campo.removeAttribute('aria-invalid');
            }
        }

        // ===== 4. Reto: Contador de caracteres =====
        const campoIndicaciones = document.getElementById('indicaciones');
        const contadorText = document.getElementById('contador-caracteres');

        if (campoIndicaciones && contadorText) {
            campoIndicaciones.addEventListener('input', function () {
                const restantes = 200 - campoIndicaciones.value.length;
                contadorText.textContent = `Te quedan ${restantes} caracteres`;
            });
        }

        // ===== 5. Escuchar el envío del formulario =====
        const formulario = document.querySelector('form');
        const estado = document.getElementById('estado');

        const reglas = [
            ['nombre', validarNombre],
            ['celular', validarCelular],
            ['producto', validarProducto],
            ['cantidad', validarCantidad],
            ['fecha', validarFecha],
        ];

        formulario.addEventListener('submit', function (evento) {
            evento.preventDefault();
            let primerError = null;

            // Validar reglas principales
            for (const [id, validar] of reglas) {
                const mensaje = validar(document.getElementById(id).value);
                mostrarError(id, mensaje);
                if (mensaje && primerError === null) primerError = id;
            }

            // Validar casilla de consentimiento
            const acepta = document.getElementById('consentimiento').checked;
            const avisoConsentimiento = 'Necesitamos tu autorización para atender el pedido.';
            mostrarError('consentimiento', acepta ? '' : avisoConsentimiento);
            if (!acepta && primerError === null) primerError = 'consentimiento';

            // Si hay errores, mover el foco al primer campo con falla
            if (primerError !== null) {
                estado.textContent = 'Revisa los campos marcados para continuar.';
                document.getElementById(primerError).focus();
                return;
            }

            // Si todo es correcto, calcular total y mostrar mensaje final
            const nombre = document.getElementById('nombre').value.trim();
            const producto = document.getElementById('producto').value;
            const cantidad = Number(document.getElementById('cantidad').value);
            const fecha = document.getElementById('fecha').value;

            const precioUnitario = PRECIOS[producto] || 0;
            const totalEstimado = (precioUnitario * cantidad).toFixed(2);

            estado.textContent = `Gracias, ${nombre}. Recibimos tu pedido de ` +
                `${cantidad} × ${producto} para el ${fecha}. Total estimado: S/ ${totalEstimado}. Te confirmaremos por WhatsApp.`;

            // Limpiar formulario y contador
            formulario.reset();
            if (contadorText) contadorText.textContent = 'Te quedan 200 caracteres';
        });