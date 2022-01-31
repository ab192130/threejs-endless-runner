import * as THREE from 'three';
import * as dat from 'dat.gui'
import Camera from "./world/misc/camera";
import World from "./world";
import Time from "./utils/time";
import Resizer from "./utils/resizer";
import TWEEN from "@tweenjs/tween.js";

export default class App {
    constructor(options) {
        this.canvas = options.canvas;
        this.background = new THREE.Color('skyblue');

        this.time = new Time();
        this.resizer = new Resizer();

        this.setConfig();
        this.setDebug();
        this.setRenderer();
        this.setCamera();
        this.setWorld();

        this.animate = this.animate.bind(this);
        this.animate();
    }

    getState() {
        return {
            config: this.config,
            camera: this.camera,
            renderer: this.renderer,
            time: this.time,
            debug: this.debug
        }
    }

    animate() {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera.instance);
        TWEEN.update();
    }

    setConfig() {
        this.config = {};
        this.config.debug = window.location.hash === '#debug';
        this.config.lights = true;
        this.config.grid = false;
        //this.config.touch = false
    }

    setDebug() {
        if (!this.config.debug) return;

        this.debug = new dat.GUI({width: 420});
    }

    setRenderer() {
        this.scene = new THREE.Scene();
        this.scene.background = this.background;
        this.renderer = new THREE.WebGLRenderer({
            //canvas: this.canvas,
            antialias: true,
            alpha: true
        });

        this.renderer.setClearColor(this.background, 1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.canvas.append(this.renderer.domElement);

        this.resizer.on('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        })
    }

    setCamera() {
        this.camera = new Camera({
            renderer: this.renderer,
            resizer: this.resizer
        });

        this.scene.add(this.camera.container);
    }

    setWorld() {
        this.world = new World(this.getState());

        this.scene.add(this.world.container);
    }

    destroy() {
        this.renderer.dispose();
        this.debug.destroy();
        this.camera.orbitControls.dispose();

        this.time.off('tick');
        this.resizer.off('resize');
    }
}
