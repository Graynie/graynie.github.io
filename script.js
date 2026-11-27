// La pantalla y los extremos mantienen sus dimensiones originales.
// En pantallas anchas solo se extiende la carcasa de relleno.
const stage = document.getElementById('consoleStage');
const viewport = document.querySelector('.console-viewport');
const outer = document.querySelector('.console-outer');

function resizeConsole() {
  const available = outer.clientWidth;
  // Hasta 1931px se escala la consola completa para que quepa.
  // En monitores más anchos, solo crecen las franjas intermedias.
  const scale = Math.min(1, available / 1931);
  const stageWidth = Math.max(1931, available);
  stage.style.setProperty('--stage-width', `${stageWidth}px`);
  stage.style.setProperty('--scale', scale);

  // Recortar únicamente la parte inferior. El viewport no debe
  // escalar otra vez ni dejar un espacio vacío debajo del footer.
  const visible = Number.parseFloat(getComputedStyle(document.documentElement)
    .getPropertyValue('--console-visible-height')) || 520;
  viewport.style.height = `${visible * scale}px`;
}
window.addEventListener('resize', resizeConsole, { passive: true });
resizeConsole();

const imageFolder = 'assets/img/';

// ================================================================
// ENLACES DE LAS TECLAS — EDITA SOLO ESTE BLOQUE
// Para enlaces externos, pega la URL completa (https://...).
// Los enlaces externos se abren en una pestaña nueva.
// El CV puede ser un PDF local, por ejemplo: 'assets/CV.pdf'.
// Si dejas una dirección vacía, la tecla muestra un aviso en pantalla.
// ================================================================
const KEY_LINKS = {
  home: 'index.html',
  linkedin: 'https://www.linkedin.com/in/graynielle/',        
  cv: 'assets/img/cv/CV_DanielleRodriguez_2026-02W.pdf',         
  mail: 'mailto:danielle.mercy.rod@gmail.com',            
  up: 'scroll-top',    // Acción especial: subir al inicio de ESTA página
  sketchfab: 'https://sketchfab.com/graynie',       // Ejemplo: 'https://sketchfab.com/tu-usuario'
  github: 'https://github.com/Graynie',          // Ejemplo: 'https://github.com/tu-usuario'
  instagram: 'https://www.instagram.com/graynielle/',       // Ejemplo: 'https://www.instagram.com/tu-usuario/'
  figma: 'https://www.figma.com/@graynielle'            // Ejemplo: 'https://www.figma.com/@tu-usuario'
};

const keys = [
  { id: 'home', label: 'Home', file: 'Consola_0000s_0005_Home.png', x: 165, y: 304, w: 112, h: 114, msg: 'WELCOME HOME', desc: 'OPENING INDEX' },
  { id: 'linkedin', label: 'LinkedIn', file: 'Consola_0000s_0006_Linkedin.png', x: 280, y: 303, w: 107, h: 112, msg: 'LINKEDIN', desc: 'LET’S CONNECT' },
  { id: 'cv', label: 'CV', file: 'Consola_0000s_0007_CV.png', x: 393, y: 303, w: 109, h: 111, msg: 'CURRICULUM', desc: 'VIEW MY RESUME' },
  { id: 'mail', label: 'Correo', file: 'Consola_0000s_0008_Correo.png', x: 507, y: 303, w: 111, h: 111, msg: 'SAY HELLO!', desc: 'SEND AN EMAIL' },
  { id: 'up', label: 'Subir', file: 'Consola_0000s_0004_Up.png', x: 143, y: 391, w: 108, h: 106, msg: 'BACK TO TOP', desc: 'SCROLLING UP' },
  { id: 'sketchfab', label: 'Sketchfab', file: 'Consola_0000s_0003_Sketchfab.png', x: 240, y: 391, w: 107, h: 106, msg: 'SKETCHFAB', desc: '3D WORLDS' },
  { id: 'github', label: 'GitHub', file: 'Consola_0000s_0002_Github.png', x: 341, y: 391, w: 107, h: 106, msg: 'GITHUB', desc: 'CODE & EXPERIMENTS' },
  { id: 'instagram', label: 'Instagram', file: 'Consola_0000s_0001_Instagram.png', x: 440, y: 391, w: 107, h: 106, msg: 'INSTAGRAM', desc: 'VISUAL STORIES' },
  { id: 'figma', label: 'Figma', file: 'Consola_0000s_0000_Figma.png', x: 540, y: 391, w: 107, h: 106, msg: 'FIGMA', desc: 'DESIGN PROCESS' }
];

