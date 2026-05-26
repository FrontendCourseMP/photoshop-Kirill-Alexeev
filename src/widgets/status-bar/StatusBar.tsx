import React, { useState, useEffect } from 'react';
import { Paper, Typography, Slider, Box } from '@mui/material';
import { useEditorStore } from '@app/store/editorStore';
import { ImageModel } from '@entities/image/model';

interface StatusBarProps {
    imageModel: ImageModel | null;
}

export const StatusBar: React.FC<StatusBarProps> = ({ imageModel }) => {
    const zoom = useEditorStore(s => s.zoom);
    const setZoom = useEditorStore(s => s.setZoom);
    const [localZoom, setLocalZoom] = useState(zoom);

    useEffect(() => {
        setLocalZoom(zoom);
    }, [zoom]);

    const handleSliderChange = (_e: Event | React.SyntheticEvent, value: number | number[]) => {
        setLocalZoom(value as number);
    };

    const handleSliderCommit = (_e: Event | React.SyntheticEvent, value: number | number[]) => {
        setZoom(value as number);
    };

    return (
        <Paper sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2 }} elevation={3}>
            {imageModel ? (
                <>
                    <Typography variant="body2">
                        Размер: {imageModel.metadata.width} x {imageModel.metadata.height} пикс.
                        | Глубина цвета: {imageModel.metadata.colorDepth} бит
                        | Формат: {imageModel.metadata.format.toUpperCase()}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
                        <Typography variant="body2">Масштаб:</Typography>
                        <Slider
                            value={localZoom}
                            min={12}
                            max={300}
                            step={1}
                            onChange={handleSliderChange}
                            onChangeCommitted={handleSliderCommit}
                            valueLabelDisplay="auto"
                            size="small"
                            sx={{ width: 150 }}
                        />
                        <Typography variant="body2">{localZoom}%</Typography>
                    </Box>
                </>
            ) : (
                <Typography variant="body2">Изображение не загружено</Typography>
            )}
        </Paper>
    );
};