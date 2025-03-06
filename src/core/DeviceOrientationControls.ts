import * as THREE from "three";

export class DeviceOrientationControls extends HTMLElement {
    object: any;
    changeEvent: any = {type: 'change'};
    EPS = 0.000001;
    deviceOrientation: any = {};
    enabled = true;
    screenOrientation = 0;
    alphaOffset = 0;

    constructor(object: any) {
        super();
        this.object = object;
        this.connect();
    }

    connect() {
        this.onScreenOrientationChangeEvent();
        // iOS 13+
        const notification = window.Notification
        if (notification) {
            const permission = notification.permission;
            if (permission === 'default') {
                // 申请权限
                notification.requestPermission().then((response) => {
                    if (response == 'granted') {
                        window.addEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);
                        window.addEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);
                    }
                }).catch((err) => {
                    console.error('THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:', err);
                });
            } else if (permission == 'granted') {
                window.addEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);
                window.addEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);
            }
        }
        this.enabled = true;
    }

    disconnect() {
        window.removeEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);
        window.removeEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);
        this.enabled = false;
    }

    update() {
        const lastQuaternion = new THREE.Quaternion();
        if (!this.enabled) return;
        const device = this.deviceOrientation;
        if (device) {
            const alpha = device.alpha ? THREE.MathUtils.degToRad(device.alpha) + this.alphaOffset : 0; // Z
            const beta = device.beta ? THREE.MathUtils.degToRad(device.beta) : 0; // X'
            const gamma = device.gamma ? THREE.MathUtils.degToRad(device.gamma) : 0; // Y''
            const orient = this.screenOrientation ? THREE.MathUtils.degToRad(this.screenOrientation) : 0; // O
            this.setObjectQuaternion(this.object.quaternion, alpha, beta, gamma, orient);
            if (8 * (1 - lastQuaternion.dot(this.object.quaternion)) > this.EPS) {
                lastQuaternion.copy(this.object.quaternion);
                this.dispatchEvent(this.changeEvent);
            }
        }
    }

    onDeviceOrientationChangeEvent(e: any) {
        this.deviceOrientation = e;
    }

    onScreenOrientationChangeEvent() {
        this.screenOrientation = window.screen.orientation.angle || 0;
    }

    setObjectQuaternion(quaternion: THREE.Quaternion, alpha: number, beta: number, gamma: number, orient: number) {
        const zee = new THREE.Vector3(0, 0, 1);
        const euler = new THREE.Euler();
        const q0 = new THREE.Quaternion();
        const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis
        euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us
        quaternion.setFromEuler(euler); // orient the device
        quaternion.multiply(q1); // camera looks out the back of the device, not the top
        quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
    }
}