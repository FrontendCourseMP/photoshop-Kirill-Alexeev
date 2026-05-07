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
                maxWidth: 360,
            }}
        >
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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2">
                        Пипетка
                    </Typography>
                    <IconButton size="small" onClick={() => setEyedropperData(null)}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                </Box>

                <Box component="table" sx={{ border: 'none', borderCollapse: 'collapse', mt: 0.5 }}>
                    <Box component="thead">
                        <Box component="tr">
                            <Box component="th" sx={{ width: 44, textAlign: 'center', fontWeight: 'normal' }}>X</Box>
                            <Box component="th" sx={{ width: 44, textAlign: 'center', fontWeight: 'normal' }}>Y</Box>
                        </Box>
                    </Box>
                    <Box component="tbody">
                        <Box component="tr">
                            <Box component="td" sx={{ width: 44, textAlign: 'center' }}>{data.x}</Box>
                            <Box component="td" sx={{ width: 44, textAlign: 'center' }}>{data.y}</Box>
                        </Box>
                    </Box>
                </Box>

                <Box component="table" sx={{ border: 'none', borderCollapse: 'collapse', mt: 0.5 }}>
                    <Box component="thead">
                        <Box component="tr">
                            <Box component="th" sx={{ width: 36, textAlign: 'center', fontWeight: 'normal' }}>R</Box>
                            <Box component="th" sx={{ width: 36, textAlign: 'center', fontWeight: 'normal' }}>G</Box>
                            <Box component="th" sx={{ width: 36, textAlign: 'center', fontWeight: 'normal' }}>B</Box>
                        </Box>
                    </Box>
                    <Box component="tbody">
                        <Box component="tr">
                            <Box component="td" sx={{ width: 36, textAlign: 'center' }}>{data.r}</Box>
                            <Box component="td" sx={{ width: 36, textAlign: 'center' }}>{data.g}</Box>
                            <Box component="td" sx={{ width: 36, textAlign: 'center' }}>{data.b}</Box>
                        </Box>
                    </Box>
                </Box>

                <Box component="table" sx={{ border: 'none', borderCollapse: 'collapse', mt: 0.5 }}>
                    <Box component="thead">
                        <Box component="tr">
                            <Box component="th" sx={{ width: 44, textAlign: 'center', fontWeight: 'normal' }}>L*</Box>
                            <Box component="th" sx={{ width: 44, textAlign: 'center', fontWeight: 'normal' }}>a*</Box>
                            <Box component="th" sx={{ width: 44, textAlign: 'center', fontWeight: 'normal' }}>b*</Box>
                        </Box>
                    </Box>
                    <Box component="tbody">
                        <Box component="tr">
                            <Box component="td" sx={{ width: 44, textAlign: 'center' }}>{data.L.toFixed(1)}</Box>
                            <Box component="td" sx={{ width: 44, textAlign: 'center' }}>{data.aStar.toFixed(1)}</Box>
                            <Box component="td" sx={{ width: 44, textAlign: 'center' }}>{data.bStar.toFixed(1)}</Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};