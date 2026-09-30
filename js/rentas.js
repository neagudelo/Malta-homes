/* ========================================
   MALTA HOMES BY SOFIA
   Gestión y listado de rentas
======================================== */


/* ========================================
   CARGAR RENTAS DESDE GOOGLE SHEETS
======================================== */

async function cargarRentas() {

    const contenedor = document.getElementById("rentalsList");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = `
        <div class="empty-state">
            <div class="icon">⏳</div>
            <strong>Cargando rentas...</strong>
            <p>Consultando Malta Homes - Database.</p>
        </div>
    `;

    try {

        const response = await fetch(
            API_URL + "?action=rentas"
        );

        const resultado = await response.json();

        if (!resultado.success) {
            throw new Error(
                resultado.message ||
                "No se pudieron cargar las rentas."
            );
        }

        const rentas = resultado.rentas || [];

        actualizarResumenRentas(rentas);
        mostrarRentas(rentas);

    } catch (error) {

        console.error(
            "Error cargando rentas:",
            error
        );

        contenedor.innerHTML = `
            <div class="empty-state">
                <div class="icon">❌</div>

                <strong>
                    No se pudieron cargar las rentas
                </strong>

                <p>
                    Revisa la conexión con Google Sheets
                    e inténtalo nuevamente.
                </p>
            </div>
        `;
    }
}


/* ========================================
   MOSTRAR RENTAS
======================================== */

function mostrarRentas(rentas) {

    const contenedor =
        document.getElementById("rentalsList");

    if (!contenedor) {
        return;
    }


    /* ----------------------------------------
       SI NO HAY RENTAS
    ---------------------------------------- */

    if (!rentas.length) {

        contenedor.innerHTML = `
            <div class="empty-state">

                <div class="icon">
                    🏡
                </div>

                <strong>
                    No hay rentas registradas
                </strong>

                <p>
                    Cuando registres una nueva renta
                    aparecerá aquí.
                </p>

            </div>
        `;

        return;
    }


    /* ----------------------------------------
       CREAR TARJETAS
    ---------------------------------------- */

    contenedor.innerHTML =
        rentas.map(renta => {

            const referencia =
                renta.reference ||
                renta.referencia ||
                "Sin referencia";

            const cliente =
                renta.client ||
                renta.nombreCliente ||
                "Sin nombre";

            const propiedad =
                renta.property ||
                renta.propertyAddress ||
                renta.direccion ||
                "Propiedad no especificada";

            const precio =
                numeroSeguro(
                    renta.rentPrice ||
                    renta.precioRenta
                );

            const miComision =
                numeroSeguro(
                    renta.myCommission ||
                    renta.miComision
                );

            const porcentaje =
                numeroSeguro(
                    renta.completionPercentage ||
                    renta.porcentajeCompletado
                );

            const estadoComision =
                renta.commissionStatus ||
                renta.estadoComision ||
                "Pendiente";

            const pagada =
                String(estadoComision)
                    .toLowerCase()
                    .includes("pag");

            const estadoClase =
                pagada
                    ? "badge-green"
                    : "badge-orange";

            const estadoTexto =
                pagada
                    ? "Pagada"
                    : "Pendiente";

            const progresoClase =
                porcentaje >= 100
                    ? "badge-green"
                    : "badge-orange";


            return `

                <div class="rental-row">

                    <div class="rental-main">

                        <strong>
                            ${escaparHTML(cliente)}
                        </strong>

                        <small>
                            Ref:
                            ${escaparHTML(referencia)}
                        </small>

                        <small>
                            🏠
                            ${escaparHTML(propiedad)}
                        </small>

                    </div>


                    <div class="rental-main">

                        <strong>
                            ${formatearDinero(precio)}
                        </strong>

                        <small>
                            Renta mensual
                        </small>

                    </div>


                    <div class="rental-main">

                        <strong>
                            ${formatearDinero(miComision)}
                        </strong>

                        <small>
                            Mi comisión
                        </small>

                    </div>


                    <div>

                        <span class="badge ${progresoClase}">
                            ${porcentaje}% completa
                        </span>

                    </div>


                    <div>

                        <span class="badge ${estadoClase}">
                            ${estadoTexto}
                        </span>

                    </div>

                </div>

            `;

        }).join("");
}


/* ========================================
   RESUMEN SUPERIOR
======================================== */

function actualizarResumenRentas(rentas) {

    const total =
        rentas.length;

    const pagadas =
        rentas.filter(renta => {

            const estado =
                renta.commissionStatus ||
                renta.estadoComision ||
                "";

            return String(estado)
                .toLowerCase()
                .includes("pag");

        }).length;

    const pendientes =
        total - pagadas;


    colocarTexto(
        "rentalsTotal",
        total
    );

    colocarTexto(
        "rentalsPending",
        pendientes
    );

    colocarTexto(
        "rentalsPaid",
        pagadas
    );
}


/* ========================================
   UTILIDADES
======================================== */

function colocarTexto(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}


function numeroSeguro(valor) {

    const numero =
        Number(valor);

    return Number.isFinite(numero)
        ? numero
        : 0;
}


function formatearDinero(valor) {

    return new Intl.NumberFormat(
        "es-ES",
        {
            style: "currency",
            currency: "EUR"
        }
    ).format(
        numeroSeguro(valor)
    );
}


function escaparHTML(valor) {

    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ========================================
   CARGAR AL ABRIR LA PÁGINA
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        cargarRentas();

    }
);