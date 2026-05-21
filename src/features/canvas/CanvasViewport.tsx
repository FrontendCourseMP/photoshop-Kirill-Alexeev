import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { CanvasRenderer } from '@features/canvas/CanvasRenderer';
import { useEditorStore } from '@app/store/editorStore';
import { ImageModel } from '@entities/image/model';

interface CanvasViewportProps {
    imageModel: ImageModel;
    onCanvasClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({ imageModel, onCanvasClick }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const currentTool = useEditorStore(s => s.currentTool);
    const pan = useEditorStore(s => s.pan);
    const setPan = useEditorStore(s => s.setPan);

    const [isPanning, setIsPanning] = useState(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (currentTool !== 'hand') return;
        setIsPanning(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isPanning) return;
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        setPan({ x: pan.x + dx, y: pan.y + dy });
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    }, [isPanning, pan, setPan]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    useEffect(() => {
        if (isPanning) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isPanning, handleMouseMove, handleMouseUp]);

    // Определяем курсор в зависимости от инструмента
    const cursor =
        currentTool === 'eyedropper' ? 'crosshair' :
            currentTool === 'hand' ? (isPanning ? 'grabbing' : 'grab') :
                'default';

    return (
        <Box
            ref={containerRef}
            sx={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
            }}
            onMouseDown={handleMouseDown}
        >
            <Box
                sx={{
                    transform: `translate(${pan.x}px, ${pan.y}px)`,
                    display: 'inline-block',
                    cursor: cursor,           // курсор действует и на холст
                }}
            >
                <CanvasRenderer
                    imageModel={imageModel}
                    onCanvasClick={onCanvasClick}
                    cursor={cursor}           // прокидываем в CanvasRenderer
                />
            </Box>
        </Box>
    );
};