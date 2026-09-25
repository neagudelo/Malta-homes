/* ========================================
   MALTA HOMES BY SOFIA
   Conexión con Google Apps Script
======================================== */

const API_URL = "https://script.google.com/macros/s/AKfycbydyLokxKhCnvFoOSlidLns1YadeF9ISICvrms9DjPKkwkyeSFBekpW6WkV7OXwBTLV_A/exec";

/**
 * Envía una renta al backend de Malta Homes.
 */
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

        /*
           Con no-cors el navegador permite enviar
           la información, pero no permite leer
           la respuesta de Apps Script.
        */

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
