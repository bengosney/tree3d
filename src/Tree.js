import NoisyLine from "./NoisyLine";

class Tree {
    constructor(x, y, z, width, height, levels, limbs) {
        Object.assign(this, { x, y, z, width, height, levels, limbs });
        this.data = [];
    }

    get(callback) {
        const { x, y, height } = this;

        let cx = x;
        let cy = y;

        const maxLevels = this.levels;

        const getLength3d = (x1, y1, z1, x2, y2, z2) => {
            const x = x1 - x2;
            const y = y1 - y2;
            const z = z1 - z2;

            return Math.abs(Math.sqrt(x * x + y * y + z * z));
        };

        const randomRange = (min, max) => {
            return min + Math.random() * (max - min);
        };

        const getAngle2d = (x1, y1, x2, y2) => {
            const y = y1 - y2;
            const x = x1 - x2;
            const theta = Math.atan2(x, y) * (180 / Math.PI);

            return theta + 90;
        };

        const s = 0.45;

        const drawLimb = (x1, y1, z1, x2, y2, z2, level = 0) => {
            const length = getLength3d(x1, y1, z1, x2, y2, z2);
            const line = new NoisyLine(x1, y1, z1, x2, y2, z2, 10, length / 500);

            const lineWidth = maxLevels - level;

            this.data.push(line);

            if (level <= maxLevels) {
                const _draw = aMod => {
                    const cx = x2;
                    const cy = y2;
                    const cz = z2;
                    const length =
                        getLength3d(x1, y1, z1, x2, y2, z2) *
                        (s + randomRange(0, 0.2));

                    const tx = x2;
                    const ty = y2 + length * randomRange(1, 0.5);
                    const tz = z2 + length * randomRange(1, 0.5);
                    const ca = getAngle2d(x1, y1, x2, y2);
                    const a = (ca - 90 + aMod + randomRange(-15, 15)) * (Math.PI / 180);
                    const nx = Math.cos(a) * (tx - cx) - Math.sin(a) * (ty - cy) + cx;
                    const ny = Math.sin(a) * (tx - cx) - Math.cos(a) * (ty - cy) + cy;
                    const nz = 0;

                    drawLimb(cx, cy, cz, nx, ny, nz, level + 1);

                    if (level === maxLevels) {
                        callback(this.data);
                    }
                };

                const m = 0.2;
                const minLimbs = 2;
                const maxLimbs = this.limbs;

                const limbs =
                    level === 0 ? maxLimbs : randomRange(minLimbs, maxLimbs);
                const diff = 90 / (limbs - 1);
                for (let i = 0; i < limbs; i++) {
                    const a = -45 + diff * i * randomRange(1 + m, 1 - m);
                    _draw(a);
                }
            }
        };
        drawLimb(cx, cy, cx, cy - height * s, 0, 0);
    }

    addToScene(scene, material) {
        this.get(data => data.map(limb => limb.addToScene(scene, material)));
    }
}

export default Tree;