// Abre la dirección configurada sin inventar enlaces.
function activateKey(id) {
  const destination = (KEY_LINKS[id] || '').trim();
  if (id === 'up' || destination === 'scroll-top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (!destination) {
    status.textContent = 'ADD LINK IN KEY_LINKS ▌';
    return;
  }
  if (/^https?:\/\//i.test(destination)) {
    window.open(destination, '_blank', 'noopener,noreferrer');
  } else if (/^mailto:/i.test(destination)) {
    window.location.href = destination;
  } else if (/^(?:javascript|data):/i.test(destination)) {
    status.textContent = 'INVALID LINK ▌';
  } else {
    // index.html y rutas locales se abren en esta misma pestaña.
    window.location.href = destination;
  }
}

const title = document.getElementById('screenTitle');
const description = document.getElementById('screenText');
const status = document.getElementById('screenStatus');
const messages = [
    ['NO PRESIONES EL BOTÓN', 'O sí... tú decides'],
    ['ERROR INESPERADO', 'Demasiadas ideas abiertas'],
    ['RENDERIZANDO...', 'Tiempo restante: una eternidad'],
    ['GAME ON!', 'WELCOME TO GRAYNIE_OS'],

    ['HUMANO DETECTADO', [
        ' /\\_/\\ ',
        '( o.o )',
        ' > ^ < '
    ].join('\n')],

    ['INVASIÓN DE PÍXELES', [
        '  ▄▀   ▀▄  ',
        ' ▄█▀███▀█▄ ',
        '█▄███████▄█',
        '█ ▀▀▀▀▀▀▀ █',
        '  ▀     ▀  '
    ].join('\n')],

    ['RECARGANDO ENERGÍA', [
        '  ( (    ',
        '   ) )   ',
        ' ┌─────┐ ',
        ' │     ├┐',
        ' └─────┴┘'
    ].join('\n')],

    ['HECHO CON CURIOSIDAD', [
        ' ██ ██ ',
        '███████',
        ' █████ ',
        '  ███  ',
        '   █   '
    ].join('\n')],

    ['DESPEGANDO...', [
        '   /\\   ',
        '  /  \\  ',
        ' | () | ',
        '/|____|\\',
        '  /\\/\\  '
    ].join('\n')],

    ['ROBOT.EXE', [
        ' ┌─────┐ ',
        ' │ o o │ ',
        ' │  -  │ ',
        ' └─────┘ ',
        ' /|___|\\ '
    ].join('\n')],

    ['FANTASMA DETECTADO', [
        '  ▄▄▄  ',
        ' █████ ',
        '██ █ ██',
        '███████',
        '█▀█▀█▀█'
    ].join('\n')],

    ['PATO DE DEPURACIÓN', [
        '  __     ',
        '<(o )___ ',
        ' ( ._> / ',
        "  `---'  "
    ].join('\n')],

    ['ESTRELLA OBTENIDA', [
        '    █    ',
        '  █████  ',
        '█████████',
        '  █████  ',
        '  ██ ██  '
    ].join('\n')],

    ['CARGANDO IDEAS...', '[████████░░] 80%'],
    ['¡LOGRO DESBLOQUEADO!', '★ CURIOSIDAD +100 XP ★'],
    ['MODO SECRETO', '(⌐■_■)'],
    ['ERROR 404', 'Límites creativos no encontrados'],
    ['¿OTRA VEZ?', 'Me agrada tu curiosidad'],
    ['TODO BAJO CONTROL', '¯\\_(ツ)_/¯'],
    ['MISIÓN CUMPLIDA', 'Gracias por explorar mi portafolio']
];
let messageIndex = 0;

function showScreen(heading, detail) {
    title.textContent = heading;
    description.textContent = detail;

    const isArt = detail.includes('\n');

    description.classList.toggle('ascii-art', isArt);
    title.classList.toggle('ascii-title', isArt);
}
function nextMessage(step) {
  messageIndex = (messageIndex + step + messages.length) % messages.length;
  showScreen(...messages[messageIndex]);
}

