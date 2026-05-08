import React from 'react';
import { Box } from '@mui/material';
import { ToolsPanel } from '@widgets/tools-panel/ToolsPanel';
import { APPBAR_HEIGHT, STATUSBAR_HEIGHT, TOOLS_WIDTH } from '@shared/constants/layout';

interface LeftPanelProps {
    onOpenLevels: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ onOpenLevels }) => (
    <Box
        sx={{
            position: 'fixed',
            top: APPBAR_HEIGHT,
            left: 0,
            bottom: STATUSBAR_HEIGHT,
            width: TOOLS_WIDTH,
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            zIndex: 1100,
            overflowY: 'auto',
        }}
    >
        <ToolsPanel onOpenLevels={onOpenLevels} />
    </Box>
);