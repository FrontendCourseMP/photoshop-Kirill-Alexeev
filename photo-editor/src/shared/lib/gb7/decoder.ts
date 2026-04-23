import { ImageMetadata } from '@shared/types';

const GB7_SIGNATURE = new Uint8Array([0x47, 0x42, 0x37, 0x1d]);

export function decodeGB7(arrayBuffer: ArrayBuffer): { metadata: ImageMetadata; imageData: ImageData } {
    const dataView = new DataView(arrayBuffer);
    let offset = 0;

    for (let i = 0; i < GB7_SIGNATURE.length; i++) {
        if (dataView.getUint8(offset++) !== GB7_SIGNATURE[i]) {
            throw new Error('Неверный формат файла: ожидалась сигнатура "GB7·".');
        }
    }

    const version = dataView.getUint8(offset++);
    if (version !== 0x01) {
        throw new Error(`Неподдерживаемая версия GB7: ${version}. Ожидалась 0x01.`);
    }

    const flags = dataView.getUint8(offset++);
    const hasMask = (flags & 0x01) !== 0;

    const width = dataView.getUint16(offset, false);
    offset += 2;
    const height = dataView.getUint16(offset, false);
    offset += 2;

    offset += 2;

    const pixelDataLength = width * height;
    const expectedFileSize = 12 + pixelDataLength;

    if (arrayBuffer.byteLength !== expectedFileSize) {
        console.warn(`Размер файла (${arrayBuffer.byteLength} байт) не соответствует ожидаемому (${expectedFileSize} байт).`);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(width, height);

    for (let i = 0; i < pixelDataLength; i++) {
        const byte = dataView.getUint8(offset++);
        const grayValue = byte & 0x7f;
        const maskBit = hasMask ? (byte & 0x80) !== 0 : true;

        const pixelIndex = i * 4;
        const scaledGray = Math.round((grayValue / 127) * 255);

        imageData.data[pixelIndex] = scaledGray;
        imageData.data[pixelIndex + 1] = scaledGray;
        imageData.data[pixelIndex + 2] = scaledGray;
        imageData.data[pixelIndex + 3] = maskBit ? 255 : 0;
    }

    const metadata: ImageMetadata = {
        width,
        height,
        colorDepth: 7,
        format: 'gb7',
        hasMask,
        fileSize: arrayBuffer.byteLength,
    };

    return { metadata, imageData };
}