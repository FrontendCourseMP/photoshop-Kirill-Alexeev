// src/widgets/tools-panel/ToolsPanel.tsx
import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import ColorizeIcon from '@mui/icons-material/Colorize';
import TuneIcon from '@mui/icons-material/Tune';
import { useEditorStore } from '@app/store/editorStore';

interface ToolsPanelProps {
    onOpenLevels?: () => void;
}

export const ToolsPanel: React.FC<ToolsPanelProps> = ({ onOpenLevels }) => {
    const currentTool = useEditorStore((s) => s.currentTool);
    const setCurrentTool = useEditorStore((s) => s.setCurrentTool);
    const isEyedropperActive = currentTool === 'eyedropper';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 0.5 }}>
            <Tooltip title="Пипетка" placement="right">
                <IconButton
                    onClick={() => setCurrentTool(isEyedropperActive ? null : 'eyedropper')}
                    sx={{
                        bgcolor: isEyedropperActive ? 'primary.main' : 'transparent',
                        color: isEyedropperActive ? 'white' : 'action.active',
                        '&:hover': {
                            bgcolor: isEyedropperActive ? 'primary.dark' : 'action.hover',
                        },
                    }}
                >
                    <ColorizeIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Уровни" placement="right">
                <IconButton onClick={onOpenLevels}>
                    <TuneIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
};