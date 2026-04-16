import React, { useRef } from 'react';
import { Button } from '@mui/material';
import { loadImageFromFile } from '@shared/lib/utils/loader';

interface ImageLoaderProps {
    onImageLoaded: (model: ImageModel) => void;
    onError: (error: Error) => void;
}

export const ImageLoader: React.FC<ImageLoaderProps> = ({ onImageLoaded, onError }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const imageModel = await loadImageFromFile(file);
            onImageLoaded(imageModel);
        } catch (error) {
            onError(error as Error);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <>
            <input
                type="file"
                accept=".png,.jpg,.jpeg,.gb7"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <Button variant="contained" onClick={() => fileInputRef.current?.click()}>
                Загрузить изображение
            </Button>
        </>
    );
};