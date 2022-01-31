import * as THREE from 'three';
import {PerspectiveCamera} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default class Camera {
    constructor(options) {
        this.renderer = options.renderer;
        this.resizer = options.resizer;

        this.container = new THREE.Object3D();
        this.container.name = 'camera';

        this.setInstance();
        //this.setOrbitControls();
    }

    setInstance() {
        this.instance = new PerspectiveCamera(
            40, // fov = Field Of View
            window.innerWidth / window.innerHeight, // aspect ratio (dummy value)
            1, // near clipping plane
            80, // far clipping plane
        );

        //this.instance.up.set(0, 0, 1);
        this.instance.position.x = 2.5;
        this.instance.position.y = 2;
        this.instance.position.z = 7;
        this.instance.rotation.x = -0.1;
        this.instance.rotation.y = 0;

        this.container.add(this.instance);

        this.resizer.on('resize', () => {
            this.instance.aspect = window.innerWidth / window.innerHeight;
            this.instance.updateProjectionMatrix();
            console.log('resize');
        })
    }

    setOrbitControls() {
        this.orbitControls = new OrbitControls(this.instance, this.renderer.domElement);
        this.orbitControls.enabled = true;
        this.orbitControls.enableKeys = false;
        this.orbitControls.zoomSpeed = 0.5;
    }
}
