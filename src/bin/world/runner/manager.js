import EventEmitter from "../../utils/event-emitter";
import {Howl} from 'howler';
import ScreenShake from "../../utils/shaker";
import * as THREE from 'three';

export default class RunnerGameManager extends EventEmitter {
    constructor(props) {
        super(props);

        this.time = props.time;
        this.camera = props.camera;

        this.finished = false;
        this.score = '00000';

        this.shaker = ScreenShake();

        const sfxGameOver = new Howl({
            src: ['sfx/game_over.wav'],
            html5: true
        });

        this.time.on('tick', time => {
            this.shaker.update(this.camera.instance);

            this.updateScore(time);
        })

        this.on('fail', () => {
            if (!this.finished) {
                sfxGameOver.play();

                this.shaker.shake(
                    this.camera.instance,
                    new THREE.Vector3(0.1, 0.1, 0), 300
                );

                setTimeout(() => {
                    location.reload();
                }, 1500);
            }

            this.finished = true;
        })
    }

    updateScore(time) {
        if (!!this.finished) return;

        const score = Math.round(time.elapsed * 10)
            .toLocaleString('en-US', {
                minimumIntegerDigits: 5,
                useGrouping: false
            });

        document.getElementById('runner-score').innerText = score;

        this.score = score;
    }
}
