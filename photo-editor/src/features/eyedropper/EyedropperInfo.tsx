import React from 'react';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEditorStore } from '@app/store/editorStore';
import { STATUSBAR_HEIGHT, TOOLS_WIDTH } from '@shared/constants/layout';

export const EyedropperInfo: React.FC = () => {
    const data = useEditorStore((s) => s.eyedropperData);
    const setEyedropperData = useEditorStore((s) => s.setEyedropperData);

    if (!data) return null;

    const colorBoxSize = 48;

    return (
        <Paper
            elevation={4}
            sx={{
                position: 'fixed',
                left: TOOLS_WIDTH + 8,
                bottom: STATUSBAR_HEIGHT + 8,
                p: 2,
                zIndex: 1200,
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
                maxWidth: 340,
            }}
        >
            {/* Крупный квадрат выбранного цвета */}
            <Box
                sx={{
                    width: colorBoxSize,
                    height: colorBoxSize,
                    backgroundColor: `rgb(${data.r},${data.g},${data.b})`,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    flexShrink: 0,
                }}
            />
            {/* Информация */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2">
                        Пипетка
                    </Typography>
                    <IconButton size="small" onClick={() => setEyedropperData(null)}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                </Box>
                <Typography variant="body2">
                    X: {data.x} &nbsp; Y: {data.y}
                </Typography>
                <Typography variant="body2">
                    R: {data.r} &nbsp; G: {data.g} &nbsp; B: {data.b}
                </Typography>
                <Typography variant="body2">
                    L*: {data.L.toFixed(1)} &nbsp; a*: {data.aStar.toFixed(1)} &nbsp; b*: {data.bStar.toFixed(1)}
                </Typography>
            </Box>
        </Paper>
    );
};