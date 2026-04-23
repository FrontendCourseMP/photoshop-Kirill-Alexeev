import React, { useRef, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { loadImageFromFile } from '@shared/lib/utils/loader';
import { ImageModel } from '@entities/image/model';

interface DropZoneProps {
    onImageLoaded: (model: ImageModel) => void;
    onError: (error: Error) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onImageLoaded, onError }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (!file) return;

        try {
            const model = await loadImageFromFile(file);
            onImageLoaded(model);
        } catch (err) {
            onError(err as Error);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const model = await loadImageFromFile(file);
            onImageLoaded(model);
        } catch (err) {
            onError(err as Error);
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
                border: '2px dashed',
                borderColor: isDragging ? 'primary.main' : 'grey.400',
                borderRadius: 2,
                bgcolor: isDragging ? 'action.hover' : 'background.paper',
                transition: 'all 0.2s',
                cursor: 'pointer',
                margin: 5,
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                accept=".png,.jpg,.jpeg,.gb7"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileSelect}
            />
            <CloudUploadIcon sx={{ fontSize: 64, color: 'grey.500', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
                Перетащите изображение сюда
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                или
            </Typography>
            <Button variant="contained" component="span">
                Выберите файл
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                Поддерживаются форматы: PNG, JPG, GB7
            </Typography>
        </Box>
    );
};