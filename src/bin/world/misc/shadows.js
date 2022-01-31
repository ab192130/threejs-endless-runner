import * as THREE from 'three';
// import ShadowMaterial from "../../materials/shadow";


export default class Shadows {
    constructor(options) {
        this.textureLoader = new THREE.TextureLoader();

        this.config = options.config;
        this.time = options.time;
        this.debug = options.debug;
        this.renderer = options.renderer;
        this.camera = options.camera;

        this.items = [];
        this.maxDistance = 3;

        this.container = new THREE.Object3D();
        this.container.updateMatrix();
        this.container.name = "shadow"

        this.setGeometry();

        this.time.on('tick', () => {
            this.render();
        });
    }

    setGeometry() {
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    }

    add(ref, options = {}) {
        const shadow = {};

        shadow.reference = ref;
        shadow.offset = options.offsetZ;
        shadow.material = new THREE.MeshBasicMaterial(
            {
                color: '#af5517',
                side: THREE.FrontSide,
                transparent: true,
                alphaMap: this.textureLoader.load('images/simpleShadow.jpg')
            });

        shadow.mesh = new THREE.Mesh(this.geometry, shadow.material);
        shadow.mesh.position.y = shadow.reference.position.y - shadow.offset;
        shadow.mesh.scale.set(options.sizeX, options.sizeY, 0);

        this.container.add(shadow.mesh);

        this.items[shadow.mesh.uuid] = shadow;

        shadow.mesh.rotation.x = Math.PI / -2;

        return shadow;
    }

    render() {
        for (const shadow of Object.values(this.items)) {
            shadow.mesh.position.x = shadow.reference.position.x;
            shadow.mesh.position.z = shadow.reference.position.z;

            shadow.material.opacity = 1 - shadow.reference.position.y;
        }
    }

    remove(shadow) {
        this.container.remove(shadow);
    }
}
