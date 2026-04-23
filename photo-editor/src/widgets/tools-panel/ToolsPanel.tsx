import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import ColorizeIcon from '@mui/icons-material/Colorize';
import PanToolIcon from '@mui/icons-material/PanTool';
import { useEditorStore } from '@app/store/editorStore';

export const ToolsPanel: React.FC = () => {
    const currentTool = useEditorStore((s) => s.currentTool);
    const setCurrentTool = useEditorStore((s) => s.setCurrentTool);

    const isEyedropperActive = currentTool === 'eyedropper';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 0.5 }}>
            <Tooltip title="Пипетка" placement="right">
                <IconButton
                    onClick={() => setCurrentTool(isEyedropperActive ? null : 'eyedropper')}
                    sx={{
                        bgcolor: isEyedropperActive ? 'action.selected' : 'transparent',
                        color: 'action.active',
                        '&:hover': {
                            bgcolor: isEyedropperActive ? 'action.selected' : 'action.hover',
                        },
                    }}
                >
                    <ColorizeIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Перемещение" placement="right">
                <span>
                    <IconButton disabled>
                        <PanToolIcon />
                    </IconButton>
                </span>
            </Tooltip>
        </Box>
    );
};