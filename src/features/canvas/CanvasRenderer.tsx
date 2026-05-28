import React, { useRef, useEffect, useMemo } from 'react';
import { ImageModel } from '@entities/image/model';
import { useEditorStore } from '@app/store/editorStore';
import { applyLevelsToImageData } from '@shared/lib/utils/applyLevels';
import { resample } from '@shared/lib/utils/interpolation';

interface CanvasRendererProps {
    imageModel: ImageModel;
    onCanvasClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    cursor?: string;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
    imageModel,
    onCanvasClick,
    cursor: cursorProp,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const channelVisibility = useEditorStore((s) => s.channelVisibility);
    const levelsPreview = useEditorStore((s) => s.levelsPreview);
    const masterPreviewImageData = useEditorStore((s) => s.masterPreviewImageData);
    const zoom = useEditorStore((s) => s.zoom);
    const interpolationMethod = useEditorStore((s) => s.interpolationMethod);
    const currentTool = useEditorStore((s) => s.currentTool);
    const filterPreview = useEditorStore(s => s.filterPreview);

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

    const finalImageData = useMemo(() => {
        if (filterPreview) return filterPreview;
        if (masterPreviewImageData) return masterPreviewImageData;
        if (levelsPreview) {
            return applyLevelsToImageData(
                filteredImageData,
                levelsPreview.channel,
                levelsPreview.levels,
                levelsPreview.maxValue
            );
        }
        return filteredImageData;
    }, [filteredImageData, levelsPreview, masterPreviewImageData, filterPreview]);

    const scaledImageData = useMemo(() => {
        if (zoom === 100) return finalImageData;
        const newWidth = Math.round(finalImageData.width * zoom / 100);
        const newHeight = Math.round(finalImageData.height * zoom / 100);
        return resample(finalImageData, newWidth, newHeight, interpolationMethod);
    }, [finalImageData, zoom, interpolationMethod]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        canvas.width = scaledImageData.width;
        canvas.height = scaledImageData.height;
        const ctx = canvas.getContext('2d')!;
        ctx.putImageData(scaledImageData, 0, 0);
    }, [scaledImageData]);

    const cursorStyle = cursorProp ??
        (currentTool === 'eyedropper' ? 'crosshair' : 'default');

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                border: '1px solid #ccc',
                cursor: cursorStyle,
            }}
            onClick={onCanvasClick}
        />
    );
};