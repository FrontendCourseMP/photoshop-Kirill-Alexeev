import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import ColorizeIcon from '@mui/icons-material/Colorize';
import TuneIcon from '@mui/icons-material/Tune';
import PanToolIcon from '@mui/icons-material/PanTool'
import { useEditorStore } from '@app/store/editorStore';
import PhotoSizeSelectLargeIcon from '@mui/icons-material/PhotoSizeSelectLarge';

interface ToolsPanelProps {
    onOpenLevels?: () => void;
    onOpenResize?: () => void;
}

export const ToolsPanel: React.FC<ToolsPanelProps> = ({ onOpenLevels, onOpenResize }) => {
    const currentTool = useEditorStore((s) => s.currentTool);
    const setCurrentTool = useEditorStore((s) => s.setCurrentTool);

    const isEyedropperActive = currentTool === 'eyedropper';
    const isHandActive = currentTool === 'hand';

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

            <Tooltip title="Перемещение (H)" placement="right">
                <IconButton
                    onClick={() => setCurrentTool(isHandActive ? null : 'hand')}
                    sx={{
                        bgcolor: isHandActive ? 'primary.main' : 'transparent',
                        color: isHandActive ? 'white' : 'action.active',
                        '&:hover': {
                            bgcolor: isHandActive ? 'primary.dark' : 'action.hover',
                        },
                    }}
                >
                    <PanToolIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Уровни" placement="right">
                <IconButton onClick={onOpenLevels}>
                    <TuneIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Размер изображения" placement="right">
                <IconButton onClick={onOpenResize}>
                    <PhotoSizeSelectLargeIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
};