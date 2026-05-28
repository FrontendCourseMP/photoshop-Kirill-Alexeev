export type EdgeHandling = 'black' | 'white' | 'copy';

export function convolveAsync(
    imageData: ImageData,
    kernel: number[][],
    channels: string[],
    edge: EdgeHandling
): Promise<ImageData> {
    return new Promise((resolve) => {
        const extended = extendImage(imageData, edge);
        const srcData = extended.data;
        const srcWidth = extended.width;
        const dstWidth = imageData.width;
        const dstHeight = imageData.height;
        const dst = new Uint8ClampedArray(dstWidth * dstHeight * 4);

        const kSize = kernel.length;

        let kernelSum = 0;
        for (let ky = 0; ky < kSize; ky++)
            for (let kx = 0; kx < kSize; kx++)
                kernelSum += kernel[ky][kx];
        const normalize = kernelSum !== 0;

        const processRow = (y: number) => {
            for (let x = 0; x < dstWidth; x++) {
                let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
                for (let ky = 0; ky < kSize; ky++) {
                    for (let kx = 0; kx < kSize; kx++) {
                        const sx = x + kx;
                        const sy = y + ky;
                        const idx = (sy * srcWidth + sx) * 4;
                        const kval = kernel[ky][kx];
                        sumR += srcData[idx] * kval;
                        sumG += srcData[idx + 1] * kval;
                        sumB += srcData[idx + 2] * kval;
                        sumA += srcData[idx + 3] * kval;
                    }
                }
                if (normalize) {
                    sumR /= kernelSum;
                    sumG /= kernelSum;
                    sumB /= kernelSum;
                    sumA /= kernelSum;
                }

                const dstIdx = (y * dstWidth + x) * 4;
                const origIdx = (y * dstWidth + x) * 4;

                dst[dstIdx] = channels.includes('master') || channels.includes('R') || channels.includes('Gray') ? clamp(sumR) : imageData.data[origIdx];
                dst[dstIdx + 1] = channels.includes('master') || channels.includes('G') || channels.includes('Gray') ? clamp(sumG) : imageData.data[origIdx + 1];
                dst[dstIdx + 2] = channels.includes('master') || channels.includes('B') || channels.includes('Gray') ? clamp(sumB) : imageData.data[origIdx + 2];
                dst[dstIdx + 3] = channels.includes('master') || channels.includes('A') || channels.includes('Alpha') ? clamp(sumA) : imageData.data[origIdx + 3];
            }
        };

        let y = 0;
        const chunkSize = 10;
        const processChunk = () => {
            const end = Math.min(y + chunkSize, dstHeight);
            for (; y < end; y++) {
                processRow(y);
            }
            if (y < dstHeight) {
                setTimeout(processChunk, 0);
            } else {
                resolve(new ImageData(dst, dstWidth, dstHeight));
            }
        };
        setTimeout(processChunk, 0);
    });
}

function extendImage(imageData: ImageData, strategy: EdgeHandling): ImageData {
    const { width, height, data } = imageData;
    const newWidth = width + 2;
    const newHeight = height + 2;
    const extended = new Uint8ClampedArray(newWidth * newHeight * 4);

    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            let srcX = x - 1;
            let srcY = y - 1;

            let r, g, b, a;
            if (srcX < 0 || srcX >= width || srcY < 0 || srcY >= height) {
                switch (strategy) {
                    case 'black':
                        r = g = b = 0; a = 255;
                        break;
                    case 'white':
                        r = g = b = 255; a = 255;
                        break;
                    case 'copy':
                        srcX = Math.max(0, Math.min(srcX, width - 1));
                        srcY = Math.max(0, Math.min(srcY, height - 1));
                        const idx = (srcY * width + srcX) * 4;
                        r = data[idx]; g = data[idx + 1]; b = data[idx + 2]; a = data[idx + 3];
                        break;
                }
            } else {
                const idx = (srcY * width + srcX) * 4;
                r = data[idx]; g = data[idx + 1]; b = data[idx + 2]; a = data[idx + 3];
            }

            const dstIdx = (y * newWidth + x) * 4;
            extended[dstIdx] = r;
            extended[dstIdx + 1] = g;
            extended[dstIdx + 2] = b;
            extended[dstIdx + 3] = a;
        }
    }
    return new ImageData(extended, newWidth, newHeight);
}

function clamp(value: number): number {
    return Math.min(255, Math.max(0, Math.round(value)));
}