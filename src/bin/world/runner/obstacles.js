import * as THREE from 'three';
import Obstacle from "./obstackles/obstacle";
import _ from 'lodash';

export default class Obstacles {
    constructor(props) {
        this.loader = props.loader;
        this.time = props.time;
        this.shadows = props.shadows;
        this.manager = props.manager;

        this.container = new THREE.Object3D();
        this.container.name = "obstacles";
        this.delayRange = 10;

        this.colliders = [];

        this.init();
    }

    init() {
        this.load();
    }

    updateRange() {
        return _.random(30, 100);
    }

    load() {
        let delta = 0;

        this.time.on('tick', time => {
            delta++;

            if (delta > this.delayRange) {
                delta = 0;

                this.delayRange = this.updateRange();

                const object = new Obstacle({loader: this.loader, shadows: this.shadows, time: this.time, manager: this.manager});

                this.colliders.push(
                    object.collider
                );

                // this.shadows.add(object.container, {sizeX: 1, sizeY: 1, offsetZ: 0});
                this.container.add(object.container)
            }
        })
    }
}
