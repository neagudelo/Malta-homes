/* ========================================
   MALTA HOMES BY SOFIA
   Dashboard mensual
======================================== */

// Mes inicial del Dashboard:
// Septiembre de 2026
let dashboardDate = new Date(2026, 8, 1);


/* ========================================
   MOSTRAR MES
======================================== */

function actualizarMes() {

    const formatter = new Intl.DateTimeFormat(
        "es-ES",
        {
            month: "long",
            year: "numeric"
        }
    );

    let texto = formatter.format(dashboardDate);

    // Primera letra en mayúscula
    texto =
        texto.charAt(0).toUpperCase() +
        texto.slice(1);

    const monthTitle =
        document.getElementById("monthTitle");

    if (monthTitle) {
        monthTitle.innerText = texto;
    }
}


/* ========================================
   CAMBIAR MES
======================================== */

function cambiarMes(cambio) {

    dashboardDate.setMonth(
        dashboardDate.getMonth() + cambio
    );

    actualizarMes();

    /*
       Más adelante aquí cargaremos
       desde Google Sheets las rentas
       correspondientes al mes seleccionado.
    */
}


/* ========================================
   INICIALIZACIÓN
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        actualizarMes();
    }
);
