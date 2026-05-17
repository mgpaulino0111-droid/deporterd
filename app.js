document.addEventListener('DOMContentLoaded', () => {
    
    // === CATÁLOGO EN CASCADA (Estilo Supercarros) ===
    const catalogoDeportes = {
        "Pádel": {
            "Siux": ["ST3", "Diablo Luxury", "Electra ST3", "Fenix IV"],
            "Babolat": ["Technical Viper 2024", "Air Viper", "Counter Vert"],
            "Nox": ["AT10 Genius", "ML10 Pro Cup", "X-One"]
        },
        "Bicicletas": {
            "Trek": ["Marlin 5", "Marlin 7", "X-Caliber"],
            "Specialized": ["Rockhopper", "Chisel", "Sirrus"],
            "Giant": ["Talon 1", "ATX"]
        },
        "Tenis": {
            "Wilson": ["Pro Staff 97", "Blade 98", "Clash 100"],
            "Babolat": ["Pure Drive", "Pure Aero"],
            "Head": ["Speed Pro", "Radical MP"]
        },
        "Béisbol": {
            "Rawlings": ["Heart of the Hide", "Pro Preferred"],
            "Wilson": ["A2000", "A2K"],
            "Louisville Slugger": ["Meta Prime", "Omaha"]
        },
        "Otros": {
            "Genérico": ["Accesorio Deportivo", "Protección / Ropa"]
        }
    };

    // Elementos del Modal e Interfaz
    const btnPublicar = document.getElementById('btnPublicar');
    const modalPublicar = document.getElementById('modalPublicar');
    const btnCerrarModal = document.getElementById('btnCerrarModal');
    const flujoForm = document.getElementById('flujoPublicarForm');
    
    // Elementos de Pasos del Formulario
    const stepVendedor = document.getElementById('step-vendedor');
    const stepArticulo = document.getElementById('step-articulo');
    const stepMultimedia = document.getElementById('step-multimedia');
    const stepPago = document.getElementById('step-pago');

    // Botones de Navegación de Pasos
    const btnPasarAlPaso2 = document.getElementById('btnPasarAlPaso2');
    const btnVolverAlPaso1 = document.getElementById('btnVolverAlPaso1');
    const btnPasarAlPaso3 = document.getElementById('btnPasarAlPaso3');
    const btnVolverAlPaso2 = document.getElementById('btnVolverAlPaso2');
    const btnPasarAlPaso4 = document.getElementById('btnPasarAlPaso4');
    const btnVolverAlPaso3 = document.getElementById('btnVolverAlPaso3');

    // Selectores Desplegables Inteligentes
    const selectCategoria = document.getElementById('formCategoria');
    const selectMarca = document.getElementById('formMarca');
    const selectModelo = document.getElementById('formModelo');
    const inputTituloOculto = document.getElementById('formTitulo');

    // Rejilla de productos y buscadores
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const btnBuscar = document.getElementById('btnBuscar');
    const tags = document.querySelectorAll('.tag-btn');

    // Base de datos local simulada con ejemplos iniciales
    const mockCloudDatabase = [
        { id: 1, titulo: "Siux ST3", categoria: "Pádel", marca: "Siux", precio: 15500, condicion: "Usado - Como nueva", vendedor: "Carlos Martínez", provincia: "Santo Domingo", whatsapp: "18095551234", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500", plan: "Premium" },
        { id: 2, titulo: "Trek Marlin 7", categoria: "Bicicletas", marca: "Trek", precio: 38000, condicion: "Nueva", vendedor: "Luis García", provincia: "Santiago", whatsapp: "18295556789", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500", plan: "Destacado" }
    ];

    let baseDeDatosActual = JSON.parse(localStorage.getItem('deporterd_database_live')) || mockCloudDatabase;
    let categoriaSeleccionada = "Todos";

    // --- MANEJO DEL MODAL (ABRIR Y CERRAR CON CLASES CSS DIRECTAS) ---
    btnPublicar.addEventListener('click', () => {
        modalPublicar.style.display = 'flex';
        modalPublicar.classList.add('show');
    });

    btnCerrarModal.addEventListener('click', () => {
        modalPublicar.style.display = 'none';
        modalPublicar.classList.remove('show');
    });

    // --- FUNCIÓN CENTRAL PARA CAMBIAR ENTRE PASOS ---
    function cambiarAUnPaso(numeroPaso) {
        // Ocultar todos los bloques de contenido
        stepVendedor.classList.remove('active');
        stepArticulo.classList.remove('active');
        stepMultimedia.classList.remove('active');
        stepPago.classList.remove('active');

        // Quitar estado activo a los indicadores numéricos superiores
        document.getElementById('ind-1').classList.remove('active');
        document.getElementById('ind-2').classList.remove('active');
        document.getElementById('ind-3').classList.remove('active');
        document.getElementById('ind-4').classList.remove('active');

        // Activar el paso que corresponde
        if (numeroPaso === 1) { stepVendedor.classList.add('active'); document.getElementById('ind-1').classList.add('active'); }
        if (numeroPaso === 2) { stepArticulo.classList.add('active'); document.getElementById('ind-2').classList.add('active'); }
        if (numeroPaso === 3) { stepMultimedia.classList.add('active'); document.getElementById('ind-3').classList.add('active'); }
        if (numeroPaso === 4) { stepPago.classList.add('active'); document.getElementById('ind-4').classList.add('active'); }
    }

    // --- ASIGNACIÓN DE ENLACES DE CLICS A LOS BOTONES DE NAVEGACIÓN ---
    btnPasarAlPaso2.addEventListener('click', () => {
        if (!document.getElementById('formVendedor').value || !document.getElementById('formWhatsapp').value || !document.getElementById('formEmail').value) {
            alert("Por favor rellena tus datos de contacto obligatorios.");
            return;
        }
        cambiarAUnPaso(2);
    });

    btnVolverAlPaso1.addEventListener('click', () => cambiarAUnPaso(1));

    btnPasarAlPaso3.addEventListener('click', () => {
        if (!selectCategoria.value || !selectMarca.value || !selectModelo.value || !document.getElementById('formPrecio').value) {
            alert("Por favor selecciona todos los detalles técnicos del artículo.");
            return;
        }
        cambiarAUnPaso(3);
    });

    btnVolverAlPaso2.addEventListener('click', () => cambiarAUnPaso(2));

    btnPasarAlPaso4.addEventListener('click', () => {
        if (!document.getElementById('formImg').files[0]) {
            alert("Es obligatorio subir una foto de tu artículo para continuar.");
            return;
        }
        cambiarAUnPaso(4);
    });

    btnVolverAlPaso3.addEventListener('click', () => cambiarAUnPaso(3));


    // --- LÓGICA DE MENÚS INTELIGENTES EN CASCADA ---
    selectCategoria.addEventListener('change', () => {
        const cat = selectCategoria.value;
        selectMarca.innerHTML = '<option value="">-- Selecciona Marca --</option>';
        selectModelo.innerHTML = '<option value="">-- Elige primero la marca --</option>';
        selectModelo.disabled = true;

        if (cat && catalogoDeportes[cat]) {
            selectMarca.disabled = false;
            Object.keys(catalogoDeportes[cat]).forEach(marca => {
                const opt = document.createElement('option');
                opt.value = marca;
                opt.innerText = marca;
                selectMarca.appendChild(opt);
            });
        } else {
            selectMarca.disabled = true;
        }
    });

    selectMarca.addEventListener('change', () => {
        const cat = selectCategoria.value;
        const marca = selectMarca.value;
        selectModelo.innerHTML = '<option value="">-- Selecciona Modelo --</option>';

        if (marca && catalogoDeportes[cat][marca]) {
            selectModelo.disabled = false;
            catalogoDeportes[cat][marca].forEach(modelo => {
                const opt = document.createElement('option');
                opt.value = modelo;
                opt.innerText = modelo;
                selectModelo.appendChild(opt);
            });
        } else {
            selectModelo.disabled = true;
        }
    });

    selectModelo.addEventListener('change', () => {
        if(selectMarca.value && selectModelo.value) {
            inputTituloOculto.value = `${selectMarca.value} ${selectModelo.value}`;
        }
    });

    // --- PROCESAMIENTO VISUAL DE LA FOTO SUBIDA ---
    const inputImg = document.getElementById('formImg');
    inputImg.addEventListener('change', () => {
        const file = inputImg.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('imgFormPreview').src = e.target.result;
                document.getElementById('previewContainer').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Cambiar etiqueta de precio según el plan seleccionado
    const radiosPlan = document.getElementsByName('planRadio');
    radiosPlan.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const precio = parseFloat(e.target.getAttribute('data-price'));
            document.getElementById('montoFinalLabel').innerText = `RD$ ${precio.toLocaleString()}`;
        });
    });


    // --- MOSTRAR LOS ARTÍCULOS EN LA PÁGINA ---
    function renderizarProductos() {
        productsGrid.innerHTML = '';
        const buscarTexto = searchInput.value.toLowerCase().trim();

        const filtrados = baseDeDatosActual.filter(art => {
            const matchTexto = art.titulo.toLowerCase().includes(buscarTexto) || art.marca.toLowerCase().includes(buscarTexto);
            const matchCat = (categoriaSeleccionada === "Todos" || art.categoria === categoriaSeleccionada);
            return matchTexto && matchCat;
        });

        if(filtrados.length === 0) {
            productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:40px; color:#64748b;">No hay artículos disponibles en este momento.</p>`;
            return;
        }

        filtrados.forEach(art => {
            const tarjeta = document.createElement('div');
            if (art.plan === "Destacado") tarjeta.className = 'product-card card-destacado';
            else if (art.plan === "Premium") tarjeta.className = 'product-card card-premium';
            else tarjeta.className = 'product-card';

            const textoMsg = encodeURIComponent(`Hola ${art.vendedor}, vi tu anuncio de "${art.titulo}" en DeporteRD. ¿Sigue disponible?`);

            tarjeta.innerHTML = `
                <div class="card-img-container">
                    <img src="${art.img}" alt="${art.titulo}">
                    <span class="badge-condicion">${art.condicion}</span>
                </div>
                <div class="card-info">
                    <span class="card-brand">${art.marca}</span>
                    <h3 class="card-title">${art.titulo}</h3>
                    <p class="card-price">RD$ ${art.precio.toLocaleString()}</p>
                    <div class="card-footer">
                        <div>
                            <span class="seller-name">${art.vendedor}</span>
                            <span class="seller-loc">${art.provincia}</span>
                        </div>
                        <a href="https://wa.me/${art.whatsapp}?text=${textoMsg}" target="_blank" class="btn-whatsapp">WhatsApp</a>
                    </div>
                </div>
            `;
            productsGrid.appendChild(tarjeta);
        });
    }

    // --- GUARDAR Y PUBLICAR EL FORMULARIO FINAL ---
    flujoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!document.getElementById('formComprobante').files[0]) {
            alert("Por favor, adjunta tu comprobante de transferencia bancaria.");
            return;
        }

        const planElegido = document.querySelector('input[name="planRadio"]:checked').value;

        const nuevoAnuncio = {
            id: Date.now(),
            titulo: inputTituloOculto.value || `${selectMarca.value} ${selectModelo.value}`,
            marca: selectMarca.value,
            precio: parseFloat(document.getElementById('formPrecio').value),
            categoria: selectCategoria.value,
            condicion: document.getElementById('formCondicion').value,
            vendedor: document.getElementById('formVendedor').value,
            provincia: document.getElementById('formProvincia').value,
            whatsapp: document.getElementById('formWhatsapp').value,
            img: document.getElementById('imgFormPreview').src,
            plan: planElegido
        };

        baseDeDatosActual.unshift(nuevoAnuncio);
        localStorage.setItem('deporterd_database_live', JSON.stringify(baseDeDatosActual));
        
        renderizarProductos();
        alert("🎉 ¡Anuncio enviado con éxito! Se publicará en vivo al validar la transferencia.");
        modalPublicar.style.display = 'none';
        modalPublicar.classList.remove('show');
        flujoForm.reset();
        document.getElementById('previewContainer').style.display = 'none';
        cambiarAUnPaso(1);
    });

    // FILTROS DE CATEGORÍAS (BOTONES SUPERIORES)
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelector('.tag-btn.active').classList.remove('active');
            tag.classList.add('active');
            categoriaSeleccionada = tag.getAttribute('data-cat');
            renderizarProductos();
        });
    });

    btnBuscar.addEventListener('click', renderizarProductos);
    searchInput.addEventListener('keyup', (e) => { if(e.key === 'Enter') renderizarProductos(); });

    // Carga inicial de tarjetas
    renderizarProductos();
});