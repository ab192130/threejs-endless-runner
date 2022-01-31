import * as THREE from "three";
import EventEmitter from "./event-emitter";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export default class Loader extends EventEmitter{
    constructor(props) {
        super(props);

        const draco = new DRACOLoader();
        this.loader = new GLTFLoader()
        this.textureLoader = new THREE.TextureLoader();
        draco.setDecoderPath('draco/');
        this.loader.setDRACOLoader(draco);

        this.items = {};

        if (!!props) {
            this.load(props);
        }
    }

    load(resources) {
        resources.forEach(resource => {
            this.loader.load(resource.source, scene => {
                this.items[resource.name] = scene;

                this.emit('loaded', {resource, scene});
            })
        })
    }
}
