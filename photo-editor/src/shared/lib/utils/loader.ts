import { decodeGB7 } from '@shared/lib/gb7/decoder';
import { ImageModel } from '@entities/image/model';

export async function loadImageFromFile(file: File): Promise<ImageModel> {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();

    if (fileExtension === 'gb7') {
        const { metadata, imageData } = decodeGB7(arrayBuffer);
        return new ImageModel(metadata, imageData);
    } else {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const blob = new Blob([arrayBuffer], { type: file.type });
            const url = URL.createObjectURL(blob);

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const metadata = {
                    width: img.width,
                    height: img.height,
                    colorDepth: 24,
                    format: fileExtension as 'png' | 'jpeg',
                    fileSize: arrayBuffer.byteLength,
                };
                URL.revokeObjectURL(url);
                resolve(new ImageModel(metadata, imageData));
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Не удалось загрузить изображение.'));
            };
            img.src = url;
        });
    }
}