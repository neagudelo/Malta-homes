/* ========================================
   MALTA HOMES BY SOFIA
   Navegación general de la aplicación
======================================== */

function showPage(pageId) {

    // Ocultar todas las páginas
    document
        .querySelectorAll(".page")
        .forEach(page => {
            page.classList.remove("active");
        });

    // Mostrar página seleccionada
    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    // Quitar selección del menú
    document
        .querySelectorAll(".menu-item")
        .forEach(item => {
            item.classList.remove("active");
        });

    // Activar opción correspondiente
    const sidebarItem = document.querySelector(
        '.menu-item[data-page="' + pageId + '"]'
    );

    if (sidebarItem) {
        sidebarItem.classList.add("active");
    }

    // Volver arriba al cambiar de pantalla
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
