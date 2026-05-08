function sRGBToLinear(c: number): number {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearRGBToXYZ(r: number, g: number, b: number): [number, number, number] {
    const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
    const y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
    const z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;
    return [x, y, z];
}

function xyzToCIELAB(x: number, y: number, z: number): [number, number, number] {
    const xn = 0.95047;
    const yn = 1.0;
    const zn = 1.08883;

    const fx = (v: number) => v > 0.008856 ? Math.cbrt(v) : (903.3 * v + 16) / 116;
    const fy = fx(y / yn);
    const L = 116 * fy - 16;
    const a = 500 * (fx(x / xn) - fy);
    const b = 200 * (fy - fx(z / zn));
    return [L, a, b];
}

export function rgbToCIELAB(r: number, g: number, b: number): { L: number; a: number; b: number } {
    const linR = sRGBToLinear(r);
    const linG = sRGBToLinear(g);
    const linB = sRGBToLinear(b);
    const [x, y, z] = linearRGBToXYZ(linR, linG, linB);
    const [L, aStar, bStar] = xyzToCIELAB(x, y, z);
    return { L, a: aStar, b: bStar };
}