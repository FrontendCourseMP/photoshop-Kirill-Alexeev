import React, { useRef, useEffect, useMemo } from 'react';
import { ImageModel } from '@entities/image/model';
import { useEditorStore } from '@app/store/editorStore';

interface CanvasRendererProps {
    imageModel: ImageModel;
    onCanvasClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ imageModel, onCanvasClick }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const channelVisibility = useEditorStore((s) => s.channelVisibility);

    const filteredImageData = useMemo(() => {
        const src = imageModel.imageData.data;
        const newData = new Uint8ClampedArray(src);
        const channels = imageModel.channels;

        for (let i = 0; i < src.length; i += 4) {
            for (let chIdx = 0; chIdx < channels.length; chIdx++) {
                const channel = channels[chIdx];
                const visible = channelVisibility[channel] !== false;

                if (channel === 'Gray') {
                    if (!visible) {
                        newData[i] = 0;     // R
                        newData[i + 1] = 0; // G
                        newData[i + 2] = 0; // B
                    }
                } else if (channel === 'R' || channel === 'G' || channel === 'B') {
                    if (!visible) {
                        const offset = channel === 'R' ? 0 : channel === 'G' ? 1 : 2;
                        newData[i + offset] = 0;
                    }
                } else if (channel === 'A' || channel === 'Alpha') {
                    if (!visible) {
                        newData[i + 3] = 255;
                    }
                }
            }
        }
        return new ImageData(newData, imageModel.metadata.width, imageModel.metadata.height);
    }, [imageModel, channelVisibility]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        canvas.width = imageModel.metadata.width;
        canvas.height = imageModel.metadata.height;
        const ctx = canvas.getContext('2d')!;
        ctx.putImageData(filteredImageData, 0, 0);
    }, [filteredImageData, imageModel]);

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