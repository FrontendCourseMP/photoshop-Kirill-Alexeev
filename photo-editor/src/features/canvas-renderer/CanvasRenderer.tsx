import React, { useRef, useEffect } from 'react';
import { ImageModel } from '@entities/image/model';

interface CanvasRendererProps {
    imageModel: ImageModel | null;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ imageModel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!imageModel || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;
        const { width, height } = imageModel.metadata;

        canvas.width = width;
        canvas.height = height;
        ctx.putImageData(imageModel.imageData, 0, 0);
    }, [imageModel]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
            }}
        />
    );
};