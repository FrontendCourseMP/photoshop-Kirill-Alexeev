import React, { useRef, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';

interface HistogramProps {
    imageData: ImageData;
    channel: string;  // 'master' | 'R'|'G'|'B'|'A'|'Alpha'|'Gray'
    maxValue: number;
    logarithmic: boolean;
}

const WIDTH = 256;
const HEIGHT = 100;

export const Histogram: React.FC<HistogramProps> = ({ imageData, channel, maxValue, logarithmic }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const counts = useMemo(() => {
        const arr = new Array(maxValue + 1).fill(0);
        const data = imageData.data;

        if (channel === 'master') {
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
                const scaled = Math.round((lum / 255) * maxValue);
                arr[scaled]++;
            }
        } else if (channel === 'A' || channel === 'Alpha') {
            for (let i = 3; i < data.length; i += 4) {
                const a = data[i];
                const scaled = Math.round((a / 255) * maxValue);
                arr[scaled]++;
            }
        } else if (channel === 'Gray') {
            for (let i = 0; i < data.length; i += 4) {
                const gray = data[i]; // R=G=B
                const scaled = Math.round((gray / 255) * maxValue);
                arr[scaled]++;
            }
        } else {
            const idx = channel === 'R' ? 0 : channel === 'G' ? 1 : 2;
            for (let i = idx; i < data.length; i += 4) {
                const val = data[i];
                const scaled = Math.round((val / 255) * maxValue);
                arr[scaled]++;
            }
        }
        return arr;
    }, [imageData, channel, maxValue]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const maxCount = Math.max(...counts);
        if (maxCount === 0) return;

        const barWidth = canvas.width / (maxValue + 1);
        const scaleY = (val: number) => {
            if (logarithmic) {
                const logVal = Math.log10(val + 1);
                const logMax = Math.log10(maxCount + 1);
                return logMax === 0 ? 0 : (logVal / logMax) * canvas.height;
            }
            return (val / maxCount) * canvas.height;
        };

        ctx.fillStyle = '#1976d2';
        for (let i = 0; i <= maxValue; i++) {
            const h = scaleY(counts[i]);
            ctx.fillRect(i * barWidth, canvas.height - h, barWidth, h);
        }
    }, [counts, maxValue, logarithmic]);

    return (
        <Box sx={{ width: '100%', border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>
            <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ width: '100%', height: 'auto' }} />
        </Box>
    );
};