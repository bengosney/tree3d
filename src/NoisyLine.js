import Noise from "./Noise";
import * as THREE from "three";

class NoisyLine {
    constructor(x1, y1, z1, x2, y2, z2, a = 100, f = 2) {
        const x = x1 - x2;
        const y = y1 - y2;
        const z = z1 - z2;

        this.length = Math.abs(Math.sqrt(x * x + y * y + z * z));
        this.angleY = this.getAngle(x1, y1, x2, y2);
        this.angleZ = this.getAngle(x1, z1, x2, z2);

        this.noiseY = new Noise(this.length, [0, a], f);
        this.noiseZ = new Noise(this.length, [0, a], f);

        this.a = a;

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.z1 = z1;
        this.z2 = z2;
    }

    setAmplitude(amplitude) {
        this.noiseY.setRange([0, amplitude]);
        this.noiseZ.setRange([0, amplitude]);
    }

    setFrequency(frequency) {
        this.noiseY.setRadius(frequency);
        this.noiseZ.setRadius(frequency);
    }

    getAngle(x1, y1, x2, y2) {
        const y = y1 - y2;
        const x = x1 - x2;
        const theta = Math.atan2(x, y) * (180 / Math.PI);

        return theta + 90;
    }

    rotate(cx, cy, x, y, angle) {
        if (angle === 0) {
            return { ax: x, ay: y };
        }
        const radians = (Math.PI / 180) * angle;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        const ax = cos * (x - cx) + sin * (y - cy) + cx;
        const ay = cos * (y - cy) - sin * (x - cx) + cy;

        return { ax: ax, ay: ay };
    }

    get() {
        const { noiseY, noiseZ, x1, y1, x2, y2, z1, z2, a } = this;
        const y = y1;
        const z = z1;

        let yOffset = null;
        let zOffset = null;
        noiseY.reset();
        noiseZ.reset();

        const data = [];
        for (let x = 0; x <= this.length; x++) {
            const ny = noiseY.get();
            const nz = noiseZ.get();
            yOffset = yOffset || ny;
            zOffset = zOffset || nz;

            const _x = x + x1;
            const _y = y + ny - yOffset;
            const _z = z + nz - zOffset;
            const { ax, ay } = this.rotate(x1, y1, _x, _y, this.angleY);
            const { _, ay: az } = this.rotate(x1, z1, _x, _z, this.angleZ);

            data.push({ x: ax, y: ay, z: az });
        }

        return data;
    }

    addToScene(scene, material, boxSizeFrom = 1, boxSizeTo = 1) {
        const points = [];
        const inc = (boxSizeTo - boxSizeFrom) / this.length;
        let boxSize = boxSizeFrom;

        this.get().map(e => {
            const boxGeometry = new THREE.BoxGeometry(
                boxSize,
                boxSize,
                boxSize
            );
            points.push(new THREE.Vector3(e.x, e.y, e.z));
            const cube = new THREE.Mesh(boxGeometry, material);
            cube.position.set(e.x, e.y, e.z);
            scene.add(cube);
            boxSize += inc;
        });

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    }
}

export default NoisyLine;
