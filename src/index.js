// eslint-disable-next-line no-unused-vars
import styles from "./styles.css";

import * as THREE from "three";
import { WEBGL } from "three/examples/jsm/WebGL.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { makeNoise2D } from "open-simplex-noise";

import NoisyLine from "./NoisyLine";
import Tree from "./Tree";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
renderer.setClearColor(0x000000, 0.0);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

const tree = new Tree(0, 0, 0, 100, 150, 2, 3);
tree.addToScene(scene, material);

//const nLine = new NoisyLine(0, 0, 0, 100, 0, 0, 20, .5);

//nLine.addToScene(scene, material, 5, 1);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const sphereSize = 1;
const light1 = new THREE.PointLight(0xff4040, 2);
light1.castShadow = true;
light1.position.set(7, 7, 10);
scene.add(light1);
const pointLightHelper1 = new THREE.PointLightHelper(light1, sphereSize);
scene.add(pointLightHelper1);

const light2 = new THREE.PointLight(0x40ff40, 2);
light2.castShadow = true;
light2.position.set(-7, -7, -10);
scene.add(light2);

const pointLightHelper2 = new THREE.PointLightHelper(light2, sphereSize);
scene.add(pointLightHelper2);

camera.position.z = 150;

controls.update();

const animate = function() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
};

if (WEBGL.isWebGLAvailable()) {
    animate();
} else {
    document
        .getElementById("container")
        .appendChild(WEBGL.getWebGLErrorMessage());
}
