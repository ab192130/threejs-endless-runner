import * as THREE from 'three';
import Player from "./runner/player";
import Obstacles from "./runner/obstacles";
import RunnerGameManager from "./runner/manager";

export default class RunnerGame {
    constructor(props) {
        this.loader = props.loader;
        this.time = props.time;
        this.shadows = props.shadows;

        this.container = new THREE.Object3D();
        this.container.name = 'runner_game';

        this.manager = new RunnerGameManager();

        this.initPlayer();
        this.initObstacles();

        this.initCollisions();
    }

    initPlayer() {
        this.player = new Player({loader: this.loader, time: this.time, shadows: this.shadows, manager: this.manager});
        this.container.add(this.player.container);
    }

    initObstacles() {
        this.obstackles = new Obstacles({loader: this.loader, time: this.time, shadows: this.shadows, manager: this.manager});
        this.container.add(this.obstackles.container);
    }

    initCollisions() {
        const playerCollider = this.player.collider;

        this.time.on('tick', time => {
            if (!playerCollider) return;

            const colliders = this.obstackles.colliders;

            for (const collider of colliders) {
                const fail = collider.intersectsBox(playerCollider);

                if (!!fail) {
                    this.manager.emit('fail');
                }
            }
        })
    }
}
