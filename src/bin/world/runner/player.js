import * as THREE from 'three';
import {Howl} from 'howler';

export default class Player {
    constructor(props) {
        this.loader = props.loader;
        this.time = props.time;
        this.shadows = props.shadows;
        this.manager = props.manager;

        this.container = new THREE.Object3D();
        this.container.name = 'player';

        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.gravity = new THREE.Vector3(0, -20, 0);

        this.clock = new THREE.Clock();
        this.mixer = null;
        this.canRun = true;

        // For collision
        this.collider = new THREE.Box3();

        this.sfxJump = new Howl({
            src: ['sfx/jump_02.wav'],
            html5: true
        });

        this.init();

        this.manager.on('fail', () => {
            //alert('Oops! You hit that!');
            this.canRun = false;
        });
    }

    init() {
        this.jumped = false;
        this.inAir = false;

        this.load();
        this.setControls();

        this.time.on('tick', data => {
            this.update(data);
        })
    }

    setControls() {
        document.addEventListener('keyup', e => {
            switch (e.code) {
                case 'Space': {
                    this.jumped = false;
                    break;
                }
            }
        });

        document.addEventListener('keydown', e => {
            switch (e.code) {
                case 'Space': {
                    this.jumped = true;
                    break;
                }
            }
        });
    }

    load() {
        const mat = new THREE.MeshStandardMaterial({color: 'green'});

        this.loader.load('runner/player/scene.glb', gltf => {
            const mesh = gltf.scene;
            mesh.position.x = 0;
            mesh.position.y = 0;
            mesh.position.z = 0;

            this.shadows.add(mesh, {sizeX: 0.6, sizeY: 0.6, offsetZ: 0})

            this.mesh = mesh;

            const body = mesh.children.find(item => item.name === 'mesh');
            const legLeft = mesh.children.find(item => item.name === 'leg_left');
            const legRight = mesh.children.find(item => item.name === 'leg_right');
            body.material = mat;
            legLeft.material = mat;
            legRight.material = mat;

            this.container.add(mesh);

            this.mixer = new THREE.AnimationMixer(mesh);
            this.actionLeftLeg = this.mixer.clipAction(gltf.animations[1]);
            this.actionLeftLeg.clampWhenFinished = false;
            this.actionLeftLeg.setLoop(THREE.LoopPingPong);
            this.actionLeftLeg.play();

            this.actionRightLeg = this.mixer.clipAction(gltf.animations[2]);
            this.actionRightLeg.clampWhenFinished = false;
            this.actionRightLeg.setLoop(THREE.LoopPingPong);
            this.actionRightLeg.play();

            this.actionBody = this.mixer.clipAction(gltf.animations[0]);
            this.actionBody.clampWhenFinished = false;
            this.actionBody.setLoop(THREE.LoopPingPong);
            this.actionBody.play();
        });

        const clock = new THREE.Clock();

        this.time.on('tick', time => {
            const delta = clock.getDelta();

            if (this.mixer && !this.inAir && !!this.canRun) {
                this.mixer.update(delta);
            }
        });
    }

    update() {
        if (!this.canRun) return;

        const delta = this.clock.getDelta();

        if (this.jumped && this.position.y === 0) {
            this.velocity.y = 8;
            this.sfxJump.play();
        } else if (this.position.y > 0) {
            this.inAir = true;
        } else if (this.position.y === 0) {
            this.inAir = false;
        }

        this.position.y = this.position.y + this.velocity.y * delta;
        this.velocity.y = this.velocity.y + this.gravity.y * delta;

        this.position.y = Math.max(this.position.y, 0.0)

        if (this.mesh) {
            this.mesh.position.copy(this.position);
            this.checkCollisions(this.mesh);
        }
    }

    checkCollisions(mesh) {
        this.collider.setFromObject(mesh);
    }
}
