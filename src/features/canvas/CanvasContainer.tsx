import React from 'react';
import { Box } from '@mui/material';
import { CanvasRenderer } from '@features/canvas/CanvasRenderer';
import { DropZone } from '@features/drop-zone/DropZone';
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

interface CanvasContainerProps {
    imageModel: ImageModel | null;
    onImageLoaded: (model: ImageModel) => void;
    onError: (message: string) => void;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
    imageModel,
    onImageLoaded,
    onError,
}) => {
    const currentTool = useEditorStore(s => s.currentTool);
    const setEyedropperData = useEditorStore(s => s.setEyedropperData);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (currentTool !== 'eyedropper' || !imageModel) return;
        const canvas = e.currentTarget;
        const coords = getCanvasPixelCoords(canvas, e.clientX, e.clientY);
        if (!coords) return;

        const { x, y } = coords;
        const originalData = imageModel.imageData.data;
        const pixelIndex = (y * imageModel.metadata.width + x) * 4;
        const r = originalData[pixelIndex];
        const g = originalData[pixelIndex + 1];
        const b = originalData[pixelIndex + 2];
        const lab = rgbToCIELAB(r, g, b);

        setEyedropperData({ x, y, r, g, b, L: lab.L, aStar: lab.a, bStar: lab.b });
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        try {
            const { loadImageFromFile } = await import('@shared/lib/utils/loader');
            const model = await loadImageFromFile(file);
            onImageLoaded(model);
        } catch (err: any) {
            onError(`Ошибка загрузки: ${err.message || 'Неизвестная ошибка'}`);
        }
    };

    return (
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
                    onDrop={handleDrop}
                >
                    <CanvasRenderer imageModel={imageModel} onCanvasClick={handleCanvasClick} />
                </Box>
            ) : (
                <DropZone
                    onImageLoaded={onImageLoaded}
                    onError={(err) => onError(`Ошибка загрузки: ${err.message}`)}
                />
            )}
        </Box>
    );
};