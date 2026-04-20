function handleDynamicNav() {
    const sidebar = document.getElementById('main-sidebar');
    if (!sidebar) return;

    const isMobile = window.innerWidth <= 768;
    const items = Array.from(sidebar.querySelectorAll('.nav-item'));
    const moreItem = sidebar.querySelector('[data-nav="more"]');

    if (isMobile) {
        // En móvil, mostramos todos los elementos importantes y ocultamos 'más'
        // ya que la barra suele ser horizontal o tener scroll.
        items.forEach(item => {
            if (item.getAttribute('data-nav') === 'more') {
                item.style.display = 'none';
            } else {
                item.style.display = 'flex';
            }
        });
        return;
    }

    // Lógica para escritorio (vertical)
    const availableHeight = window.innerHeight - 100;
    const itemHeight = 60; // 40px height + 20px gap

    let currentHeight = 0;
    let itemsToShow = [];
    let itemsToHide = [];

    // Siempre queremos considerar "Inicio" y "Más" como candidatos
    items.forEach(item => {
        const navType = item.getAttribute('data-nav');
        if (navType === 'home' || navType === 'more') {
            itemsToShow.push(item);
            currentHeight += itemHeight;
        }
    });

    items.forEach(item => {
        const navType = item.getAttribute('data-nav');
        if (navType !== 'home' && navType !== 'more') {
            if (currentHeight + itemHeight <= availableHeight) {
                itemsToShow.push(item);
                currentHeight += itemHeight;
            } else {
                itemsToHide.push(item);
            }
        }
    });

    // Aplicar visibilidad
    items.forEach(item => {
        if (itemsToHide.includes(item)) {
            item.style.display = 'none';
        } else {
            item.style.display = 'flex';
        }
    });

    if (itemsToHide.length === 0) {
        if (moreItem) moreItem.style.display = 'none';
    } else {
        if (moreItem) moreItem.style.display = 'flex';
    }
}
