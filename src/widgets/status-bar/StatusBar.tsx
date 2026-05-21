import React from 'react';
import { Paper, Typography, Slider, Box } from '@mui/material';
import { ImageModel } from '@entities/image/model';
import { useEditorStore } from '@app/store/editorStore';


interface StatusBarProps {
    imageModel: ImageModel | null;
}

export const StatusBar: React.FC<StatusBarProps> = ({ imageModel }) => {
    const zoom = useEditorStore(s => s.zoom);
    const setZoom = useEditorStore(s => s.setZoom);

    return (
        <Paper
            sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1200,
            }}
            elevation={3}
        >
            {imageModel ? (
                <>
                    <Typography variant="body2">
                        Размер: {imageModel.metadata.width} x {imageModel.metadata.height} пикселей
                        | Глубина цвета: {imageModel.metadata.colorDepth} бит
                        | Формат: {imageModel.metadata.format.toUpperCase()} | Размер файла: {(imageModel.metadata.fileSize! / 1024).toFixed(2)} КБ
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
                        <Typography variant="body2">Масштаб:</Typography>
                        <Slider
                            value={zoom}
                            min={12}
                            max={300}
                            step={1}
                            onChange={(_, val) => setZoom(val as number)}
                            valueLabelDisplay="auto"
                            size="small"
                            sx={{ width: 150 }}
                        />
                        <Typography variant="body2">{zoom}%</Typography>
                    </Box>
                </>
            ) : (
                <Typography variant="body2">Изображение не загружено</Typography>
            )}
        </Paper>
    );
};