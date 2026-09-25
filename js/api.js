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

        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(datosRenta)
        });

        const resultado = await response.json();

        if (!resultado.success) {
            throw new Error(
                resultado.message || "No se pudo guardar la renta"
            );
        }

        return resultado;

    } catch (error) {

        console.error("Error guardando la renta:", error);

        throw error;
    }
}
