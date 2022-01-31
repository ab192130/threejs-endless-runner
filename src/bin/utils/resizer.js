import EventEmitter from "./event-emitter";

export default class Resizer extends EventEmitter {
    constructor(options) {
        super(options);

        this.viewport = {};
        this.size = document.createElement('div');
        this.size.style.width = '100vw';
        this.size.style.height = '100vh';
        this.size.style.position = 'absolute';
        this.size.style.top = 0;
        this.size.style.left = 0;
        this.size.style.pointerEvents = 'none';

        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
    }

    resize() {
        document.body.appendChild(this.size);
        this.viewport.width = this.size.offsetWidth;
        this.viewport.height = this.size.offsetHeight;
        document.body.removeChild(this.size);

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.emit('resize');
    }
}
