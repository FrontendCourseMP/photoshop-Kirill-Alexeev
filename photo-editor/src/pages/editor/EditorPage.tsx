import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ImageSaver } from '@features/image-saver/ImageSaver';
import { DropZone } from '@features/drop-zone/DropZone';
import { CanvasRenderer } from '@features/canvas-renderer/CanvasRenderer';
import { StatusBar } from '@widgets/status-bar/StatusBar';
import { ToolsPanel } from '@widgets/tools-panel/ToolsPanel';
import { ChannelsPanel } from '@features/channels-panel/ChannelsPanel';
import { EyedropperInfo } from '@features/eyedropper/EyedropperInfo';
import { ImageModel } from '@entities/image/model';
import { useToast } from '@shared/ui/ToastContext';
import { useEditorStore } from '@app/store/editorStore';
import { getCanvasPixelCoords } from '@shared/lib/utils/canvasCoords';
import { rgbToCIELAB } from '@shared/lib/utils/conversions';
import { APPBAR_HEIGHT, STATUSBAR_HEIGHT, TOOLS_WIDTH, CHANNELS_WIDTH } from '@shared/constants/layout';

export const EditorPage: React.FC = () => {
    const [imageModel, setImageModel] = useState<ImageModel | null>(null);
    const { showToast } = useToast();
    const currentTool = useEditorStore((s) => s.currentTool);
    const setEyedropperData = useEditorStore((s) => s.setEyedropperData);
    const resetChannelVisibility = useEditorStore((s) => s.resetChannelVisibility);

    const handleError = (message: string) => showToast(message, 'error');

    const handleImageLoaded = (model: ImageModel) => {
        setImageModel(model);
        resetChannelVisibility(model.channels);
        showToast('Изображение успешно загружено', 'success');
    };

    const handleClearImage = () => {
        setImageModel(null);
        setEyedropperData(null);
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

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (currentTool !== 'eyedropper' || !imageModel) return;
        const canvas = e.currentTarget;
        const coords = getCanvasPixelCoords(canvas, e.clientX, e.clientY);
        if (!coords) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const pixel = ctx.getImageData(coords.x, coords.y, 1, 1).data;
        const [r, g, b] = pixel;
        const lab = rgbToCIELAB(r, g, b);
        setEyedropperData({ x: coords.x, y: coords.y, r, g, b, L: lab.L, aStar: lab.a, bStar: lab.b });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="fixed" sx={{ zIndex: 1300 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        PhotoEditor
                    </Typography>
                    <Tooltip title="Очистить холст">
                        <span>
                            <IconButton color="inherit" onClick={handleClearImage} disabled={!imageModel}>
                                <DeleteIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <ImageSaver imageModel={imageModel} />
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    position: 'fixed',
                    top: APPBAR_HEIGHT,
                    left: 0,
                    bottom: STATUSBAR_HEIGHT,
                    width: TOOLS_WIDTH,
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    zIndex: 1100,
                    overflowY: 'auto',
                }}
            >
                <ToolsPanel />
            </Box>

            {imageModel && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: APPBAR_HEIGHT,
                        right: 0,
                        bottom: STATUSBAR_HEIGHT,
                        width: CHANNELS_WIDTH,
                        borderLeft: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        zIndex: 1100,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        p: 1,
                    }}
                >
                    <ChannelsPanel imageModel={imageModel} />
                </Box>
            )}

            <Box
                sx={{
                    marginTop: `${APPBAR_HEIGHT}px`,
                    marginBottom: `${STATUSBAR_HEIGHT}px`,
                    marginLeft: `${TOOLS_WIDTH}px`,
                    marginRight: imageModel ? `${CHANNELS_WIDTH}px` : 0,
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 3,
                    overflow: 'auto',
                }}
            >
                {imageModel ? (
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file) handleDropNewImage(file);
                        }}
                    >
                        <CanvasRenderer imageModel={imageModel} onCanvasClick={handleCanvasClick} />
                    </Box>
                ) : (
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <DropZone
                            onImageLoaded={handleImageLoaded}
                            onError={(err) => handleError(`Ошибка загрузки: ${err.message}`)}
                        />
                    </Box>
                )}
            </Box>

            <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1300 }}>
                <StatusBar imageModel={imageModel} />
            </Box>

            <EyedropperInfo />
        </Box>
    );
};