(() => {
    // La pantalla y los extremos mantienen sus dimensiones originales.
// En pantallas anchas solo se extiende la carcasa de relleno.
const stage = document.getElementById('consoleStage');
const viewport = document.querySelector('.console-viewport');
const outer = document.querySelector('.console-outer');
if (!stage || !viewport || !outer) return;

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

keyContainer.replaceChildren();

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
  keyContainer.append(button);
});

document.getElementById('redControl').addEventListener('click', () => nextMessage(1));
// v11: dos interruptores independientes.
// Morado -> LED verde izquierdo; amarillo -> LED amarillo derecho.
const purpleControl = document.getElementById('purpleControl');
const yellowControl = document.getElementById('yellowControl');
const greenLed = document.getElementById('greenLed');
const yellowLed = document.getElementById('yellowLed');

function toggleLight(button, led, color) {
  const active = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(active));
  button.setAttribute('aria-label', `${active ? 'Apagar' : 'Encender'} luz ${color}`);
  button.classList.toggle('is-latched', active);
  led.classList.toggle('is-on', active);
  showScreen(active ? `${color.toUpperCase()} LIGHT ON` : `${color.toUpperCase()} LIGHT OFF`,
    active ? 'INDICATOR ENABLED' : 'INDICATOR DISABLED');
}

purpleControl.addEventListener('click', () => toggleLight(purpleControl, greenLed, 'verde'));
yellowControl.addEventListener('click', () => toggleLight(yellowControl, yellowLed, 'amarilla'));

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
})();