const keyContainer = document.getElementById('keys');
keys.forEach(key => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'key';
  button.setAttribute('aria-label', key.label);
  button.title = key.label;
  Object.assign(button.style, {
    left: `${key.x}px`, top: `${key.y - 9}px`, width: `${key.w}px`, height: `${key.h}px`
  });
  const image = document.createElement('img');
  image.src = imageFolder + key.file;
  image.alt = '';
  image.draggable = false;
  button.append(image);

  button.addEventListener('mouseenter', () => showScreen(key.msg, key.desc));
  button.addEventListener('focus', () => showScreen(key.msg, key.desc));
  button.addEventListener('click', () => {
    showScreen(key.msg, key.desc);
    button.classList.add('is-pressed');
    setTimeout(() => button.classList.remove('is-pressed'), 180);
    activateKey(key.id);
  });
});

document.getElementById('redControl').addEventListener('click', () => nextMessage(1));
// v11: dos interruptores independientes.
// Morado -> LED verde izquierdo; amarillo -> LED amarillo derecho.
const purpleControl = document.getElementById('purpleControl');
const yellowControl = document.getElementById('yellowControl');
const greenLed = document.getElementById('greenLed');
const yellowLed = document.getElementById('yellowLed');

// Ambas luces comienzan apagadas. Puedes cambiarlo en el HTML
// añadiendo class="is-on" al LED y class="is-latched" al botón.

// MENSAJES DEL VISOR PEQUEÑO
// Puedes editar, agregar o quitar estos textos libremente.
const miniMessages = [
  'HECHO CON CURIOSIDAD',
  'EN CONSTANTE EVOLUCIÓN',
  'NUNCA DEJES DE CREAR',
  'MODO CREATIVO',
  '¿COLABORAMOS?',
  'CARGANDO IDEAS',
  'EXPLORANDO POSIBILIDADES',
  '¡HOLA MUNDO!',
  '¡GRACIAS POR VISITAR!',
  'NO SOY UN ROBOT, NI IA'
];
const miniDisplayText = document.getElementById('miniDisplayText');
let miniMessageIndex = 0;

function rotateMiniDisplay() {
  miniDisplayText.classList.add('is-changing');
  window.setTimeout(() => {
    miniMessageIndex = (miniMessageIndex + 1) % miniMessages.length;
    miniDisplayText.textContent = miniMessages[miniMessageIndex];
    miniDisplayText.classList.remove('is-changing');
  }, 180);
}

// Cambia el número 3500 para ajustar el intervalo (en milisegundos).
window.setInterval(rotateMiniDisplay, 3500);

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, TweenMax, ScrollToPlugin);

gsap.config({
  nullTargetWarn: false,
});

let smoother = ScrollSmoother.create({
  smooth: 2,
  effects: true,
  smoothTouch: 0.1,
  normalizeScroll: false,
  ignoreMobileResize: true,
});
/* ==========================================
  BOTÓN CV — EXPANSIÓN DIRECCIONAL
========================================== */

