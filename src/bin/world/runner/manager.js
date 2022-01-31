import EventEmitter from "../../utils/event-emitter";
import {Howl} from 'howler';

export default class RunnerGameManager extends EventEmitter {
    constructor(props) {
        super(props);

        this.finished = false;

        const sfxGameOver = new Howl({
            src: ['sfx/game_over.wav'],
            html5: true
        });

        this.on('fail', () => {
            if (!this.finished) {
                sfxGameOver.play();

                setTimeout(() => {
                    location.reload();
                }, 1500);
            }

            this.finished = true;
        })
    }

}
