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
