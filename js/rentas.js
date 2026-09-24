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

function guardarRenta() {

    actualizarProgreso();
    calcularComision();


    const referenceElement =
        document.getElementById(
            "reference"
        );

    const clientElement =
        document.getElementById(
            "client"
        );


    const reference =
        referenceElement
            ? referenceElement.value.trim()
            : "";

    const client =
        clientElement
            ? clientElement.value.trim()
            : "";


    /*
       Permitimos guardar rentas incompletas.

       Solo necesitamos al menos referencia
       o nombre del cliente para poder
       identificar el registro.
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
       TEMPORAL:

       En la siguiente etapa reemplazaremos
       este mensaje por el envío real de los
       datos a Google Sheets y los documentos
       a Google Drive.
    */

    alert(
        "La interfaz está funcionando correctamente.\n\n" +
        "En la siguiente etapa conectaremos este botón " +
        "con Google Sheets y Google Drive para guardar " +
        "la información y los documentos."
    );
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
