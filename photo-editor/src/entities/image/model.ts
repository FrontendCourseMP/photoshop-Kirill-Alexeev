import { ImageMetadata } from '@shared/types';

export class ImageModel {
    private _metadata: ImageMetadata;
    private _imageData: ImageData;

    constructor(metadata: ImageMetadata, imageData: ImageData) {
        this._metadata = metadata;
        this._imageData = imageData;
    }

    get metadata(): ImageMetadata {
        return this._metadata;
    }

    get imageData(): ImageData {
        return this._imageData;
    }
}