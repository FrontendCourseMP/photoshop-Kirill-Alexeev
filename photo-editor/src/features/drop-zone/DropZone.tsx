import React, { useRef, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { loadImageFromFile } from '@shared/lib/utils/loader';
import { ImageModel } from '@entities/image/model';

interface DropZoneProps {
    onImageLoaded: (model: ImageModel) => void;
    onError: (error: Error) => void;
    compact?: boolean;
    label?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({
    onImageLoaded,
    onError,
    compact = false,
    label = 'Перетащите изображение сюда',
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = async (file: File) => {
        setIsLoading(true);
        try {
            const model = await loadImageFromFile(file);
            onImageLoaded(model);
        } catch (err) {
            onError(err as Error);
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!isLoading) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (isLoading) return;
        const file = e.dataTransfer.files[0];
        if (!file) return;
        processFile(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        processFile(file);
    };

    if (compact) {
        return (
            <Box
                sx={{
                    p: 1.5,
                    border: '1px dashed',
                    borderColor: isDragging ? 'primary.main' : 'grey.400',
                    borderRadius: 1,
                    bgcolor: isDragging ? 'action.hover' : 'background.paper',
                    cursor: isLoading ? 'default' : 'pointer',
                    textAlign: 'center',
                    width: '100%',
                    opacity: isLoading ? 0.7 : 1,
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                    if (!isLoading) fileInputRef.current?.click();
                }}
            >
                <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.gb7"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />
                {isLoading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CircularProgress size={24} sx={{ mb: 0.5 }} />
                        <Typography variant="caption">Загрузка...</Typography>
                    </Box>
                ) : (
                    <>
                        <CloudUploadIcon fontSize="small" sx={{ color: 'grey.600' }} />
                        <Typography variant="caption" sx={{ mt: 0.5 }}>
                            {label}
                        </Typography>
                    </>
                )}
            </Box>
        );
    }

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
                cursor: isLoading ? 'default' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
                if (!isLoading) fileInputRef.current?.click();
            }}
        >
            <input
                type="file"
                accept=".png,.jpg,.jpeg,.gb7"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileSelect}
            />
            {isLoading ? (
                <>
                    <CircularProgress size={48} sx={{ mb: 2 }} />
                    <Typography variant="h6">Загрузка изображения...</Typography>
                </>
            ) : (
                <>
                    <CloudUploadIcon sx={{ fontSize: 64, color: 'grey.500', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        {label}
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
                </>
            )}
        </Box>
    );
};