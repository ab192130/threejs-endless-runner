import EventEmitter from "./event-emitter";
import * as THREE from 'three';

export default class Time extends EventEmitter {
    constructor(options) {
        super(options);

        this.clock = new THREE.Clock();

        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 0;

        this.tick = this.tick.bind(this);
        this.tick();
    }

    tick() {
        this.ticker = requestAnimationFrame(this.tick);

        const current = Date.now();
        this.delta = current - this.current
        this.current = Date.now();

        if(this.delta > 60)
        {
            this.delta = 60
        }

        this.emit('tick', {
            elapsed: this.clock.getElapsedTime(),
            delta: this.delta,
            current: this.current,
        });
    }

    stop() {
        window.cancelAnimationFrame(this.ticker);
    }
}
