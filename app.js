document.addEventListener('DOMContentLoaded', () => {
    
    // BASE DE DATOS TÉCNICA - 30+ DEPORTES
    const listaDeportes = [
        "Pádel", "Béisbol", "Baloncesto", "Fútbol", "Bicicletas", "Tenis", "Gym & Fitness",
        "Voleibol", "Softbol", "Natación", "Boxeo / MMA", "Running", "Golf", "Skate / Surf",
        "Motociclismo", "Senderismo / Outdoor", "Ping Pong", "Billar", "Ciclismo Estacionario",
        "Crossfit", "Yoga / Pilates", "Fútbol Americano", "Rugby", "Atletismo", "Artes Marciales",
        "Pesca Deportiva", "Bolos", "Dardos", "Ajedrez", "Otros Deportes"
    ];

    const tiposArticulos = ["Equipamiento / Herramienta Principal", "Calzado / Tenis", "Ropa Deportiva", "Accesorios / Grips / Extras"];

    const marcasPorTipo = {
        "Equipamiento / Herramienta Principal": {
            "Pádel": ["Siux", "Babolat", "Nox", "Adidas", "Bullpadel", "Head", "StarVie", "Drop Shot"],
            "Béisbol": ["Rawlings", "Wilson", "Louisville Slugger", "Marucci", "Easton", "Mizuno", "Demarini"],
            "Baloncesto": ["Spalding", "Wilson", "Molten", "Nike", "Under Armour"],
            "Fútbol": ["Nike", "Adidas", "Puma", "Penalty", "Mitre", "Select"],
            "Bicicletas": ["Trek", "Specialized", "Giant", "Cannondale", "Scott", "Santa Cruz", "GT"],
            "Tenis": ["Wilson", "Babolat", "Head", "Yonex", "Prince", "Dunlop"],
            "Gym & Fitness": ["Rogue Fitness", "Bowflex", "Everlast", "Cap Barbell", "Titan Fitness"],
            "Voleibol": ["Mikasa", "Molten", "Tachikara", "Wilson"],
            "Softbol": ["Miken", "Worth", "Rawlings", "Easton", "DeMarini"],
            "Natación": ["Speedo", "Arena", "TYR", "MP Michael Phelps"],
            "Boxeo / MMA": ["Everlast", "Cleto Reyes", "Venum", "Hayabusa", "Fairtex"],
            "Golf": ["Callaway", "TaylorMade", "Titleist", "Ping", "Cobra", "Mizuno"],
            "Otros Deportes": ["Marcas Variadas", "Genérico"]
        },
        "Calzado / Tenis": {
            "General": ["Nike", "Adidas", "Puma", "Under Armour", "Asics", "New balance", "Reebok", "Mizuno", "Jordan", "Skechers", "Babolat", "Nox", "Salomon"]
        },
        "Ropa Deportiva": {
            "General": ["Nike", "Adidas", "Puma", "Under Armour", "Reebok", "Columbia", "Gymshark", "Lululemon", "Fila", "Champion", "Asics"]
        },
        "Accesorios / Grips / Extras": {
            "General": ["Garmin", "Apple", "Fitbit", "Everlast", "Mueller", "McDavid", "Tourna", "Wilson", "Babolat", "Alien Pros", "Genérico"]
        }
    };

    // ELEMENTOS DEL DOM
    const selectCategoria = document.getElementById('formCategoria');
    const selectTipo = document.getElementById('formTipo');
    const selectMarca = document.getElementById('formMarca');
    const selectModelo = document.getElementById('formModelo');
    const inputTituloOculto = document.getElementById('formTitulo');
    
    // Nuevos elementos para Entrada Manual Integrada sin Prompts
    const wrapperModeloManual = document.getElementById('wrapperModeloManual');
    const inputModeloManual = document.getElementById('inputModeloManual');

    const btnPublicar = document.getElementById('btnPublicar');
    const modalPublicar = document.getElementById('modalPublicar');
    const btnCerrarModal = document.getElementById('btnCerrarModal');
    const flujoForm = document.getElementById('flujoPublicarForm');
    
    const stepVendedor = document.getElementById('step-vendedor');
    const stepArticulo = document.getElementById('step-articulo');
    const stepMultimedia = document.getElementById('step-multimedia');
    const stepPago = document.getElementById('step-pago');

    const btnPasarAlPaso2 = document.getElementById('btnPasarAlPaso2');
    const btnVolverAlPaso1 = document.getElementById('btnVolverAlPaso1');
    const btnPasarAlPaso3 = document.getElementById('btnPasarAlPaso3');
    const btnVolverAlPaso2 = document.getElementById('btnVolverAlPaso2');
    const btnPasarAlPaso4 = document.getElementById('btnPasarAlPaso4');
    const btnVolverAlPaso3 = document.getElementById('btnVolverAlPaso3');

    // Alertas inline y de éxito
    const errorStep1 = document.getElementById('error-step-1');
    const errorStep2 = document.getElementById('error-step-2');
    const errorStep3 = document.getElementById('error-step-3');
    const errorStep4 = document.getElementById('error-step-4');
    const modalExitoNativo = document.getElementById('modalExitoNativo');
    const btnCerrarExito = document.getElementById('btnCerrarExito');

    // Multimedia Multi-Imagen
    const inputImg = document.getElementById('formImg');
    const previewMultiGrid = document.getElementById('previewMultiGrid');

    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const btnBuscar = document.getElementById('btnBuscar');
    const tags = document.querySelectorAll('.tag-btn');

    // ARRAY PARA ALMACENAR HASTA 3 IMÁGENES BASE64
    let base64ImagesArray = [];

    // STATE DE LA APLICACIÓN
    const mockCloudDatabase = [
        { id: 1, titulo: "Siux ST3", categoria: "Pádel", tipo: "Equipamiento / Herramienta Principal", marca: "Siux", precio: 15500, condicion: "Usado - Como nueva", vendedor: "Carlos Martínez", provincia: "Santo Domingo", whatsapp: "18095551234", imagenes: ["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500"], plan: "Premium", esEliminable: false }
    ];
    let baseDeDatosActual = JSON.parse(localStorage.getItem('deporterd_database_live')) || mockCloudDatabase;
    let categoriaSeleccionada = "Todos";

    // CARGAR CATEGORÍAS AUTOMÁTICAS
    if (selectCategoria) {
        selectCategoria.innerHTML = '<option value="">-- Selecciona Deporte --</option>';
        listaDeportes.forEach(deporte => {
            const opt = document.createElement('option');
            opt.value = deporte; opt.innerText = deporte;
            selectCategoria.appendChild(opt);
        });
    }

    // INTERRUPTORES MODALES PRINCIPALES
    if (btnPublicar) btnPublicar.addEventListener('click', () => modalPublicar.style.display = 'flex');
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', () => modalPublicar.style.display = 'none');

    function cambiarAUnPaso(numeroPaso) {
        stepVendedor.classList.remove('active');
        stepArticulo.classList.remove('active');
        stepMultimedia.classList.remove('active');
        stepPago.classList.remove('active');
        document.getElementById('ind-1').classList.remove('active');
        document.getElementById('ind-2').classList.remove('active');
        document.getElementById('ind-3').classList.remove('active');
        document.getElementById('ind-4').classList.remove('active');

        if (numeroPaso === 1) { stepVendedor.classList.add('active'); document.getElementById('ind-1').classList.add('active'); }
        if (numeroPaso === 2) { stepArticulo.classList.add('active'); document.getElementById('ind-2').classList.add('active'); }
        if (numeroPaso === 3) { stepMultimedia.classList.add('active'); document.getElementById('ind-3').classList.add('active'); }
        if (numeroPaso === 4) { stepPago.classList.add('active'); document.getElementById('ind-4').classList.add('active'); }
    }

    // --- MANEJO DE PASOS Y VALIDACIONES ---
    if (btnPasarAlPaso2) {
        btnPasarAlPaso2.addEventListener('click', () => {
            const v = document.getElementById('formVendedor').value.trim();
            const w = document.getElementById('formWhatsapp').value.trim();
            const e = document.getElementById('formEmail').value.trim();

            if (!v || !w || !e) {
                errorStep1.innerText = "Debes completar todos tus datos de contacto obligatorios.";
                errorStep1.style.display = 'flex';
                return;
            }
            errorStep1.style.display = 'none';
            cambiarAUnPaso(2);
        });
    }

    if (btnVolverAlPaso1) btnVolverAlPaso1.addEventListener('click', () => { errorStep1.style.display = 'none'; cambiarAUnPaso(1); });

    if (btnPasarAlPaso3) {
        btnPasarAlPaso3.addEventListener('click', () => {
            const p = document.getElementById('formPrecio').value;
            let modeloFinal = selectModelo.value;
            
            if (modeloFinal === "Escribir modelo...") {
                modeloFinal = inputModeloManual.value.trim();
            }

            if (!selectCategoria.value || !selectTipo.value || !selectMarca.value || !modeloFinal || !p) {
                errorStep2.innerText = "Todos los campos de detalles del artículo son obligatorios.";
                errorStep2.style.display = 'flex';
                return;
            }
            errorStep2.style.display = 'none';
            cambiarAUnPaso(3);
        });
    }

    if (btnVolverAlPaso2) btnVolverAlPaso2.addEventListener('click', () => { errorStep2.style.display = 'none'; cambiarAUnPaso(2); });

    if (btnPasarAlPaso4) {
        btnPasarAlPaso4.addEventListener('click', () => {
            if (base64ImagesArray.length === 0) {
                errorStep3.innerText = "¡Foto Obligatoria! Sube al menos 1 imagen real de tu producto (Máximo 3).";
                errorStep3.style.display = 'flex';
                return;
            }
            errorStep3.style.display = 'none';
            cambiarAUnPaso(4);
        });
    }

    if (btnVolverAlPaso3) btnVolverAlPaso3.addEventListener('click', () => { errorStep3.style.display = 'none'; cambiarAUnPaso(3); });


    // --- MANEJO DE MÚLTIPLES IMÁGENES (HASTA 3) ---
    if (inputImg) {
        inputImg.addEventListener('change', () => {
            const archivos = Array.from(inputImg.files);
            
            archivos.forEach(file => {
                if (base64ImagesArray.length >= 3) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    base64ImagesArray.push(e.target.result);
                    actualizarGridImagenes();
                };
                reader.readAsDataURL(file);
            });
            inputImg.value = ""; // Limpiar input para permitir re-subir la misma
        });
    }

    function actualizarGridImagenes() {
        previewMultiGrid.innerHTML = "";
        base64ImagesArray.forEach((imgSrc, index) => {
            const card = document.createElement('div');
            card.className = "modern-preview-card";
            card.innerHTML = `
                <img src="${imgSrc}" alt="Preview ${index + 1}">
                <button type="button" class="btn-delete-image-floating" data-idx="${index}">🗑️</button>
            `;
            previewMultiGrid.appendChild(card);
        });

        // Eventos para eliminar de forma individual
        document.querySelectorAll('.btn-delete-image-floating').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-idx'));
                base64ImagesArray.splice(idx, 1);
                actualizarGridImagenes();
            });
        });
    }


    // --- DESPLEGABLES ASOCIADOS EN CADENA ---
    if (selectCategoria) {
        selectCategoria.addEventListener('change', () => {
            selectTipo.innerHTML = '<option value="">-- Selecciona Tipo --</option>';
            selectMarca.innerHTML = '<option value="">-- Elige el tipo de artículo --</option>';
            selectModelo.innerHTML = '<option value="">-- Elige primero la marca --</option>';
            selectMarca.disabled = true; selectModelo.disabled = true;
            wrapperModeloManual.style.display = "none";

            if (selectCategoria.value) {
                selectTipo.disabled = false;
                tiposArticulos.forEach(tipo => {
                    const opt = document.createElement('option');
                    opt.value = tipo; opt.innerText = tipo;
                    selectTipo.appendChild(opt);
                });
            } else { selectTipo.disabled = true; }
        });
    }

    if (selectTipo) {
        selectTipo.addEventListener('change', () => {
            selectMarca.innerHTML = '<option value="">-- Selecciona Marca --</option>';
            selectModelo.innerHTML = '<option value="">-- Elige primero la marca --</option>';
            selectModelo.disabled = true;
            wrapperModeloManual.style.display = "none";

            const tipo = selectTipo.value;
            const dep = selectCategoria.value;

            if (!tipo) { selectMarca.disabled = true; return; }
            selectMarca.disabled = false;

            let marcasDisponibles = [];
            if (tipo === "Equipamiento / Herramienta Principal") {
                marcasDisponibles = marcasPorTipo[tipo][dep] || marcasPorTipo[tipo]["Otros Deportes"];
            } else { marcasDisponibles = marcasPorTipo[tipo]["General"]; }

            marcasDisponibles.forEach(marca => {
                const opt = document.createElement('option');
                opt.value = marca; opt.innerText = marca;
                selectMarca.appendChild(opt);
            });

            const optOtra = document.createElement('option');
            optOtra.value = "Otra marca..."; optOtra.innerText = "➕ Otra marca...";
            selectMarca.appendChild(optOtra);
        });
    }

    if (selectMarca) {
        selectMarca.addEventListener('change', () => {
            let marca = selectMarca.value;
            if (!marca) { selectModelo.disabled = true; wrapperModeloManual.style.display = "none"; return; }

            if (marca === "Otra marca...") {
                wrapperModeloManual.style.display = "block";
                inputModeloManual.placeholder = "Escribe la Marca y el Modelo aquí...";
                selectModelo.disabled = true;
                return;
            }

            selectModelo.disabled = false;
            wrapperModeloManual.style.display = "none";
            selectModelo.innerHTML = `
                <option value="">-- Elige Opción --</option>
                <option value="Escribir modelo...">✍️ Escribir modelo manualmente...</option>
            `;
        });
    }

    if (selectModelo) {
        selectModelo.addEventListener('change', () => {
            if (selectModelo.value === "Escribir modelo...") {
                wrapperModeloManual.style.display = "block";
                inputModeloManual.placeholder = "Escribe el modelo exacto aquí...";
            } else {
                wrapperModeloManual.style.display = "none";
            }
        });
    }


    // MONTO DE FACTURACIÓN INTERACTIVO (PREMIUM CORREGIDO A 4000)
    const radiosPlan = document.getElementsByName('planRadio');
    radiosPlan.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const precio = parseFloat(e.target.getAttribute('data-price'));
            document.getElementById('montoFinalLabel').innerText = `RD$ ${precio.toLocaleString()}`;
        });
    });


    // --- SUBMIT FINAL Y REGISTRO ---
    if (flujoForm) {
        flujoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fileComprobante = document.getElementById('formComprobante').files[0];
            if (!fileComprobante) { 
                errorStep4.innerText = "Es obligatorio adjuntar la captura del comprobante bancario.";
                errorStep4.style.display = 'flex';
                return; 
            }
            errorStep4.style.display = 'none';

            const planElegido = document.querySelector('input[name="planRadio"]:checked').value;
            const vendedorNombre = document.getElementById('formVendedor').value;

            // Procesar título definitivo sin Prompts
            let marcaFinal = selectMarca.value;
            let modeloFinal = selectModelo.value;

            if (marcaFinal === "Otra marca...") {
                marcaFinal = "Variada";
                modeloFinal = inputModeloManual.value.trim();
            } else if (modeloFinal === "Escribir modelo...") {
                modeloFinal = inputModeloManual.value.trim();
            }

            const tituloDefinitivo = `${marcaFinal} ${modeloFinal}`;

            const nuevoAnuncio = {
                id: Date.now(),
                titulo: tituloDefinitivo,
                marca: marcaFinal,
                tipo: selectTipo.value,
                precio: parseFloat(document.getElementById('formPrecio').value),
                categoria: selectCategoria.value,
                condicion: document.getElementById('formCondicion').value,
                vendedor: vendedorNombre,
                provincia: document.getElementById('formProvincia').value,
                whatsapp: document.getElementById('formWhatsapp').value,
                imagenes: [...base64ImagesArray],
                plan: planElegido,
                esEliminable: true // Flag para saber que fue creado en esta sesión y poder borrarlo
            };

            baseDeDatosActual.unshift(nuevoAnuncio);
            localStorage.setItem('deporterd_database_live', JSON.stringify(baseDeDatosActual));
            
            // Limpieza
            base64ImagesArray = [];
            actualizarGridImagenes();
            renderizarProductos();
            
            modalPublicar.style.display = 'none';
            modalExitoNativo.style.display = 'flex';
        });
    }

    if (btnCerrarExito) {
        btnCerrarExito.addEventListener('click', () => {
            modalExitoNativo.style.display = 'none';
            flujoForm.reset();
            wrapperModeloManual.style.display = "none";
            cambiarAUnPaso(1);
        });
    }


    // --- RENDERIZACIÓN DE ARTÍCULOS CON SISTEMA DE BORRADO ---
    function renderizarProductos() {
        if (!productsGrid) return;
        productsGrid.innerHTML = '';
        const buscarTexto = searchInput ? searchInput.value.toLowerCase().trim() : "";

        const filtrados = baseDeDatosActual.filter(art => {
            const matchTexto = art.titulo.toLowerCase().includes(buscarTexto) || art.marca.toLowerCase().includes(buscarTexto);
            const matchCat = (categoriaSeleccionada === "Todos" || art.categoria === categoriaSeleccionada);
            return matchTexto && matchCat;
        });

        if(filtrados.length === 0) {
            productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:40px; color:#64748b;">No hay artículos disponibles con estos filtros.</p>`;
            return;
        }

        filtrados.forEach(art => {
            const tarjeta = document.createElement('div');
            tarjeta.className = art.plan === "Premium" ? 'product-card card-premium' : (art.plan === "Destacado" ? 'product-card card-destacado' : 'product-card');
            
            const textoMsg = encodeURIComponent("Hola " + art.vendedor + ", vi tu anuncio de \"" + art.titulo + "\" en DeporteRD. ¿Sigue disponible?");
            
            // Usar la primera imagen del arreglo, o una por defecto si está vacío
            const imagenPrincipal = (art.imagenes && art.imagenes.length > 0) ? art.imagenes[0] : (art.img || "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500");

            // Si es eliminable (creado localmente), inyectamos el botón de borrar
            const botonBorrarHTML = art.esEliminable ? `<button class="btn-eliminar-anuncio" data-id="${art.id}">❌</button>` : '';

            tarjeta.innerHTML = `
                ${botonBorrarHTML}
                <div class="card-img-container">
                    <img src="${imagenPrincipal}" alt="${art.titulo}">
                    <span class="badge-condicion">${art.condicion}</span>
                </div>
                <div class="card-info">
                    <span class="card-brand">${art.marca} • <small>${art.tipo.split(" ")[0]}</small></span>
                    <h3 class="card-title">${art.titulo}</h3>
                    <p class="card-price">RD$ ${art.precio.toLocaleString()}</p>
                    <div class="card-footer">
                        <div><span class="seller-name">${art.vendedor}</span><span class="seller-loc">${art.provincia}</span></div>
                        <a href="https://wa.me/${art.whatsapp}?text=${textoMsg}" target="_blank" class="btn-whatsapp">WhatsApp</a>
                    </div>
                </div>
            `;
            productsGrid.appendChild(tarjeta);
        });

        // Asignar listeners a los botones de eliminación de anuncios
        document.querySelectorAll('.btn-eliminar-anuncio').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idABorrar = parseInt(e.target.getAttribute('data-id'));
                // Filtrar de la lista
                baseDeDatosActual = baseDeDatosActual.filter(item => item.id !== idABorrar);
                localStorage.setItem('deporterd_database_live', JSON.stringify(baseDeDatosActual));
                renderizarProductos();
            });
        });
    }

    if (tags) {
        tags.forEach(tag => {
            tag.addEventListener('click', () => {
                const activeTag = document.querySelector('.tag-btn.active');
                if (activeTag) activeTag.classList.remove('active');
                tag.classList.add('active');
                categoriaSeleccionada = tag.getAttribute('data-cat');
                renderizarProductos();
            });
        });
    }

    if (btnBuscar) btnBuscar.addEventListener('click', renderizarProductos);
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if(e.key === 'Enter') renderizarProductos();
        });
    }

    renderizarProductos();
});