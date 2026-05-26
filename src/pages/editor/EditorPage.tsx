import React, { useState } from 'react';
import { Box } from '@mui/material';
import { AppHeader } from '@widgets/app-header/AppHeader';
import { LeftPanel } from '@widgets/tools-panel/LeftPanel';
import { ImageSidebar } from '@widgets/image-sidebar/ImageSidebar';
import { StatusBar } from '@widgets/status-bar/StatusBar';
import { EyedropperInfo } from '@features/eyedropper/EyedropperInfo';
import { LevelsDialog } from '@features/levels/LevelsDialog';
import { ResizeDialog } from '@/features/resize/ResizeDialog';
import { CanvasViewport } from '@/features/canvas/CanvasViewPort';
import { DropZone } from '@features/drop-zone/DropZone';
import { LoaderOverlay } from '@shared/ui/LoaderOverlay';
import { useImageActions } from '@shared/hooks/useImageActions';
import { useToast } from '@shared/ui/ToastContext';
import { useEditorStore } from '@app/store/editorStore';
import { getCanvasPixelCoords } from '@shared/lib/utils/canvasCoords';
import { rgbToCIELAB } from '@shared/lib/utils/conversions';
import { ImageModel } from '@entities/image/model';
import {
    APPBAR_HEIGHT,
    STATUSBAR_HEIGHT,
    TOOLS_WIDTH,
    CHANNELS_WIDTH,
} from '@shared/constants/layout';

export const EditorPage: React.FC = () => {
    const {
        imageModel,
        setImageModel,
        handleImageLoaded,
        handleClearImage,
        handleDropNewImage,
    } = useImageActions();

    const [showLevels, setShowLevels] = useState(false);
    const [showResize, setShowResize] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();
    const currentTool = useEditorStore(s => s.currentTool);
    const setEyedropperData = useEditorStore(s => s.setEyedropperData);
    const zoom = useEditorStore(s => s.zoom);

    const handleError = (message: string) => showToast(message, 'error');

    // Применение уровней с лоадером
    const handleApplyLevels = async (newImageData: ImageData) => {
        if (!imageModel) return;
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 0));
            const newModel = new ImageModel(imageModel.metadata, newImageData);
            setImageModel(newModel);
            setShowLevels(false);
            showToast('Уровни применены', 'success');
        } finally {
            setIsLoading(false);
        }
    };

    // Применение ресайза с лоадером
    const handleResized = async (newModel: ImageModel) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 0));
            setImageModel(newModel);
            setShowResize(false);
            showToast('Размер изменён', 'success');
        } finally {
            setIsLoading(false);
        }
    };

    // Загрузка через любой DropZone (уже есть в useImageActions, но обернём лоадером)
    const handleLoadStart = () => setIsLoading(true);
    const handleLoadEnd = () => setIsLoading(false);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (currentTool !== 'eyedropper' || !imageModel) return;
        const canvas = e.currentTarget;
        const coords = getCanvasPixelCoords(canvas, e.clientX, e.clientY, zoom);
        if (!coords) return;
        const { x, y } = coords;
        const originalData = imageModel.imageData.data;
        const pixelIndex = (y * imageModel.metadata.width + x) * 4;
        if (pixelIndex < 0 || pixelIndex + 3 >= originalData.length) return;
        const r = originalData[pixelIndex];
        const g = originalData[pixelIndex + 1];
        const b = originalData[pixelIndex + 2];
        const lab = rgbToCIELAB(r, g, b);
        setEyedropperData({ x, y, r, g, b, L: lab.L, aStar: lab.a, bStar: lab.b });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <LoaderOverlay open={isLoading} message="Пожалуйста, подождите..." />

            <AppHeader imageModel={imageModel} onClear={handleClearImage} />
            <LeftPanel onOpenLevels={() => setShowLevels(true)} onOpenResize={() => setShowResize(true)} />

            {imageModel && (
                <ImageSidebar
                    imageModel={imageModel}
                    onImageLoaded={handleImageLoaded}
                    onError={handleError}
                    onLoadStart={handleLoadStart}
                    onLoadEnd={handleLoadEnd}
                />
            )}

            <Box
                sx={{
                    position: 'fixed',
                    top: APPBAR_HEIGHT,
                    bottom: STATUSBAR_HEIGHT,
                    left: TOOLS_WIDTH,
                    right: imageModel ? CHANNELS_WIDTH : 0,
                    overflow: 'hidden',
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
                {imageModel ? (
                    <CanvasViewport imageModel={imageModel} onCanvasClick={handleCanvasClick} />
                ) : (
                    <Box sx={{ width: '100%', height: '100%', p: 6.25 }}>
                        <DropZone
                            onImageLoaded={handleImageLoaded}
                            onError={(err) => handleError(`Ошибка загрузки: ${err.message}`)}
                            onLoadStart={handleLoadStart}
                            onLoadEnd={handleLoadEnd}
                        />
                    </Box>
                )}
            </Box>

            <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1300 }}>
                <StatusBar imageModel={imageModel} />
            </Box>
            <EyedropperInfo />

            {imageModel && (
                <LevelsDialog
                    open={showLevels}
                    imageModel={imageModel}
                    onApply={handleApplyLevels}
                    onClose={() => setShowLevels(false)}
                />
            )}

            {imageModel && (
                <ResizeDialog
                    open={showResize}
                    imageModel={imageModel}
                    onResized={handleResized}
                    onClose={() => setShowResize(false)}
                />
            )}
        </Box>
    );
};