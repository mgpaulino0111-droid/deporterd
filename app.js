document.addEventListener('DOMContentLoaded', () => {
    
    const listaDeportes = [
        "Pádel", "Béisbol", "Baloncesto", "Fútbol", "Bicicletas", "Tenis", "Gym & Fitness",
        "Voleibol", "Softbol", "Natación", "Boxeo / MMA", "Running", "Golf", "Skate / Surf",
        "Otros Deportes"
    ];

    const tiposArticulos = ["Equipamiento / Herramienta Principal", "Calzado / Tenis", "Ropa Deportiva", "Accesorios / Grips / Extras"];

    // BASE DE DATOS EXTENDIDA DE MARCAS RESTAURADA
    const marcasPorTipo = {
        "Equipamiento / Herramienta Principal": {
            "Pádel": ["Siux", "Babolat", "Nox", "Adidas", "Bullpadel", "Head", "StarVie", "Drop Shot"],
            "Béisbol": ["Rawlings", "Wilson", "Louisville Slugger", "Marucci", "Mizuno", "Easton"],
            "Baloncesto": ["Spalding", "Wilson", "Molten", "Nike"],
            "Fútbol": ["Adidas", "Nike", "Puma", "Penalty", "Mitre"],
            "Bicicletas": ["Trek", "Specialized", "Giant", "Cannondale", "Scott", "Shimano"],
            "Tenis": ["Wilson", "BabolaT", "Head", "Yonex", "Prince", "Dunlop"],
            "Gym & Fitness": ["Rogue Fitness", "Bowflex", "Everlast", "Cap Barbell", "Matrix"],
            "Softbol": ["Rawlings", "DeMarini", "Worth", "Mizuno"],
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

    // PASOS DEL FORMULARIO
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
    const modalExitoNativo = document.getElementById('modalExitoNativo');
    const btnCerrarExito = document.getElementById('btnCerrarExito');

    const inputImg = document.getElementById('formImg');
    const previewMultiGrid = document.getElementById('previewMultiGrid');
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const btnBuscar = document.getElementById('btnBuscar');
    const tags = document.querySelectorAll('.tag-btn');

    let base64ImagesArray = [];

    // ARTÍCULOS BASE RESTAURADOS
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
            plan: "Premium", 
            esEliminable: false 
        },
        { 
            id: 2, 
            titulo: "Bate Rawlings Mach AI", 
            categoria: "Béisbol", 
            tipo: "Equipamiento / Herramienta Principal", 
            marca: "Rawlings", 
            precio: 8500, 
            condicion: "Nueva", 
            vendedor: "Miguel Paulino", 
            provincia: "Santiago", 
            whatsapp: "18098889876", 
            imagenes: ["https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=500"], 
            plan: "Destacado", 
            esEliminable: false 
        }
    ];

    let baseDeDatosActual = JSON.parse(localStorage.getItem('deporterd_database_live')) || mockCloudDatabase;
    let categoriaSeleccionada = "Todos";

    // CARGAR CATEGORÍAS EN SELECT
    if (selectCategoria) {
        selectCategoria.innerHTML = '<option value="">-- Selecciona Deporte --</option>';
        listaDeportes.forEach(dep => {
            const opt = document.createElement('option');
            opt.value = dep; opt.innerText = dep;
            selectCategoria.appendChild(opt);
        });
    }

    // GESTIÓN DE APERTURA/CIERRE DE MODALES
    if (btnPublicar) btnPublicar.addEventListener('click', () => modalPublicar.style.display = 'flex');
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', () => modalPublicar.style.display = 'none');
    if (btnCerrarDetalle) btnCerrarDetalle.addEventListener('click', () => modalDetalle.style.display = 'none');

    function cambiarAUnPaso(num) {
        [stepVendedor, stepArticulo, stepMultimedia, stepPago].forEach(s => s.classList.remove('active'));
        ['ind-1', 'ind-2', 'ind-3', 'ind-4'].forEach(id => document.getElementById(id).classList.remove('active'));

        if (num === 1) { stepVendedor.classList.add('active'); document.getElementById('ind-1').classList.add('active'); }
        if (num === 2) { stepArticulo.classList.add('active'); document.getElementById('ind-2').classList.add('active'); }
        if (num === 3) { stepMultimedia.classList.add('active'); document.getElementById('ind-3').classList.add('active'); }
        if (num === 4) { stepPago.classList.add('active'); document.getElementById('ind-4').classList.add('active'); }
    }

    // NAVEGACIÓN PASO A PASO CON VALIDACIONES INLINE
    if (btnPasarAlPaso2) {
        btnPasarAlPaso2.addEventListener('click', () => {
            if (!document.getElementById('formVendedor').value.trim() || !document.getElementById('formWhatsapp').value.trim() || !document.getElementById('formEmail').value.trim()) {
                errorStep1.innerText = "Por favor, completa todos los campos obligatorios del vendedor."; errorStep1.style.display = 'flex'; return;
            }
            errorStep1.style.display = 'none'; cambiarAUnPaso(2);
        });
    }
    if (btnVolverAlPaso1) btnVolverAlPaso1.addEventListener('click', () => cambiarAUnPaso(1));

    if (btnPasarAlPaso3) {
        btnPasarAlPaso3.addEventListener('click', () => {
            const modFinal = (selectModelo.value === "Escribir modelo...") ? inputModeloManual.value.trim() : selectModelo.value;
            if (!selectCategoria.value || !selectTipo.value || !selectMarca.value || !modFinal || !document.getElementById('formPrecio').value) {
                errorStep2.innerText = "Todos los campos de detalles técnicos son estrictamente obligatorios."; errorStep2.style.display = 'flex'; return;
            }
            errorStep2.style.display = 'none'; cambiarAUnPaso(3);
        });
    }
    if (btnVolverAlPaso2) btnVolverAlPaso2.addEventListener('click', () => cambiarAUnPaso(2));

    if (btnPasarAlPaso4) {
        btnPasarAlPaso4.addEventListener('click', () => {
            if (base64ImagesArray.length === 0) {
                errorStep3.innerText = "Sube al menos 1 foto real de tu artículo deportivo."; errorStep3.style.display = 'flex'; return;
            }
            errorStep3.style.display = 'none'; cambiarAUnPaso(4);
        });
    }
    if (btnVolverAlPaso3) btnVolverAlPaso3.addEventListener('click', () => cambiarAUnPaso(3));

    // CARGA Y PREVISUALIZACIÓN DE FOTOS MULTIPLES
    if (inputImg) {
        inputImg.addEventListener('change', () => {
            Array.from(inputImg.files).forEach(file => {
                if (base64ImagesArray.length >= 3) return;
                const r = new FileReader();
                r.onload = (e) => { base64ImagesArray.push(e.target.result); actualizarGridImagenes(); };
                r.readAsDataURL(file);
            });
            inputImg.value = "";
        });
    }

    function actualizarGridImagenes() {
        previewMultiGrid.innerHTML = "";
        base64ImagesArray.forEach((src, idx) => {
            const card = document.createElement('div'); card.className = "modern-preview-card";
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

    // MENÚS EN CASCADA COMPLETO
    if (selectCategoria) {
        selectCategoria.addEventListener('change', () => {
            selectTipo.innerHTML = '<option value="">-- Selecciona Tipo --</option>'; selectMarca.innerHTML = '<option value="">-- Elige Tipo --</option>'; selectModelo.innerHTML = '<option value="">-- Elige Marca --</option>';
            selectMarca.disabled = true; selectModelo.disabled = true; wrapperModeloManual.style.display = "none";
            if (selectCategoria.value) {
                selectTipo.disabled = false;
                tiposArticulos.forEach(t => selectTipo.appendChild(new Option(t, t)));
            } else { selectTipo.disabled = true; }
        });
    }

    if (selectTipo) {
        selectTipo.addEventListener('change', () => {
            selectMarca.innerHTML = '<option value="">-- Selecciona Marca --</option>'; selectModelo.innerHTML = '<option value="">-- Elige Marca --</option>';
            selectModelo.disabled = true; wrapperModeloManual.style.display = "none";
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
            if (!selectMarca.value) { selectModelo.disabled = true; wrapperModeloManual.style.display = "none"; return; }
            if (selectMarca.value === "Otra marca...") {
                wrapperModeloManual.style.display = "block"; inputModeloManual.placeholder = "Escribe la Marca y el Modelo aquí..."; selectModelo.disabled = true;
            } else {
                selectModelo.disabled = false; wrapperModeloManual.style.display = "none";
                selectModelo.innerHTML = '<option value="">-- Elige Opción --</option><option value="Escribir modelo...">✍️ Escribir modelo manualmente...</option>';
            }
        });
    }

    if (selectModelo) {
        selectModelo.addEventListener('change', () => {
            wrapperModeloManual.style.display = (selectModelo.value === "Escribir modelo...") ? "block" : "none";
            if (selectModelo.value === "Escribir modelo...") inputModeloManual.placeholder = "Escribe el modelo exacto aquí...";
        });
    }

    // MANEJO DE PRECIOS DINÁMICOS DEL PLAN SELECCIONADO
    document.getElementsByName('planRadio').forEach(r => {
        r.addEventListener('change', (e) => {
            document.getElementById('montoFinalLabel').innerText = `RD$ ${parseFloat(e.target.getAttribute('data-price')).toLocaleString()}`;
        });
    });

    // GUARDADO FINAL CORRECTO DEL ANUNCIO
    if (flujoForm) {
        flujoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fileComp = document.getElementById('formComprobante').files[0];
            if (!fileComp) { errorStep4.innerText = "Debes adjuntar el comprobante o captura de tu transferencia bancaria."; errorStep4.style.display = 'flex'; return; }
            errorStep4.style.display = 'none';

            let mkF = selectMarca.value;
            let modF = selectModelo.value;
            if (mkF === "Otra marca...") { mkF = "Variada"; modF = inputModeloManual.value.trim(); }
            else if (modF === "Escribir modelo...") { modF = inputModeloManual.value.trim(); }

            const nuevoAnuncio = {
                id: Date.now(),
                titulo: `${mkF} ${modF}`,
                marca: mkF,
                tipo: selectTipo.value,
                precio: parseFloat(document.getElementById('formPrecio').value),
                categoria: selectCategoria.value,
                condicion: document.getElementById('formCondicion').value,
                vendedor: document.getElementById('formVendedor').value,
                provincia: document.getElementById('formProvincia').value,
                whatsapp: document.getElementById('formWhatsapp').value,
                imagenes: [...base64ImagesArray],
                plan: document.querySelector('input[name="planRadio"]:checked').value,
                esEliminable: true
            };

            baseDeDatosActual.unshift(nuevoAnuncio);
            localStorage.setItem('deporterd_database_live', JSON.stringify(baseDeDatosActual));
            
            base64ImagesArray = [];
            actualizarGridImagenes();
            renderizarProductos();
            
            modalPublicar.style.display = 'none';
            modalExitoNativo.style.display = 'flex';
        });
    }

    if (btnCerrarExito) {
        btnCerrarExito.addEventListener('click', () => {
            modalExitoNativo.style.display = 'none'; flujoForm.reset();
            wrapperModeloManual.style.display = "none"; cambiarAUnPaso(1);
        });
    }

    // LOGICA DE DETALLES CON GALERÍA DE IMÁGENES COMPLETA
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
        linkWp.href = `https://wa.me/${prod.whatsapp}?text=${txtMsg}`;

        const imgPrincipal = document.getElementById('det-img-main');
        const miniGrid = document.getElementById('det-mini-grid');
        miniGrid.innerHTML = "";

        const fotos = (prod.imagenes && prod.imagenes.length > 0) ? prod.imagenes : ["https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500"];
        imgPrincipal.src = fotos[0];

        fotos.forEach((f, index) => {
            const imgMini = document.createElement('img'); imgMini.src = f;
            if (index === 0) imgMini.className = "active";
            imgMini.addEventListener('click', () => {
                document.querySelectorAll('.detalle-miniaturas img').forEach(m => m.classList.remove('active'));
                imgMini.className = "active"; imgPrincipal.src = f;
            });
            miniGrid.appendChild(imgMini);
        });

        modalDetalle.style.display = "flex";
    }

    // RENDERIZADO COMPLETO DE TARJETAS EN PORTADA
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
            productsGrid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:40px; color:#64748b;">No hay artículos deportivos disponibles en esta categoría.</p>`; return;
        }

        filtrados.forEach(art => {
            const tarjeta = document.createElement('div');
            tarjeta.className = art.plan === "Premium" ? 'product-card card-premium' : (art.plan === "Destacado" ? 'product-card card-destacado' : 'product-card');
            
            const imgP = (art.imagenes && art.imagenes.length > 0) ? art.imagenes[0] : "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500";
            const btnB = art.esEliminable ? `<button class="btn-eliminar-anuncio" data-id="${art.id}">❌</button>` : '';

            tarjeta.innerHTML = `
                ${btnB}
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
                        <span class="btn-whatsapp" style="background:#22c55e; padding:4px 8px; font-size:11px; border-radius:4px; color:#fff; font-weight:bold;">Ver más</span>
                    </div>
                </div>
            `;
            
            // Clic en la tarjeta abre el panel de detalles
            tarjeta.addEventListener('click', () => verDetallesProducto(art.id));

            // Clic en la equis borra el producto sin abrir el panel de detalles
            const bDel = tarjeta.querySelector('.btn-eliminar-anuncio');
            if (bDel) {
                bDel.addEventListener('click', (e) => {
                    e.stopPropagation();
                    baseDeDatosActual = baseDeDatosActual.filter(x => x.id !== art.id);
                    localStorage.setItem('deporterd_database_live', JSON.stringify(baseDeDatosActual));
                    renderizarProductos();
                });
            }

            productsGrid.appendChild(tarjeta);
        });
    }

    if (tags) {
        tags.forEach(t => {
            t.addEventListener('click', () => {
                document.querySelectorAll('.tag-btn').forEach(x => x.classList.remove('active'));
                t.classList.add('active'); categoriaSeleccionada = t.getAttribute('data-cat'); renderizarProductos();
            });
        });
    }

    if (btnBuscar) btnBuscar.addEventListener('click', renderizarProductos);
    if (searchInput) searchInput.addEventListener('keyup', (e) => { if(e.key === 'Enter') renderizarProductos(); });

    renderizarProductos();
});