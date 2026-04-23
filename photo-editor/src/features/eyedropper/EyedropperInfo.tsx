import React from 'react';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEditorStore } from '@app/store/editorStore';

export const EyedropperInfo: React.FC = () => {
    const data = useEditorStore((s) => s.eyedropperData);
    const setEyedropperData = useEditorStore((s) => s.setEyedropperData);

    if (!data) return null;

    const colorStyle = {
        width: 24,
        height: 24,
        backgroundColor: `rgb(${data.r},${data.g},${data.b})`,
        border: '1px solid #000',
        display: 'inline-block',
        marginLeft: 8,
        verticalAlign: 'middle',
        borderRadius: 4,
    };

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'fixed',
                bottom: 60,
                right: 16,
                p: 1.5,
                zIndex: 1200,
                minWidth: 220,
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle2">Пипетка</Typography>
                <IconButton size="small" onClick={() => setEyedropperData(null)}>
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            </Box>
            <Typography variant="body2">
                X: {data.x}, Y: {data.y}
                <Box component="span" sx={colorStyle} />
            </Typography>
            <Typography variant="body2">R: {data.r}, G: {data.g}, B: {data.b}</Typography>
            <Typography variant="body2">
                L*: {data.L.toFixed(1)}, a*: {data.aStar.toFixed(1)}, b*: {data.bStar.toFixed(1)}
            </Typography>
        </Paper>
    );
};