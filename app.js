document.addEventListener('DOMContentLoaded', () => {
    // Selectores del modal
    const btnPublicar = document.getElementById('btnPublicar');
    const modalPublicar = document.getElementById('modalPublicar');
    const btnCerrarModal = document.getElementById('btnCerrarModal');
    const flujoForm = document.getElementById('flujoPublicarForm');
    
    // Selectores de los pasos de contenido
    const stepVendedor = document.getElementById('step-vendedor');
    const stepArticulo = document.getElementById('step-articulo');
    const stepMultimedia = document.getElementById('step-multimedia');
    const stepPago = document.getElementById('step-pago');

    // Elementos de la Rejilla Principal
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const btnBuscar = document.getElementById('btnBuscar');
    const tags = document.querySelectorAll('.tag-btn');

    // Base de datos integrada global (Simulación Cloud)
    const mockCloudDatabase = [
        { id: 1, titulo: "Pala de Pádel Babolat Technical Viper 2024", categoria: "Pádel", marca: "Babolat", precio: 14500, condicion: "Usado - Como nueva", vendedor: "Carlos Martínez", provincia: "Santo Domingo", whatsapp: "18095551234", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500", plan: "Regular" },
        { id: 2, titulo: "Bicicleta de Montaña Trek Marlin 7 Talla M", categoria: "Bicicletas", marca: "Trek", precio: 38000, condicion: "Nueva", vendedor: "Luis García", provincia: "Santiago", whatsapp: "18295556789", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500", plan: "Destacado" },
        { id: 3, titulo: "Raqueta de Tenis Wilson Pro Staff 97", categoria: "Tenis", marca: "Wilson", precio: 9500, condicion: "Usado", vendedor: "Ana Rodríguez", provincia: "La Romana", whatsapp: "18495559876", img: "https://images.unsplash.com/photo-1622279457486-62dce4a4de53?w=500", plan: "Premium" }
    ];

    let baseDeDatosActual = JSON.parse(localStorage.getItem('deporterd_database_live')) || mockCloudDatabase;
    let categoriaSeleccionada = "Todos";
    let objetoArticuloListo = null;

    // RENDERIZADOR GENERAL AUTOMÁTICO
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
            
            // Asignación de clases automatizadas por planes
            if (art.plan === "Destacado") tarjeta.className = 'product-card card-destacado';
            else if (art.plan === "Premium") tarjeta.className = 'product-card card-premium';
            else tarjeta.className = 'product-card';

            const textoMsg = encodeURIComponent(`Hola ${art.vendedor}, vi tu anuncio en DeporteRD del artículo "${art.titulo}". ¿Sigue disponible?`);

            tarjeta.innerHTML = `
                <div class="card-img-container">
                    <img src="${art.img}" alt="${art.titulo}">
                    <span class="badge-condicion">${art.condicion}</span>
                    ${art.plan === "Premium" ? '<span class="badge-vip">PREMIUM</span>' : ''}
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

    // CONTROLADOR DE PASOS GLOBAL (Lógica compartida de ventana)
    window.cambiarPaso = function(pasoDestino) {
        // Validación obligatoria antes de saltar al paso 2
        if (pasoDestino === 2) {
            if (!document.getElementById('formVendedor').value || !document.getElementById('formWhatsapp').value || !document.getElementById('formEmail').value) {
                alert("Por favor rellena todos los campos del vendedor.");
                return;
            }
        }
        // Validación obligatoria antes de saltar al paso 3
        if (pasoDestino === 3) {
            if (!document.getElementById('formTitulo').value || !document.getElementById('formMarca').value || !document.getElementById('formPrecio').value) {
                alert("Por favor rellena las especificaciones del artículo.");
                return;
            }
        }

        // Limpieza de estados visuales activos
        document.querySelectorAll('.step-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.step-indicator').forEach(i => i.classList.remove('active'));

        // Activación del paso seleccionado
        if (pasoDestino === 1) { stepVendedor.classList.add('active'); document.getElementById('ind-1').classList.add('active'); }
        if (pasoDestino === 2) { stepArticulo.classList.add('active'); document.getElementById('ind-2').classList.add('active'); }
        if (pasoDestino === 3) { stepMultimedia.classList.add('active'); document.getElementById('ind-3').classList.add('active'); }
        if (pasoDestino === 4) { stepPago.classList.add('active'); document.getElementById('ind-4').classList.add('active'); }
    };

    // MANEJO DE IMÁGENES Y VISTA PREVIA
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

    // PASO 4: CALCULAR FACTURA AUTOMÁTICA
    window.generarFacturaPaso4 = function() {
        if (!inputImg.files[0]) {
            alert("Es obligatorio subir una foto de tu artículo deportivo.");
            return;
        }
        cambiarPaso(4);
    };

    // Monitoreo del radio button de planes para actualizar el precio del label
    const radiosPlan = document.getElementsByName('planRadio');
    radiosPlan.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const precio = parseFloat(e.target.getAttribute('data-price'));
            document.getElementById('montoFinalLabel').innerText = `RD$ ${precio.toLocaleString()}`;
        });
    });

    // FINALIZAR TODO EL PROCESO AUTOMATIZADO
    flujoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const comprobanteInput = document.getElementById('formComprobante');
        if (!comprobanteInput.files[0]) {
            alert("Por favor, adjunta la captura de tu transferencia bancaria para validación.");
            return;
        }

        const planElegido = document.querySelector('input[name="planRadio"]:checked').value;

        // Construcción automática del objeto final
        objetoArticuloListo = {
            id: Date.now(),
            titulo: document.getElementById('formTitulo').value,
            marca: document.getElementById('formMarca').value,
            precio: parseFloat(document.getElementById('formPrecio').value),
            categoria: document.getElementById('formCategoria').value,
            condicion: document.getElementById('formCondicion').value,
            vendedor: document.getElementById('formVendedor').value,
            provincia: document.getElementById('formProvincia').value,
            whatsapp: document.getElementById('formWhatsapp').value,
            img: document.getElementById('imgFormPreview').src, // Base64 de la foto cargada
            plan: planElegido
        };

        // Inserción limpia a la base de datos global simulada
        baseDeDatosActual.unshift(objetoArticuloListo);
        localStorage.setItem('deporterd_database_live', JSON.stringify(baseDeDatosActual));
        
        // Cierre, refresco y feedback instantáneo
        renderizarProductos();
        alert("🎉 ¡Transacción Procesada exitosamente! Tu anuncio ha sido enviado y publicado de manera automatizada.");
        modalPublicar.classList.remove('show');
        flujoForm.reset();
        document.getElementById('previewContainer').style.display = 'none';
        cambiarPaso(1);
    });

    // NAVEGACIÓN Y FILTRADOS EXTERNOS
    btnPublicar.addEventListener('click', () => modalPublicar.classList.add('show'));
    btnCerrarModal.addEventListener('click', () => modalPublicar.classList.remove('show'));

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

    // Ejecución inicial
    renderizarProductos();
});