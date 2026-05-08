// src/features/canvas-renderer/CanvasRenderer.tsx
import React, { useRef, useEffect, useMemo } from 'react';
import { ImageModel } from '@entities/image/model';
import { useEditorStore } from '@app/store/editorStore';
import { applyLevelsToImageData } from '@shared/lib/utils/applyLevels';

interface CanvasRendererProps {
    imageModel: ImageModel;
    onCanvasClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ imageModel, onCanvasClick }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const channelVisibility = useEditorStore((s) => s.channelVisibility);
    const levelsPreview = useEditorStore((s) => s.levelsPreview);

    // 1. Фильтрация по каналам
    const filteredImageData = useMemo(() => {
        const src = imageModel.imageData.data;
        const newData = new Uint8ClampedArray(src);
        const channels = imageModel.channels;

        for (let i = 0; i < src.length; i += 4) {
            for (let chIdx = 0; chIdx < channels.length; chIdx++) {
                const channel = channels[chIdx];
                const visible = channelVisibility[channel] !== false;

                if (!visible) {
                    if (channel === 'Gray') {
                        newData[i] = 0;
                        newData[i + 1] = 0;
                        newData[i + 2] = 0;
                    } else if (channel === 'R' || channel === 'G' || channel === 'B') {
                        const offset = channel === 'R' ? 0 : channel === 'G' ? 1 : 2;
                        newData[i + offset] = 0;
                    } else if (channel === 'A' || channel === 'Alpha') {
                        newData[i + 3] = 255;
                    }
                }
            }
        }
        return new ImageData(newData, imageModel.metadata.width, imageModel.metadata.height);
    }, [imageModel, channelVisibility]);

    // 2. Применение Levels предпросмотра (если есть)
    const finalImageData = useMemo(() => {
        if (!levelsPreview) return filteredImageData;
        return applyLevelsToImageData(
            filteredImageData,
            levelsPreview.channel,
            levelsPreview.levels,
            levelsPreview.maxValue
        );
    }, [filteredImageData, levelsPreview]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        canvas.width = imageModel.metadata.width;
        canvas.height = imageModel.metadata.height;
        const ctx = canvas.getContext('2d')!;
        ctx.putImageData(finalImageData, 0, 0);
    }, [finalImageData, imageModel]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                border: '1px solid #ccc',
            }}
            onClick={onCanvasClick}
        />
    );
};