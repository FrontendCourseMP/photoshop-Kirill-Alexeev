import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Tooltip } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { ImageSaver } from '@features/image-saver/ImageSaver';
import { DropZone } from '@features/drop-zone/DropZone';
import { CanvasRenderer } from '@features/canvas-renderer/CanvasRenderer';
import { StatusBar } from '@widgets/status-bar/StatusBar';
import { ImageModel } from '@entities/image/model';

export const EditorPage: React.FC = () => {
    const [imageModel, setImageModel] = useState<ImageModel | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleClearImage = () => {
        setImageModel(null);
        setError(null);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        GrayBit-7 Editor
                    </Typography>
                    <Tooltip title="Новое изображение">
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


            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {imageModel ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 400,
                        borderRadius: 1,
                        p: 2,
                        marginBottom: 4,
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (!file) return;
                        try {
                            const { loadImageFromFile } = await import('@shared/lib/utils/loader');
                            const model = await loadImageFromFile(file);
                            setImageModel(model);
                            setError(null);
                        } catch (err) {
                            setError((err as Error).message);
                        }
                    }}
                >
                    <CanvasRenderer imageModel={imageModel} />
                </Box>
            ) : (
                <DropZone onImageLoaded={setImageModel} onError={(err) => setError(err.message)} />
            )}

            <StatusBar imageModel={imageModel} />
        </Box>
    );
};