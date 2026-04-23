import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Tooltip } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { ImageSaver } from '@features/image-saver/ImageSaver';
import { DropZone } from '@features/drop-zone/DropZone';
import { CanvasRenderer } from '@features/canvas-renderer/CanvasRenderer';
import { StatusBar } from '@widgets/status-bar/StatusBar';
import { ImageModel } from '@entities/image/model';
import { useToast } from '@shared/ui/ToastContext';

export const EditorPage: React.FC = () => {
    const [imageModel, setImageModel] = useState<ImageModel | null>(null);
    const { showToast } = useToast();

    const handleError = (message: string) => {
        showToast(message, 'error');
    };

    const handleImageLoaded = (model: ImageModel) => {
        setImageModel(model);
        showToast('Изображение успешно загружено', 'success');
    };

    const handleClearImage = () => {
        setImageModel(null);
        showToast('Холст очищен', 'info');
    };

    const handleDropNewImage = async (file: File) => {
        try {
            const { loadImageFromFile } = await import('@shared/lib/utils/loader');
            const model = await loadImageFromFile(file);
            handleImageLoaded(model);
        } catch (err: any) {
            handleError(`Ошибка загрузки: ${err?.message || 'Неизвестная ошибка'}`);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        PhotoEditor
                    </Typography>

                    <Tooltip title="Очистить холст">
                        <span>
                            <IconButton
                                color="inherit"
                                onClick={handleClearImage}
                                disabled={!imageModel}
                            >
                                <FolderOpenIcon />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <ImageSaver imageModel={imageModel} />
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 3, flexGrow: 1 }}>
                {imageModel ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            minHeight: 400,
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file) handleDropNewImage(file);
                        }}
                    >
                        <CanvasRenderer imageModel={imageModel} />
                    </Box>
                ) : (
                    <DropZone
                        onImageLoaded={handleImageLoaded}
                        onError={(err) => handleError(`Ошибка загрузки: ${err.message}`)}
                    />
                )}
            </Box>

            <StatusBar imageModel={imageModel} />
        </Box>
    );
};