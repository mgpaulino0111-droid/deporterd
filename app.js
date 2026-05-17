document.addEventListener('DOMContentLoaded', () => {
    
    // 13 Deportes oficiales exactos
    const listaDeportes = [
        "Pádel", "Béisbol", "Baloncesto", "Fútbol", "Bicicletas", "Tenis de Campo", "Gym & Fitness",
        "Voleibol", "Softbol", "Natación", "Boxeo / MMA", "Running", "Otros Deportes"
    ];

    const tiposArticulos = ["Equipamiento / Herramienta Principal", "Calzado / Tenis", "Ropa Deportiva", "Accesorios / Grips / Extras"];

    // Base de datos de marcas mapeada correctamente a las 13 categorías
    const marcasPorTipo = {
        "Equipamiento / Herramienta Principal": {
            "Pádel": ["Siux", "Babolat", "Nox", "Adidas", "Bullpadel", "Head", "StarVie", "Drop Shot"],
            "Béisbol": ["Rawlings", "Wilson", "Louisville Slugger", "Marucci", "Mizuno", "Easton"],
            "Baloncesto": ["Spalding", "Wilson", "Molten", "Nike"],
            "Fútbol": ["Adidas", "Nike", "Puma", "Penalty", "Mitre"],
            "Bicicletas": ["Trek", "Specialized", "Giant", "Cannondale", "Scott", "Shimano"],
            "Tenis de Campo": ["Wilson", "Babolat", "Head", "Yonex", "Prince", "Dunlop"],
            "Gym & Fitness": ["Rogue Fitness", "Bowflex", "Everlast", "Cap Barbell", "Matrix"],
            "Softbol": ["Rawlings", "DeMarini", "Worth", "Mizuno"],
            "Voleibol": ["Mikasa", "Molten", "Wilson", "Asics"],
            "Natación": ["Speedo", "Arena", "TYR", "Cressi"],
            "Boxeo / MMA": ["Everlast", "Venum", "Cleto Reyes", "Hayabusa"],
            "Running": ["Nike", "Asics", "Brooks", "Saucony", "Hoka", "New Balance"],
            "Otros Deportes": ["Marcas Variadas", "Genérico"]
        },
        "Calzado / Tenis": { 
            "General": ["Nike", "Adidas", "Puma", "Under Armour", "Asics", "New Balance", "Mizuno", "Reebok"] 
        },
        "Ropa Deportiva": { 
            "General": ["Nike", "Adidas", "Puma", "Under Armour", "Reebok", "Columbia", "Gymshark"] 
        },
        "Accesorios / Grips / Extras": { 
            "General": ["Garmin", "Apple", "Wilson", "Babolat", "Nox", "Nike", "Fitbit", "Genérico"] 
        }
    };

    // ELEMENTOS DEL DOM
    const selectCategoria = document.getElementById('formCategoria');
    const selectTipo = document.getElementById('formTipo');
    const selectMarca = document.getElementById('formMarca');
    const selectModelo = document.getElementById('formModelo');
    const wrapperModeloManual = document.getElementById('wrapperModeloManual');
    const inputModeloManual = document.getElementById('inputModeloManual');

    const btnPublicar = document.getElementById('btnPublicar');
    const modalPublicar = document.getElementById('modalPublicar');
    const btnCerrarModal = document.getElementById('btnCerrarModal');
    const flujoForm = document.getElementById('flujoPublicarForm');
    
    const modalDetalle = document.getElementById('modalDetalle');
    const btnCerrarDetalle = document.getElementById('btnCerrarDetalle');

    // PASOS DEL FORMULARIO FLOTANTE
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

    const errorStep1 = document.getElementById('error-step-1');
    const errorStep2 = document.getElementById('error-step-2');
    const errorStep3 = document.getElementById('error-step-3');
    const errorStep4 = document.getElementById('error-step-4');

    const inputImg = document.getElementById('formImg');
    const previewMultiGrid = document.getElementById('previewMultiGrid');
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const btnBuscar = document.getElementById('btnBuscar');
    const tags = document.querySelectorAll('.tag-btn');

    let base64ImagesArray = [];

    // ARTÍCULO BASE POR DEFECTO EN CASO DE LOCALSTORAGE VACÍO
    const mockCloudDatabase = [
        { 
            id: 1, 
            titulo: "Siux ST3 Pro", 
            categoria: "Pádel", 
            tipo: "Equipamiento / Herramienta Principal", 
            marca: "Siux", 
            precio: 15500, 
            condicion: "Usado - Como nueva", 
            vendedor: "Carlos Martínez", 
            provincia: "Santo Domingo", 
            whatsapp: "18095551234", 
            imagenes: ["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500"], 
            plan: "Premium"
        }
    ];

    // INICIALIZACIÓN DE LA BASE DE DATOS LOCAL (PERSISTENTE)
    let baseDeDatosActual = JSON.parse(localStorage.getItem('deporterd_database_live'));
    if (!baseDeDatosActual || !Array.isArray(baseDeDatosActual)) {
        baseDeDatosActual = mockCloudDatabase;
        localStorage.setItem('deporterd_database_live', JSON.stringify(baseDeDatosActual));
    }

    let categoriaSeleccionada = "Todos";

    // CARGAR LAS 13 CATEGORÍAS EN EL SELECT AL INICIAR
    if (selectCategoria) {
        selectCategoria.innerHTML = '<option value="">-- Selecciona Deporte --</option>';
        listaDeportes.forEach(dep => {
            selectCategoria.appendChild(new Option(dep, dep));
        });
    }

    // CONTROL DE VISIBILIDAD DE MODALES PRINCIPALES
    if (btnPublicar) btnPublicar.addEventListener('click', () => { modalPublicar.style.display = 'flex'; });
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', () => { modalPublicar.style.display = 'none'; });
    if (btnCerrarDetalle) btnCerrarDetalle.addEventListener('click', () => { modalDetalle.style.display = 'none'; });

    // FLUJO VISUAL PASO A PASO
    function cambiarAUnPaso(num) {
        const pasos = [stepVendedor, stepArticulo, stepMultimedia, stepPago];
        const indicadores = ['ind-1', 'ind-2', 'ind-3', 'ind-4'];

        pasos.forEach(s => { if(s) s.classList.remove('active'); });
        indicadores.forEach(id => { 
            const el = document.getElementById(id);
            if(el) el.classList.remove('active'); 
        });

        if (num === 1 && stepVendedor) { stepVendedor.classList.add('active'); document.getElementById('ind-1')?.classList.add('active'); }
        if (num === 2 && stepArticulo) { stepArticulo.classList.add('active'); document.getElementById('ind-2')?.classList.add('active'); }
        if (num === 3 && stepMultimedia) { stepMultimedia.classList.add('active'); document.getElementById('ind-3')?.classList.add('active'); }
        if (num === 4 && stepPago) { stepPago.classList.add('active'); document.getElementById('ind-4')?.classList.add('active'); }
    }

    // VALIDACIÓN Y AVANCE - PASO 1
    if (btnPasarAlPaso2) {
        btnPasarAlPaso2.addEventListener('click', () => {
            const vend = document.getElementById('formVendedor').value.trim();
            const tel = document.getElementById('formWhatsapp').value.trim();
            const mail = document.getElementById('formEmail').value.trim();

            if (!vend || !tel || !mail) {
                if(errorStep1) { errorStep1.innerText = "Por favor, completa todos los campos del vendedor."; errorStep1.style.display = 'flex'; }
                return;
            }
            if(errorStep1) errorStep1.style.display = 'none'; 
            cambiarAUnPaso(2);
        });
    }
    if (btnVolverAlPaso1) btnVolverAlPaso1.addEventListener('click', () => cambiarAUnPaso(1));

    // VALIDACIÓN Y AVANCE - PASO 2
    if (btnPasarAlPaso3) {
        btnPasarAlPaso3.addEventListener('click', () => {
            const necesitaManual = (selectMarca.value === "Otra marca..." || selectModelo.value === "Escribir modelo..." || selectTipo.value !== "Equipamiento / Herramienta Principal");
            const textoManual = inputModeloManual.value.trim();
            const precio = document.getElementById('formPrecio').value.trim();

            if (!selectCategoria.value || !selectTipo.value || !selectMarca.value || !precio) {
                if(errorStep2) { errorStep2.innerText = "Por favor, completa los campos obligatorios de categoría, marca y precio."; errorStep2.style.display = 'flex'; }
                return;
            }

            if (necesitaManual && !textoManual) {
                if(errorStep2) { errorStep2.innerText = "Por favor, escribe el modelo o descripción del artículo en el campo de texto manual."; errorStep2.style.display = 'flex'; }
                return;
            }

            if(errorStep2) errorStep2.style.display = 'none'; 
            cambiarAUnPaso(3);
        });
    }
    if (btnVolverAlPaso2) btnVolverAlPaso2.addEventListener('click', () => cambiarAUnPaso(2));

    // VALIDACIÓN Y AVANCE - PASO 3 (MULTIMEDIA)
    if (btnPasarAlPaso4) {
        btnPasarAlPaso4.addEventListener('click', () => {
            if (base64ImagesArray.length === 0) {
                if(errorStep3) { errorStep3.innerText = "Sube al menos 1 foto real de tu artículo deportivo."; errorStep3.style.display = 'flex'; }
                return;
            }
            if(errorStep3) errorStep3.style.display = 'none'; 
            cambiarAUnPaso(4);
        });
    }
    if (btnVolverAlPaso3) btnVolverAlPaso3.addEventListener('click', () => cambiarAUnPaso(3));

    // PROCESAMIENTO MULTIPLE DE IMÁGENES A BASE64
    if (inputImg) {
        inputImg.addEventListener('change', () => {
            Array.from(inputImg.files).forEach(file => {
                if (base64ImagesArray.length >= 3) return;
                const r = new FileReader();
                r.onload = (e) => { 
                    base64ImagesArray.push(e.target.result); 
                    actualizarGridImagenes(); 
                };
                r.readAsDataURL(file);
            });
            inputImg.value = "";
        });
    }

    function actualizarGridImagenes() {
        if (!previewMultiGrid) return;
        previewMultiGrid.innerHTML = "";
        base64ImagesArray.forEach((src, idx) => {
            const card = document.createElement('div'); 
            card.className = "modern-preview-card";
            card.innerHTML = `<img src="${src}"><button type="button" class="btn-delete-image-floating" data-idx="${idx}">🗑️</button>`;
            previewMultiGrid.appendChild(card);
        });
        
        document.querySelectorAll('.btn-delete-image-floating').forEach(b => {
            b.addEventListener('click', (e) => {
                base64ImagesArray.splice(parseInt(e.target.getAttribute('data-idx')), 1);
                actualizarGridImagenes();
            });
        });
    }

    // DINÁMICA DE MENÚS DESPLEGABLES EN CASCADA
    if (selectCategoria) {
        selectCategoria.addEventListener('change', () => {
            selectTipo.innerHTML = '<option value="">-- Selecciona Tipo --</option>'; 
            selectMarca.innerHTML = '<option value="">-- Elige Tipo --</option>'; 
            selectModelo.innerHTML = '<option value="">-- Elige Marca --</option>';
            selectMarca.disabled = true; selectModelo.disabled = true; 
            if(wrapperModeloManual) wrapperModeloManual.style.display = "none";
            
            if (selectCategoria.value) {
                selectTipo.disabled = false;
                tiposArticulos.forEach(t => selectTipo.appendChild(new Option(t, t)));
            } else { selectTipo.disabled = true; }
        });
    }

    if (selectTipo) {
        selectTipo.addEventListener('change', () => {
            selectMarca.innerHTML = '<option value="">-- Selecciona Marca --</option>'; 
            selectModelo.innerHTML = '<option value="">-- Elige Marca --</option>';
            selectModelo.disabled = true; 
            if(wrapperModeloManual) wrapperModeloManual.style.display = "none";
            if (!selectTipo.value) { selectMarca.disabled = true; return; }
            selectMarca.disabled = false;
            
            let mks = (selectTipo.value === "Equipamiento / Herramienta Principal") 
                ? (marcasPorTipo[selectTipo.value][selectCategoria.value] || marcasPorTipo[selectTipo.value]["Otros Deportes"]) 
                : marcasPorTipo[selectTipo.value]["General"];
                
            mks.forEach(m => selectMarca.appendChild(new Option(m, m)));
            selectMarca.appendChild(new Option("➕ Otra marca...", "Otra marca..."));
        });
    }

    if (selectMarca) {
        selectMarca.addEventListener('change', () => {
            if (!selectMarca.value) { selectModelo.disabled = true; if(wrapperModeloManual) wrapperModeloManual.style.display = "none"; return; }
            
            if (selectMarca.value === "Otra marca..." || selectTipo.value !== "Equipamiento / Herramienta Principal") {
                if(wrapperModeloManual) {
                    wrapperModeloManual.style.display = "block"; 
                    inputModeloManual.value = ""; 
                    inputModeloManual.placeholder = "Escribe la marca y el modelo exacto aquí...";
                }
                selectModelo.disabled = true;
            } else {
                selectModelo.disabled = false; 
                if(wrapperModeloManual) wrapperModeloManual.style.display = "none";
                selectModelo.innerHTML = '<option value="">-- Elige Opción --</option><option value="Escribir modelo...">✍️ Escribir modelo manualmente...</option>';
            }
        });
    }

    if (selectModelo) {
        selectModelo.addEventListener('change', () => {
            if(wrapperModeloManual) {
                wrapperModeloManual.style.display = (selectModelo.value === "Escribir modelo...") ? "block" : "none";
                if (selectModelo.value === "Escribir modelo...") { inputModeloManual.value = ""; inputModeloManual.placeholder = "Escribe el modelo exacto aquí..."; }
            }
        });
    }

    // INTERFAZ DE PRECIOS SEGÚN EL PLAN
    document.getElementsByName('planRadio').forEach(r => {
        r.addEventListener('change', (e) => {
            const label = document.getElementById('montoFinalLabel');
            if(label) label.innerText = `RD$ ${parseFloat(e.target.getAttribute('data-price')).toLocaleString()}`;
        });
    });

    // GUARDADO FINAL 100% PERSISTENTE Y SIN TRABAS
    if (flujoForm) {
        flujoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Cerrar el modal inmediatamente para liberar la pantalla
            if (modalPublicar) {
                modalPublicar.style.display = 'none';
            }

            let mkF = selectMarca ? selectMarca.value : "Genérico";
            let modF = selectModelo ? selectModelo.value : "Genérico";
            
            if ((selectTipo && selectTipo.value !== "Equipamiento / Herramienta Principal") || mkF === "Otra marca...") { 
                if(mkF === "Otra marca...") { mkF = "Variada"; }
                if(inputModeloManual) modF = inputModeloManual.value.trim(); 
            } else if (modF === "Escribir modelo...") { 
                if(inputModeloManual) modF = inputModeloManual.value.trim(); 
            }

            if (!modF) { modF = "Genérico"; }

            const copiaImagenes = [...base64ImagesArray];
            const imagenesFinales = copiaImagenes.length > 0 ? copiaImagenes : ["https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500"];
            const planSeleccionado = document.querySelector('input[name="planRadio"]:checked')?.value || "Básico";

            const nuevoAnuncio = {
                id: Date.now(),
                titulo: `${mkF} ${modF}`,
                marca: mkF,
                tipo: selectTipo ? selectTipo.value : "Otros",
                precio: parseFloat(document.getElementById('formPrecio')?.value) || 0,
                categoria: selectCategoria ? selectCategoria.value : "Otros Deportes",
                condicion: document.getElementById('formCondicion')?.value || "Usado",
                vendedor: document.getElementById('formVendedor')?.value || "Anónimo",
                provincia: document.getElementById('formProvincia')?.value || "Santo Domingo",
                whatsapp: document.getElementById('formWhatsapp')?.value || "18095551234",
                imagenes: imagenesFinales,
                plan: planSeleccionado
            };

            // 1. Añadir el nuevo elemento a nuestro array en memoria
            baseDeDatosActual.unshift(nuevoAnuncio);
            
            // 2. GUARDADO COMPLETO E INMEDIATO EN LOCALSTORAGE (No se borra al actualizar)
            localStorage.setItem('deporterd_database_live', JSON.stringify(baseDeDatosActual));
            
            // Limpiar caché multimedia e inputs del formulario
            base64ImagesArray = [];
            if (previewMultiGrid) previewMultiGrid.innerHTML = "";
            
            // Volver a pintar las tarjetas en la página
            renderizarProductos();
            
            // Limpiar el formulario y reestablecer al paso 1
            flujoForm.reset();
            if (wrapperModeloManual) wrapperModeloManual.style.display = "none"; 
            cambiarAUnPaso(1);

            // GESTIÓN DEL MODAL O AVISO DE ÉXITO
            const modalExitoPropio = document.getElementById('modalExitoPropio');
            if (modalExitoPropio) {
                modalExitoPropio.style.display = 'flex';
                const btnCerrarExitoPropio = document.getElementById('btnCerrarExitoPropio');
                if (btnCerrarExitoPropio) {
                    btnCerrarExitoPropio.addEventListener('click', () => { modalExitoPropio.style.display = 'none'; });
                }
            } else {
                // Notificación dinámica elegante integrada por si acaso
                const notificacion = document.createElement('div');
                notificacion.style = "position:fixed; bottom:24px; right:24px; background:#0066ff; color:#ffffff; padding:16px 24px; border-radius:12px; font-family:system-ui, sans-serif; box-shadow:0 10px 25px rgba(0,0,0,0.15); z-index:999999; font-weight:600;";
                notificacion.innerText = "✨ ¡Anuncio guardado y enviado a revisión!";
                document.body.appendChild(notificacion);
                setTimeout(() => notificacion.remove(), 4000);
            }
        });
    }

    // VER VENTANA DETALLADA DE UN ARTÍCULO
    function verDetallesProducto(id) {
        const prod = baseDeDatosActual.find(x => x.id === id);
        if (!prod) return;

        document.getElementById('det-titulo').innerText = prod.titulo;
        document.getElementById('det-precio').innerText = `RD$ ${prod.precio.toLocaleString()}`;
        document.getElementById('det-marca').innerText = prod.marca;
        document.getElementById('det-condicion').innerText = prod.condicion;
        document.getElementById('det-vendedor').innerText = prod.vendedor;
        document.getElementById('det-provincia').innerText = prod.provincia;

        const linkWp = document.getElementById('det-whatsapp-link');
        const txtMsg = encodeURIComponent(`Hola ${prod.vendedor}, me interesa tu "${prod.titulo}" en DeporteRD.`);
        if(linkWp) linkWp.href = `https://wa.me/${prod.whatsapp}?text=${txtMsg}`;

        const imgPrincipal = document.getElementById('det-img-main');
        const miniGrid = document.getElementById('det-mini-grid');
        if(miniGrid) miniGrid.innerHTML = "";

        const fotos = (prod.imagenes && prod.imagenes.length > 0) ? prod.imagenes : ["https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500"];
        if(imgPrincipal) imgPrincipal.src = fotos[0];

        fotos.forEach((f, index) => {
            const imgMini = document.createElement('img'); imgMini.src = f;
            if (index === 0) imgMini.className = "active";
            imgMini.addEventListener('click', () => {
                document.querySelectorAll('.detalle-miniaturas img').forEach(m => m.classList.remove('active'));
                imgMini.className = "active"; if(imgPrincipal) imgPrincipal.src = f;
            });
            if(miniGrid) miniGrid.appendChild(imgMini);
        });

        if(modalDetalle) modalDetalle.style.display = "flex";
    }

    // RENDERIZADO EN PORTADA (SIN BOTONES "X" DE BORRADO URBANO)
    function renderizarProductos() {
        if (!productsGrid) return;
        productsGrid.innerHTML = '';
        const txt = searchInput ? searchInput.value.toLowerCase().trim() : "";

        const filtrados = baseDeDatosActual.filter(art => {
            const mTxt = art.titulo.toLowerCase().includes(txt) || art.marca.toLowerCase().includes(txt);
            const mCat = (categoriaSeleccionada === "Todos" || art.categoria === categoriaSeleccionada);
            return mTxt && mCat;
        });

        if(filtrados.length === 0) {
            productsGrid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:40px; color:#64748b;">No hay artículos deportivos disponibles en esta categoría.</p>`; 
            return;
        }

        filtrados.forEach(art => {
            const tarjeta = document.createElement('div');
            tarjeta.className = art.plan === "Premium" ? 'product-card card-premium' : (art.plan === "Destacado" ? 'product-card card-destacado' : 'product-card');
            
            const imgP = (art.imagenes && art.imagenes.length > 0) ? art.imagenes[0] : "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500";

            tarjeta.innerHTML = `
                <div class="card-img-container">
                    <img src="${imgP}">
                    <span class="badge-condicion">${art.condicion}</span>
                </div>
                <div class="card-info">
                    <span class="card-brand">${art.marca} • <small>${art.tipo.split(" ")[0]}</small></span>
                    <h3 class="card-title">${art.titulo}</h3>
                    <p class="card-price">RD$ ${art.precio.toLocaleString()}</p>
                    <div class="card-footer">
                        <div><span class="seller-name">${art.vendedor}</span><span class="seller-loc">${art.provincia}</span></div>
                        <span class="btn-whatsapp" style="background:#0066ff; padding:6px 12px; font-size:11px; border-radius:6px; color:#fff; font-weight:bold;">Ver más</span>
                    </div>
                </div>
            `;
            
            tarjeta.addEventListener('click', () => verDetallesProducto(art.id));
            productsGrid.appendChild(tarjeta);
        });
    }

    // MANEJO DE FILTROS POR BOTÓN (TAGS)
    if (tags) {
        tags.forEach(t => {
            t.addEventListener('click', () => {
                document.querySelectorAll('.tag-btn').forEach(x => x.classList.remove('active'));
                t.classList.add('active'); 
                categoriaSeleccionada = t.getAttribute('data-cat'); 
                renderizarProductos();
            });
        });
    }

    if (btnBuscar) btnBuscar.addEventListener('click', renderizarProductos);
    if (searchInput) searchInput.addEventListener('keyup', (e) => { if(e.key === 'Enter') renderizarProductos(); });

    // Ejecución inicial limpia
    renderizarProductos();
});