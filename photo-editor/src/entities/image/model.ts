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

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.putImageData(this._imageData, 0, 0);
        ctx.drawImage(tempCanvas, 0, 0, pw, ph);
        const scaledData = ctx.getImageData(0, 0, pw, ph);

        for (const ch of channels) {
            const preview = ctx.createImageData(pw, ph);
            const src = scaledData.data;
            const dst = preview.data;
            const idx = channels.indexOf(ch);
            for (let i = 0; i < pw * ph; i++) {
                const pixelOffset = i * 4;
                const value = src[pixelOffset + idx];
                dst[pixelOffset] = value;
                dst[pixelOffset + 1] = value;
                dst[pixelOffset + 2] = value;
                dst[pixelOffset + 3] = 255;
            }
            previews.push(preview);
        }
        return previews;
    }
}