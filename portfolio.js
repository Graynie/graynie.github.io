
(() => {
    'use strict';

    const page = document.querySelector('.pf-page');

    if (!page || page.dataset.initialized) return;

    page.dataset.initialized = 'true';

    const tabs = [...page.querySelectorAll('.pf-tab')];
    const panels = [...page.querySelectorAll('.pf-panel')];

    function select(id, updateUrl = false) {

        const tab = tabs.find(t => t.dataset.category === id);

        if (!tab) return false;

        tabs.forEach(t => {

            const selected = t === tab;

            t.setAttribute('aria-selected', String(selected));

            t.tabIndex = selected ? 0 : -1;

        });

        panels.forEach(p => {
            p.hidden = p.id !== tab.getAttribute('aria-controls');
        });

        page.style.setProperty(
            '--pf-accent',
            tab.style.getPropertyValue('--pf-tab-accent')
        );

        if (updateUrl && location.hash !== '#' + id) {
            history.pushState(null, '', '#' + id);
        }

        return true;
    }

    tabs.forEach((tab, i) => {

        tab.addEventListener('click', () => {
            select(tab.dataset.category, true);
        });

        tab.addEventListener('keydown', e => {

            let next;

            if (e.key === 'ArrowRight') {
                next = (i + 1) % tabs.length;
            } else if (e.key === 'ArrowLeft') {
                next = (i - 1 + tabs.length) % tabs.length;
            } else if (e.key === 'Home') {
                next = 0;
            } else if (e.key === 'End') {
                next = tabs.length - 1;
            } else {
                return;
            }

            e.preventDefault();

            select(tabs[next].dataset.category, true);

            tabs[next].focus({ preventScroll: true });

        });

    });

    document.addEventListener('click', e => {

        const link = e.target.closest('a[href]');

        if (
            !link ||
            e.button !== 0 ||
            e.ctrlKey ||
            e.metaKey ||
            e.shiftKey ||
            e.altKey
        ) return;

        const url = new URL(link.href, location.href);

        if (
            url.origin !== location.origin ||
            url.pathname !== location.pathname
        ) return;

        if (!select(url.hash.slice(1), true)) return;

        e.preventDefault();

        if (link.closest('.tp-offcanvas-2')) {
            document
                .querySelector('.tp-offcanvas-close-btn-2')
                ?.click();
        }

    });

    function sync() {

        if (
            !select(location.hash.slice(1)) &&
            !location.hash
        ) {
            select(tabs[0].dataset.category);
        }

    }

    window.addEventListener('popstate', sync);

    window.addEventListener('hashchange', sync);

    sync();

    window.lucide?.createIcons();
/* EXPLORAR PROYECTOS */

const scrollCue = page.querySelector('.pf-scroll-cue');

const workspace = page.querySelector('#portfolio-projects');

if (scrollCue && workspace) {

    scrollCue.addEventListener('click', (e) => {

        e.preventDefault();

        const reduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        const smoother = window.ScrollSmoother?.get?.();

        if (smoother) {

            smoother.scrollTo(
                workspace,
                !reduced,
                'top 100px'
            );

        } else {

            workspace.scrollIntoView({
                behavior: reduced ? 'instant' : 'smooth',
                block: 'start'
            });

        }

    });

}

/* =========================================
   RETRO CRT — BARRAS DE TERMINAL
========================================= */

(() => {

    function initRetroTerminal() {

        const panels = document.querySelectorAll(
            '.pf-panel'
        );

        const terminalNames = {

            'diseno-grafico': 'DISEÑO_GRÁFICO',

            'ilustraciones': 'ILUSTRACIONES',

            'fotografia-estudio': 'FOTOGRAFÍA',

            'eventos': 'EVENTOS',

            'motion-graphics': 'MOTION_GRAPHICS',

            'edicion-video': 'EDICIÓN_DE_VIDEO',

            'interfaces': 'INTERFACES',

            'diseno-3d': 'DISEÑO_3D'

        };

        panels.forEach(panel => {

            const meta = panel.querySelector(
                '.pf-panel-meta'
            );

            if (!meta) return;

            const category = panel.id.replace(
                'panel-', ''
            );

            const name =
                terminalNames[category] ||
                category.toUpperCase();

            meta.innerHTML = `

                <div class="pf-terminal-command">

                    <span>
                        C:\\PORTAFOLIO\\${name}&gt;
                    </span>

                    <span
                        class="pf-terminal-cursor"
                        aria-hidden="true">
                    </span>

                </div>

                <div
                    class="pf-window-controls"
                    aria-hidden="true">

                    <i data-lucide="minus"></i>

                    <i data-lucide="square"></i>

                    <i data-lucide="x"></i>

                </div>

            `;

        });

        if (window.lucide) {

            lucide.createIcons();

        }

    }

    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            initRetroTerminal
        );

    } else {

        initRetroTerminal();

    }

})();

})();
