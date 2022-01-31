import * as THREE from 'three';
import {TransformControls} from "three/examples/jsm/controls/TransformControls";

const clock = new THREE.Clock();

export default class Cube {
    constructor(options) {
        this.config = options.config;
        this.time = options.time;
        this.debug = options.debug;
        this.renderer = options.renderer;
        this.camera = options.camera;
        this.shadows = options.shadows;

        this.container = new THREE.Object3D();

        this.createCube();
    }

    createCube() {
        //const transformControls = new TransformControls(this.camera.instance, this.renderer.domElement);

        this.geometry = new THREE.SphereBufferGeometry(0.5, 30, 30);
        this.material = new THREE.MeshBasicMaterial({color: 0xffffff});
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(0, 0.53, 0);
        this.mesh.rotation.set(0, 0, 0);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.container.add(this.mesh);
    }
}
