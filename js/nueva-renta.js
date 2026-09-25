/* ========================================
   MALTA HOMES BY SOFIA
   Nueva renta
======================================== */


/* ========================================
   REQUISITOS OBLIGATORIOS
======================================== */

const requisitos = [

    ["Referencia", "reference"],
    ["Nombre del cliente", "client"],
    ["Origen del cliente", "source"],
    ["Fecha de depósito", "depositDate"],
    ["Fecha de contrato", "contractDate"],
    ["Precio de renta", "rentPrice"],
    ["Comisión inquilino", "tenantCommission"],
    ["Comisión propietario", "landlordCommission"],
    ["Número de contacto", "phone"],
    ["Correo electrónico", "email"],
    ["Recibo de depósito", "depositReceipt"],
    ["Contrato", "contract"],
    ["Pasaporte", "passport"],
    ["Inventario", "inventory"]

];


/* ========================================
   COMPROBAR CAMPO
======================================== */

function campoCompleto(id) {

    const element = document.getElementById(id);

    if (!element) {
        return false;
    }

    // Documentos
    if (element.type === "file") {
        return element.files.length > 0;
    }

    // Campos normales
    return element.value.trim() !== "";
}


/* ========================================
   PROGRESO DE LA RENTA
======================================== */

function actualizarProgreso() {

    let completos = 0;

    const lista =
        document.getElementById("checklist");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    requisitos.forEach(([nombre, id]) => {

        const completo = campoCompleto(id);

        if (completo) {
            completos++;
        }

        const li =
            document.createElement("li");

        li.className =
            completo
                ? "done"
                : "pending";

        li.innerHTML =
            (completo ? "✓ " : "○ ") +
            nombre;

        lista.appendChild(li);
    });


    const porcentaje = Math.round(
        (completos / requisitos.length) * 100
    );


    const percentage =
        document.getElementById("percentage");

    const progressBar =
        document.getElementById("progressBar");

    const statusText =
        document.getElementById("statusText");


    if (percentage) {
        percentage.innerText =
            porcentaje + "%";
    }

    if (progressBar) {
        progressBar.style.width =
            porcentaje + "%";
    }


    /* ------------------------------------
       RENTA COMPLETA
    ------------------------------------ */

    if (porcentaje === 100) {

        if (percentage) {
            percentage.style.color =
                "var(--green)";
        }

        if (progressBar) {
            progressBar.style.background =
                "var(--green)";
        }

        if (statusText) {

            statusText.innerText =
                "✓ Renta completa";

            statusText.style.color =
                "var(--green)";
        }

    }

    /* ------------------------------------
       RENTA INCOMPLETA
    ------------------------------------ */

    else {

        if (percentage) {
            percentage.style.color =
                "var(--orange)";
        }

        if (progressBar) {
            progressBar.style.background =
                "var(--orange)";
        }

        if (statusText) {

            statusText.innerText =
                "Información pendiente";

            statusText.style.color =
                "var(--navy)";
        }
    }
}


/* ========================================
   CALCULAR COMISIÓN
======================================== */

function calcularComision() {

    const tenantInput =
        document.getElementById(
            "tenantCommission"
        );

    const landlordInput =
        document.getElementById(
            "landlordCommission"
        );

    const tenant =
        parseFloat(
            tenantInput
                ? tenantInput.value
                : 0
        ) || 0;

    const landlord =
        parseFloat(
            landlordInput
                ? landlordInput.value
                : 0
        ) || 0;


    /* Comisión total antes de VAT */

    const total =
        tenant + landlord;


    /* Comisión de Sofia = 35% */

    const commission =
        total * 0.35;


    const myCommission =
        document.getElementById(
            "myCommission"
        );

    if (myCommission) {

        myCommission.innerText =
            formatearEuro(commission);
    }


    const commissionText =
        document.getElementById(
            "commissionText"
        );

    if (commissionText) {

        commissionText.innerText =
            formatearEuroSimple(tenant)
            + " VAT + "
            + formatearEuroSimple(landlord);
    }
}


/* ========================================
   FORMATO EURO
======================================== */

function formatearEuro(numero) {

    return new Intl.NumberFormat(
        "es-ES",
        {
            style: "currency",
            currency: "EUR"
        }
    ).format(numero);
}


function formatearEuroSimple(numero) {

    return "€" +
        new Intl.NumberFormat(
            "es-ES",
            {
                maximumFractionDigits: 2
            }
        ).format(numero);
}


/* ========================================
   GUARDAR RENTA
======================================== */

async function guardarRenta() {

    actualizarProgreso();
    calcularComision();

    const obtenerValor = (id) => {
        const elemento = document.getElementById(id);
        return elemento ? elemento.value.trim() : "";
    };

    const reference = obtenerValor("reference");
    const client = obtenerValor("client");

    /*
       Permitimos guardar rentas incompletas,
       pero necesitamos poder identificarlas.
    */

    if (!reference && !client) {

        alert(
            "Puedes guardar información parcial, " +
            "pero escribe al menos la referencia " +
            "o el nombre del cliente para identificar la renta."
        );

        return;
    }

    /*
       Calcular porcentaje de información completada
    */

    let completados = 0;

    requisitos.forEach(([nombre, id]) => {
        if (campoCompleto(id)) {
            completados++;
        }
    });

    const porcentaje = Math.round(
        (completados / requisitos.length) * 100
    );

    const estadoInformacion =
        porcentaje === 100
            ? "Completa"
            : "Pendiente";


    /*
       Preparar información para Google Sheets
    */

    const datosRenta = {

        reference: reference,
        client: client,
        source: obtenerValor("source"),

        depositDate: obtenerValor("depositDate"),
        contractDate: obtenerValor("contractDate"),
        contractEndDate: obtenerValor("contractEndDate"),

        property: obtenerValor("property"),

        rentPrice: obtenerValor("rentPrice"),

        tenantCommission:
            obtenerValor("tenantCommission"),

        landlordCommission:
            obtenerValor("landlordCommission"),

        phone: obtenerValor("phone"),
        email: obtenerValor("email"),

        landlord: obtenerValor("landlord"),
        landlordContact:
            obtenerValor("landlordContact"),

        observations:
            obtenerValor("observations"),

        completionPercentage: porcentaje,
        informationStatus: estadoInformacion
    };


    try {

        const resultado =
            await guardarRentaAPI(datosRenta);

        alert(
            "✅ Renta guardada correctamente.\n\n" +
            "Cliente: " + (client || "Sin nombre") +
            "\nReferencia: " + (reference || "Sin referencia") +
            "\nCompletado: " + porcentaje + "%"
        );

        console.log(
            "Renta guardada:",
            resultado
        );

    } catch (error) {

        alert(
            "❌ No se pudo guardar la renta.\n\n" +
            "Revisa la conexión e inténtalo nuevamente."
        );

        console.error(error);
    }
}


/* ========================================
   INICIALIZACIÓN
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        actualizarProgreso();
        calcularComision();

    }
);
