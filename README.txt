GRAYNIE RETRO CONSOLE — FOOTER V12

Abre index.html con Live Server en Visual Studio Code.

CAMBIO PRINCIPAL
La consola está integrada al final del documento. Se recorta solo su
parte inferior (patas y base) y no se ve una franja debajo.
Las teclas, pantalla y controles permanecen visibles.

AJUSTAR EL RECORTE
En styles.css, al final:
:root { --console-visible-height: 520; }

- 540 muestra más parte inferior.
- 505 oculta más parte inferior.
- Evita bajar de 500 porque se pueden recortar las teclas.

ESCALADO
- Hasta 1931 px de ancho, se escala toda la consola de manera uniforme.
- Más de 1931 px, la carcasa se alarga solo entre los módulos.
- No se modifica la proporción de la pantalla.

ENLACES
En script.js, modifica KEY_LINKS con tus enlaces reales.
Los enlaces vacíos muestran un aviso en la pantalla.

LUCES
Morado activa/desactiva el LED verde; amarillo activa/desactiva el amarillo.
Cada botón permanece presionado mientras su luz esté encendida.
