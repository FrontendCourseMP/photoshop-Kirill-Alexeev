export function encodeGB7(imageData: ImageData, hasMask: boolean = false): ArrayBuffer {
    const { width, height, data } = imageData;
    const headerSize = 12;
    const pixelDataSize = width * height;
    const buffer = new ArrayBuffer(headerSize + pixelDataSize);
    const dataView = new DataView(buffer);
    let offset = 0;

    dataView.setUint8(offset++, 0x47);
    dataView.setUint8(offset++, 0x42);
    dataView.setUint8(offset++, 0x37);
    dataView.setUint8(offset++, 0x1d);

    dataView.setUint8(offset++, 0x01);
    dataView.setUint8(offset++, hasMask ? 0x01 : 0x00);
    dataView.setUint16(offset, width, false);
    offset += 2;
    dataView.setUint16(offset, height, false);
    offset += 2;
    dataView.setUint16(offset, 0x0000, false);
    offset += 2;

    for (let i = 0; i < pixelDataSize; i++) {
        const pixelIndex = i * 4;
        const r = data[pixelIndex];
        const g = data[pixelIndex + 1];
        const b = data[pixelIndex + 2];
        const a = data[pixelIndex + 3];

        const luminance = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        const grayValue = Math.round((luminance / 255) * 127);
        const maskBit = hasMask ? (a > 127 ? 0x80 : 0x00) : 0x00;

        dataView.setUint8(offset++, grayValue | maskBit);
    }

    return buffer;
}