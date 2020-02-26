import { makeNoise2D, makeNoise3D } from "open-simplex-noise";

let rand = Math.random() * 100;

class Noise {
    constructor(length, range = [1, 100], radius = 2) {
        this.noise = new makeNoise2D(Date.now() + rand);
        rand += 1;
        this.length = length;
        this.a = 0;
        this.range = range;
        this.r = radius;
        this.start = 0;

        this.findStart();
        this.reset();
    }

    setRange(range) {
        this.range = range;
    }

    setRadius(radius) {
        this.radius = radius;
    }

    scale(value, r1, r2) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }

    reset() {
        this.a = this.start;
    }

    step() {
        return (Math.PI * 2) / this.length;
    }

    angle(y1, y2) {
        const y = y1 - y2;
        const x = 10;
        let theta = Math.atan2(y, x);
        theta *= 180 / Math.PI;

        return theta;
    }

    findStart() {
        let prev = this.get();

        let smallestAngle = Number.MAX_SAFE_INTEGER;
        let bestStart = 0;

        for (let i = 0; i < this.length; i++) {
            const cur = this.get();
            const angle = Math.abs(this.angle(prev, cur));

            if (angle < smallestAngle) {
                smallestAngle = angle;
                bestStart = this.a - (this.step() * 2);
            }

            prev = cur;
        }

        this.start = bestStart;
    }

    get() {
        const step = this.step();

        const { r, a } = this;
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);

        this.a += step;

        return this.scale(this.noise(x, y, 0), [0, 1], this.range);
    }
}


export default Noise;