import * as THREE from 'three';

import { GLTFLoader } from
    'three/addons/loaders/GLTFLoader.js';

import { OrbitControls } from
    'three/addons/controls/OrbitControls.js';

import { RoomEnvironment } from
    'three/addons/environments/RoomEnvironment.js';

const container = document.getElementById('portfolio-3d');

if (container) {
    initPortfolio3D();
}

function initPortfolio3D() {

    /* ESCENA */

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        35,
        1,
        0.1,
        100
    );

    camera.position.set(4, 2.5, 6);


    /* RENDER */

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 1.5)
    );

    renderer.setClearColor(0x000000, 0);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);


    /* ILUMINACIÓN AMBIENTAL */

    const pmrem = new THREE.PMREMGenerator(renderer);

    const environment = new RoomEnvironment();

    const environmentMap = pmrem.fromScene(environment);

    scene.environment = environmentMap.texture;

    environment.dispose();

    pmrem.dispose();


    /* LUCES */

    const ambient = new THREE.AmbientLight(
        0xffffff,
        1.2
    );

    scene.add(ambient);


    const mainLight = new THREE.DirectionalLight(
        0xffe6d5,
        3
    );

    mainLight.position.set(3, 5, 4);

    scene.add(mainLight);


    const purpleLight = new THREE.DirectionalLight(
        0xa26bff,
        3
    );

    purpleLight.position.set(-4, 2, -2);

    scene.add(purpleLight);


    const pinkLight = new THREE.DirectionalLight(
        0xff65ba,
        2
    );

    pinkLight.position.set(4, 1, -3);

    scene.add(pinkLight);


    const blueLight = new THREE.DirectionalLight(
        0x68cfff,
        1.8
    );

    blueLight.position.set(-3, 0, 4);

    scene.add(blueLight);


    /* CONTROLES */

    const controls = new OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping = true;

    controls.dampingFactor = 0.045;

    controls.enableZoom = false;

    controls.enablePan = false;

    controls.rotateSpeed = 0.65;

    controls.minPolarAngle = Math.PI * 0.15;

    controls.maxPolarAngle = Math.PI * 0.85;

    controls.target.set(0, 0, 0);

    controls.update();
    camera.zoom = 1.35;
    camera.updateProjectionMatrix();

    /* GRUPO DEL MODELO */

    const floatingGroup = new THREE.Group();

    scene.add(floatingGroup);


    /* CARGAR GLB */

    const loader = new GLTFLoader();

    loader.load(

        './assets/models/retro-pc.glb',

        (gltf) => {

            const model = gltf.scene;

            const box = new THREE.Box3()
                .setFromObject(model);

            const size = box.getSize(
                new THREE.Vector3()
            );

            const center = box.getCenter(
                new THREE.Vector3()
            );

            const maxDimension = Math.max(
                size.x,
                size.y,
                size.z
            );

            const scale = 3.2 / maxDimension;

            model.scale.setScalar(scale);

            model.position.copy(center)
                .multiplyScalar(-scale);

            floatingGroup.add(model);

        },

        undefined,

        (error) => {

            console.error(
                'Error al cargar el modelo 3D:',
                error
            );

        }
    );


    /* RESPONSIVE */

    function resize() {

        const width = container.clientWidth;

        const height = container.clientHeight;

        if (!width || !height) return;

        camera.aspect = width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

    }

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(container);

    resize();


    /* RENDIMIENTO */

    let isVisible = true;

    const observer = new IntersectionObserver(
        ([entry]) => {

            isVisible = entry.isIntersecting;

        },
        {
            threshold: 0
        }
    );

    observer.observe(container);


    /* MOVIMIENTO REDUCIDO */

    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;


    /* ANIMACIÓN */

    const startTime = performance.now();

    function animate(now) {

        requestAnimationFrame(animate);

        if (!isVisible || document.hidden) return;

        const time = (now - startTime) / 1000;

        if (!reducedMotion) {

            floatingGroup.position.y =
                Math.sin(time * 1.3) * 0.12;

            floatingGroup.rotation.z =
                Math.sin(time * 0.8) * 0.025;

        }

        controls.update();

        renderer.render(scene, camera);

    }

    requestAnimationFrame(animate);

}