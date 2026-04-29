import { ImageMetadata } from '@shared/types';

export class ImageModel {
    private _metadata: ImageMetadata;
    private _imageData: ImageData;
    channels: string[];

    constructor(metadata: ImageMetadata, imageData: ImageData) {
        this._metadata = metadata;
        this._imageData = imageData;
        this.channels = this.determineChannels();
    }

    private determineChannels(): string[] {
        const { format, hasMask } = this._metadata;
        if (format === 'gb7') {
            return hasMask ? ['Gray', 'Alpha'] : ['Gray'];
        }
        const data = this._imageData.data;
        let hasAlpha = false;
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] !== 255) {
                hasAlpha = true;
                break;
            }
        }
        return hasAlpha ? ['R', 'G', 'B', 'A'] : ['R', 'G', 'B'];
    }

    get metadata(): ImageMetadata {
        return this._metadata;
    }

    get imageData(): ImageData {
        return this._imageData;
    }

    generateChannelPreviews(maxSize: number = 80): ImageData[] {
        const { width, height } = this._metadata;
        const channels = this.channels;
        const previews: ImageData[] = [];
        const scale = Math.min(1, maxSize / Math.max(width, height));
        const pw = Math.max(1, Math.floor(width * scale));
        const ph = Math.max(1, Math.floor(height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = pw;
        canvas.height = ph;
        const ctx = canvas.getContext('2d')!;

        const srcData = this._imageData.data;

        for (const ch of channels) {
            const preview = ctx.createImageData(pw, ph);
            const dst = preview.data;

            let srcIdx: number;
            if (ch === 'Gray') srcIdx = 0;
            else if (ch === 'Alpha') srcIdx = 3;
            else if (ch === 'R') srcIdx = 0;
            else if (ch === 'G') srcIdx = 1;
            else if (ch === 'B') srcIdx = 2;
            else if (ch === 'A') srcIdx = 3;
            else continue;

            for (let y = 0; y < ph; y++) {
                for (let x = 0; x < pw; x++) {
                    const srcX = Math.floor(x / scale);
                    const srcY = Math.floor(y / scale);
                    const srcPixelIndex = (srcY * width + srcX) * 4;
                    const value = srcData[srcPixelIndex + srcIdx];

                    const dstIndex = (y * pw + x) * 4;
                    dst[dstIndex] = value;
                    dst[dstIndex + 1] = value;
                    dst[dstIndex + 2] = value;
                    dst[dstIndex + 3] = 255;
                }
            }
            previews.push(preview);
        }
        return previews;
    }
}