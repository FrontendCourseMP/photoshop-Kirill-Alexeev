export type ImageFormat = 'png' | 'jpeg' | 'gb7';

export interface ImageMetadata {
    width: number;
    height: number;
    colorDepth: number;
    format: ImageFormat;
    hasMask?: boolean;
    fileSize?: number;
}

export interface ImageDataWithMetadata {
    metadata: ImageMetadata;
    pixelData: ImageData;
}