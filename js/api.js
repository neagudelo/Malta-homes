/* ========================================
   MALTA HOMES BY SOFIA
   Conexión con Google Apps Script
======================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbydyLokxKhCnvFoOSlidLns1YadeF9ISICvrms9DjPKkwkyeSFBekpW6WkV7OXwBTLV_A/exec";


/* ========================================
   GUARDAR RENTA
======================================== */

async function guardarRentaAPI(datosRenta) {

    try {

        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(datosRenta)
        });

        return {
            success: true
        };

    } catch (error) {

        console.error(
            "Error enviando la renta:",
            error
        );

        throw error;
    }
}


/* ========================================
   OBTENER RENTAS
======================================== */

async function obtenerRentasAPI() {

    try {

        const response = await fetch(
            API_URL + "?action=rentas"
        );

        if (!response.ok) {
            throw new Error(
                "No se pudo consultar las rentas"
            );
        }

        const resultado = await response.json();

        if (!resultado.success) {
            throw new Error(
                resultado.message ||
                "No se pudieron obtener las rentas"
            );
        }

        return resultado.rentas || [];

    } catch (error) {

        console.error(
            "Error consultando las rentas:",
            error
        );

        throw error;
    }
}