import React, { useState } from 'react';
import { Box } from '@mui/material';
import { AppHeader } from '@widgets/app-header/AppHeader';
import { LeftPanel } from '@widgets/tools-panel/LeftPanel';
import { ImageSidebar } from '@widgets/image-sidebar/ImageSidebar';
import { CanvasContainer } from '@features/canvas/CanvasContainer';
import { StatusBar } from '@widgets/status-bar/StatusBar';
import { EyedropperInfo } from '@features/eyedropper/EyedropperInfo';
import { LevelsDialog } from '@features/levels/LevelsDialog';
import { useImageActions } from '@shared/hooks/useImageActions';
import { useToast } from '@shared/ui/ToastContext';
import { ImageModel } from '@entities/image/model';

export const EditorPage: React.FC = () => {
    const {
        imageModel,
        setImageModel,
        handleImageLoaded,
        handleClearImage,
    } = useImageActions();

    const [showLevels, setShowLevels] = useState(false);
    const { showToast } = useToast();

    const handleError = (message: string) => showToast(message, 'error');

    const handleApplyLevels = (newImageData: ImageData) => {
        if (!imageModel) return;
        const newModel = new ImageModel(imageModel.metadata, newImageData);
        setImageModel(newModel);
        setShowLevels(false);
        showToast('Уровни применены', 'success');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppHeader imageModel={imageModel} onClear={handleClearImage} />
            <LeftPanel onOpenLevels={() => setShowLevels(true)} />

            {imageModel && (
                <ImageSidebar
                    imageModel={imageModel}
                    onImageLoaded={handleImageLoaded}
                    onError={handleError}
                />
            )}

            <CanvasContainer
                imageModel={imageModel}
                onImageLoaded={handleImageLoaded}
                onError={handleError}
            />

            <StatusBar imageModel={imageModel} />
            <EyedropperInfo />

            {imageModel && (
                <LevelsDialog
                    open={showLevels}
                    imageModel={imageModel}
                    onApply={handleApplyLevels}
                    onClose={() => setShowLevels(false)}
                />
            )}
        </Box>
    );
};