import { encodeGB7 } from '@shared/lib/gb7/coder';
import { ImageModel } from '@entities/image/model';
import { ImageFormat } from '@shared/types';

export async function saveImage(model: ImageModel, format: ImageFormat): Promise<void> {
    const { metadata, imageData } = model;
    let blob: Blob;
    let fileName: string;

    if (format === 'gb7') {
        const arrayBuffer = encodeGB7(imageData, metadata.hasMask || false);
        blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
        fileName = `image.gb7`;
    } else {
        const canvas = document.createElement('canvas');
        canvas.width = metadata.width;
        canvas.height = metadata.height;
        const ctx = canvas.getContext('2d')!;
        ctx.putImageData(imageData, 0, 0);

        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'jpeg' ? 0.92 : undefined;
        const dataUrl = canvas.toDataURL(mimeType, quality);

        const response = await fetch(dataUrl);
        blob = await response.blob();
        fileName = `image.${format}`;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}