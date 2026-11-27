
(() => {

    'use strict';

    const gallery = document.getElementById('ui-gallery');

    if (!gallery || gallery.dataset.initialized) return;

    gallery.dataset.initialized = 'true';

    /* =========================================
       CONFIGURACIÓN - Añadir para imagenes adicionales editar
    ========================================= */

    const IMAGE_PATH = 'assets/portfolio/interfaces/';

    const MAX_PROJECTS = 40;

    const projectDetails = {};

    /* =========================================
       ELEMENTOS
    ========================================= */

    const stage = document.getElementById('ui-stage');
    const track = document.getElementById('ui-track');

    const counter = document.getElementById('ui-counter');
    const title = document.getElementById('ui-title');
    const subtitle = document.getElementById('ui-subtitle');

    const prev = document.getElementById('ui-prev');
    const next = document.getElementById('ui-next');

    const pagination = document.getElementById('ui-pagination');
    const empty = document.getElementById('ui-empty');

    const lightbox = document.getElementById('ui-lightbox');

    const lightboxImage =
        document.getElementById('ui-lightbox-image');

    const lightboxTitle =
        document.getElementById('ui-lightbox-title');

    const lightboxDescription =
        document.getElementById('ui-lightbox-description');

    const close = document.getElementById('ui-close');

    let projects = [];
    let cards = [];
    let dots = [];

    let active = 0;

    let startX = 0;
    let startY = 0;
    let dragging = false;
    let suppressClick = false;

    prev.disabled = true;
    next.disabled = true;

    /* =========================================
       DETECTAR IMÁGENES DISPONIBLES
    ========================================= */

async function loadProject(number) {

    const id = String(number).padStart(2, '0');

    const extensions = ['png', 'jpg', 'jpeg', 'webp'];

    for (const extension of extensions) {

        const src = `${IMAGE_PATH}proyecto-${id}.${extension}`;

        const project = await new Promise(resolve => {

            const image = new Image();

            image.onload = () => {

                const details = projectDetails[id] || {};

                resolve({
                    id,
                    src,

                    width: image.naturalWidth,
                    height: image.naturalHeight,

                    title: details.title || `Proyecto ${id}`,

                    category: details.category || 'Diseño Gráfico',

                    description: details.description || '',

                    software: details.software || []
                });

            };

            image.onerror = () => resolve(null);

            image.src = src;

        });

        if (project) return project;

    }

    return null;

}

    /* =========================================
       CONSTRUIR CARRUSEL
    ========================================= */

    function build() {

        track.replaceChildren();
        pagination.replaceChildren();

        cards = [];
        dots = [];

        projects.forEach((project, index) => {

            const card = document.createElement('button');

            card.type = 'button';
            card.className = 'ui-card';

            card.setAttribute(
                'aria-label',
                project.title
            );

            const image = document.createElement('img');

            image.src = project.src;
            image.alt = project.title;
            image.draggable = false;
            image.decoding = 'async';

            card.appendChild(image);

            card.addEventListener('click', () => {

                if (suppressClick) return;

                if (index === active) {

                    openProject();

                } else {

                    select(index);

                }

            });

            track.appendChild(card);
            cards.push(card);

            /* Indicadores inferiores */

            const dot = document.createElement('button');

            dot.type = 'button';
            dot.className = 'ui-dot';

            dot.setAttribute(
                'aria-label',
                `Ver ${project.title}`
            );

            dot.addEventListener('click', () => {

                select(index);

            });

            pagination.appendChild(dot);
            dots.push(dot);

        });

        update();

    }

    /* =========================================
       POSICIONES 3D
    ========================================= */
    function update() {

        const total = projects.length;

        if (!total || !stage.clientWidth || !stage.clientHeight) return;

        const mobile = window.innerWidth <= 767;

        const maxWidth = Math.min(
            stage.clientWidth * (mobile ? 0.82 : 0.42),
            760
        );

        const maxHeight = stage.clientHeight * 0.78;

        const visibleDistance = mobile ? 1 : 2;

        /* =====================================
           CALCULAR DIMENSIONES
        ===================================== */

        const layout = cards.map((card, index) => {

            const image = card.querySelector('img');

            const ratio =
                projects[index].width && projects[index].height
                    ? projects[index].width / projects[index].height
                    : 0.8;
            let offset = index - active;

            if (offset > total / 2) {
                offset -= total;
            }

            if (offset < -total / 2) {
                offset += total;
            }

            const distance = Math.abs(offset);

            const scale =
                distance === 0 ? 1 :
                    distance === 1 ? 0.85 :
                        distance === 2 ? 0.70 : 0.55;

            const widthLimit = distance === 0
                ? maxWidth
                : Math.min(
                    maxWidth,
                    stage.clientWidth * (mobile ? 0.65 : 0.28)
                );

            const height = Math.min(
                maxHeight * scale,
                widthLimit / ratio
            );

            const width = height * ratio;

            const rotation = offset === 0
                ? 0
                : -Math.sign(offset) * Math.min(distance * 18, 36);

            const visualWidth =
                width * Math.cos(rotation * Math.PI / 180);

            return {
                card,
                index,
                offset,
                distance,
                width,
                height,
                visualWidth,
                rotation,
                x: 0
            };

        });

        /* =====================================
           POSICIONES ADAPTATIVAS
        ===================================== */

        const center = layout.find(item => item.offset === 0);

        if (!center) return;

        [-1, 1].forEach(direction => {

            const side = layout
                .filter(item => Math.sign(item.offset) === direction)
                .sort((a, b) => a.distance - b.distance);

            let previous = center;

            side.forEach(item => {

                const overlap = Math.min(
                    previous.visualWidth,
                    item.visualWidth
                ) * 0.25;

                const separation =
                    (previous.visualWidth + item.visualWidth) / 2
                    - overlap;

                item.x = previous.x + direction * separation;

                previous = item;

            });

        });

        /* =====================================
           APLICAR POSICIONES Y PROFUNDIDAD
        ===================================== */

        layout.forEach(item => {

            const {
                card,
                index,
                distance,
                width,
                height,
                rotation,
                x
            } = item;

            const visible = distance <= visibleDistance;

            const inside =
                Math.abs(x) + width / 2
                <= stage.clientWidth / 2 - 30;

            const show = visible && (inside || distance === 0);

            card.style.width = `${width}px`;
            card.style.height = `${height}px`;

            card.style.transform = `
            translate(-50%, -50%)
            translateX(${x}px)
            rotateY(${rotation}deg)
        `;

            card.style.zIndex = String(
                total + 10 - distance
            );

            card.style.opacity = !show
                ? '0'
                : distance === 0
                    ? '1'
                    : distance === 1
                        ? '0.80'
                        : '0.45';

            card.style.pointerEvents =
                show ? 'auto' : 'none';

            card.tabIndex = show ? 0 : -1;

            card.classList.toggle(
                'is-active',
                index === active
            );

            card.setAttribute(
                'aria-hidden',
                String(!show)
            );

        });

        /* =====================================
           ACTUALIZAR INDICADORES
        ===================================== */

        dots.forEach((dot, index) => {

            dot.classList.toggle(
                'is-active',
                index === active
            );

        });

        prev.disabled = total < 2;
        next.disabled = total < 2;

    }

    /* =========================================
       NAVEGACIÓN
    ========================================= */

    function select(index) {

        if (!projects.length) return;

        active = (
            index + projects.length
        ) % projects.length;

        update();

    }

    prev.addEventListener('click', () => {

        select(active - 1);

    });

    next.addEventListener('click', () => {

        select(active + 1);

    });

    /* Navegación con teclado */

    stage.addEventListener('keydown', event => {

        if (event.key === 'ArrowLeft') {

            event.preventDefault();
            select(active - 1);

        }

        if (event.key === 'ArrowRight') {

            event.preventDefault();
            select(active + 1);

        }

    });

    /* =========================================
       ARRASTRE / SWIPE
    ========================================= */

    stage.addEventListener('pointerdown', event => {

        if (event.button !== 0) return;

        startX = event.clientX;
        startY = event.clientY;

        dragging = true;
        suppressClick = false;

    });

    window.addEventListener('pointerup', event => {

        if (!dragging) return;

        dragging = false;

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        if (
            Math.abs(deltaX) > 45 &&
            Math.abs(deltaX) > Math.abs(deltaY)
        ) {

            suppressClick = true;

            select(
                active + (deltaX < 0 ? 1 : -1)
            );

            setTimeout(() => {

                suppressClick = false;

            }, 100);

        }

    });

    window.addEventListener('pointercancel', () => {

        dragging = false;
        suppressClick = false;

    });

    /* =========================================
       LIGHTBOX
    ========================================= */

    /* =========================================
       LIGHTBOX — PROJECT DETAILS
    ========================================= */

    const modal = document.getElementById('ui-lightbox');

    const modalImage =
        document.getElementById('ui-lightbox-image');

    const modalTitle =
        document.getElementById('ui-lightbox-title');

    const modalDescription =
        document.getElementById('ui-lightbox-description');

    const modalSoftware =
        document.getElementById('ui-lightbox-software');

    const modalDots =
        document.getElementById('ui-lightbox-dots');

    const modalPrev =
        document.getElementById('ui-lightbox-prev');

    const modalNext =
        document.getElementById('ui-lightbox-next');

    const softwareNames = {

        // DISEÑO GRÁFICO E INTERFACES

        Ps: 'Adobe Photoshop',
        Ai: 'Adobe Illustrator',
        Id: 'Adobe InDesign',
        Fg: 'Figma',
        Lr: 'Adobe Lightroom',
        Cv: 'Canva',

        // INTELIGENCIA ARTIFICIAL

        GPT: 'ChatGPT',
        Gm: 'Google Gemini',
        Sd: 'Seedance',
        Mj: 'Midjourney',
        Rw: 'Runway',
        Fl: 'Adobe Firefly',
        Kl: 'Kling AI',
        Veo: 'Google Veo',
        EL: 'ElevenLabs',

        // PRODUCCIÓN AUDIOVISUAL

        Ae: 'Adobe After Effects',
        Pr: 'Adobe Premiere Pro',
        Dv: 'DaVinci Resolve',
        Au: 'Adobe Audition',
        Me: 'Adobe Media Encoder',
        OBS: 'OBS Studio',

        // DISEÑO 3D Y VIDEOJUEGOS

        Bl: 'Blender',
        C4D: 'Cinema 4D',
        UE: 'Unreal Engine',
        Un: 'Unity',
        Sp: 'Substance Painter',
        Sf: 'Sketchfab',

        // PROGRAMACIÓN Y DESARROLLO

        HTML: 'HTML5',
        CSS: 'CSS3',
        JS: 'JavaScript',
        '3JS': 'Three.js',
        GSAP: 'GSAP',
        VS: 'Visual Studio Code',
        GH: 'GitHub',
        Py: 'Python'

    };
    /* ACTUALIZAR CONTENIDO */

    function updateLightbox() {

        const project = projects[active];

        if (!project) return;

        modalImage.src = project.src;
        modalImage.alt = project.title;

        modalTitle.textContent = project.title;

        modalDescription.textContent =
            project.description || '';

        const category = modal.querySelector(
            '.ui-lightbox-category'
        );

        category.textContent =
            project.category || 'Diseño de Interfaces';

        /* PROGRAMAS UTILIZADOS */

        modalSoftware.replaceChildren();

        (project.software || []).forEach(software => {

            const tag = document.createElement('span');

            tag.className = 'ui-software-tag';
            tag.dataset.software = software;

            tag.textContent = software;

            tag.title =
                softwareNames[software] || software;

            modalSoftware.appendChild(tag);

        });

        modal.querySelector('.ui-lightbox-tools').hidden =
            !project.software?.length;

        /* INDICADORES */

        modalDots.replaceChildren();

        projects.forEach((item, index) => {

            const dot = document.createElement('button');

            dot.type = 'button';

            dot.className = 'ui-lightbox-dot';

            dot.classList.toggle(
                'is-active',
                index === active
            );

            dot.setAttribute(
                'aria-label',
                `Ver ${item.title}`
            );

            dot.setAttribute(
                'aria-current',
                index === active ? 'true' : 'false'
            );

            dot.addEventListener('click', () => {
                select(index);
                updateLightbox();
            });

            modalDots.appendChild(dot);

        });

        modalPrev.disabled = projects.length < 2;
        modalNext.disabled = projects.length < 2;

    }

    /* ABRIR PROYECTO */

    function openProject() {

        if (!projects.length) return;

        updateLightbox();

        if (!modal.open) {
            modal.showModal();
        }

    }

    /* NAVEGACIÓN INTERNA */

    function navigateLightbox(direction) {

        const total = projects.length;

        if (total < 2) return;

        const index =
            (active + direction + total) % total;

        select(index);

        updateLightbox();

    }

    modalPrev.addEventListener('click', () => {
        navigateLightbox(-1);
    });

    modalNext.addEventListener('click', () => {
        navigateLightbox(1);
    });

    /* NAVEGACIÓN CON TECLADO */

    modal.addEventListener('keydown', event => {

        if (event.key === 'ArrowLeft') {

            event.preventDefault();
            event.stopPropagation();

            navigateLightbox(-1);

        }

        if (event.key === 'ArrowRight') {

            event.preventDefault();
            event.stopPropagation();

            navigateLightbox(1);

        }

    });

    close.addEventListener('click', () => {

        lightbox.close();

    });

    lightbox.addEventListener('click', event => {

        if (event.target === lightbox) {

            const rect = lightbox.getBoundingClientRect();

            if (
                event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom
            ) {

                lightbox.close();

            }

        }

    });

    lightbox.addEventListener('close', () => {

        window.ScrollSmoother?.get?.()?.paused(false);

    });

    /* =========================================
       RESPONSIVE
    ========================================= */

    window.addEventListener('resize', update);
    /* =========================================
       RANDOM PROJECT ORDER
    ========================================= */

    function shuffleProjects(array) {

        for (let i = array.length - 1; i > 0; i--) {

            const j = Math.floor(
                Math.random() * (i + 1)
            );

            [array[i], array[j]] =
                [array[j], array[i]];

        }

        return array;
    }
    /* =========================================
       INICIALIZACIÓN
    ========================================= */

    async function init() {

        const available = await Promise.all(

            Array.from(
                { length: MAX_PROJECTS },
                (_, index) => loadProject(index + 1)
            )

        );

        projects = available.filter(Boolean);

        if (!projects.length) {

            empty.textContent =
                'No hay proyectos disponibles todavía.';

            return;

        }

        empty.hidden = true;

        /* MEZCLAR PROYECTOS */

        shuffleProjects(projects);

        active = 0;

        /* CONSTRUIR CARRUSEL */

        build();

        window.lucide?.createIcons();

        window.ScrollTrigger?.refresh?.();

    }
    /* HOVER NAVIGATION */

    /* =========================================
   HOVER NAVIGATION
========================================= */

    let hoverTimer = null;
    let hoverDirection = 0;

    const HOVER_DELAY = 0;
    const HOVER_INTERVAL = 500;

    function stopHoverNavigation() {

        clearTimeout(hoverTimer);

        hoverTimer = null;
        hoverDirection = 0;

    }

    function startHoverNavigation(direction) {

        if (hoverDirection === direction) return;

        stopHoverNavigation();

        hoverDirection = direction;

        function advance() {

            if (
                !hoverDirection ||
                dragging ||
                lightbox?.open ||
                !stage.getClientRects().length ||
                document.hidden
            ) {
                stopHoverNavigation();
                return;
            }

            select(active + hoverDirection);

            hoverTimer = setTimeout(
                advance,
                HOVER_INTERVAL
            );

        }

        hoverTimer = setTimeout(
            advance,
            HOVER_DELAY
        );

    }

    stage.addEventListener('pointermove', event => {

        if (
            event.pointerType !== 'mouse' ||
            dragging ||
            projects.length < 2 ||
            lightbox?.open
        ) {
            stopHoverNavigation();
            return;
        }

        const activeCard = cards[active];

        if (!activeCard) return;

        const rect = activeCard.getBoundingClientRect();

        const margin = 25;

        if (event.clientX < rect.left - margin) {

            startHoverNavigation(-1);

        } else if (event.clientX > rect.right + margin) {

            startHoverNavigation(1);

        } else {

            stopHoverNavigation();

        }

    });

    stage.addEventListener(
        'pointerleave',
        stopHoverNavigation
    );

    stage.addEventListener(
        'pointerdown',
        stopHoverNavigation
    );

    window.addEventListener(
        'blur',
        stopHoverNavigation
    );

    document.addEventListener(
        'visibilitychange',
        stopHoverNavigation
    );
    /* =========================================
       AUTOPLAY — CARRUSEL AUTOMÁTICO
    ========================================= */

    const AUTOPLAY_INTERVAL = 1500;

    let autoplayTimer = null;
    let mouseInside = false;

    function stopAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }

    function startAutoplay() {

        stopAutoplay();

        autoplayTimer = setInterval(() => {

            if (
                projects.length < 2 ||
                mouseInside ||
                document.hidden ||
                !stage.getClientRects().length ||
                document.querySelector('dialog[open]') ||
                window.matchMedia(
                    '(prefers-reduced-motion: reduce)'
                ).matches
            ) {
                return;
            }

            select((active + 1) % projects.length);

        }, AUTOPLAY_INTERVAL);
    }

    /* PAUSAR CUANDO EL USUARIO INTERACTÚA */

    gallery.addEventListener('pointerenter', () => {
        mouseInside = true;
        stopAutoplay();
    });

    gallery.addEventListener('pointerleave', () => {
        mouseInside = false;
        startAutoplay();
    });

    /* INICIAR MOVIMIENTO AUTOMÁTICO */

    let loaded = false;
    const panel = gallery.closest(".pf-panel");
    function activate() {
        if (!stage.clientWidth || !stage.clientHeight) {
            stopAutoplay();
            stopHoverNavigation();
            return;
        }
        if (loaded) { update(); if (!mouseInside && !autoplayTimer) startAutoplay(); return; }
        loaded = true;
        startAutoplay();
        init().catch(error => {
        console.error('Error al iniciar el carrusel:', error);

        if (empty) {
            empty.hidden = false;
            empty.textContent = 'Error al cargar los proyectos.';
        }
        });
    }
    new ResizeObserver(activate).observe(stage);
    if (panel) new MutationObserver(activate).observe(panel, { attributes: true, attributeFilter: ["hidden", "class", "style"] });
    activate();

})();
