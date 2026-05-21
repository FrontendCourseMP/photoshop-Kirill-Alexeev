export type InterpolationMethod = 'nearest' | 'bilinear';

export function resample(
    src: ImageData,
    newWidth: number,
    newHeight: number,
    method: InterpolationMethod = 'bilinear'
): ImageData {
    if (method === 'nearest') {
        return nearestNeighbor(src, newWidth, newHeight);
    }
    return bilinear(src, newWidth, newHeight);
}

function nearestNeighbor(src: ImageData, newWidth: number, newHeight: number): ImageData {
    const srcW = src.width, srcH = src.height;
    const dst = new ImageData(newWidth, newHeight);
    const scaleX = srcW / newWidth, scaleY = srcH / newHeight;

    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            const srcX = Math.floor(x * scaleX);
            const srcY = Math.floor(y * scaleY);
            const si = (srcY * srcW + srcX) * 4;
            const di = (y * newWidth + x) * 4;
            dst.data[di] = src.data[si];
            dst.data[di + 1] = src.data[si + 1];
            dst.data[di + 2] = src.data[si + 2];
            dst.data[di + 3] = src.data[si + 3];
        }
    }
    return dst;
}

function bilinear(src: ImageData, newWidth: number, newHeight: number): ImageData {
    const srcW = src.width, srcH = src.height;
    const dst = new ImageData(newWidth, newHeight);
    const scaleX = srcW / newWidth, scaleY = srcH / newHeight;

    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            const gx = x * scaleX;
            const gy = y * scaleY;
            const x1 = Math.floor(gx), x2 = Math.min(x1 + 1, srcW - 1);
            const y1 = Math.floor(gy), y2 = Math.min(y1 + 1, srcH - 1);
            const dx = gx - x1, dy = gy - y1;

            const i11 = (y1 * srcW + x1) * 4;
            const i12 = (y1 * srcW + x2) * 4;
            const i21 = (y2 * srcW + x1) * 4;
            const i22 = (y2 * srcW + x2) * 4;

            const di = (y * newWidth + x) * 4;
            for (let c = 0; c < 4; c++) {
                const v =
                    src.data[i11 + c] * (1 - dx) * (1 - dy) +
                    src.data[i12 + c] * dx * (1 - dy) +
                    src.data[i21 + c] * (1 - dx) * dy +
                    src.data[i22 + c] * dx * dy;
                dst.data[di + c] = Math.round(v);
            }
        }
    }
    return dst;
}