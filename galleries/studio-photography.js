(() => {

    'use strict';

    const gallery = document.getElementById('sp-gallery');

    if (!gallery || gallery.dataset.initialized) return;

    gallery.dataset.initialized = 'true';

    /* =========================================
       CONFIGURACIÓN
    ========================================= */

    const IMAGE_PATH = 'assets/portfolio/studio-photography/';

    const MAX_PROJECTS = 80;

    const EXTENSIONS = ['jpg', 'png', 'jpeg', 'webp'];

    const AUTOPLAY_INTERVAL = 1500;
    const HOVER_INTERVAL = 700;
    const HOVER_DELAY = 0;

    const projectDetails = {};

    /* =========================================
       ELEMENTOS
    ========================================= */

    const stage = document.getElementById('sp-stage');
    const track = document.getElementById('sp-track');

    const prev = document.getElementById('sp-prev');
    const next = document.getElementById('sp-next');

    const pagination = document.getElementById('sp-pagination');
    const empty = document.getElementById('sp-empty');

    const modal = document.getElementById('sp-lightbox');

    const modalImage = document.getElementById('sp-lightbox-image');
    const modalTitle = document.getElementById('sp-lightbox-title');
    const modalDescription = document.getElementById('sp-lightbox-description');
    const modalSoftware = document.getElementById('sp-lightbox-software');

    const modalDots = document.getElementById('sp-lightbox-dots');
    const modalPrev = document.getElementById('sp-lightbox-prev');
    const modalNext = document.getElementById('sp-lightbox-next');

    const close = document.getElementById('sp-close');

    const panel = gallery.closest('.pf-panel');

    /* =========================================
       ESTADO DEL CARRUSEL
    ========================================= */

    let projects = [];
    let cards = [];

    let active = 0;
    let selectionToken = 0;

    let loaded = false;
    let ready = false;
    let selecting = false;

    let startX = 0;
    let startY = 0;
    let dragging = false;
    let suppressClick = false;

    let hoverTimer = null;
    let hoverDirection = 0;

    let autoplayTimer = null;
    let mouseInside = false;

    const mounted = new Map();
    const pending = new Map();

    prev.disabled = true;
    next.disabled = true;

    /* =========================================
       UTILIDADES
    ========================================= */

    function wrap(index) {

        return (
            (index % projects.length + projects.length)
            % projects.length
        );

    }

    function nearby(index, radius = 3) {

        return [...new Set(

            Array.from(
                { length: radius * 2 + 1 },
                (_, i) => wrap(index + i - radius)
            )

        )];

    }

    function shuffleProjects(array) {

        for (let i = array.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]];

        }

        return array;

    }

    /* =========================================
       DETECTAR Y CARGAR IMÁGENES
    ========================================= */

    async function loadProject(number) {

        const id = String(number).padStart(2, '0');

        for (const extension of EXTENSIONS) {

            const src =
                `${IMAGE_PATH}proyecto-${id}.${extension}`;

            const project = await new Promise(resolve => {

                const image = new Image();

                image.decoding = 'async';

                image.onload = () => {

                    const details = projectDetails[id] || {};

                    resolve({

                        id,
                        number,
                        src,

                        width: image.naturalWidth,
                        height: image.naturalHeight,

                        title:
                            details.title || `Proyecto ${id}`,

                        category:
                            details.category || 'Fotografía de Estudio',

                        description:
                            details.description || '',

                        software:
                            details.software || []

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
       CARGA PROGRESIVA
    ========================================= */

    function ensure(index) {

        const project = projects[index];

        if (!project || project.missing) {

            return Promise.resolve(null);

        }

        if (project.src) {

            return Promise.resolve(project);

        }

        if (!pending.has(index)) {

            pending.set(

                index,

                loadProject(project.number)

                    .then(result => {

                        if (result) {

                            Object.assign(project, result);

                        } else {

                            project.missing = true;

                        }

                        return result;

                    })

                    .finally(() => {

                        pending.delete(index);

                    })

            );

        }

        return pending.get(index);

    }

    /* =========================================
       CARRUSEL VIRTUALIZADO
       MÁXIMO 7 TARJETAS
    ========================================= */

    function syncCards() {

        const wanted = nearby(active, 3);

        /* Eliminar tarjetas lejanas */

        for (const [index, card] of mounted) {

            if (!wanted.includes(index)) {

                card.remove();

                mounted.delete(index);

            }

        }

        /* Crear únicamente tarjetas cercanas */

        for (const index of wanted) {

            const project = projects[index];

            if (!project.src || mounted.has(index)) {

                continue;

            }

            const card = document.createElement('button');

            card.type = 'button';
            card.className = 'sp-card';
            card.dataset.index = index;

            card.style.opacity = '0';

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

            mounted.set(index, card);

        }

        cards = [...mounted.values()];

    }

    /* =========================================
       PAGINACIÓN DINÁMICA
    ========================================= */

    function renderPagination(container, className) {

        if (!container || !projects.length) return;

        container.replaceChildren();

        const label = document.createElement('span');

        label.className = 'sp-position';

        label.textContent =
            `${active + 1} / ${projects.length}`;

        container.appendChild(label);

        /* Solo cinco indicadores */

        for (const index of nearby(active, 2)) {

            const dot = document.createElement('button');

            dot.type = 'button';
            dot.className = className;

            dot.classList.toggle(
                'is-active',
                index === active
            );

            dot.setAttribute(
                'aria-label',
                `Ver fotografía ${index + 1}`
            );

            dot.setAttribute(
                'aria-current',
                String(index === active)
            );

            dot.addEventListener('click', () => {

                select(index);

            });

            container.appendChild(dot);

        }

    }

    /* =========================================
       POSICIONES 3D ADAPTATIVAS
    ========================================= */

    function update() {

        const total = projects.length;

        const stageWidth = stage.clientWidth;
        const stageHeight = stage.clientHeight;

        if (!total || !stageWidth || !stageHeight) return;

        const mobile = window.innerWidth <= 767;

        const maxWidth = Math.min(
            stageWidth * (mobile ? 0.82 : 0.42),
            760
        );

        const maxHeight = stageHeight * 0.78;

        const visibleDistance = mobile ? 1 : 2;

        /* =====================================
           CALCULAR DIMENSIONES
        ===================================== */

        const layout = cards.map(card => {

            const index = Number(card.dataset.index);

            const project = projects[index];

            const ratio =
                project.width && project.height
                    ? project.width / project.height
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
                    stageWidth * (mobile ? 0.65 : 0.28)
                );

            const height = Math.min(
                maxHeight * scale,
                widthLimit / ratio
            );

            const width = height * ratio;

            const rotation = offset === 0

                ? 0

                : -Math.sign(offset)
                    * Math.min(distance * 18, 36);

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

        const center = layout.find(
            item => item.offset === 0
        );

        if (!center) return;

        [-1, 1].forEach(direction => {

            const side = layout

                .filter(
                    item => Math.sign(item.offset) === direction
                )

                .sort(
                    (a, b) => a.distance - b.distance
                );

            let previous = center;

            side.forEach(item => {

                const overlap = Math.min(

                    previous.visualWidth,
                    item.visualWidth

                ) * 0.25;

                const separation =

                    (previous.visualWidth + item.visualWidth) / 2

                    - overlap;

                item.x =
                    previous.x + direction * separation;

                previous = item;

            });

        });

        /* =====================================
           APLICAR TRANSFORMACIONES
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

            const visible =
                distance <= visibleDistance;

            const inside =

                Math.abs(x) + width / 2

                <= stageWidth / 2 - 30;

            const show =

                visible && (inside || distance === 0);

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

        renderPagination(
            pagination,
            'sp-dot'
        );

        prev.disabled = total < 2;
        next.disabled = total < 2;

    }

    /* =========================================
       SELECCIONAR FOTOGRAFÍA
    ========================================= */

    async function select(index) {

        if (!projects.length || selecting) return;

        selecting = true;

        const token = ++selectionToken;

        const direction = index < active ? -1 : 1;

        let target = wrap(index);

        try {

            /* Buscar una fotografía disponible */

            for (let i = 0; i < projects.length; i++) {

                if (

                    !projects[target].missing

                    && await ensure(target)

                ) {

                    break;

                }

                target = wrap(target + direction);

            }

            if (

                token !== selectionToken

                || !projects[target].src

            ) {

                return;

            }

            active = target;

            syncCards();

            update();

            if (modal.open) {

                updateLightbox();

            }

            /* Precargar fotografías cercanas */

            await Promise.all(

                nearby(active, 3)

                    .filter(i => !projects[i].missing)

                    .map(ensure)

            );

            if (token !== selectionToken) return;

            syncCards();

            update();

        } finally {

            selecting = false;

        }

    }

    /* =========================================
       FLECHAS DE NAVEGACIÓN
    ========================================= */

    prev.addEventListener('click', () => {

        select(active - 1);

    });

    next.addEventListener('click', () => {

        select(active + 1);

    });

    /* =========================================
       NAVEGACIÓN CON TECLADO
    ========================================= */

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

            Math.abs(deltaX) > 45

            && Math.abs(deltaX) > Math.abs(deltaY)

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
       SOFTWARE DISPONIBLE
    ========================================= */

    const softwareNames = {

        // DISEÑO GRÁFICO Y FOTOGRAFÍA

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

    /* =========================================
       LIGHTBOX
    ========================================= */

    function updateLightbox() {

        const project = projects[active];

        if (!project || !project.src) return;

        modalImage.src = project.src;

        modalImage.alt = project.title;

        modalTitle.textContent = project.title;

        modalDescription.textContent =
            project.description || '';

        const category = modal.querySelector(
            '.sp-lightbox-category'
        );

        category.textContent =

            project.category || 'Fotografía de Estudio';

        /* Software utilizado */

        modalSoftware.replaceChildren();

        (project.software || []).forEach(software => {

            const tag = document.createElement('span');

            tag.className = 'sp-software-tag';

            tag.dataset.software = software;

            tag.textContent = software;

            tag.title =
                softwareNames[software] || software;

            modalSoftware.appendChild(tag);

        });

        modal.querySelector('.sp-lightbox-tools').hidden =

            !project.software?.length;

        /* Paginación optimizada */

        renderPagination(

            modalDots,

            'sp-lightbox-dot'

        );

        modalPrev.disabled = projects.length < 2;

        modalNext.disabled = projects.length < 2;

    }

    /* =========================================
       ABRIR LIGHTBOX
    ========================================= */

    function openProject() {

        if (!projects[active]?.src) return;

        stopHoverNavigation();

        updateLightbox();

        if (!modal.open) {

            modal.showModal();

        }

    }

    /* =========================================
       NAVEGACIÓN DEL LIGHTBOX
    ========================================= */

    function navigateLightbox(direction) {

        if (projects.length < 2) return;

        select(active + direction);

    }

    modalPrev.addEventListener('click', () => {

        navigateLightbox(-1);

    });

    modalNext.addEventListener('click', () => {

        navigateLightbox(1);

    });

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

        modal.close();

    });

    modal.addEventListener('click', event => {

        if (event.target === modal) {

            const rect = modal.getBoundingClientRect();

            if (

                event.clientX < rect.left

                || event.clientX > rect.right

                || event.clientY < rect.top

                || event.clientY > rect.bottom

            ) {

                modal.close();

            }

        }

    });

    modal.addEventListener('close', () => {

        window.ScrollSmoother?.get?.()?.paused(false);

    });

    /* =========================================
       HOVER NAVIGATION
    ========================================= */

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

                !hoverDirection

                || dragging

                || modal.open

                || !stage.getClientRects().length

                || document.hidden

            ) {

                stopHoverNavigation();

                return;

            }

            if (!selecting) {

                select(active + hoverDirection);

            }

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

            event.pointerType !== 'mouse'

            || dragging

            || !ready

            || projects.length < 2

            || modal.open

        ) {

            stopHoverNavigation();

            return;

        }

        const activeCard = mounted.get(active);

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
       AUTOPLAY
    ========================================= */

    function stopAutoplay() {

        clearInterval(autoplayTimer);

        autoplayTimer = null;

    }

    function startAutoplay() {

        stopAutoplay();

        if (!ready || !stage.clientWidth) return;

        autoplayTimer = setInterval(() => {

            if (

                projects.length < 2

                || selecting

                || mouseInside

                || document.hidden

                || !stage.getClientRects().length

                || document.querySelector('dialog[open]')

                || window.matchMedia(
                    '(prefers-reduced-motion: reduce)'
                ).matches

            ) {

                return;

            }

            select(active + 1);

        }, AUTOPLAY_INTERVAL);

    }

    /* =========================================
       PAUSAR DURANTE LA INTERACCIÓN
    ========================================= */

    gallery.addEventListener('pointerenter', () => {

        mouseInside = true;

        stopAutoplay();

    });

    gallery.addEventListener('pointerleave', () => {

        mouseInside = false;

        startAutoplay();

    });

    /* =========================================
       RESPONSIVE
    ========================================= */

    window.addEventListener('resize', update);

    /* =========================================
       INICIALIZACIÓN PROGRESIVA
    ========================================= */

    async function init() {

        /* Crear únicamente referencias numéricas */

        projects = Array.from(

            { length: MAX_PROJECTS },

            (_, index) => ({

                number: index + 1

            })

        );

        /* Orden aleatorio */

        shuffleProjects(projects);

        active = 0;

        /* Cargar las primeras fotografías */

        await select(0);

        if (!projects[active]?.src) {

            empty.hidden = false;

            empty.textContent =
                'No hay proyectos disponibles todavía.';

            projects = [];

            return;

        }

        empty.hidden = true;

        ready = true;

        window.lucide?.createIcons();

        window.ScrollTrigger?.refresh?.();

    }

    /* =========================================
       ACTIVAR SOLO CUANDO LA GALERÍA ES VISIBLE
    ========================================= */

    function activate() {

        if (!stage.clientWidth || !stage.clientHeight) {

            stopAutoplay();

            stopHoverNavigation();

            mouseInside = false;

            return;

        }

        if (loaded) {

            update();

            if (ready && !mouseInside && !autoplayTimer) {

                startAutoplay();

            }

            return;

        }

        loaded = true;

        init()

            .then(() => {

                if (ready && !mouseInside && stage.clientWidth) {

                    startAutoplay();

                }

            })

            .catch(error => {

                console.error(

                    'Error al iniciar el carrusel:',

                    error

                );

                empty.hidden = false;

                empty.textContent =
                    'Error al cargar los proyectos.';

            });

    }

    /* =========================================
       OBSERVADORES
    ========================================= */

    new ResizeObserver(activate).observe(stage);

    if (panel) {

        new MutationObserver(activate).observe(panel, {

            attributes: true,

            attributeFilter: [

                'hidden',

                'class',

                'style'

            ]

        });

    }

    activate();

})();