document.querySelectorAll('.tp-hero-btn .tp-hover-btn').forEach(button => {
  const dot = button.querySelector('.tp-btn-circle-dot');
  if (!dot || typeof gsap === 'undefined') return;

  function getPosition(event) {
    const rect = button.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function setOrigin(event) {
    const { x, y } = getPosition(event);

    gsap.set(dot, {
      left: x,
      top: y,
      xPercent: -50,
      yPercent: -50
    });
  }

  button.addEventListener('pointerenter', event => {
    gsap.killTweensOf(dot);
    setOrigin(event);

    gsap.fromTo(dot,
      { scale: 0 },
      {
        scale: 1,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: true
      }
    );
  });

  button.addEventListener('pointerleave', event => {
    gsap.killTweensOf(dot);
    setOrigin(event);

    gsap.to(dot, {
      scale: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      overwrite: true
    });
  });
});
/* ==========================================
   CARRUSEL DE APLICACIONES Y PROGRAMAS
========================================== */

document.addEventListener('DOMContentLoaded', function () {

  const slider = document.querySelector(
    '.tp-brand-slider-active'
  );

  if (!slider || typeof Swiper === 'undefined') {
    console.warn('Swiper no está disponible');
    return;
  }

  if (slider.swiper) return;

  new Swiper(slider, {
    direction: 'horizontal',
    slidesPerView: 5,
    spaceBetween: 64,
    loop: true,
    speed: 1600,

    autoplay: {
      delay: 100,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    breakpoints: {
      0: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      576: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 50,
      },
      1400: {
        slidesPerView: 5,
        spaceBetween: 64,
      },
    },
  });
});
/* ==========================================================
   SOFTWARE PROFILE — CATÁLOGO DE APLICACIONES Editar Luego
========================================================== */
/* ==========================================================
   SOFTWARE PROFILE — SKILL ICONS
========================================================== */

const SKILL_ICONS = {

  // FOTOGRAFÍA
  'Revelado RAW': 'sliders-horizontal',
  'Corrección de color': 'palette',
  'Edición fotográfica': 'image',
  'Retoque fotográfico': 'brush',

  // AUDIOVISUAL
  'Montaje audiovisual': 'clapperboard',
  'Postproducción': 'film',
  'Motion graphics': 'sparkles',
  'Composición digital': 'layers',
  'Plantillas MOGRT': 'layout-template',
  'Animación 2D': 'move',

  // DISEÑO GRÁFICO
  'Diseño gráfico': 'pen-tool',
  'Diagramación': 'layout-grid',
  'Diseño editorial': 'book-open',
  'Publicaciones digitales': 'file-text',

  // PRODUCCIÓN 3D
  'Modelado 3D': 'box',
  'Materiales': 'layers',
  'Producción 3D': 'boxes',
  'Escultura digital': 'brush',
  'Modelado orgánico': 'shapes',
  'Detalle tridimensional': 'scan',

  // ILUSTRACIÓN
  'Ilustración digital': 'pen-tool',
  'Diseño de personajes': 'user-round',
  'Pintura digital': 'paintbrush',

  // INTELIGENCIA ARTIFICIAL
  'Optimización de procesos': 'workflow',
  'Programación asistida': 'code-xml',
  'Exploración creativa': 'lightbulb'

};
const SOFTWARE_APPS = {

  photoshop: {
    name: 'Adobe Photoshop',
    category: 'DISEÑO Y FOTOGRAFÍA',

    description:
      'Edición fotográfica, composición digital y creación de recursos gráficos para proyectos creativos e institucionales.',

    skills: [
      'Retoque fotográfico',
      'Composición digital',
      'Diseño gráfico'
    ]
  },

  premiere: {
    name: 'Adobe Premiere Pro',
    category: 'PRODUCCIÓN AUDIOVISUAL',

    description:
      'Edición y postproducción de contenidos audiovisuales, educativos, institucionales y creativos.',

    skills: [
      'Montaje audiovisual',
      'Corrección de color',
      'Postproducción'
    ]
  },

  aftereffects: {
    name: 'Adobe After Effects',
    category: 'ANIMACIÓN Y POSTPRODUCCIÓN',

    description:
      'Creación de gráficos animados, composiciones digitales y recursos adaptativos para optimizar procesos de postproducción audiovisual.',

    skills: [
      'Motion graphics',
      'Composición digital',
      'Plantillas MOGRT',
      'Animación 2D'
    ]
  },

  lightroom: {
    name: 'Adobe Lightroom',
    category: 'FOTOGRAFÍA DIGITAL',

    description:
      'Revelado digital, tratamiento de color y organización de proyectos fotográficos.',

    skills: [
      'Revelado RAW',
      'Corrección de color',
      'Edición fotográfica'
    ]
  },

  indesign: {
    name: 'Adobe InDesign',
    category: 'DISEÑO EDITORIAL',

    description:
      'Diseño y diagramación de publicaciones, documentos y recursos gráficos editoriales.',

    skills: [
      'Diagramación',
      'Diseño editorial',
      'Publicaciones digitales'
    ]
  },

  maya: {
    name: 'Autodesk Maya',
    category: 'PRODUCCIÓN 3D',

    description:
      'Desarrollo de recursos tridimensionales para proyectos de producción digital.',

    skills: [
      'Modelado 3D',
      'Materiales',
      'Producción 3D'
    ]
  },

  zbrush: {
    name: 'ZBrush',
    category: 'ESCULTURA DIGITAL',

    description:
      'Creación y desarrollo de modelos tridimensionales mediante técnicas de escultura digital.',

    skills: [
      'Escultura digital',
      'Modelado orgánico',
      'Detalle tridimensional'
    ]
  },

  clipstudio: {
    name: 'Clip Studio Paint',
    category: 'ILUSTRACIÓN DIGITAL',

    description:
      'Creación de ilustraciones digitales, personajes y propuestas visuales.',

    skills: [
      'Ilustración digital',
      'Diseño de personajes',
      'Pintura digital'
    ]
  },

  chatgpt: {
    name: 'ChatGPT',
    category: 'INTELIGENCIA ARTIFICIAL',

    description:
      'Integración de inteligencia artificial como herramienta de apoyo en procesos creativos, técnicos y de programación.',

    skills: [
      'Optimización de procesos',
      'Programación asistida',
      'Exploración creativa'
    ]
  }

};
/* ==========================================================
   SOFTWARE PROFILE — CONTROL DE LA VENTANA
========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const modal = document.getElementById('softwareModal');

  if (!modal) return;

  const closeButton =
    document.getElementById('closeSoftwareModal');

  const softwareLogo =
    document.getElementById('softwareLogo');

  const softwareName =
    document.getElementById('softwareName');

  const softwareCategory =
    document.getElementById('softwareCategory');

  const softwareDescription =
    document.getElementById('softwareDescription');

  const softwareSkills =
    document.getElementById('softwareSkills');

  let previousOverflow = '';
  let resumeAutoplay = false;

  function getSwiper() {
    return document.querySelector(
      '.tp-brand-slider-active'
    )?.swiper;
  }

  /* ABRIR VENTANA */

  document.addEventListener('click', event => {

    const trigger = event.target.closest(
      '.toolkit-app-trigger'
    );

    if (!trigger) return;

    event.preventDefault();

    const app = SOFTWARE_APPS[trigger.dataset.app];

    if (!app || modal.open) return;

    const image = trigger.querySelector('img');

    softwareLogo.src = image.currentSrc || image.src;
    softwareLogo.alt = app.name;

    softwareName.textContent = app.name;
    softwareCategory.textContent = app.category;
    softwareDescription.textContent = app.description;

    softwareSkills.replaceChildren();

    app.skills.forEach(skill => {

      const tag = document.createElement('span');

      tag.className = 'software-skill-tag';

      const icon = document.createElement('i');

      icon.setAttribute(
        'data-lucide',
        SKILL_ICONS[skill] || 'sparkles'
      );

      icon.setAttribute('aria-hidden', 'true');

      tag.appendChild(icon);

      tag.appendChild(document.createTextNode(skill));

      softwareSkills.appendChild(tag);

    });

    if (window.lucide) {
      lucide.createIcons();
    }

    const swiper = getSwiper();

    resumeAutoplay = Boolean(swiper?.autoplay?.running);

    swiper?.autoplay?.stop();

    previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    modal.showModal();

  });

  /* CERRAR CON EL BOTÓN X */

  closeButton.addEventListener('click', () => {

    modal.close();

  });

  /* CERRAR AL HACER CLIC FUERA */

  modal.addEventListener('click', event => {

    if (event.target === modal) {

      modal.close();

    }

  });

  /* RESTAURAR LA PÁGINA AL CERRAR */

  modal.addEventListener('close', () => {

    document.body.style.overflow = previousOverflow;

    if (resumeAutoplay) {

      getSwiper()?.autoplay?.start();

    }

    resumeAutoplay = false;

  });

});
window.addEventListener('load', function () {
    if (window.lucide) {
        lucide.createIcons();
    }
});
// ANIMACIÓN DE LA BANDA AZUL

window.addEventListener('load', function () {

    const marquee = jQuery('.tp-marquee-slider-active');

    if (marquee.length && !marquee.hasClass('slick-initialized')) {

        marquee.slick({
            speed: 7000,
            autoplay: true,
            autoplaySpeed: 0,
            centerMode: true,
            cssEase: 'linear',
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            infinite: true,
            initialSlide: 1,
            arrows: false,
            dots: false,
            pauseOnHover: false,
            pauseOnFocus: false
        });

    }

});
