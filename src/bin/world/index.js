import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import Floor from "./floor";
import Lights from "./misc/lights";
import Shadows from "./misc/shadows";
import RunnerGame from "./runner";

export default class World {
    constructor(options) {
        this.config = options.config;
        this.time = options.time;
        this.renderer = options.renderer;
        this.camera = options.camera;
        this.debug = options.debug;

        this.container = new THREE.Object3D();
        this.container.name = 'world';

        const draco = new DRACOLoader();
        this.loader = new GLTFLoader()
        this.textureLoader = new THREE.TextureLoader();
        draco.setDecoderPath('draco/');
        this.loader.setDRACOLoader(draco);
        this.loader.setPath('src/models/');

        this.setLights();
        this.setShadows();
        this.setGrid();

        this.setFloor();
        this.setRunnerGame();
    }

    getState() {
        return {
            config: this.config,
            camera: this.camera,
            renderer: this.renderer,
            time: this.time,
            debug: this.debug,
            shadows: this.shadows,
            loader: this.loader
        }
    }

    setLights() {
        if (!this.config.lights) return;

        this.lights = new Lights();
        this.container.add(this.lights.container);

        this.renderer.shadowMap.enabled = true; // Shadows
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMapSoft = true;
    }

    setShadows() {
        this.shadows = new Shadows(this.getState());

        this.container.add(this.shadows.container);
    }

    setGrid() {
        if (!this.config.grid) return;

        this.container.add(new THREE.GridHelper(20, 20, 0x575757, 0x828282));
    }

    setFloor() {
        this.floor = new Floor(this.getState());
        this.container.add(this.floor.container);
    }

    setRunnerGame() {
        this.runnerGame = new RunnerGame(this.getState());
        this.container.add(this.runnerGame.container);
    }
}
