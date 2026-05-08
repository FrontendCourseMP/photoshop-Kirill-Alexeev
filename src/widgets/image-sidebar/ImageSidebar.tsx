import React from 'react';
import { Box } from '@mui/material';
import { DropZone } from '@features/drop-zone/DropZone';
import { ChannelsPanel } from '@features/channels-panel/ChannelsPanel';
import { ImageModel } from '@entities/image/model';
import { APPBAR_HEIGHT, STATUSBAR_HEIGHT, CHANNELS_WIDTH } from '@shared/constants/layout';

interface ImageSidebarProps {
    imageModel: ImageModel;
    onImageLoaded: (model: ImageModel) => void;
    onError: (message: string) => void;
}

export const ImageSidebar: React.FC<ImageSidebarProps> = ({ imageModel, onImageLoaded, onError }) => (
    <Box
        sx={{
            position: 'fixed',
            top: APPBAR_HEIGHT,
            right: 0,
            bottom: STATUSBAR_HEIGHT,
            width: CHANNELS_WIDTH,
            borderLeft: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
            p: 1,
            gap: 1,
        }}
    >
        <DropZone
            compact
            label="Загрузить другое"
            onImageLoaded={onImageLoaded}
            onError={(err) => onError(`Ошибка загрузки: ${err.message}`)}
        />
        <ChannelsPanel imageModel={imageModel} />
    </Box>
);