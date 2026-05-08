import React from 'react';
import { Paper, Typography } from '@mui/material';
import { ImageModel } from '@entities/image/model';

interface StatusBarProps {
    imageModel: ImageModel | null;
}

export const StatusBar: React.FC<StatusBarProps> = ({ imageModel }) => {
    return (
        <Paper
            sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
            }}
            elevation={3}
        >
            {imageModel ? (
                <Typography variant="body2">
                    Размер: {imageModel.metadata.width} x {imageModel.metadata.height} пикселей
                    | Глубина цвета: {imageModel.metadata.colorDepth} бит
                    | Формат: {imageModel.metadata.format.toUpperCase()} | Размер файла: {(imageModel.metadata.fileSize! / 1024).toFixed(2)} КБ
                </Typography>
            ) : (
                <Typography variant="body2">Изображение не загружено</Typography>
            )}
        </Paper>
    );
};